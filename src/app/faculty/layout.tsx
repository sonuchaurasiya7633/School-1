import React from 'react';
import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Experienced Teachers & Academic Faculty | Success Point School',
  description:
    'Meet the passionate, qualified, and certified teaching faculty at Success Point School. Expert subject mentors providing personalized guidance and academic excellence.',
  keywords: [
    'School Teachers',
    'Success Point School Faculty',
    'Qualified School Educators',
    'Best Teachers in School',
    'Subject Matter Experts',
  ],
  alternates: {
    canonical: 'https://www.successpointschool.online/faculty',
  },
  openGraph: {
    title: 'Experienced Teachers & Academic Faculty | Success Point School',
    description:
      'Passionate, qualified educators committed to student growth and academic distinction.',
    url: 'https://www.successpointschool.online/faculty',
    type: 'website',
    images: [
      {
        url: '/images/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'Success Point School Faculty',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Experienced Teachers & Academic Faculty | Success Point School',
    description:
      'Passionate, qualified educators committed to student growth and academic distinction.',
    images: ['/images/logo.jpeg'],
  },
};

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://www.successpointschool.online' },
          { name: 'Faculty', url: 'https://www.successpointschool.online/faculty' },
        ]}
      />
      {children}
    </>
  );
}
