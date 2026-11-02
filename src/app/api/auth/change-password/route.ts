import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getUserFromRequest, comparePassword, hashPassword } from '@/lib/auth';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const tokenUser = getUserFromRequest(req);

    if (!tokenUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Please provide both current and new password.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const user = await User.findById(tokenUser.id);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const isMatch = await comparePassword(currentPassword, user.password || '');
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
