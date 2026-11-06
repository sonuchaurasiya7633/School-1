import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import AttendanceCorrection from '@/models/AttendanceCorrection';
import Attendance from '@/models/Attendance';
import StudentProfile from '@/models/StudentProfile';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const classId = searchParams.get('classId');

    const filter: any = {};
    if (auth.user.role === 'student') {
      filter.student = auth.user.id;
    } else {
      if (status) filter.status = status;
      if (classId) filter.class = classId;
    }

    const corrections = await AttendanceCorrection.find(filter)
      .populate('student', 'name userId email')
      .populate('class', 'name grade')
      .populate('reviewedBy', 'name role')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, corrections });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['student']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const body = await req.json();
    const { date, currentStatus, requestedStatus, reason } = body;

    if (!date || !currentStatus || !requestedStatus || !reason) {
      return NextResponse.json(
        { success: false, message: 'Date, current status, requested status, and reason are required.' },
        { status: 400 }
      );
    }

    // Lookup student's class and section
    const studentProf = await StudentProfile.findOne({ user: auth.user.id });
    if (!studentProf) {
      return NextResponse.json(
        { success: false, message: 'Student academic profile not found.' },
        { status: 404 }
      );
    }

    // Check if an existing request is pending for the same date
    const existing = await AttendanceCorrection.findOne({
      student: auth.user.id,
      date,
      status: 'Pending',
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `A correction request for date ${date} is already pending review.` },
        { status: 400 }
      );
    }

    const correction = await AttendanceCorrection.create({
      student: auth.user.id,
      class: studentProf.class,
      section: studentProf.section || 'A',
      date,
      currentStatus,
      requestedStatus,
      reason: reason.trim(),
      status: 'Pending',
    });

    const populated = await AttendanceCorrection.findById(correction._id)
      .populate('student', 'name userId')
      .populate('class', 'name grade');

    return NextResponse.json({
      success: true,
      message: 'Attendance correction request submitted for administrative review.',
      correction: populated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const body = await req.json();
    const { requestId, action, reviewRemarks } = body; // action: 'Approved' | 'Rejected'

    if (!requestId || !action || !['Approved', 'Rejected'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Valid requestId and action (Approved/Rejected) are required.' },
        { status: 400 }
      );
    }

    const correction = await AttendanceCorrection.findById(requestId);
    if (!correction) {
      return NextResponse.json({ success: false, message: 'Correction request not found.' }, { status: 404 });
    }

    correction.status = action;
    correction.reviewedBy = auth.user.id as any;
    correction.reviewRemarks = reviewRemarks || `Request ${action} by ${auth.user.name}`;
    await correction.save();

    // If Approved: Synchronize and update the actual Attendance record!
    if (action === 'Approved') {
      const attendanceDoc = await Attendance.findOne({
        date: correction.date,
        class: correction.class,
        section: correction.section,
      });

      if (attendanceDoc) {
        const studentRecordIndex = attendanceDoc.records.findIndex(
          (r: any) => r.student.toString() === correction.student.toString()
        );

        if (studentRecordIndex !== -1) {
          attendanceDoc.records[studentRecordIndex].status = correction.requestedStatus;
          const prevRemarks = attendanceDoc.records[studentRecordIndex].remarks || '';
          attendanceDoc.records[studentRecordIndex].remarks = prevRemarks
            ? `${prevRemarks} | Corrected to ${correction.requestedStatus}`
            : `Corrected to ${correction.requestedStatus} on approval`;
        } else {
          // If student was not listed in that session's records, append them
          attendanceDoc.records.push({
            student: correction.student,
            status: correction.requestedStatus,
            remarks: `Corrected on administrative approval`,
          });
        }

        await attendanceDoc.save();
      }
    }

    const updated = await AttendanceCorrection.findById(correction._id)
      .populate('student', 'name userId email')
      .populate('class', 'name grade')
      .populate('reviewedBy', 'name');

    return NextResponse.json({
      success: true,
      message: `Correction request has been ${action.toLowerCase()} successfully.`,
      correction: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
