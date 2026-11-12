import React from 'react';
import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Latest School Notices & Circulars',
  description:
    'Stay updated with the latest official notices, examination timetables, holiday announcements, and academic circulars from Success Point School administration.',
  keywords: [
    'School Notices',
    'Success Point School Circulars',
    'Exam Notice 2026',
    'School Holiday Announcements',
    'Official School News',
  ],
  alternates: {
    canonical: 'https://www.successpointschool.online/notices',
  },
  openGraph: {
    title: 'Latest School Notices & Circulars | Success Point School',
    description:
      'Timely administrative notices, circulars, and announcements for students and parents.',
    url: 'https://www.successpointschool.online/notices',
    type: 'website',
    images: [
      {
        url: '/images/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'School Notices Success Point School',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest School Notices & Circulars | Success Point School',
    description:
      'Timely administrative notices, circulars, and announcements for students and parents.',
    images: ['/images/logo.jpeg'],
  },
};

export default function NoticesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://www.successpointschool.online' },
          { name: 'Notices', url: 'https://www.successpointschool.online/notices' },
        ]}
      />
      {children}
    </>
  );
}
