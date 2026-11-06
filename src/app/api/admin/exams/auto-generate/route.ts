import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Exam from '@/models/Exam';
import StudentProfile from '@/models/StudentProfile';
import Mark from '@/models/Mark';
import Subject from '@/models/Subject';
import { calculateGrade } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { examId, classId } = await req.json();

    if (!examId) {
      return NextResponse.json({ success: false, message: 'Exam ID is required.' }, { status: 400 });
    }

    const exam = await Exam.findById(examId).populate('schedule.subject');
    if (!exam) {
      return NextResponse.json({ success: false, message: 'Exam not found.' }, { status: 404 });
    }

    const targetClassId = classId || exam.class;

    // Find all enrolled students in this class
    const students = await StudentProfile.find({ class: targetClassId }).populate('user');
    if (students.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No students found enrolled in this class to generate marksheets.',
      }, { status: 400 });
    }

    // Get subjects from exam schedule or subjects of class
    let examSubjects: any[] = [];
    if (exam.schedule && exam.schedule.length > 0) {
      examSubjects = exam.schedule;
    } else {
      const dbSubs = await Subject.find({ classes: targetClassId });
      examSubjects = dbSubs.map((s) => ({ subject: s, maxMarks: 100, passMarks: 35 }));
    }

    if (examSubjects.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No subjects scheduled for this exam.',
      }, { status: 400 });
    }

    let generatedCount = 0;
    const now = new Date();

    for (const st of students) {
      const studentUserId = st.user._id;

      for (const item of examSubjects) {
        const subId = item.subject?._id || item.subject;
        const maxMarks = item.maxMarks || 100;
        const passMarks = item.passMarks || 35;

        // Check if mark already exists
        const existingMark = await Mark.findOne({
          exam: examId,
          student: studentUserId,
          subject: subId,
        });

        if (!existingMark) {
          // Generate realistic marks (75 to 98)
          const baseScore = Math.floor(75 + Math.random() * 23);
          const marksObtained = Math.min(maxMarks, Math.max(passMarks + 5, baseScore));
          const grade = calculateGrade(marksObtained, maxMarks, false, passMarks);
          const remarks =
            marksObtained >= 90
              ? 'Outstanding conceptual clarity'
              : marksObtained >= 80
              ? 'Very good academic understanding'
              : marksObtained >= 70
              ? 'Good effort, consistent performance'
              : 'Satisfactory, keep practicing';

          await Mark.create({
            exam: examId,
            class: targetClassId,
            section: st.section || 'A',
            subject: subId,
            student: studentUserId,
            marksObtained,
            maxMarks,
            passMarks,
            isAbsent: false,
            grade,
            remarks,
            status: 'Published',
            enteredBy: auth.user.id,
            reviewedBy: auth.user.id,
            approvedAt: now,
            reviewRemarks: 'Auto-generated & approved',
            auditLogs: [
              {
                action: 'Published',
                changedBy: auth.user.id,
                timestamp: now,
                details: 'Auto-generated marksheet baseline',
              },
            ],
          });
          generatedCount++;
        }
      }
    }

    // Mark the exam as published
    exam.isPublished = true;
    await exam.save();

    return NextResponse.json({
      success: true,
      message: `Successfully generated and published marksheets for ${students.length} students (${generatedCount} subject marks created)!`,
      studentsCount: students.length,
      generatedCount,
    });
  } catch (err: any) {
    console.error('Auto generate marksheets error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
