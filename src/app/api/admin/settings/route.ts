import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import SchoolSetting from '@/models/SchoolSetting';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SchoolSetting.findOne();
    if (!settings) {
      settings = await SchoolSetting.create({
        schoolName: 'Success Point School',
        tagline: 'Best Education, Good Results.',
        code: 'SPS',
        logo: '/images/logo.jpeg',
        email: 'contact@successpointschool.edu',
        phone: '+91 98765 43210',
        address: 'Sector 14, Education Zone, SPS Campus',
        academicYear: '2026-2027',
        principalName: 'Dr. A. K. Sharma',
      });
    }

    return NextResponse.json({ success: true, settings });
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
    let settings = await SchoolSetting.findOne();
    if (!settings) {
      settings = new SchoolSetting(body);
    } else {
      Object.assign(settings, body);
    }
    await settings.save();

    return NextResponse.json({
      success: true,
      message: 'School settings updated successfully.',
      settings,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
