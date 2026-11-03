import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import StudentProfile from '@/models/StudentProfile';
import TeacherProfile from '@/models/TeacherProfile';
import { comparePassword, signToken } from '@/lib/auth';
import { seedDatabase } from '@/lib/seed-data';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Auto-seed if database is empty on first run
    const count = await User.countDocuments();
    if (count === 0) {
      await seedDatabase();
    }

    const body = await req.json();
    const rawIdentifier = body.identifier || body.userId || body.email || body.username;
    const password = body.password;

    if (!rawIdentifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide Email / User ID and password.' },
        { status: 400 }
      );
    }

    const trimmedIdentifier = String(rawIdentifier).trim().toLowerCase();

    // Find by email or userId
    let user = await User.findOne({
      $or: [
        { email: trimmedIdentifier },
        { userId: { $regex: new RegExp(`^${trimmedIdentifier}$`, 'i') } },
      ],
    });

    // Flexible fallback: if user typed 'STU001' instead of 'STD001' or vice versa
    if (!user && (trimmedIdentifier.startsWith('stu') || trimmedIdentifier.startsWith('std'))) {
      const altId = trimmedIdentifier.startsWith('stu')
        ? trimmedIdentifier.replace(/^stu/, 'std')
        : trimmedIdentifier.replace(/^std/, 'stu');
      user = await User.findOne({
        userId: { $regex: new RegExp(`^${altId}$`, 'i') },
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. User not found.' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account has been deactivated. Please contact administrator.' },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(password, user.password || '');
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid password. Please check your credentials.' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signToken({
      id: user._id.toString(),
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Fetch related profile if teacher or student
    let profileData: any = null;
    if (user.role === 'student') {
      profileData = await StudentProfile.findOne({ user: user._id }).populate('class');
    } else if (user.role === 'teacher') {
      profileData = await TeacherProfile.findOne({ user: user._id })
        .populate('assignedClasses.class')
        .populate('assignedClasses.subject');
    }

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        profile: profileData,
      },
    });

    const isLocalhost = req.nextUrl?.origin?.includes('localhost') || req.nextUrl?.origin?.includes('127.0.0.1');
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && !isLocalhost,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
