import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Timetable from '@/models/Timetable';
import StudentProfile from '@/models/StudentProfile';
import SchoolClass from '@/models/SchoolClass';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let classId = searchParams.get('classId');
    let section = searchParams.get('section');
    const teacherId = searchParams.get('teacherId');
    const day = searchParams.get('day');

    // If Student: lookup student's registered class and section
    if (auth.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ user: auth.user.id });
      if (studentProfile) {
        classId = studentProfile.class.toString();
        section = studentProfile.section;
      }
    }

    let filter: any = {};
    if (classId) filter.class = classId;
    if (section) filter.section = section;
    if (day) filter.day = day;

    const timetables = await Timetable.find(filter)
      .populate('class', 'name grade')
      .populate('periods.subject', 'name code type')
      .populate('periods.teacher', 'name email userId')
      .sort({ day: 1 });

    // If Teacher: provide compiled teacher timetable
    let teacherSchedule: any[] = [];
    const targetTeacherUserId = auth.user.role === 'teacher' ? auth.user.id : teacherId;

    if (targetTeacherUserId) {
      teacherSchedule = await Timetable.find({
        'periods.teacher': targetTeacherUserId,
      })
        .populate('class', 'name grade')
        .populate('periods.subject', 'name code type')
        .populate('periods.teacher', 'name email userId');
    }

    return NextResponse.json({
      success: true,
      timetables,
      teacherTimetable: teacherSchedule,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      holidays: ['Saturday', 'Sunday'],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const body = await req.json();
    const { classId, section = 'A', day, periods, forceSave = false } = body;

    if (!classId || !day || !periods || !Array.isArray(periods)) {
      return NextResponse.json(
        { success: false, message: 'Class ID, Day, and Periods array are required.' },
        { status: 400 }
      );
    }

    // STRICT RULE: Saturday and Sunday are fixed weekly holidays (OFF)
    const normalizedDay = day.trim();
    if (normalizedDay.toLowerCase() === 'saturday') {
      return NextResponse.json(
        {
          success: false,
          message:
            'Strict Policy: Saturday is a mandatory fixed weekly holiday (OFF). No classes, teaching periods, or teacher assignments can be scheduled on Saturday.',
        },
        { status: 400 }
      );
    }
    if (normalizedDay.toLowerCase() === 'sunday') {
      return NextResponse.json(
        {
          success: false,
          message:
            'Sunday is a designated weekly holiday (OFF). Regular class timetables cannot be scheduled on Sunday.',
        },
        { status: 400 }
      );
    }

    // 1. Conflict Detection Engine:
    // Check if any assigned teacher or room in the proposed periods overlaps with another class on the same day & time
    const conflicts: string[] = [];

    // Fetch all existing timetables for this day across OTHER classes/sections
    const otherTimetables = await Timetable.find({
      day: normalizedDay,
      $or: [
        { class: { $ne: classId } },
        { section: { $ne: section } },
      ],
    })
      .populate('class', 'name grade')
      .populate('periods.teacher', 'name email')
      .populate('periods.subject', 'name code')
      .lean();

    for (const proposedPeriod of periods) {
      if (proposedPeriod.isBreak) continue;

      const pTeacher = proposedPeriod.teacher;
      const pRoom = proposedPeriod.room ? proposedPeriod.room.trim().toLowerCase() : '';
      const pStart = proposedPeriod.startTime ? proposedPeriod.startTime.trim() : '';
      const pEnd = proposedPeriod.endTime ? proposedPeriod.endTime.trim() : '';

      if (!pStart || !pEnd) continue;

      for (const otherTt of otherTimetables) {
        const otherClassName = (otherTt.class as any)?.name || 'Class';
        const otherSec = otherTt.section || 'A';

        for (const existingPeriod of otherTt.periods) {
          if (existingPeriod.isBreak) continue;

          const exStart = existingPeriod.startTime ? existingPeriod.startTime.trim() : '';
          const exEnd = existingPeriod.endTime ? existingPeriod.endTime.trim() : '';

          // Overlap check (exact match or matching slot)
          const isTimeOverlap = pStart === exStart || pEnd === exEnd;

          if (isTimeOverlap) {
            // Teacher Conflict
            if (pTeacher && existingPeriod.teacher) {
              const pTId = String(pTeacher._id || pTeacher);
              const exTId = String((existingPeriod.teacher as any)?._id || existingPeriod.teacher);

              if (pTId === exTId) {
                const teacherName = (existingPeriod.teacher as any)?.name || 'Teacher';
                conflicts.push(
                  `Teacher Conflict: ${teacherName} is already assigned to teach ${otherClassName} (Sec ${otherSec}) on ${normalizedDay} during ${exStart} - ${exEnd}.`
                );
              }
            }

            // Room Conflict
            if (pRoom && existingPeriod.room) {
              const exRoom = existingPeriod.room.trim().toLowerCase();
              if (pRoom === exRoom) {
                conflicts.push(
                  `Room Conflict: Room "${proposedPeriod.room}" is already reserved for ${otherClassName} (Sec ${otherSec}) on ${normalizedDay} during ${exStart} - ${exEnd}.`
                );
              }
            }
          }
        }
      }
    }

    if (conflicts.length > 0 && !forceSave) {
      return NextResponse.json(
        {
          success: false,
          hasConflicts: true,
          message: `Scheduling conflict detected! Please resolve the following before saving:`,
          conflicts,
        },
        { status: 409 }
      );
    }

    // 2. Clean and save periods
    const cleanPeriods = periods.map((p: any, idx: number) => ({
      periodNumber: p.periodNumber || idx + 1,
      startTime: p.startTime,
      endTime: p.endTime,
      isBreak: Boolean(p.isBreak),
      title: p.isBreak ? p.title || 'Break' : '',
      subject: p.isBreak || !p.subject ? undefined : p.subject,
      teacher: p.isBreak || !p.teacher ? undefined : p.teacher,
      room: p.room || 'Room 101',
    }));

    const updated = await Timetable.findOneAndUpdate(
      { class: classId, section: section || 'A', day: normalizedDay },
      {
        class: classId,
        section: section || 'A',
        day: normalizedDay,
        periods: cleanPeriods,
      },
      { upsert: true, new: true }
    )
      .populate('class', 'name grade')
      .populate('periods.subject', 'name code type')
      .populate('periods.teacher', 'name email userId');

    return NextResponse.json({
      success: true,
      message: `${normalizedDay} timetable saved successfully with conflict validation.`,
      timetable: updated,
      conflictsResolved: conflicts.length === 0,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const section = searchParams.get('section');
    const day = searchParams.get('day');

    if (!classId || !day) {
      return NextResponse.json({ success: false, message: 'Class ID and Day are required.' }, { status: 400 });
    }

    await Timetable.findOneAndDelete({ class: classId, section: section || 'A', day });
    return NextResponse.json({ success: true, message: `${day} timetable schedule cleared.` });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
