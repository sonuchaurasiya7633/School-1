import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import SchoolCalendarEvent from '@/models/SchoolCalendarEvent';
import {
  INITIAL_2027_EVENTS,
  calculate2027CalendarStats,
} from '@/data/calendarData2027';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year') || '2027';

    // Auto-seed if empty
    const count = await SchoolCalendarEvent.countDocuments({
      academicYear: year,
    });
    if (count === 0 && year === '2027') {
      await SchoolCalendarEvent.insertMany(INITIAL_2027_EVENTS);
    }

    const events = (await SchoolCalendarEvent.find({ academicYear: year })
      .sort({ date: 1 })
      .lean()) as any[];
    const { stats } = calculate2027CalendarStats(events);

    return NextResponse.json({
      success: true,
      year,
      events,
      stats,
    });
  } catch (error: any) {
    console.error('Error fetching admin calendar events:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Special action: Reseed / Reset to Official 2027 Bihar Govt Data
    if (body.action === 'reseed') {
      const year = body.academicYear || '2027';
      await SchoolCalendarEvent.deleteMany({ academicYear: year });
      await SchoolCalendarEvent.insertMany(INITIAL_2027_EVENTS);

      const refreshed = (await SchoolCalendarEvent.find({
        academicYear: year,
      })
        .sort({ date: 1 })
        .lean()) as any[];
      const { stats } = calculate2027CalendarStats(refreshed);

      return NextResponse.json({
        success: true,
        message: 'Reseeded official 2027 Bihar Government calendar successfully',
        events: refreshed,
        stats,
      });
    }

    // Single or bulk create
    const {
      title,
      date,
      endDate,
      category,
      schoolStatus,
      isOptional,
      isApproved,
      description,
      instructions,
      academicYear,
    } = body;

    if (!title || !date) {
      return NextResponse.json(
        { success: false, message: 'Title and Date are required' },
        { status: 400 }
      );
    }

    const newEvent = await SchoolCalendarEvent.create({
      title,
      date,
      endDate: endDate || '',
      category: category || 'general',
      schoolStatus: schoolStatus || 'closed',
      isOptional: isOptional ?? false,
      isApproved: isApproved ?? true,
      description: description || '',
      instructions: instructions || '',
      academicYear: academicYear || '2027',
      createdSource: 'school_admin',
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      event: newEvent,
    });
  } catch (error: any) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, _id, ...updateData } = body;
    const targetId = id || _id;

    if (!targetId) {
      return NextResponse.json(
        { success: false, message: 'Event ID is required' },
        { status: 400 }
      );
    }

    const updated = await SchoolCalendarEvent.findByIdAndUpdate(
      targetId,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Calendar event updated successfully',
      event: updated,
    });
  } catch (error: any) {
    console.error('Error updating calendar event:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Event ID is required' },
        { status: 400 }
      );
    }

    await SchoolCalendarEvent.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete event' },
      { status: 500 }
    );
  }
}
