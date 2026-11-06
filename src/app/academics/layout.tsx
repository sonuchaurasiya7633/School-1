import React from 'react';
import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Academic Curriculum, Smart Classes & Syllabus | Success Point School',
  description:
    'Discover our comprehensive academic framework from Nursery to Class 12th. Modern CBSE-aligned syllabus, smart digital classrooms, hands-on science labs, and continuous student assessments.',
  keywords: [
    'School Curriculum',
    'Smart Digital Classes',
    'CBSE School Curriculum',
    'Success Point School Academics',
    'Audio Visual Classrooms',
    'Science and Computer Labs',
  ],
  alternates: {
    canonical: 'https://www.successpointschool.online/academics',
  },
  openGraph: {
    title: 'Academic Curriculum & Smart Classes | Success Point School',
    description:
      'Rigorous academic programs, audio-visual smart classes, and experiential learning from Nursery to Class 12th.',
    url: 'https://www.successpointschool.online/academics',
    type: 'website',
    images: [
      {
        url: '/images/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'Academics at Success Point School',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academic Curriculum & Smart Classes | Success Point School',
    description:
      'Rigorous academic programs, audio-visual smart classes, and experiential learning from Nursery to Class 12th.',
    images: ['/images/logo.jpeg'],
  },
};

export default function AcademicsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://www.successpointschool.online' },
          { name: 'Academics', url: 'https://www.successpointschool.online/academics' },
        ]}
      />
      {children}
    </>
  );
}
