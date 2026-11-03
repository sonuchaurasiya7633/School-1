import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Timetable from '@/models/Timetable';
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
    let classId = searchParams.get('classId');
    let section = searchParams.get('section');

    // If Student: lookup student's class and section
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

    const timetables = await Timetable.find(filter)
      .populate('class', 'name grade')
      .populate('periods.subject', 'name code')
      .populate('periods.teacher', 'name email userId');

    // If Teacher: also provide a compiled view of all slots where this teacher is assigned
    if (auth.user.role === 'teacher') {
      const allTimetables = await Timetable.find({ 'periods.teacher': auth.user.id })
        .populate('class', 'name grade')
        .populate('periods.subject', 'name code')
        .populate('periods.teacher', 'name email');

      return NextResponse.json({ success: true, timetables, teacherTimetable: allTimetables });
    }

    return NextResponse.json({ success: true, timetables });
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

    const { classId, section, day, periods } = await req.json();

    if (!classId || !day || !periods) {
      return NextResponse.json({ success: false, message: 'Class, Day, and Periods are required.' }, { status: 400 });
    }

    const updated = await Timetable.findOneAndUpdate(
      { class: classId, section: section || 'A', day },
      {
        class: classId,
        section: section || 'A',
        day,
        periods,
      },
      { upsert: true, new: true }
    )
      .populate('class', 'name grade')
      .populate('periods.subject', 'name code')
      .populate('periods.teacher', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Timetable saved successfully.',
      timetable: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
