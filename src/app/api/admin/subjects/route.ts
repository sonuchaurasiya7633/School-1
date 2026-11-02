import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Subject from '@/models/Subject';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');

    const filter: any = {};
    if (classId) {
      filter.classes = classId;
    }

    const subjects = await Subject.find(filter).populate('classes', 'name grade').sort({ name: 1 });

    return NextResponse.json({ success: true, subjects });
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

    const { name, code, classes } = await req.json();

    if (!name || !code) {
      return NextResponse.json({ success: false, message: 'Subject name and code are required.' }, { status: 400 });
    }

    const newSubject = await Subject.create({
      name,
      code: code.toUpperCase().trim(),
      classes: classes || [],
    });

    const populated = await Subject.findById(newSubject._id).populate('classes', 'name grade');

    return NextResponse.json({
      success: true,
      message: 'Subject created successfully.',
      subject: populated,
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

    const { id, name, code, classes } = await req.json();

    const updated = await Subject.findByIdAndUpdate(
      id,
      {
        name,
        code: code.toUpperCase().trim(),
        classes,
      },
      { new: true }
    ).populate('classes', 'name grade');

    return NextResponse.json({
      success: true,
      message: 'Subject updated successfully.',
      subject: updated,
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
      return NextResponse.json({ success: false, message: 'Subject ID is required.' }, { status: 400 });
    }

    await Subject.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Subject deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
