import React from 'react';
import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'About Us — Vision, Philosophy & Academic Leadership',
  description:
    'Discover Success Point School (S.P.S.) — our educational philosophy, qualified faculty, audio-visual smart classrooms, leadership, and mission of nurturing future leaders.',
  keywords: [
    'About Success Point School',
    'SPS School History',
    'School Vision and Mission',
    'Best School Faculty',
    'Smart Classrooms School',
    'Holistic Education',
  ],
  alternates: {
    canonical: 'https://www.successpointschool.online/about',
  },
  openGraph: {
    title: 'About Success Point School | Vision, Philosophy & Leadership',
    description:
      'Learn about Success Point School (S.P.S.) — academic excellence, dedicated teachers, and holistic growth.',
    url: 'https://www.successpointschool.online/about',
    type: 'website',
    images: [
      {
        url: '/images/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'About Success Point School',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Success Point School | Vision & Leadership',
    description:
      'Learn about Success Point School (S.P.S.) — academic excellence, dedicated teachers, and holistic growth.',
    images: ['/images/logo.jpeg'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://www.successpointschool.online' },
          { name: 'About Us', url: 'https://www.successpointschool.online/about' },
        ]}
      />
      {children}
    </>
  );
}
