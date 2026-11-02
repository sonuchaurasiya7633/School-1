import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Homework from '@/models/Homework';
import StudentProfile from '@/models/StudentProfile';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const subjectId = searchParams.get('subjectId');

    let filter: any = {};

    // If Student: find only homework for their class
    if (auth.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ user: auth.user.id });
      if (!studentProfile) {
        return NextResponse.json({ success: true, homework: [] });
      }
      filter.class = studentProfile.class;
    } else if (auth.user.role === 'teacher') {
      // Teacher can see what they created or for their assigned classes
      if (classId) filter.class = classId;
      if (subjectId) filter.subject = subjectId;
    } else {
      // Admin
      if (classId) filter.class = classId;
      if (subjectId) filter.subject = subjectId;
    }

    const homeworkList = await Homework.find(filter)
      .populate('class', 'name grade')
      .populate('subject', 'name code')
      .populate('teacher', 'name email')
      .populate('submissions.student', 'name userId avatar')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, homework: homeworkList, homeworks: homeworkList });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const body = await req.json();

    // Case 1: Student submitting homework
    if (body.action === 'submit') {
      if (auth.user.role !== 'student') {
        return NextResponse.json({ success: false, message: 'Only students can submit homework.' }, { status: 403 });
      }

      const { homeworkId, submissionText, fileUrl } = body;
      const hw = await Homework.findById(homeworkId);
      if (!hw) {
        return NextResponse.json({ success: false, message: 'Homework not found.' }, { status: 404 });
      }

      const existingIndex = hw.submissions.findIndex((s: any) => s.student.toString() === auth.user!.id);
      if (existingIndex > -1) {
        hw.submissions[existingIndex].submissionText = submissionText;
        if (fileUrl) hw.submissions[existingIndex].fileUrl = fileUrl;
        hw.submissions[existingIndex].submittedAt = new Date();
        hw.submissions[existingIndex].status = 'Submitted';
      } else {
        hw.submissions.push({
          student: auth.user.id as any,
          submissionText,
          fileUrl,
          submittedAt: new Date(),
          status: 'Submitted',
        });
      }

      await hw.save();
      return NextResponse.json({ success: true, message: 'Homework submitted successfully!' });
    }

    // Case 2: Teacher grading / reviewing submission
    if (body.action === 'grade') {
      if (auth.user.role !== 'teacher' && auth.user.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Unauthorized to grade homework.' }, { status: 403 });
      }

      const { homeworkId, studentId, marks, feedback } = body;
      const hw = await Homework.findById(homeworkId);
      if (!hw) {
        return NextResponse.json({ success: false, message: 'Homework not found.' }, { status: 404 });
      }

      const submission = hw.submissions.find((s: any) => s.student.toString() === studentId);
      if (submission) {
        submission.status = 'Reviewed';
        if (marks !== undefined) submission.marks = Number(marks);
        if (feedback !== undefined) submission.feedback = feedback;
        await hw.save();
      }

      return NextResponse.json({ success: true, message: 'Submission reviewed successfully.' });
    }

    // Case 3: Teacher / Admin creating new homework
    if (auth.user.role !== 'teacher' && auth.user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Only teachers can assign homework.' }, { status: 403 });
    }

    const { title, description, classId, section, subjectId, dueDate } = body;
    if (!title || !description || !classId || !subjectId || !dueDate) {
      return NextResponse.json({ success: false, message: 'All homework fields are required.' }, { status: 400 });
    }

    const newHw = await Homework.create({
      title,
      description,
      class: classId,
      section: section || 'A',
      subject: subjectId,
      teacher: auth.user.id,
      dueDate,
      submissions: [],
    });

    const populated = await Homework.findById(newHw._id)
      .populate('class', 'name grade')
      .populate('subject', 'name code')
      .populate('teacher', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Homework assigned successfully.',
      homework: populated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Homework ID is required.' }, { status: 400 });
    }

    await Homework.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Homework deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
