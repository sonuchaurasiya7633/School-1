import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import User from '@/models/User';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const tokenUser = getUserFromRequest(req);

    if (!tokenUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    let avatarUrl = '';
    let targetUserId = '';

    // 1. Multipart Form-Data (Direct File Upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      targetUserId = ((formData.get('targetUserId') as string) || '').trim();

      if (!file) {
        return NextResponse.json(
          { success: false, message: 'No image file uploaded.' },
          { status: 400 }
        );
      }

      // Upload file directly to Cloudinary in avatars folder
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadRes = await uploadToCloudinary(buffer, {
        folder: 'success_point_school/avatars',
        resource_type: 'image',
      });
      avatarUrl = uploadRes.secure_url;
    }
    // 2. JSON Payload (Base64 or direct Image URL)
    else if (contentType.includes('application/json')) {
      const body = await req.json();
      targetUserId = (body.targetUserId || '').trim();
      const rawData = body.avatar || body.image || body.data;

      if (!rawData) {
        return NextResponse.json(
          { success: false, message: 'No avatar image or URL provided.' },
          { status: 400 }
        );
      }

      // If rawData is base64 data URI, upload to Cloudinary
      if (typeof rawData === 'string' && rawData.startsWith('data:image/')) {
        const uploadRes = await uploadToCloudinary(rawData, {
          folder: 'success_point_school/avatars',
          resource_type: 'image',
        });
        avatarUrl = uploadRes.secure_url;
      } else {
        avatarUrl = rawData;
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid Content-Type.' },
        { status: 400 }
      );
    }

    // Determine target user to update
    let userToUpdate: any = null;

    if (targetUserId) {
      // Only Super Admin can change another user's avatar
      if (tokenUser.role !== 'admin') {
        return NextResponse.json(
          { success: false, message: 'Forbidden. Only Super Admin can update other users\' profile pictures.' },
          { status: 403 }
        );
      }

      // Find by MongoDB _id or userId (e.g. STD001, TCH001) or email
      if (mongoose.Types.ObjectId.isValid(targetUserId)) {
        userToUpdate = await User.findById(targetUserId);
      }
      if (!userToUpdate) {
        userToUpdate = await User.findOne({
          $or: [
            { userId: { $regex: new RegExp(`^${targetUserId}$`, 'i') } },
            { email: targetUserId.toLowerCase() },
          ],
        });
      }

      if (!userToUpdate) {
        return NextResponse.json(
          { success: false, message: `Target user "${targetUserId}" not found.` },
          { status: 404 }
        );
      }
    } else {
      // User is updating their OWN profile picture
      userToUpdate = await User.findById(tokenUser.id);
      if (!userToUpdate) {
        return NextResponse.json(
          { success: false, message: 'Current user record not found.' },
          { status: 404 }
        );
      }
    }

    // Save avatar
    userToUpdate.avatar = avatarUrl;
    await userToUpdate.save();

    return NextResponse.json({
      success: true,
      message: targetUserId
        ? `Profile picture updated for ${userToUpdate.name} (${userToUpdate.userId})!`
        : 'Your profile picture has been updated successfully!',
      avatar: userToUpdate.avatar,
      user: {
        _id: userToUpdate._id,
        userId: userToUpdate.userId,
        name: userToUpdate.name,
        role: userToUpdate.role,
        avatar: userToUpdate.avatar,
      },
    });
  } catch (err: any) {
    console.error('Avatar update error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Error updating profile picture.' },
      { status: 500 }
    );
  }
}
