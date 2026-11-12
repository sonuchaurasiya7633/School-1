import React from 'react';
import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Campus Photo Gallery & Campus Life',
  description:
    'Experience campus life at Success Point School through our photo gallery. View smart classrooms, science labs, sports tournaments, annual celebrations, and co-curricular activities.',
  keywords: [
    'School Photo Gallery',
    'Success Point School Campus',
    'Smart Classrooms Photos',
    'School Events and Sports Day',
    'Campus Life SPS',
  ],
  alternates: {
    canonical: 'https://www.successpointschool.online/gallery',
  },
  openGraph: {
    title: 'Campus Photo Gallery | Success Point School',
    description:
      'View modern campus infrastructure, digital classrooms, science labs, and extracurricular life.',
    url: 'https://www.successpointschool.online/gallery',
    type: 'website',
    images: [
      {
        url: '/images/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'Success Point School Gallery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campus Photo Gallery | Success Point School',
    description:
      'View modern campus infrastructure, digital classrooms, science labs, and extracurricular life.',
    images: ['/images/logo.jpeg'],
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://www.successpointschool.online' },
          { name: 'Gallery', url: 'https://www.successpointschool.online/gallery' },
        ]}
      />
      {children}
    </>
  );
}
