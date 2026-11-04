import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles, hashPassword } from '@/lib/auth';
import '@/models/SchoolClass';
import '@/models/Subject';
import User from '@/models/User';
import TeacherProfile from '@/models/TeacherProfile';
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
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, teachers });
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

    const count = await User.countDocuments({ role: 'teacher' });
    const userId = `TCH${String(count + 1).padStart(3, '0')}`;
    const hashedPassword = await hashPassword(password || 'password123');

    const newUser = await User.create({
      userId,
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'teacher',
      phone: phone || '',
      address: address || '',
      gender: gender || 'Male',
      isActive: true,
    });

    const profile = await TeacherProfile.create({
      user: newUser._id,
      qualification: qualification || 'B.Ed, Master Degree',
      specialization: specialization || 'General',
      assignedClasses: assignedClasses || [],
    });

    const populated = await TeacherProfile.findById(profile._id)
      .populate('user', '-password')
      .populate('assignedClasses.class')
      .populate('assignedClasses.subject');

    // Sync to Faculty Directory
    await syncTeacherProfileToFaculty(profile, newUser);

    return NextResponse.json({
      success: true,
      message: 'Teacher created successfully.',
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

    const profile = await TeacherProfile.findById(targetTeacherId);
    if (!profile) {
      return NextResponse.json({ success: false, message: 'Teacher profile not found.' }, { status: 404 });
    }

    if (qualification) profile.qualification = qualification;
    if (specialization) profile.specialization = specialization;
    if (assignedClasses) profile.assignedClasses = assignedClasses;
    await profile.save();

    const user = await User.findById(profile.user);
    if (user) {
      if (name) user.name = name;
      if (email) user.email = email.toLowerCase().trim();
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
      message: 'Teacher updated successfully.',
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
