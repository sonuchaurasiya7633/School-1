import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Inquiry from '@/models/Inquiry';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, inquiries });
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
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Inquiry ID required.' }, { status: 400 });
    }

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Inquiry updated successfully.',
      inquiry: updated,
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
      return NextResponse.json({ success: false, message: 'Inquiry ID required.' }, { status: 400 });
    }

    await Inquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
