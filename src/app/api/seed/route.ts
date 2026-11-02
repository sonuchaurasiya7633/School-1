import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { seedDatabase } from '@/lib/seed-data';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const result = await seedDatabase(true);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const result = await seedDatabase(false);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
