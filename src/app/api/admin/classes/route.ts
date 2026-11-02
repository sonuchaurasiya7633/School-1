import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import SchoolClass from '@/models/SchoolClass';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const classes = await SchoolClass.find()
      .populate('classTeacher', 'name email userId')
      .sort({ grade: 1 });

    return NextResponse.json({ success: true, classes });
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

    const { name, grade, sections, classTeacher, tuitionFee } = await req.json();

    if (!name || grade === undefined) {
      return NextResponse.json({ success: false, message: 'Class name and grade are required.' }, { status: 400 });
    }

    const newClass = await SchoolClass.create({
      name,
      grade: Number(grade),
      sections: sections && sections.length > 0 ? sections : ['A'],
      classTeacher: classTeacher || undefined,
      tuitionFee: Number(tuitionFee) || 2500,
    });

    const populated = await SchoolClass.findById(newClass._id).populate('classTeacher', 'name email userId');

    return NextResponse.json({
      success: true,
      message: 'Class created successfully.',
      class: populated,
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

    const { id, name, grade, sections, classTeacher, tuitionFee } = await req.json();

    const updated = await SchoolClass.findByIdAndUpdate(
      id,
      {
        name,
        grade: Number(grade),
        sections,
        classTeacher: classTeacher || undefined,
        tuitionFee: Number(tuitionFee),
      },
      { new: true }
    ).populate('classTeacher', 'name email userId');

    return NextResponse.json({
      success: true,
      message: 'Class updated successfully.',
      class: updated,
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
      return NextResponse.json({ success: false, message: 'Class ID is required.' }, { status: 400 });
    }

    await SchoolClass.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Class deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
