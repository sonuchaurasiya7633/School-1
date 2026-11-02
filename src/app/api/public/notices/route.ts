import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Notice from '@/models/Notice';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Public notices for all or students
    const notices = await Notice.find({ targetRole: { $in: ['all', 'student'] } })
      .populate('author', 'name role')
      .populate('class', 'name grade')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(6);

    return NextResponse.json({ success: true, notices });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
