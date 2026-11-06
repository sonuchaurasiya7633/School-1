import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Attendance from '@/models/Attendance';
import StudentProfile from '@/models/StudentProfile';
import TeacherProfile from '@/models/TeacherProfile';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');
    const date = searchParams.get('date');
    const classId = searchParams.get('classId');
    const section = searchParams.get('section') || 'A';
    const month = searchParams.get('month'); // YYYY-MM

    // ================= 1. MONTHLY REGISTER REPORT (ADMIN & TEACHER) =================
    if (mode === 'monthly_report' && classId) {
      const monthPrefix = month || new Date().toISOString().slice(0, 7); // Default current month YYYY-MM

      // Get all enrolled students in this class and section
      const enrolledStudents = await StudentProfile.find({
        class: classId,
        section,
      })
        .populate('user', 'name userId avatar email phone')
        .sort({ rollNumber: 1 });

      // Fetch all attendance documents in this month for this class & section
      const monthRecords = await Attendance.find({
        class: classId,
        section,
        date: { $regex: new RegExp(`^${monthPrefix}`) },
      }).sort({ date: 1 });

      const uniqueDates = Array.from(new Set(monthRecords.map((m) => m.date))).sort();
      const totalWorkingSessions = uniqueDates.length;

      const studentStats = enrolledStudents.map((sp) => {
        const studentUserId = sp.user?._id?.toString();
        let presentCount = 0;
        let absentCount = 0;
        let lateCount = 0;
        const dailyMap: { [date: string]: string } = {};

        monthRecords.forEach((attDoc) => {
          const rec = attDoc.records.find((r: any) => r.student?.toString() === studentUserId);
          if (rec) {
            dailyMap[attDoc.date] = rec.status;
            if (rec.status === 'Present') presentCount++;
            else if (rec.status === 'Absent') absentCount++;
            else if (rec.status === 'Late' || rec.status === 'Half Day') lateCount++;
          } else {
            dailyMap[attDoc.date] = 'Unmarked';
          }
        });

        const effectivePresent = presentCount + lateCount * 0.5;
        const percentage =
          totalWorkingSessions > 0
            ? Math.round((effectivePresent / totalWorkingSessions) * 100)
            : 100;

        return {
          studentId: studentUserId,
          name: (sp.user as any)?.name || 'Student',
          userId: (sp.user as any)?.userId || '',
          rollNumber: sp.rollNumber,
          totalSessions: totalWorkingSessions,
          presentCount,
          absentCount,
          lateCount,
          percentage,
          isLowAttendance: percentage < 75 && totalWorkingSessions > 0,
          dailyMap,
        };
      });

      const totalStudents = studentStats.length;
      const lowAttendanceCount = studentStats.filter((s) => s.isLowAttendance).length;
      const classAvgPercentage =
        totalStudents > 0
          ? Math.round(studentStats.reduce((acc, s) => acc + s.percentage, 0) / totalStudents)
          : 100;

      return NextResponse.json({
        success: true,
        report: {
          month: monthPrefix,
          totalSessions: totalWorkingSessions,
          dates: uniqueDates,
          totalStudents,
          lowAttendanceCount,
          classAvgPercentage,
          studentStats,
        },
      });
    }

    // ================= 2. STUDENT PERSONAL ATTENDANCE SUMMARY =================
    if (auth.user.role === 'student') {
      const studentFilter: any = { 'records.student': auth.user.id };
      if (month) {
        studentFilter.date = { $regex: new RegExp(`^${month}`) };
      }

      const allAttendance = await Attendance.find(studentFilter)
        .populate('class', 'name grade')
        .populate('recordedBy', 'name role')
        .sort({ date: -1 });

      const studentHistory = allAttendance.map((att) => {
        const studentRecord = att.records.find((r: any) => r.student?.toString() === auth.user!.id);
        return {
          _id: att._id,
          date: att.date,
          class: att.class,
          section: att.section,
          status: studentRecord ? studentRecord.status : 'Absent',
          remarks: studentRecord?.remarks || '',
          recordedBy: (att.recordedBy as any)?.name || 'Class Teacher',
        };
      });

      const totalDays = studentHistory.length;
      const presentCount = studentHistory.filter((s) => s.status === 'Present').length;
      const absentCount = studentHistory.filter((s) => s.status === 'Absent').length;
      const lateCount = studentHistory.filter((s) => s.status === 'Late' || s.status === 'Half Day').length;
      const percentage =
        totalDays > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalDays) * 100) : 100;
      const isLowAttendance = percentage < 75 && totalDays >= 3;

      return NextResponse.json({
        success: true,
        summary: {
          totalDays,
          presentCount,
          absentCount,
          lateCount,
          percentage,
          isLowAttendance,
          warningMessage: isLowAttendance
            ? 'Alert: Your attendance is below the mandatory 75% limit. Please submit an attendance correction or medical certificate if applicable.'
            : null,
        },
        history: studentHistory,
      });
    }

    // ================= 3. ADMIN & TEACHER ATTENDANCE QUERY =================
    const filter: any = {};
    if (date) filter.date = date;
    if (classId) filter.class = classId;
    if (section) filter.section = section;

    const attendances = await Attendance.find(filter)
      .populate('class', 'name grade')
      .populate('records.student', 'name userId avatar phone')
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

    const { date, classId, section, subjectId, records } = await req.json();

    if (!date || !classId || !records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Valid date, classId, and student records are required.' },
        { status: 400 }
      );
    }

    // Date format validation YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, message: 'Invalid date format. Expected YYYY-MM-DD.' },
        { status: 400 }
      );
    }

    // Teacher authorization: ensure teacher is assigned to this class (or admin)
    if (auth.user.role === 'teacher') {
      const teacherProfile = await TeacherProfile.findOne({ user: auth.user.id });
      if (teacherProfile && teacherProfile.assignedClasses && teacherProfile.assignedClasses.length > 0) {
        const isAssigned = teacherProfile.assignedClasses.some(
          (ac) =>
            ac.class.toString() === classId &&
            (!ac.section || ac.section === (section || 'A'))
        );
        if (!isAssigned) {
          // If teacher has assigned classes, prevent modifying unassigned classes
          return NextResponse.json(
            {
              success: false,
              message: 'Access Denied: You are not assigned to take attendance for this class/section.',
            },
            { status: 403 }
          );
        }
      }
    }

    // Sanitize records
    const sanitizedRecords = records
      .filter((r: any) => r.student)
      .map((r: any) => ({
        student: r.student,
        status: ['Present', 'Absent', 'Late', 'Half Day'].includes(r.status) ? r.status : 'Present',
        remarks: (r.remarks || '').trim(),
      }));

    if (sanitizedRecords.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid student records provided.' },
        { status: 400 }
      );
    }

    // Upsert attendance for date + class + section
    const updateData: any = {
      date,
      class: classId,
      section: section || 'A',
      records: sanitizedRecords,
      recordedBy: auth.user.id,
    };
    if (subjectId) updateData.subject = subjectId;

    const attendance = await Attendance.findOneAndUpdate(
      { date, class: classId, section: section || 'A' },
      updateData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
      .populate('class', 'name grade')
      .populate('records.student', 'name userId')
      .populate('recordedBy', 'name role');

    return NextResponse.json({
      success: true,
      message: 'Attendance register saved and synchronized successfully.',
      attendance,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Attendance register ID is required.' }, { status: 400 });
    }

    await Attendance.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Attendance register session deleted successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
