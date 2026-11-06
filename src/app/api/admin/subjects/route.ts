import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Subject from '@/models/Subject';

export const dynamic = 'force-dynamic';

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

    const subjects = await Subject.find(filter)
      .populate('classes', 'name grade')
      .populate('teachers', 'name email userId')
      .sort({ name: 1 });

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

    const { name, code, type = 'compulsory', classes, teachers } = await req.json();

    if (!name || !code) {
      return NextResponse.json({ success: false, message: 'Subject name and subject code are required.' }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().trim();
    const cleanName = name.trim();

    // Prevent duplicate subject code or name
    const existing = await Subject.findOne({
      $or: [
        { code: cleanCode },
        { name: { $regex: new RegExp(`^${cleanName}$`, 'i') } },
      ],
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            existing.code === cleanCode
              ? `Subject code "${cleanCode}" already exists. Please choose a unique code.`
              : `Subject name "${cleanName}" already exists.`,
        },
        { status: 400 }
      );
    }

    const validClasses = (classes || []).filter((c: any) => mongoose.isValidObjectId(c));
    const validTeachers = (teachers || []).filter((t: any) => mongoose.isValidObjectId(t));

    const newSubject = await Subject.create({
      name: cleanName,
      code: cleanCode,
      type: type === 'optional' ? 'optional' : 'compulsory',
      classes: validClasses,
      teachers: validTeachers,
    });

    const populated = await Subject.findById(newSubject._id)
      .populate('classes', 'name grade')
      .populate('teachers', 'name email userId');

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

    const { id, name, code, type = 'compulsory', classes, teachers } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'Subject ID is required.' }, { status: 400 });
    }

    const cleanCode = code ? code.toUpperCase().trim() : undefined;
    const cleanName = name ? name.trim() : undefined;

    // Check duplicate code on other subject
    if (cleanCode) {
      const duplicate = await Subject.findOne({
        _id: { $ne: id },
        code: cleanCode,
      });
      if (duplicate) {
        return NextResponse.json(
          { success: false, message: `Subject code "${cleanCode}" is already in use by another subject.` },
          { status: 400 }
        );
      }
    }

    const updatePayload: any = {};
    if (cleanName) updatePayload.name = cleanName;
    if (cleanCode) updatePayload.code = cleanCode;
    if (type) updatePayload.type = type === 'optional' ? 'optional' : 'compulsory';
    if (classes) {
      updatePayload.classes = classes.filter((c: any) => mongoose.isValidObjectId(c));
    }
    if (teachers) {
      updatePayload.teachers = teachers.filter((t: any) => mongoose.isValidObjectId(t));
    }

    const updated = await Subject.findByIdAndUpdate(id, updatePayload, { new: true })
      .populate('classes', 'name grade')
      .populate('teachers', 'name email userId');

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
