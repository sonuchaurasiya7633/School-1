import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Attendance from '@/models/Attendance';
import StudentProfile from '@/models/StudentProfile';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const classId = searchParams.get('classId');
    const section = searchParams.get('section');

    // If Student: return student's personal attendance summary and history
    if (auth.user.role === 'student') {
      const allAttendance = await Attendance.find({ 'records.student': auth.user.id })
        .populate('class', 'name grade')
        .sort({ date: -1 });

      const studentHistory = allAttendance.map((att) => {
        const studentRecord = att.records.find((r: any) => r.student.toString() === auth.user!.id);
        return {
          _id: att._id,
          date: att.date,
          class: att.class,
          section: att.section,
          status: studentRecord ? studentRecord.status : 'Absent',
          remarks: studentRecord?.remarks || '',
        };
      });

      const totalDays = studentHistory.length;
      const presentCount = studentHistory.filter((s) => s.status === 'Present').length;
      const absentCount = studentHistory.filter((s) => s.status === 'Absent').length;
      const lateCount = studentHistory.filter((s) => s.status === 'Late' || s.status === 'Half Day').length;
      const percentage = totalDays > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalDays) * 100) : 100;

      return NextResponse.json({
        success: true,
        summary: {
          totalDays,
          presentCount,
          absentCount,
          lateCount,
          percentage,
        },
        history: studentHistory,
      });
    }

    // For Admin and Teacher
    const filter: any = {};
    if (date) filter.date = date;
    if (classId) filter.class = classId;
    if (section) filter.section = section;

    const attendances = await Attendance.find(filter)
      .populate('class', 'name grade')
      .populate('records.student', 'name userId avatar')
      .populate('recordedBy', 'name role')
      .sort({ date: -1 });

    return NextResponse.json({ success: true, attendances });
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

    const { date, classId, section, records } = await req.json();

    if (!date || !classId || !records || records.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Date, Class, and attendance records are required.' },
        { status: 400 }
      );
    }

    // Upsert attendance for date + class + section
    const attendance = await Attendance.findOneAndUpdate(
      { date, class: classId, section: section || 'A' },
      {
        date,
        class: classId,
        section: section || 'A',
        records,
        recordedBy: auth.user.id,
      },
      { upsert: true, new: true }
    )
      .populate('class', 'name grade')
      .populate('records.student', 'name userId')
      .populate('recordedBy', 'name');

    return NextResponse.json({
      success: true,
      message: 'Attendance saved successfully.',
      attendance,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
