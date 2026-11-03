import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import SchoolSetting from '@/models/SchoolSetting';
import { DEFAULT_FOOTER_SETTINGS } from '@/types/footer';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const settings = await SchoolSetting.findOne().lean();
    const footer = settings?.footer || DEFAULT_FOOTER_SETTINGS;

    const mergedFooter = {
      ...DEFAULT_FOOTER_SETTINGS,
      ...footer,
      ctaButton: {
        ...DEFAULT_FOOTER_SETTINGS.ctaButton,
        ...(footer.ctaButton || {}),
      },
      exploreLinks: footer.exploreLinks?.length ? footer.exploreLinks : DEFAULT_FOOTER_SETTINGS.exploreLinks,
      portals: footer.portals?.length ? footer.portals : DEFAULT_FOOTER_SETTINGS.portals,
      admissionsCard: {
        ...DEFAULT_FOOTER_SETTINGS.admissionsCard,
        ...(footer.admissionsCard || {}),
      },
      campusInfo: {
        ...DEFAULT_FOOTER_SETTINGS.campusInfo,
        ...(footer.campusInfo || {}),
      },
      bottomBar: {
        ...DEFAULT_FOOTER_SETTINGS.bottomBar,
        ...(footer.bottomBar || {}),
      },
    };

    return NextResponse.json({ success: true, footer: mergedFooter });
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

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid payload provided' }, { status: 400 });
    }

    // Sanitize and validate
    const updatedFooter = {
      logo: body.logo || '/images/logo.jpeg',
      schoolName: body.schoolName?.trim() || 'SUCCESS POINT SCHOOL',
      tagline: body.tagline?.trim() || 'Best Education, Good Results.',
      description: body.description?.trim() || '',
      ctaButton: {
        enabled: Boolean(body.ctaButton?.enabled),
        text: body.ctaButton?.text?.trim() || 'Apply for Admission',
        url: body.ctaButton?.url?.trim() || '/admissions',
      },
      exploreLinks: Array.isArray(body.exploreLinks)
        ? body.exploreLinks.map((link: any, idx: number) => ({
            id: link.id || `link-${idx + 1}-${Date.now()}`,
            label: link.label?.trim() || 'Link',
            url: link.url?.trim() || '#',
            isExternal: Boolean(link.isExternal),
            enabled: link.enabled !== false,
          }))
        : DEFAULT_FOOTER_SETTINGS.exploreLinks,
      portals: Array.isArray(body.portals)
        ? body.portals.map((portal: any, idx: number) => ({
            id: portal.id || `portal-${idx + 1}-${Date.now()}`,
            label: portal.label?.trim() || 'Portal',
            url: portal.url?.trim() || '#',
            target: portal.target === '_blank' ? '_blank' : '_self',
            badge: portal.badge?.trim() || '',
            enabled: portal.enabled !== false,
          }))
        : DEFAULT_FOOTER_SETTINGS.portals,
      admissionsCard: {
        enabled: body.admissionsCard?.enabled !== false,
        title: body.admissionsCard?.title?.trim() || 'Admissions Session 2026-27',
        description: body.admissionsCard?.description?.trim() || '',
        ctaText: body.admissionsCard?.ctaText?.trim() || 'Online Inquiry',
        ctaUrl: body.admissionsCard?.ctaUrl?.trim() || '/admissions',
      },
      campusInfo: {
        address: body.campusInfo?.address?.trim() || '',
        showAddress: body.campusInfo?.showAddress !== false,
        phonePrimary: body.campusInfo?.phonePrimary?.trim() || '',
        phoneSecondary: body.campusInfo?.phoneSecondary?.trim() || '',
        showPhone: body.campusInfo?.showPhone !== false,
        email: body.campusInfo?.email?.trim() || '',
        showEmail: body.campusInfo?.showEmail !== false,
        officeHours: body.campusInfo?.officeHours?.trim() || '',
        showOfficeHours: body.campusInfo?.showOfficeHours !== false,
        mapsUrl: body.campusInfo?.mapsUrl?.trim() || '',
        showMaps: body.campusInfo?.showMaps !== false,
      },
      bottomBar: {
        copyrightText: body.bottomBar?.copyrightText?.trim() || '© {year} Success Point School. All Rights Reserved.',
        tagline: body.bottomBar?.tagline?.trim() || 'Best Education, Good Results.',
        showCopyright: body.bottomBar?.showCopyright !== false,
        showTagline: body.bottomBar?.showTagline !== false,
      },
    };

    const settings = await SchoolSetting.findOneAndUpdate(
      {},
      { $set: { footer: updatedFooter } },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Footer settings published and updated successfully!',
      footer: settings.footer,
    });
  } catch (err: any) {
    console.error('Failed to update footer settings:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
