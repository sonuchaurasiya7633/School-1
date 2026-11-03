import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';
import StudentProfile from '@/models/StudentProfile';
import TeacherProfile from '@/models/TeacherProfile';

export { PUT } from '@/app/api/user/profile/route';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const tokenUser = getUserFromRequest(req);

    if (!tokenUser) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const user = await User.findById(tokenUser.id).select('-password');
    if (!user || !user.isActive) {
      return NextResponse.json({ success: false, message: 'User not found or inactive' }, { status: 404 });
    }

    let profile: any = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id }).populate('class');
    } else if (user.role === 'teacher') {
      profile = await TeacherProfile.findOne({ user: user._id })
        .populate('assignedClasses.class')
        .populate('assignedClasses.subject');
    }

    const rawToken =
      req.cookies.get('token')?.value ||
      (req.headers.get('authorization')?.startsWith('Bearer ')
        ? req.headers.get('authorization')?.split(' ')[1]
        : '') ||
      req.headers.get('x-auth-token');

    return NextResponse.json({
      success: true,
      token: rawToken,
      user: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar,
        isActive: user.isActive,
        profile,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
