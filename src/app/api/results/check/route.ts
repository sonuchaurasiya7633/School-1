import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import StudentProfile from '@/models/StudentProfile';
import User from '@/models/User';
import Exam from '@/models/Exam';
import Mark from '@/models/Mark';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Enforce student & staff authentication for marksheet privacy
    const auth = authorizeRoles(req, ['student', 'teacher', 'admin']);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please login to your portal to access examination results.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const rollNumber = searchParams.get('rollNumber')?.trim();
    const studentId = searchParams.get('studentId')?.trim();
    const examId = searchParams.get('examId')?.trim();

    const query = rollNumber || studentId;
    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Please provide Roll Number or Student ID.' },
        { status: 400 }
      );
    }

    // 1. Find Student Profile
    let studentProfile: any = await StudentProfile.findOne({
      $or: [
        { rollNumber: query },
        { rollNumber: { $regex: new RegExp(`^${query}$`, 'i') } },
      ],
    })
      .populate('user', '-password')
      .populate('class');

    if (!studentProfile) {
      const matchedUser = await User.findOne({
        $or: [
          { userId: { $regex: new RegExp(`^${query}$`, 'i') } },
          { email: query.toLowerCase() },
        ],
        role: 'student',
      });

      if (matchedUser) {
        studentProfile = await StudentProfile.findOne({ user: matchedUser._id })
          .populate('user', '-password')
          .populate('class');
      }
    }

    if (!studentProfile) {
      return NextResponse.json(
        { success: false, message: `No student found matching Roll Number / ID: "${query}".` },
        { status: 404 }
      );
    }

    const userObj = studentProfile.user as any;
    const classObj = studentProfile.class as any;

    // Student role restriction: student can only query their own roll number
    if (auth.user?.role === 'student' && userObj._id.toString() !== auth.user.id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Students can only view their own examination results.' },
        { status: 403 }
      );
    }

    // 2. Find published exam
    let exam: any = null;
    if (examId) {
      exam = await Exam.findOne({ _id: examId, isPublished: true });
    } else {
      exam = await Exam.findOne({ class: classObj?._id, isPublished: true }).sort({ createdAt: -1 });
      if (!exam) {
        exam = await Exam.findOne({ isPublished: true }).sort({ createdAt: -1 });
      }
    }

    if (!exam) {
      return NextResponse.json(
        { success: false, message: 'No published examination results available yet for this class.' },
        { status: 404 }
      );
    }

    // 3. Find marks for this student in this exam
    const markFilter: any = {
      exam: exam._id,
      student: userObj._id,
    };
    // Students can only see Published marks
    if (auth.user?.role === 'student') {
      markFilter.status = 'Published';
    }

    const marks = await Mark.find(markFilter)
      .populate('subject', 'name code')
      .sort({ createdAt: 1 });

    if (marks.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Marks for ${userObj.name} (Roll #${studentProfile.rollNumber}) have not been published yet for ${exam.name}.`,
        },
        { status: 404 }
      );
    }

    const totalMax = marks.reduce((acc, m) => acc + (m.maxMarks || 100), 0);
    const totalObtained = marks.reduce((acc, m) => acc + (m.isAbsent ? 0 : m.marksObtained || 0), 0);
    const percentage = totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(1)) : 0;
    
    // Check if failed any subject or absent
    const hasFailedAny = marks.some((m) => m.isAbsent || (m.marksObtained < (m.passMarks || 35)));
    const isPassed = !hasFailedAny && percentage >= 35;

    const reportCard = {
      studentName: userObj.name,
      studentUserId: userObj.userId,
      rollNumber: studentProfile.rollNumber,
      className: `${classObj?.name || 'Class 10'} — Section ${studentProfile.section || 'A'}`,
      parentName: studentProfile.parentName,
      examName: exam.name,
      session: exam.session || '2026-2027',
      examDate: exam.startDate,
      publishedDate: (exam as any).updatedAt || new Date().toISOString(),
      totalMaxMarks: totalMax,
      totalMarksObtained: totalObtained,
      percentage,
      isPassed,
      overallGrade: isPassed
        ? percentage >= 90
          ? 'A+'
          : percentage >= 80
          ? 'A'
          : percentage >= 70
          ? 'B+'
          : percentage >= 60
          ? 'B'
          : percentage >= 50
          ? 'C'
          : 'D'
        : 'F',
      marks: marks.map((m: any) => ({
        subjectName: m.subject?.name || 'Subject',
        subjectCode: m.subject?.code || 'SUB',
        marksObtained: m.isAbsent ? 0 : m.marksObtained,
        maxMarks: m.maxMarks || 100,
        passMarks: m.passMarks || 35,
        isAbsent: Boolean(m.isAbsent),
        grade: m.isAbsent ? 'AB' : m.grade,
        remarks: m.remarks || '',
      })),
    };

    return NextResponse.json({
      success: true,
      reportCard,
    });
  } catch (err: any) {
    console.error('Check result error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
