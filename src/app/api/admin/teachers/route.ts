import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles, hashPassword } from '@/lib/auth';
import User from '@/models/User';
import TeacherProfile from '@/models/TeacherProfile';
import SchoolClass from '@/models/SchoolClass';
import Subject from '@/models/Subject';
import Timetable from '@/models/Timetable';
import {
  reconcileAllFacultyWithTeachers,
  syncTeacherProfileToFaculty,
} from '@/lib/teacherFacultySync';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    // Reconcile and synchronize all faculty directory assignments with teacher profiles
    await reconcileAllFacultyWithTeachers();

    const teachers = await TeacherProfile.find()
      .populate('user', '-password')
      .populate('assignedClasses.class')
      .populate('assignedClasses.subject')
      .sort({ createdAt: -1 })
      .lean();

    // 1. Fetch Class Teacher assignments
    const classes = await SchoolClass.find().select('name grade classTeacher sectionClassTeachers').lean();
    const classTeacherMap: { [teacherUserId: string]: string[] } = {};

    classes.forEach((c) => {
      if (c.classTeacher) {
        const tId = String(c.classTeacher);
        if (!classTeacherMap[tId]) classTeacherMap[tId] = [];
        classTeacherMap[tId].push(`${c.name} (General)`);
      }
      if (c.sectionClassTeachers && Array.isArray(c.sectionClassTeachers)) {
        c.sectionClassTeachers.forEach((st) => {
          if (st.teacher) {
            const tId = String(st.teacher);
            if (!classTeacherMap[tId]) classTeacherMap[tId] = [];
            classTeacherMap[tId].push(`${c.name} — Sec ${st.section}`);
          }
        });
      }
    });

    // 2. Compute weekly teaching periods from Timetable
    const allTimetables = await Timetable.find().select('day periods').lean();
    const periodsCountMap: { [teacherUserId: string]: number } = {};

    allTimetables.forEach((tt) => {
      // Exclude Saturday (fixed weekly holiday OFF)
      if (tt.day === 'Saturday') return;

      tt.periods?.forEach((p) => {
        if (p.teacher && !p.isBreak) {
          const tId = String(p.teacher);
          periodsCountMap[tId] = (periodsCountMap[tId] || 0) + 1;
        }
      });
    });

    const enhancedTeachers = teachers.map((t: any) => {
      const uId = t.user ? String(t.user._id) : '';
      return {
        ...t,
        classTeacherAssignments: classTeacherMap[uId] || [],
        weeklyPeriodsCount: periodsCountMap[uId] || 0,
        assignedClassesCount: t.assignedClasses?.length || 0,
      };
    });

    return NextResponse.json({ success: true, teachers: enhancedTeachers });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const data = await req.json();
    const { name, email, phone, address, gender, qualification, specialization, assignedClasses, password } = data;

    if (!name || !email) {
      return NextResponse.json({ success: false, message: 'Name and email are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json({ success: false, message: `A user with email "${cleanEmail}" already exists.` }, { status: 400 });
    }

    const count = await User.countDocuments({ role: 'teacher' });
    const userId = `TCH${String(count + 1).padStart(3, '0')}`;
    const hashedPassword = await hashPassword(password || 'password123');

    const newUser = await User.create({
      userId,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: 'teacher',
      phone: phone || '',
      address: address || '',
      gender: gender || 'Male',
      isActive: true,
    });

    // Validate and clean assignedClasses to prevent duplicate subject assignments per class/section
    const cleanAssignedClasses: any[] = [];
    const assignmentSet = new Set<string>();

    (assignedClasses || []).forEach((ac: any) => {
      const cId = ac.class?._id || ac.class;
      const sId = ac.subject?._id || ac.subject;
      const sec = (ac.section || 'A').toUpperCase().trim();

      if (cId && sId && mongoose.isValidObjectId(String(cId)) && mongoose.isValidObjectId(String(sId))) {
        const key = `${cId}-${sec}-${sId}`;
        if (!assignmentSet.has(key)) {
          assignmentSet.add(key);
          cleanAssignedClasses.push({
            class: new mongoose.Types.ObjectId(String(cId)),
            section: sec,
            subject: new mongoose.Types.ObjectId(String(sId)),
          });
        }
      }
    });

    const profile = await TeacherProfile.create({
      user: newUser._id,
      qualification: qualification || 'B.Ed, Master Degree',
      specialization: specialization || 'General',
      assignedClasses: cleanAssignedClasses,
    });

    const populated = await TeacherProfile.findById(profile._id)
      .populate('user', '-password')
      .populate('assignedClasses.class')
      .populate('assignedClasses.subject');

    // Sync to Faculty Directory
    await syncTeacherProfileToFaculty(profile, newUser);

    return NextResponse.json({
      success: true,
      message: 'Teacher profile created successfully.',
      teacher: populated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const data = await req.json();
    const { teacherId, id, _id, name, email, phone, address, gender, qualification, specialization, assignedClasses, isActive, password } = data;
    const targetTeacherId = teacherId || id || _id;

    if (!targetTeacherId) {
      return NextResponse.json({ success: false, message: 'Teacher profile ID is required.' }, { status: 400 });
    }

    const profile = await TeacherProfile.findById(targetTeacherId);
    if (!profile) {
      return NextResponse.json({ success: false, message: 'Teacher profile not found.' }, { status: 404 });
    }

    if (qualification !== undefined) profile.qualification = qualification;
    if (specialization !== undefined) profile.specialization = specialization;

    if (assignedClasses !== undefined) {
      const cleanAssignedClasses: any[] = [];
      const assignmentSet = new Set<string>();

      (assignedClasses || []).forEach((ac: any) => {
        const cId = ac.class?._id || ac.class;
        const sId = ac.subject?._id || ac.subject;
        const sec = (ac.section || 'A').toUpperCase().trim();

        if (cId && sId && mongoose.isValidObjectId(String(cId)) && mongoose.isValidObjectId(String(sId))) {
          const key = `${cId}-${sec}-${sId}`;
          if (!assignmentSet.has(key)) {
            assignmentSet.add(key);
            cleanAssignedClasses.push({
              class: new mongoose.Types.ObjectId(String(cId)),
              section: sec,
              subject: new mongoose.Types.ObjectId(String(sId)),
            });
          }
        }
      });

      profile.assignedClasses = cleanAssignedClasses;
    }

    await profile.save();

    const user = await User.findById(profile.user);
    if (user) {
      if (name) user.name = name.trim();
      if (email) {
        const cleanEmail = email.toLowerCase().trim();
        const dupUser = await User.findOne({ _id: { $ne: user._id }, email: cleanEmail });
        if (dupUser) {
          return NextResponse.json({ success: false, message: `Email "${cleanEmail}" is already used by another user.` }, { status: 400 });
        }
        user.email = cleanEmail;
      }
      if (phone !== undefined) user.phone = phone;
      if (address !== undefined) user.address = address;
      if (gender) user.gender = gender;
      if (isActive !== undefined) user.isActive = isActive;
      if (password && password.trim()) {
        user.password = await hashPassword(password.trim());
      }
      await user.save();
    }

    // Sync back to Faculty Directory
    await syncTeacherProfileToFaculty(profile, user);

    const updated = await TeacherProfile.findById(targetTeacherId)
      .populate('user', '-password')
      .populate('assignedClasses.class')
      .populate('assignedClasses.subject');

    return NextResponse.json({
      success: true,
      message: 'Teacher profile updated successfully.',
      teacher: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('id');

    if (!teacherId) {
      return NextResponse.json({ success: false, message: 'Teacher ID is required.' }, { status: 400 });
    }

    const profile = await TeacherProfile.findById(teacherId);
    if (profile) {
      await User.findByIdAndDelete(profile.user);
      await TeacherProfile.findByIdAndDelete(teacherId);
    }

    return NextResponse.json({ success: true, message: 'Teacher removed successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
