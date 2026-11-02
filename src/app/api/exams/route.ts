import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Exam from '@/models/Exam';
import StudentProfile from '@/models/StudentProfile';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    let filter: any = {};
    if (auth.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ user: auth.user.id });
      if (studentProfile) {
        filter.class = studentProfile.class;
      }
      filter.isPublished = true;
    }

    const exams = await Exam.find(filter)
      .populate('class', 'name grade')
      .populate('schedule.subject', 'name code')
      .sort({ startDate: -1 });

    return NextResponse.json({ success: true, exams });
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

    const { name, startDate, endDate, classId, isPublished, schedule } = await req.json();

    if (!name || !startDate || !endDate || !classId) {
      return NextResponse.json({ success: false, message: 'All exam details are required.' }, { status: 400 });
    }

    const newExam = await Exam.create({
      name,
      startDate,
      endDate,
      class: classId,
      isPublished: !!isPublished,
      schedule: schedule || [],
    });

    const populated = await Exam.findById(newExam._id)
      .populate('class', 'name grade')
      .populate('schedule.subject', 'name code');

    return NextResponse.json({
      success: true,
      message: 'Exam created successfully.',
      exam: populated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { id, name, startDate, endDate, classId, isPublished, schedule } = await req.json();

    const updated = await Exam.findByIdAndUpdate(
      id,
      {
        name,
        startDate,
        endDate,
        class: classId,
        isPublished,
        schedule,
      },
      { new: true }
    )
      .populate('class', 'name grade')
      .populate('schedule.subject', 'name code');

    return NextResponse.json({
      success: true,
      message: 'Exam updated successfully.',
      exam: updated,
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Exam ID is required.' }, { status: 400 });
    }

    await Exam.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Exam deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
