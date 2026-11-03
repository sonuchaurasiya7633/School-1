import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SchoolSetting from '@/models/SchoolSetting';
import { DEFAULT_FOOTER_SETTINGS } from '@/types/footer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await SchoolSetting.findOne().lean();

    if (!settings || !settings.footer) {
      return NextResponse.json({
        success: true,
        footer: DEFAULT_FOOTER_SETTINGS,
      });
    }

    // Merge with defaults to guarantee all fields exist
    const mergedFooter = {
      ...DEFAULT_FOOTER_SETTINGS,
      ...settings.footer,
      ctaButton: {
        ...DEFAULT_FOOTER_SETTINGS.ctaButton,
        ...(settings.footer.ctaButton || {}),
      },
      exploreLinks: settings.footer.exploreLinks?.length
        ? settings.footer.exploreLinks
        : DEFAULT_FOOTER_SETTINGS.exploreLinks,
      portals: settings.footer.portals?.length
        ? settings.footer.portals
        : DEFAULT_FOOTER_SETTINGS.portals,
      admissionsCard: {
        ...DEFAULT_FOOTER_SETTINGS.admissionsCard,
        ...(settings.footer.admissionsCard || {}),
      },
      campusInfo: {
        ...DEFAULT_FOOTER_SETTINGS.campusInfo,
        ...(settings.footer.campusInfo || {}),
      },
      bottomBar: {
        ...DEFAULT_FOOTER_SETTINGS.bottomBar,
        ...(settings.footer.bottomBar || {}),
      },
    };

    return NextResponse.json({
      success: true,
      footer: mergedFooter,
    });
  } catch (err: any) {
    console.error('Failed to fetch public footer:', err);
    return NextResponse.json(
      { success: false, footer: DEFAULT_FOOTER_SETTINGS, error: err.message },
      { status: 500 }
    );
  }
}
