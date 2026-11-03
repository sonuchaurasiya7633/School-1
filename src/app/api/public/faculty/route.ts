import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Faculty from '@/models/Faculty';
import { FACULTY_MEMBERS } from '@/data/facultyData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    let list = await Faculty.find({ isActive: true })
      .populate('assignedClasses.class', 'name grade sections')
      .populate('assignedClasses.subject', 'name code')
      .sort({ order: 1, createdAt: 1 });

    // Auto-seed if database collection is empty
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
      list = await Faculty.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    }

    return NextResponse.json({ success: true, faculty: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
