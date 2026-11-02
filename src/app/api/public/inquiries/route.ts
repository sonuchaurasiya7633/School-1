import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const applyingClass = body.applyingClass || body.gradeApplying || body.grade || body.class;

    if (!body.studentName || !body.parentName || !body.phone || !applyingClass) {
      return NextResponse.json(
        {
          success: false,
          message: 'Student name, parent name, phone number, and class are required.',
        },
        { status: 400 }
      );
    }

    const inquiry = await Inquiry.create({
      studentName: body.studentName.trim(),
      parentName: body.parentName.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() || '',
      applyingClass: String(applyingClass).trim(),
      message: body.message?.trim() || '',
      status: 'Pending',
    });

    return NextResponse.json({
      success: true,
      message:
        'Your admission inquiry has been submitted successfully! The school admissions team will contact you shortly.',
      inquiry,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
