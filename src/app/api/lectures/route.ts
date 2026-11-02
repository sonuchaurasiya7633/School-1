import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Lecture from '@/models/Lecture';
import StudentProfile from '@/models/StudentProfile';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    let filter: any = {};

    if (auth.user.role === 'teacher') {
      filter = { teacher: auth.user.id };
    } else if (auth.user.role === 'student') {
      // Find student class
      const studentProfile = await StudentProfile.findOne({ user: auth.user.id });
      if (studentProfile) {
        filter = { class: studentProfile.class };
      }
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const subjectId = searchParams.get('subjectId');

    if (classId) filter.class = classId;
    if (subjectId) filter.subject = subjectId;

    const lectures = await Lecture.find(filter)
      .populate('teacher', 'name email userId')
      .populate('class', 'name grade section')
      .populate('subject', 'name code')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, lectures });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['teacher', 'admin']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { title, description, classId, section, subjectId, videoUrl, attachmentUrl, tags } = await req.json();

    if (!title || !classId || !subjectId) {
      return NextResponse.json({ success: false, message: 'Title, Class, and Subject are required.' }, { status: 400 });
    }

    const lecture = await Lecture.create({
      title,
      description: description || '',
      class: classId,
      section: section || 'A',
      subject: subjectId,
      teacher: auth.user.id,
      videoUrl: videoUrl || '',
      attachmentUrl: attachmentUrl || '',
      tags: tags || [],
    });

    const populated = await Lecture.findById(lecture._id)
      .populate('teacher', 'name email userId')
      .populate('class', 'name grade')
      .populate('subject', 'name code');

    return NextResponse.json({
      success: true,
      message: 'Lecture uploaded successfully!',
      lecture: populated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['teacher', 'admin']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Lecture ID is required' }, { status: 400 });
    }

    const lecture = await Lecture.findById(id);
    if (!lecture) {
      return NextResponse.json({ success: false, message: 'Lecture not found' }, { status: 404 });
    }

    // Teachers can only delete their own lectures
    if (auth.user.role === 'teacher' && lecture.teacher.toString() !== auth.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized to delete this lecture' }, { status: 403 });
    }

    await Lecture.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Lecture removed successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
