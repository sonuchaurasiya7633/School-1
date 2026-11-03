import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SchoolSetting, { DEFAULT_FOOTER_SETTINGS } from '@/models/SchoolSetting';

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
        email: 'info@successpointschool.edu',
        phone: '+91 98765 43210',
        address: 'Success Point Campus, Knowledge City, Pin - 800001',
        academicYear: '2026-2027',
        principalName: 'Dr. Ramesh Sharma',
        directorName: 'Subodh Kumar Sharma',
        directorDesignation: 'Director',
        directorQualifications: 'M.A. | D.El.Ed | B.Ed | CTET | STET',
        directorMessage:
          'Dedicated to fostering an atmosphere of intellectual curiosity, moral discipline, and comprehensive educational development for every student at Success Point School.',
        directorImage: '/images/director.jpg',
        announcement:
          'Welcome to Success Point School — Admissions & Digital E-Learning Hub Session 2026-2027',
        admissionsOpen: true,
        heroTitle: 'Building Knowledge, Character & Academic Brilliance',
        heroSubtitle:
          'Welcome to the digital learning campus of Success Point School (S.P.S.). We provide state-of-the-art classroom education, recorded video lectures, continuous evaluation, and dedicated student care.',
        footer: DEFAULT_FOOTER_SETTINGS,
      });
    } else if (!settings.footer) {
      settings.footer = DEFAULT_FOOTER_SETTINGS;
    }

    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
