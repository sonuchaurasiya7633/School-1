import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import AcademicSession from '@/models/AcademicSession';
import SchoolSetting from '@/models/SchoolSetting';

export const dynamic = 'force-dynamic';

const DEFAULT_SESSIONS = [
  {
    sessionName: '2026-2027',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    isCurrent: true,
    isAdmissionOpen: true,
    status: 'active',
    description: 'Current running academic session with digital learning & board curriculum.',
  },
  {
    sessionName: '2027-2028',
    startDate: '2027-04-01',
    endDate: '2028-03-31',
    isCurrent: false,
    isAdmissionOpen: true,
    status: 'upcoming',
    description: 'Upcoming academic session. Early admissions & entrance forms open.',
  },
  {
    sessionName: '2025-2026',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    isCurrent: false,
    isAdmissionOpen: false,
    status: 'completed',
    description: 'Previous academic year (Archived).',
  },
];

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'teacher']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    let sessions = await AcademicSession.find().sort({ isCurrent: -1, sessionName: -1 });

    if (sessions.length === 0) {
      await AcademicSession.insertMany(DEFAULT_SESSIONS);
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

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const body = await req.json();
    const { sessionName, startDate, endDate, isCurrent, isAdmissionOpen, status, description } = body;

    if (!sessionName || !sessionName.trim()) {
      return NextResponse.json(
        { success: false, message: 'Session name is required (e.g. 2027-2028).' },
        { status: 400 }
      );
    }

    const trimmedName = sessionName.trim();
    const existing = await AcademicSession.findOne({ sessionName: trimmedName });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Academic Session "${trimmedName}" already exists.` },
        { status: 400 }
      );
    }

    if (isCurrent) {
      await AcademicSession.updateMany({}, { $set: { isCurrent: false } });
      await SchoolSetting.findOneAndUpdate({}, { $set: { academicYear: trimmedName } });
    }

    const newSession = await AcademicSession.create({
      sessionName: trimmedName,
      startDate: startDate || '',
      endDate: endDate || '',
      isCurrent: !!isCurrent,
      isAdmissionOpen: isAdmissionOpen !== false,
      status: status || (isCurrent ? 'active' : 'upcoming'),
      description: description || '',
    });

    const allSessions = await AcademicSession.find().sort({ isCurrent: -1, sessionName: -1 });

    return NextResponse.json({
      success: true,
      message: `Academic Session "${trimmedName}" created successfully.`,
      session: newSession,
      sessions: allSessions,
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
    const { id, _id, sessionName, startDate, endDate, isCurrent, isAdmissionOpen, status, description } = body;
    const targetId = id || _id;

    if (!targetId) {
      return NextResponse.json({ success: false, message: 'Session ID is required.' }, { status: 400 });
    }

    const session = await AcademicSession.findById(targetId);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Academic Session not found.' }, { status: 404 });
    }

    if (sessionName && sessionName.trim() !== session.sessionName) {
      const trimmed = sessionName.trim();
      const duplicate = await AcademicSession.findOne({ sessionName: trimmed, _id: { $ne: targetId } });
      if (duplicate) {
        return NextResponse.json({ success: false, message: 'Session name already taken.' }, { status: 400 });
      }
      session.sessionName = trimmed;
    }

    if (startDate !== undefined) session.startDate = startDate;
    if (endDate !== undefined) session.endDate = endDate;
    if (description !== undefined) session.description = description;
    if (status) session.status = status;
    if (isAdmissionOpen !== undefined) session.isAdmissionOpen = isAdmissionOpen;

    if (isCurrent !== undefined) {
      if (isCurrent) {
        await AcademicSession.updateMany({ _id: { $ne: targetId } }, { $set: { isCurrent: false } });
        session.isCurrent = true;
        session.status = 'active';
        await SchoolSetting.findOneAndUpdate({}, { $set: { academicYear: session.sessionName } });
      } else {
        session.isCurrent = false;
      }
    }

    await session.save();
    const allSessions = await AcademicSession.find().sort({ isCurrent: -1, sessionName: -1 });

    return NextResponse.json({
      success: true,
      message: `Academic Session "${session.sessionName}" updated successfully.`,
      session,
      sessions: allSessions,
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
      return NextResponse.json({ success: false, message: 'Session ID is required.' }, { status: 400 });
    }

    const session = await AcademicSession.findById(id);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found.' }, { status: 404 });
    }

    if (session.isCurrent) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete the current active academic session. Switch to another session first.' },
        { status: 400 }
      );
    }

    await AcademicSession.findByIdAndDelete(id);
    const remaining = await AcademicSession.find().sort({ isCurrent: -1, sessionName: -1 });

    return NextResponse.json({
      success: true,
      message: `Academic session "${session.sessionName}" deleted successfully.`,
      sessions: remaining,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
