import React from 'react';
import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Academic Calendar 2026-27 & Holiday Schedule',
  description:
    'Plan ahead with the official 2026-27 academic calendar of Success Point School. View term examinations, parent-teacher meetings, activity dates, and gazetted holidays.',
  keywords: [
    'School Academic Calendar 2026-27',
    'Success Point School Holidays',
    'Exam Dates 2026',
    'PTM Dates School',
    'School Event Calendar',
  ],
  alternates: {
    canonical: 'https://www.successpointschool.online/calendar',
  },
  openGraph: {
    title: 'Academic Calendar 2026-27 | Success Point School',
    description:
      'Term dates, examination schedules, PTM meetings, and official school holidays.',
    url: 'https://www.successpointschool.online/calendar',
    type: 'website',
    images: [
      {
        url: '/images/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'Academic Calendar Success Point School',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academic Calendar 2026-27 | Success Point School',
    description:
      'Term dates, examination schedules, PTM meetings, and official school holidays.',
    images: ['/images/logo.jpeg'],
  },
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://www.successpointschool.online' },
          { name: 'Calendar', url: 'https://www.successpointschool.online/calendar' },
        ]}
      />
      {children}
    </>
  );
}
