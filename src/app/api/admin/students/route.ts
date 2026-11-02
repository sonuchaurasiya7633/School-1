import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles, hashPassword } from '@/lib/auth';
import User from '@/models/User';
import StudentProfile from '@/models/StudentProfile';
import TeacherProfile from '@/models/TeacherProfile';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const classId = searchParams.get('classId') || '';
    const section = searchParams.get('section') || '';

    // If student, return only their profile
    if (auth.user.role === 'student') {
      const student = await StudentProfile.findOne({ user: auth.user.id })
        .populate('user', '-password')
        .populate('class');
      return NextResponse.json({ success: true, students: student ? [student] : [] });
    }

    // If teacher, filter to students in teacher's assigned classes
    let allowedClassIds: any[] = [];
    if (auth.user.role === 'teacher') {
      const teacherProf = await TeacherProfile.findOne({ user: auth.user.id });
      if (teacherProf) {
        allowedClassIds = teacherProf.assignedClasses.map((ac) => ac.class);
      }
    }

    let filter: any = {};
    if (auth.user.role === 'teacher') {
      filter.class = { $in: allowedClassIds };
    }
    if (classId) {
      filter.class = classId;
    }
    if (section) {
      filter.section = section;
    }

    let students = await StudentProfile.find(filter)
      .populate('user', '-password')
      .populate('class')
      .sort({ rollNumber: 1 });

    if (search) {
      const q = search.toLowerCase();
      students = students.filter(
        (s: any) =>
          s.user?.name?.toLowerCase().includes(q) ||
          s.user?.userId?.toLowerCase().includes(q) ||
          s.rollNumber?.toLowerCase().includes(q) ||
          s.parentName?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, students });
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
    const {
      name,
      email,
      phone,
      address,
      gender,
      dateOfBirth,
      rollNumber,
      classId,
      section,
      parentName,
      parentPhone,
      bloodGroup,
      password,
    } = data;

    if (!name || !email || !classId || !rollNumber) {
      return NextResponse.json(
        { success: false, message: 'Name, email, class and roll number are required.' },
        { status: 400 }
      );
    }

    // Generate unique User ID if not provided (e.g. STD004)
    const count = await User.countDocuments({ role: 'student' });
    const userId = `STD${String(count + 1).padStart(3, '0')}`;

    const hashedPassword = await hashPassword(password || 'password123');

    // Create User record
    const newUser = await User.create({
      userId,
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'student',
      phone: phone || '',
      address: address || '',
      gender: gender || 'Male',
      dateOfBirth: dateOfBirth || '',
      isActive: true,
    });

    // Create Student Profile record
    const profile = await StudentProfile.create({
      user: newUser._id,
      rollNumber,
      class: classId,
      section: section || 'A',
      parentName: parentName || 'Guardian',
      parentPhone: parentPhone || phone || '',
      bloodGroup: bloodGroup || 'O+',
    });

    const populated = await StudentProfile.findById(profile._id)
      .populate('user', '-password')
      .populate('class');

    return NextResponse.json({
      success: true,
      message: 'Student created successfully.',
      student: populated,
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
    const { studentId, name, email, phone, address, gender, dateOfBirth, rollNumber, classId, section, parentName, parentPhone, bloodGroup, isActive } = data;

    const studentProfile = await StudentProfile.findById(studentId);
    if (!studentProfile) {
      return NextResponse.json({ success: false, message: 'Student profile not found.' }, { status: 404 });
    }

    if (rollNumber) studentProfile.rollNumber = rollNumber;
    if (classId) studentProfile.class = classId;
    if (section) studentProfile.section = section;
    if (parentName) studentProfile.parentName = parentName;
    if (parentPhone) studentProfile.parentPhone = parentPhone;
    if (bloodGroup) studentProfile.bloodGroup = bloodGroup;
    await studentProfile.save();

    const user = await User.findById(studentProfile.user);
    if (user) {
      if (name) user.name = name;
      if (email) user.email = email.toLowerCase().trim();
      if (phone !== undefined) user.phone = phone;
      if (address !== undefined) user.address = address;
      if (gender) user.gender = gender;
      if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
      if (isActive !== undefined) user.isActive = isActive;
      await user.save();
    }

    const updated = await StudentProfile.findById(studentId)
      .populate('user', '-password')
      .populate('class');

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully.',
      student: updated,
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
    const studentId = searchParams.get('id');

    if (!studentId) {
      return NextResponse.json({ success: false, message: 'Student ID required.' }, { status: 400 });
    }

    const studentProfile = await StudentProfile.findById(studentId);
    if (studentProfile) {
      await User.findByIdAndDelete(studentProfile.user);
      await StudentProfile.findByIdAndDelete(studentId);
    }

    return NextResponse.json({ success: true, message: 'Student removed successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
