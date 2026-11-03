import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import SchoolSetting from '@/models/SchoolSetting';

export const dynamic = 'force-dynamic';

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
        directorName: 'Subodh Kumar Sharma',
        directorDesignation: 'Director',
        directorQualifications: 'M.A. | D.El.Ed | B.Ed | CTET | STET',
        directorMessage:
          'Dedicated to fostering an atmosphere of intellectual curiosity, moral discipline, and comprehensive educational development for every student at Success Point School.',
        directorImage: '/images/director.jpg',
        announcement:
          'Welcome to Success Point School — Admissions Open for Session 2026-2027',
        admissionsOpen: true,
        heroTitle: 'Building Knowledge, Character & Academic Brilliance',
        heroSubtitle:
          'Welcome to the digital learning campus of Success Point School (S.P.S.). We provide state-of-the-art classroom education, recorded video lectures, continuous evaluation, and dedicated student care.',
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
    const { _id, createdAt, updatedAt, __v, ...updateData } = body;

    const settings = await SchoolSetting.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'School settings updated successfully.',
      settings,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
