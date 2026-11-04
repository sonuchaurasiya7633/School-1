import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AcademicSession from '@/models/AcademicSession';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    let sessions = await AcademicSession.find({ status: { $ne: 'archived' } }).sort({ isCurrent: -1, sessionName: -1 });

    if (sessions.length === 0) {
      sessions = await AcademicSession.find().sort({ isCurrent: -1, sessionName: -1 });
    }

    return NextResponse.json({
      success: true,
      sessions,
      currentSession: sessions.find((s) => s.isCurrent)?.sessionName || '2026-2027',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
