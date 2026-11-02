import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import User from '@/models/User';
import Faculty from '@/models/Faculty';

export const runtime = 'nodejs';
export const maxDuration = 60;

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

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Try Cloudinary upload, with safe base64 fallback if external API is unreachable
      try {
        const uploadRes = await uploadToCloudinary(buffer, {
          folder: 'success_point_school/avatars',
          resource_type: 'image',
        });
        avatarUrl = uploadRes.secure_url;
      } catch (cloudErr) {
        console.warn('Cloudinary upload warning, falling back to base64 storage:', cloudErr);
        const mimeType = file.type || 'image/jpeg';
        avatarUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
      }
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

      if (typeof rawData === 'string' && rawData.startsWith('data:image/')) {
        try {
          const uploadRes = await uploadToCloudinary(rawData, {
            folder: 'success_point_school/avatars',
            resource_type: 'image',
          });
          avatarUrl = uploadRes.secure_url;
        } catch (cloudErr) {
          console.warn('Cloudinary JSON upload warning, keeping base64:', cloudErr);
          avatarUrl = rawData;
        }
      } else {
        avatarUrl = rawData;
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid Content-Type.' },
        { status: 400 }
      );
    }

    // Determine target user or faculty to update
    let userToUpdate: any = null;
    let facultyToUpdate: any = null;

    if (targetUserId) {
      // Only Super Admin can change another user's avatar
      if (tokenUser.role !== 'admin') {
        return NextResponse.json(
          { success: false, message: "Forbidden. Only Super Admin can update other users' profile pictures." },
          { status: 403 }
        );
      }

      // Check if target is a User _id or userId (e.g. STD001, TCH001) or email
      if (mongoose.Types.ObjectId.isValid(targetUserId)) {
        userToUpdate = await User.findById(targetUserId);
        if (!userToUpdate) {
          facultyToUpdate = await Faculty.findById(targetUserId);
        }
      }

      if (!userToUpdate && !facultyToUpdate) {
        userToUpdate = await User.findOne({
          $or: [
            { userId: { $regex: new RegExp(`^${targetUserId}$`, 'i') } },
            { email: targetUserId.toLowerCase() },
          ],
        });
      }

      if (!userToUpdate && !facultyToUpdate) {
        // Try finding faculty by name
        facultyToUpdate = await Faculty.findOne({
          name: { $regex: new RegExp(`^${targetUserId}$`, 'i') },
        });
      }

      if (!userToUpdate && !facultyToUpdate) {
        return NextResponse.json(
          { success: false, message: `Target record "${targetUserId}" not found.` },
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

    // If User found, update User.avatar
    if (userToUpdate) {
      userToUpdate.avatar = avatarUrl;
      await userToUpdate.save();

      // If user is a teacher, also sync with Faculty Directory document for public website!
      if (userToUpdate.role === 'teacher') {
        try {
          const matchingFaculty = await Faculty.findOne({
            name: { $regex: new RegExp(`^${userToUpdate.name.trim()}$`, 'i') },
          });
          if (matchingFaculty) {
            matchingFaculty.avatar = avatarUrl;
            await matchingFaculty.save();
          }
        } catch (facErr) {
          console.error('Error syncing faculty avatar:', facErr);
        }
      }
    }

    // If Faculty record found, update Faculty.avatar and sync with User if matching teacher exists
    if (facultyToUpdate) {
      facultyToUpdate.avatar = avatarUrl;
      await facultyToUpdate.save();

      try {
        const matchingUser = await User.findOne({
          role: 'teacher',
          name: { $regex: new RegExp(`^${facultyToUpdate.name.trim()}$`, 'i') },
        });
        if (matchingUser) {
          matchingUser.avatar = avatarUrl;
          await matchingUser.save();
        }
      } catch (usrErr) {
        console.error('Error syncing user avatar from faculty:', usrErr);
      }
    }

    const displayName = userToUpdate?.name || facultyToUpdate?.name || 'User';

    return NextResponse.json({
      success: true,
      message: targetUserId
        ? `Profile picture updated for ${displayName}!`
        : 'Your profile picture has been updated successfully!',
      avatar: avatarUrl,
      user: userToUpdate
        ? {
            _id: userToUpdate._id,
            userId: userToUpdate.userId,
            name: userToUpdate.name,
            role: userToUpdate.role,
            avatar: userToUpdate.avatar,
          }
        : null,
      faculty: facultyToUpdate
        ? {
            _id: facultyToUpdate._id,
            name: facultyToUpdate.name,
            avatar: facultyToUpdate.avatar,
          }
        : null,
    });
  } catch (err: any) {
    console.error('Avatar update error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Error updating profile picture.' },
      { status: 500 }
    );
  }
}
