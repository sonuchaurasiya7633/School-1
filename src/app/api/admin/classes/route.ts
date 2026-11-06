import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import SchoolClass from '@/models/SchoolClass';
import StudentProfile from '@/models/StudentProfile';
import Faculty from '@/models/Faculty';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher', 'student']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const classes = await SchoolClass.find()
      .populate('classTeacher', 'name email userId')
      .populate('sectionClassTeachers.teacher', 'name email userId')
      .sort({ grade: 1 })
      .lean();

    // Attach student enrollment count per class
    const studentCounts = await StudentProfile.aggregate([
      { $group: { _id: { class: '$class', section: '$section' }, count: { $sum: 1 } } },
    ]);

    const countMap: { [classId: string]: { total: number; bySection: { [section: string]: number } } } = {};
    studentCounts.forEach((sc) => {
      const cId = String(sc._id.class);
      const sec = sc._id.section || 'A';
      if (!countMap[cId]) {
        countMap[cId] = { total: 0, bySection: {} };
      }
      countMap[cId].total += sc.count;
      countMap[cId].bySection[sec] = sc.count;
    });

    // Populate fallback if classTeacher is a Faculty ID
    const unpopulatedTeacherIds = classes
      .filter((c: any) => c.classTeacher && !c.classTeacher.name)
      .map((c: any) => c.classTeacher);

    if (unpopulatedTeacherIds.length > 0) {
      const facultyDocs = await Faculty.find({ _id: { $in: unpopulatedTeacherIds } }).lean();
      const facultyMap = new Map(facultyDocs.map((f: any) => [String(f._id), f]));

      classes.forEach((c: any) => {
        if (c.classTeacher && !c.classTeacher.name) {
          const fac = facultyMap.get(String(c.classTeacher));
          if (fac) {
            c.classTeacher = {
              _id: fac._id,
              name: fac.name,
              email: 'Faculty Directory',
              userId: 'FAC',
            };
          }
        }
      });
    }

    const enhancedClasses = classes.map((c: any) => ({
      ...c,
      studentStats: countMap[String(c._id)] || { total: 0, bySection: {} },
    }));

    return NextResponse.json({ success: true, classes: enhancedClasses });
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

    const { name, grade, sections, classTeacher, sectionClassTeachers, tuitionFee } = await req.json();

    if (!name || grade === undefined) {
      return NextResponse.json({ success: false, message: 'Class name and numeric grade are required.' }, { status: 400 });
    }

    // 1. Prevent duplicate class name
    const existing = await SchoolClass.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });
    if (existing) {
      return NextResponse.json({ success: false, message: `A class named "${name}" already exists.` }, { status: 400 });
    }

    // 2. Normalize and deduplicate sections
    let normalizedSections = ['A'];
    if (sections && Array.isArray(sections)) {
      normalizedSections = Array.from(new Set(sections.map((s: string) => String(s).trim().toUpperCase()))).filter(Boolean);
    } else if (typeof sections === 'string') {
      normalizedSections = Array.from(new Set(sections.split(',').map((s) => s.trim().toUpperCase()))).filter(Boolean);
    }
    if (normalizedSections.length === 0) normalizedSections = ['A'];

    // 3. Normalize section class teachers
    const validSectionTeachers = (sectionClassTeachers || [])
      .filter((st: any) => st.section && st.teacher && mongoose.isValidObjectId(st.teacher))
      .map((st: any) => ({
        section: String(st.section).toUpperCase().trim(),
        teacher: new mongoose.Types.ObjectId(st.teacher),
      }));

    const newClass = await SchoolClass.create({
      name: name.trim(),
      grade: Number(grade),
      sections: normalizedSections,
      classTeacher: classTeacher && mongoose.isValidObjectId(classTeacher) ? classTeacher : undefined,
      sectionClassTeachers: validSectionTeachers,
      tuitionFee: Number(tuitionFee) || 2500,
    });

    const populated = await SchoolClass.findById(newClass._id)
      .populate('classTeacher', 'name email userId')
      .populate('sectionClassTeachers.teacher', 'name email userId');

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

    const { id, name, grade, sections, classTeacher, sectionClassTeachers, tuitionFee } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'Class ID is required.' }, { status: 400 });
    }

    // Check duplicate name on other classes
    if (name) {
      const duplicate = await SchoolClass.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });
      if (duplicate) {
        return NextResponse.json(
          { success: false, message: `Another class named "${name}" already exists.` },
          { status: 400 }
        );
      }
    }

    // Deduplicate sections
    let normalizedSections: string[] | undefined;
    if (sections) {
      if (Array.isArray(sections)) {
        normalizedSections = Array.from(new Set(sections.map((s: string) => String(s).trim().toUpperCase()))).filter(Boolean);
      } else if (typeof sections === 'string') {
        normalizedSections = Array.from(new Set(sections.split(',').map((s) => s.trim().toUpperCase()))).filter(Boolean);
      }
    }

    const updatePayload: any = {};
    if (name) updatePayload.name = name.trim();
    if (grade !== undefined) updatePayload.grade = Number(grade);
    if (normalizedSections) updatePayload.sections = normalizedSections;
    if (tuitionFee !== undefined) updatePayload.tuitionFee = Number(tuitionFee);

    if (classTeacher !== undefined) {
      updatePayload.classTeacher = classTeacher && mongoose.isValidObjectId(classTeacher) ? classTeacher : null;
    }

    if (sectionClassTeachers) {
      updatePayload.sectionClassTeachers = (sectionClassTeachers || [])
        .filter((st: any) => st.section && st.teacher && mongoose.isValidObjectId(st.teacher))
        .map((st: any) => ({
          section: String(st.section).toUpperCase().trim(),
          teacher: new mongoose.Types.ObjectId(st.teacher),
        }));
    }

    const updated = await SchoolClass.findByIdAndUpdate(id, updatePayload, { new: true })
      .populate('classTeacher', 'name email userId')
      .populate('sectionClassTeachers.teacher', 'name email userId');

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

    // Check if students are enrolled
    const studentCount = await StudentProfile.countDocuments({ class: id });
    if (studentCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete class because ${studentCount} student(s) are currently enrolled in it. Please reassign the students first.`,
        },
        { status: 400 }
      );
    }

    await SchoolClass.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Class deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
