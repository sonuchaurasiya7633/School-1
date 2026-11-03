import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Notice from '@/models/Notice';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    let filter: any = {};
    if (auth.user.role === 'student') {
      filter = { targetRole: { $in: ['all', 'student'] } };
    } else if (auth.user.role === 'teacher') {
      filter = { targetRole: { $in: ['all', 'teacher'] } };
    }

    const notices = await Notice.find(filter)
      .populate('author', 'name role')
      .populate('class', 'name grade')
      .sort({ isPinned: -1, createdAt: -1 });

    return NextResponse.json({ success: true, notices });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { title, content, targetRole, classId, isPinned } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ success: false, message: 'Title and content are required.' }, { status: 400 });
    }

    const newNotice = await Notice.create({
      title: title.trim(),
      content: content.trim(),
      targetRole: targetRole || 'all',
      class: classId && mongoose.isValidObjectId(classId) ? classId : undefined,
      author: auth.user.id,
      isPinned: Boolean(isPinned),
      date: new Date().toISOString().split('T')[0],
    });

    const populated = await Notice.findById(newNotice._id)
      .populate('author', 'name role')
      .populate('class', 'name grade');

    return NextResponse.json({
      success: true,
      message: 'Notice published successfully.',
      notice: populated,
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Notice ID is required.' }, { status: 400 });
    }

    await Notice.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Notice removed successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
