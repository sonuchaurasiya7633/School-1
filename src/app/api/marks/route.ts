import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Mark from '@/models/Mark';
import Exam from '@/models/Exam';
import { calculateGrade } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const examId = searchParams.get('examId');
    const classId = searchParams.get('classId');
    const subjectId = searchParams.get('subjectId');
    const studentId = searchParams.get('studentId');

    let filter: any = {};
    if (examId) filter.exam = examId;
    if (classId) filter.class = classId;
    if (subjectId) filter.subject = subjectId;

    // Student can only see their own marks
    if (auth.user.role === 'student') {
      filter.student = auth.user.id;
    } else if (studentId) {
      filter.student = studentId;
    }

    const marks = await Mark.find(filter)
      .populate('exam', 'name startDate isPublished')
      .populate('class', 'name grade')
      .populate('subject', 'name code')
      .populate('student', 'name userId')
      .populate('enteredBy', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, marks });
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

    const { examId, classId, section, subjectId, marksData } = await req.json();

    if (!examId || !classId || !subjectId || !marksData || !Array.isArray(marksData)) {
      return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 });
    }

    const savedMarks = [];
    for (const item of marksData) {
      const { studentId, marksObtained, maxMarks = 100, remarks } = item;
      const grade = calculateGrade(Number(marksObtained), Number(maxMarks));

      const updated = await Mark.findOneAndUpdate(
        { exam: examId, student: studentId, subject: subjectId },
        {
          exam: examId,
          class: classId,
          section: section || 'A',
          subject: subjectId,
          student: studentId,
          marksObtained: Number(marksObtained),
          maxMarks: Number(maxMarks),
          grade,
          remarks: remarks || '',
          enteredBy: auth.user.id,
        },
        { upsert: true, new: true }
      );
      savedMarks.push(updated);
    }

    return NextResponse.json({
      success: true,
      message: 'Marks recorded successfully.',
      count: savedMarks.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
