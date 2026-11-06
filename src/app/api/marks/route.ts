import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Mark from '@/models/Mark';
import Exam from '@/models/Exam';
import TeacherProfile from '@/models/TeacherProfile';
import { calculateGrade } from '@/lib/utils';

export const dynamic = 'force-dynamic';

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
    const section = searchParams.get('section');
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');

    let filter: any = {};
    if (examId) filter.exam = examId;
    if (classId) filter.class = classId;
    if (subjectId) filter.subject = subjectId;
    if (section) filter.section = section;
    if (status) filter.status = status;

    // Student privacy: ONLY see published marks where the parent exam is published
    if (auth.user.role === 'student') {
      filter.student = auth.user.id;
      filter.status = 'Published';
    } else if (studentId) {
      filter.student = studentId;
    }

    const marks = await Mark.find(filter)
      .populate('exam', 'name session startDate endDate isPublished schedule')
      .populate('class', 'name grade')
      .populate('subject', 'name code')
      .populate('student', 'name userId')
      .populate('enteredBy', 'name role')
      .populate('reviewedBy', 'name role')
      .sort({ createdAt: -1 });

    // Extra safety for students: Filter out any marks whose exam is not published
    let filteredMarks = marks;
    if (auth.user.role === 'student') {
      filteredMarks = marks.filter((m: any) => m.exam && m.exam.isPublished === true);
    }

    return NextResponse.json({ success: true, marks: filteredMarks });
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

    const body = await req.json();
    const {
      action = 'save_draft', // 'save_draft' | 'submit_approval' | 'approve' | 'reject' | 'publish' | 'approve_all' | 'publish_all'
      examId,
      classId,
      section = 'A',
      subjectId,
      marksData,
      reviewRemarks = '',
    } = body;

    // 1. Bulk Admin Actions (approve_all / publish_all)
    if (action === 'approve_all' || action === 'publish_all') {
      if (auth.user.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Only administrators can perform bulk approval or publication.' }, { status: 403 });
      }
      if (!examId) {
        return NextResponse.json({ success: false, message: 'Exam ID is required.' }, { status: 400 });
      }

      const markFilter: any = { exam: examId };
      if (classId) markFilter.class = classId;

      const targetStatus = action === 'publish_all' ? 'Published' : 'Approved';
      const now = new Date();

      const updatePayload: any = {
        status: targetStatus,
        reviewedBy: auth.user.id,
        reviewRemarks: reviewRemarks || `Bulk ${action} by Admin`,
      };
      if (action === 'approve_all') updatePayload.approvedAt = now;

      const result = await Mark.updateMany(markFilter, {
        $set: updatePayload,
        $push: {
          auditLogs: {
            action: targetStatus,
            changedBy: auth.user.id,
            timestamp: now,
            details: `Bulk updated to ${targetStatus}`,
          },
        },
      });

      if (action === 'publish_all') {
        await Exam.findByIdAndUpdate(examId, { isPublished: true });
      }

      return NextResponse.json({
        success: true,
        message: `Successfully updated ${result.modifiedCount} mark records to ${targetStatus}.`,
        modifiedCount: result.modifiedCount,
      });
    }

    // 2. Regular subject marks entry or approval
    if (!examId || !classId || !subjectId || !marksData || !Array.isArray(marksData)) {
      return NextResponse.json({ success: false, message: 'Invalid payload: exam, class, subject, and student marks are required.' }, { status: 400 });
    }

    // Teacher permission check: verify teacher is assigned to this class and subject (admins bypass)
    if (auth.user.role === 'teacher') {
      const teacherProfile = await TeacherProfile.findOne({ user: auth.user.id });
      if (teacherProfile && teacherProfile.assignedClasses && teacherProfile.assignedClasses.length > 0) {
        const isAssigned = teacherProfile.assignedClasses.some(
          (ac) =>
            ac.class.toString() === classId.toString() &&
            ac.subject.toString() === subjectId.toString() &&
            (!ac.section || ac.section.toUpperCase() === section.toUpperCase())
        );
        if (!isAssigned) {
          return NextResponse.json(
            { success: false, message: 'Unauthorized. You are not assigned to teach this subject for the selected class/section.' },
            { status: 403 }
          );
        }
      }

      // Teachers cannot directly approve or publish
      if (action === 'approve' || action === 'publish') {
        return NextResponse.json(
          { success: false, message: 'Teachers cannot approve or publish results. Please use Submit for Admin Approval.' },
          { status: 403 }
        );
      }
    }

    // Fetch exam schedule details for this subject
    const examDoc = await Exam.findById(examId);
    if (!examDoc) {
      return NextResponse.json({ success: false, message: 'Exam schedule not found.' }, { status: 404 });
    }

    const scheduledSubject = examDoc.schedule?.find(
      (s: any) => s.subject.toString() === subjectId.toString()
    );
    const defaultMaxMarks = scheduledSubject?.maxMarks || 100;
    const defaultPassMarks = scheduledSubject?.passMarks || 35;

    // Determine target status
    let targetStatus: 'Draft' | 'Submitted' | 'Approved' | 'Published' = 'Draft';
    if (action === 'submit_approval') targetStatus = 'Submitted';
    else if (action === 'approve') targetStatus = 'Approved';
    else if (action === 'reject') targetStatus = 'Draft';
    else if (action === 'publish') targetStatus = 'Published';

    const now = new Date();
    const savedMarks = [];

    for (const item of marksData) {
      const {
        studentId,
        marksObtained,
        maxMarks = defaultMaxMarks,
        passMarks = defaultPassMarks,
        isAbsent = false,
        remarks = '',
      } = item;

      const numMax = Number(maxMarks) || 100;
      const numPass = Number(passMarks) || 35;
      const numMarks = isAbsent ? 0 : Number(marksObtained);

      // Validation 1: Prevent negative marks or marks exceeding maxMarks
      if (!isAbsent) {
        if (isNaN(numMarks) || numMarks < 0) {
          return NextResponse.json(
            { success: false, message: `Invalid mark value for student. Marks cannot be negative.` },
            { status: 400 }
          );
        }
        if (numMarks > numMax) {
          return NextResponse.json(
            { success: false, message: `Marks obtained (${numMarks}) cannot exceed maximum marks (${numMax}).` },
            { status: 400 }
          );
        }
      }

      // Grade calculation
      const grade = calculateGrade(numMarks, numMax, isAbsent, numPass);

      // Prepare update object
      const updateData: any = {
        exam: examId,
        class: classId,
        section: section || 'A',
        subject: subjectId,
        student: studentId,
        marksObtained: numMarks,
        maxMarks: numMax,
        passMarks: numPass,
        isAbsent: Boolean(isAbsent),
        grade,
        remarks: remarks || '',
        status: targetStatus,
        enteredBy: auth.user.id,
      };

      if (action === 'submit_approval') {
        updateData.submittedAt = now;
      }
      if (action === 'approve') {
        updateData.approvedAt = now;
        updateData.reviewedBy = auth.user.id;
        updateData.reviewRemarks = reviewRemarks || 'Approved by Admin';
      }
      if (action === 'reject') {
        updateData.reviewRemarks = reviewRemarks || 'Changes requested by Admin';
      }
      if (action === 'publish') {
        updateData.reviewedBy = auth.user.id;
        updateData.reviewRemarks = reviewRemarks || 'Published by Admin';
      }

      // Perform upsert (prevents duplicate marks per exam + student + subject)
      const updated = await Mark.findOneAndUpdate(
        { exam: examId, student: studentId, subject: subjectId },
        {
          $set: updateData,
          $push: {
            auditLogs: {
              action: targetStatus,
              changedBy: auth.user.id,
              timestamp: now,
              details: isAbsent
                ? `Marked as Absent`
                : `Marks: ${numMarks}/${numMax} (${grade}) - Status: ${targetStatus}`,
            },
          },
        },
        { upsert: true, new: true }
      );

      savedMarks.push(updated);
    }

    let responseMessage = 'Marks saved as draft successfully.';
    if (action === 'submit_approval') responseMessage = 'Marks submitted for Admin approval successfully!';
    else if (action === 'approve') responseMessage = 'Marks approved successfully!';
    else if (action === 'reject') responseMessage = 'Marks returned to draft for corrections.';
    else if (action === 'publish') responseMessage = 'Marks published successfully to Student Portal!';

    return NextResponse.json({
      success: true,
      message: responseMessage,
      status: targetStatus,
      count: savedMarks.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
