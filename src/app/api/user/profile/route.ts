import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';
import StudentProfile from '@/models/StudentProfile';
import TeacherProfile from '@/models/TeacherProfile';
import Faculty from '@/models/Faculty';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const tokenUser = getUserFromRequest(req);

    if (!tokenUser) {
      return NextResponse.json({ success: false, message: 'Not authenticated. Please log in.' }, { status: 401 });
    }

    const body = await req.json();
    const { targetUserId, name, phone, address, gender, dateOfBirth, ...profileFields } = body;

    // Determine target user
    let userToUpdateId = tokenUser.id;
    if (targetUserId && tokenUser.role === 'admin') {
      userToUpdateId = targetUserId;
    }

    const user = await User.findById(userToUpdateId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User record not found.' }, { status: 404 });
    }

    const oldName = user.name;

    // 1. Update User core fields
    if (name && typeof name === 'string' && name.trim()) {
      user.name = name.trim();
    }
    if (phone !== undefined) {
      user.phone = String(phone).trim();
    }
    if (address !== undefined) {
      user.address = String(address).trim();
    }
    if (gender && ['Male', 'Female', 'Other'].includes(gender)) {
      user.gender = gender as any;
    }
    if (dateOfBirth !== undefined) {
      user.dateOfBirth = String(dateOfBirth).trim();
    }

    await user.save();

    // 2. Update Student Profile if applicable
    let updatedProfile: any = null;
    if (user.role === 'student') {
      const studentUpdateData: any = {};
      if (profileFields.parentName !== undefined) studentUpdateData.parentName = String(profileFields.parentName).trim();
      if (profileFields.parentPhone !== undefined) studentUpdateData.parentPhone = String(profileFields.parentPhone).trim();
      if (profileFields.emergencyContact !== undefined) studentUpdateData.emergencyContact = String(profileFields.emergencyContact).trim();
      if (profileFields.bloodGroup !== undefined) studentUpdateData.bloodGroup = String(profileFields.bloodGroup).trim();

      if (Object.keys(studentUpdateData).length > 0) {
        updatedProfile = await StudentProfile.findOneAndUpdate(
          { user: user._id },
          { $set: studentUpdateData },
          { new: true, upsert: true }
        ).populate('class');
      } else {
        updatedProfile = await StudentProfile.findOne({ user: user._id }).populate('class');
      }
    }

    // 3. Update Teacher Profile if applicable
    if (user.role === 'teacher') {
      const teacherUpdateData: any = {};
      if (profileFields.qualification !== undefined) teacherUpdateData.qualification = String(profileFields.qualification).trim();
      if (profileFields.specialization !== undefined) teacherUpdateData.specialization = String(profileFields.specialization).trim();

      if (Object.keys(teacherUpdateData).length > 0) {
        updatedProfile = await TeacherProfile.findOneAndUpdate(
          { user: user._id },
          { $set: teacherUpdateData },
          { new: true, upsert: true }
        )
          .populate('assignedClasses.class')
          .populate('assignedClasses.subject');
      } else {
        updatedProfile = await TeacherProfile.findOne({ user: user._id })
          .populate('assignedClasses.class')
          .populate('assignedClasses.subject');
      }

      // Synchronize with public Faculty directory if matching record exists
      try {
        await Faculty.updateMany(
          {
            $or: [
              { name: oldName },
              { name: user.name },
            ],
          },
          {
            $set: {
              name: user.name,
              ...(profileFields.qualification ? { qualification: profileFields.qualification.trim() } : {}),
            },
          }
        );
      } catch (err) {
        console.error('Faculty sync error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profile details updated successfully!',
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
        profile: updatedProfile,
      },
    });
  } catch (err: any) {
    console.error('Error updating user profile:', err);
    return NextResponse.json({ success: false, message: err.message || 'Failed to update profile.' }, { status: 500 });
  }
}
