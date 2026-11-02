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
        { success: false, message: 'Unauthorized. Please login to your student portal to access examination results.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const rollNumber = searchParams.get('rollNumber')?.trim();
    const studentId = searchParams.get('studentId')?.trim();

    const query = rollNumber || studentId;
    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Please provide Roll Number or Student ID.' },
        { status: 400 }
      );
    }

    // 1. Find user by userId (e.g. STD001) or find StudentProfile by rollNumber
    let studentProfile: any = await StudentProfile.findOne({
      $or: [
        { rollNumber: query },
        { rollNumber: { $regex: new RegExp(`^${query}$`, 'i') } },
      ],
    })
      .populate('user', '-password')
      .populate('class');

    if (!studentProfile) {
      // Try searching by User.userId (e.g. STD001) or User.email
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

    // 2. Find published exam
    let exam = await Exam.findOne({ class: classObj?._id, isPublished: true }).sort({ createdAt: -1 });
    if (!exam) {
      exam = await Exam.findOne({ isPublished: true }).sort({ createdAt: -1 });
    }

    if (!exam) {
      return NextResponse.json(
        { success: false, message: 'No published examination results available yet.' },
        { status: 404 }
      );
    }

    // 3. Find marks for this student in this exam
    const marks = await Mark.find({
      exam: exam._id,
      student: userObj._id,
    })
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
    const totalObtained = marks.reduce((acc, m) => acc + (m.marksObtained || 0), 0);
    const percentage = totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(1)) : 0;
    const isPassed = percentage >= 35;

    const reportCard = {
      studentName: userObj.name,
      studentUserId: userObj.userId,
      rollNumber: studentProfile.rollNumber,
      className: `${classObj?.name || 'Class 10'} — Section ${studentProfile.section}`,
      parentName: studentProfile.parentName,
      examName: exam.name,
      examDate: exam.startDate,
      publishedDate: (exam as any).updatedAt || new Date().toISOString(),
      totalMaxMarks: totalMax,
      totalMarksObtained: totalObtained,
      percentage,
      isPassed,
      overallGrade:
        percentage >= 90
          ? 'A+'
          : percentage >= 80
          ? 'A'
          : percentage >= 70
          ? 'B+'
          : percentage >= 60
          ? 'B'
          : percentage >= 50
          ? 'C'
          : percentage >= 35
          ? 'D'
          : 'F',
      marks: marks.map((m: any) => ({
        subjectName: m.subject?.name,
        subjectCode: m.subject?.code,
        marksObtained: m.marksObtained,
        maxMarks: m.maxMarks,
        grade: m.grade,
        remarks: m.remarks,
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
