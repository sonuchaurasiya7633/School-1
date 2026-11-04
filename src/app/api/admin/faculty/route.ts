import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import '@/models/SchoolClass';
import '@/models/Subject';
import Faculty from '@/models/Faculty';
import User from '@/models/User';
import TeacherProfile from '@/models/TeacherProfile';
import { FACULTY_MEMBERS } from '@/data/facultyData';
import {
  syncFacultyMemberToTeacherProfile,
  reconcileAllFacultyWithTeachers,
} from '@/lib/teacherFacultySync';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    let list = await Faculty.find()
      .populate('assignedClasses.class', 'name grade sections')
      .populate('assignedClasses.subject', 'name code')
      .sort({ order: 1, createdAt: 1 });

    if (list.length === 0) {
      const initialDocs = FACULTY_MEMBERS.map((m, index) => ({
        name: m.name,
        qualification: m.qualification,
        university: m.university || '',
        additional: m.additional || '',
        category: m.tags?.[0] || 'General',
        order: index + 1,
        isActive: true,
      }));
      await Faculty.insertMany(initialDocs);
      list = await Faculty.find()
        .populate('assignedClasses.class', 'name grade sections')
        .populate('assignedClasses.subject', 'name code')
        .sort({ order: 1, createdAt: 1 });
    }

    return NextResponse.json({ success: true, faculty: list });
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
    if (!body.name || !body.qualification) {
      return NextResponse.json(
        { success: false, message: 'Name and qualification are required.' },
        { status: 400 }
      );
    }

    const newFaculty = await Faculty.create({
      name: body.name,
      qualification: body.qualification,
      university: body.university || '',
      additional: body.additional || '',
      category: body.category || 'General',
      order: body.order || 99,
      isActive: body.isActive !== false,
      avatar: body.avatar || '',
      assignedClasses: body.assignedClasses || [],
    });

    // Synchronize with User & TeacherProfile
    await syncFacultyMemberToTeacherProfile(newFaculty);

    const populated = await Faculty.findById(newFaculty._id)
      .populate('assignedClasses.class', 'name grade sections')
      .populate('assignedClasses.subject', 'name code');

    return NextResponse.json({
      success: true,
      message: 'Faculty member added and classes mapped successfully.',
      faculty: populated,
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

    const body = await req.json();
    const { id, _id, createdAt, updatedAt, __v, ...updateData } = body;
    const targetId = id || _id;

    if (!targetId) {
      return NextResponse.json({ success: false, message: 'Faculty ID required.' }, { status: 400 });
    }

    const updated = await Faculty.findByIdAndUpdate(targetId, { $set: updateData }, { new: true })
      .populate('assignedClasses.class', 'name grade sections')
      .populate('assignedClasses.subject', 'name code');

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Faculty not found.' }, { status: 404 });
    }

    // Synchronize with User & TeacherProfile
    await syncFacultyMemberToTeacherProfile(updated);

    return NextResponse.json({
      success: true,
      message: 'Faculty details & class/subject allocations updated successfully.',
      faculty: updated,
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
      return NextResponse.json({ success: false, message: 'Faculty ID required.' }, { status: 400 });
    }

    await Faculty.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Faculty member removed successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
