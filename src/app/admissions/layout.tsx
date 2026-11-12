import React from 'react';
import type { Metadata } from 'next';
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'School Admission 2026-27 (Nursery to 11th Open)',
  description:
    'Admissions open for Session 2026-27 at Success Point School. Apply online for Nursery, KG, Primary & Secondary classes. Explore admission criteria, fees, and required documents.',
  keywords: [
    'School Admission 2026-27',
    'Success Point School Admission',
    'Nursery School Admission Online',
    'CBSE School Admission',
    'Admission Process SPS',
    'Best School Admission',
  ],
  alternates: {
    canonical: 'https://www.successpointschool.online/admissions',
  },
  openGraph: {
    title: 'School Admission 2026-27 Open | Success Point School',
    description:
      'Enroll your child for academic excellence. Online registrations open for Nursery to Class 11th for 2026-27 session.',
    url: 'https://www.successpointschool.online/admissions',
    type: 'website',
    images: [
      {
        url: '/images/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'Admissions Open Success Point School',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School Admission 2026-27 Open | Success Point School',
    description:
      'Enroll your child for academic excellence. Online registrations open for Nursery to Class 11th.',
    images: ['/images/logo.jpeg'],
  },
};

const admissionFAQs = [
  {
    question: 'How do I apply for admission to Success Point School for 2026-27?',
    answer:
      'You can apply directly online by submitting the admission registration inquiry form on our Admissions page, or visit the school administrative office in person during campus working hours.',
  },
  {
    question: 'Which classes are open for new admissions?',
    answer:
      'Admissions are currently open from Nursery, LKG, UKG up to Class 11th across Science, Commerce, and Arts streams.',
  },
  {
    question: 'What documents are required during admission?',
    answer:
      'Required documents include the original Transfer Certificate (T.C.) from previous school, birth certificate, previous year marksheets, 4 passport-size photographs, and copies of student/parent Aadhar cards.',
  },
  {
    question: 'Does Success Point School provide school transport facilities?',
    answer:
      'Yes, the school operates safe and reliable transport vans and buses covering all major nearby city routes and neighborhoods.',
  },
];

export default function AdmissionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://www.successpointschool.online' },
          { name: 'Admissions 2026-27', url: 'https://www.successpointschool.online/admissions' },
        ]}
      />
      <FAQJsonLd items={admissionFAQs} />
      {children}
    </>
  );
}
