import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SchoolCalendarEvent from '@/models/SchoolCalendarEvent';
import {
  INITIAL_2027_EVENTS,
  calculate2027CalendarStats,
} from '@/data/calendarData2027';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || '2027';
    const category = searchParams.get('category');

    // Auto-seed if empty for year 2027
    const count = await SchoolCalendarEvent.countDocuments({
      academicYear: year,
    });
    if (count === 0 && year === '2027') {
      try {
        await SchoolCalendarEvent.insertMany(INITIAL_2027_EVENTS);
      } catch (seedErr) {
        console.error('Error auto-seeding calendar:', seedErr);
      }
    }

    const query: any = { academicYear: year, isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }

    const events = (await SchoolCalendarEvent.find(query)
      .sort({ date: 1 })
      .lean()) as any[];

    // Calculate dynamic stats
    const allYearEvents = (await SchoolCalendarEvent.find({
      academicYear: year,
      isActive: true,
    })
      .sort({ date: 1 })
      .lean()) as any[];

    const { stats } = calculate2027CalendarStats(allYearEvents);

    return NextResponse.json({
      success: true,
      year,
      events,
      stats,
    });
  } catch (error: any) {
    console.error('Error in public calendar API:', error);
    // Fallback gracefully to default in-memory 2027 dataset so page never crashes
    const { stats } = calculate2027CalendarStats(INITIAL_2027_EVENTS);
    return NextResponse.json({
      success: true,
      year: '2027',
      events: INITIAL_2027_EVENTS,
      stats,
      isFallback: true,
    });
  }
}
