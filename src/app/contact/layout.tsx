import React from 'react';
import type { Metadata } from 'next';
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Contact School Administration & Admissions Desk',
  description:
    'Get in touch with Success Point School administration. Campus address, admissions helpline (+91 8051217686), official email, visiting hours, and instant inquiry submission.',
  keywords: [
    'Contact Success Point School',
    'School Phone Number',
    'School Admission Helpline',
    'Campus Location Address',
    'School Office Hours',
  ],
  alternates: {
    canonical: 'https://www.successpointschool.online/contact',
  },
  openGraph: {
    title: 'Contact School Administration | Success Point School',
    description:
      'Campus address, admissions helpline (+91 8051217686), visiting hours, and online inquiry form.',
    url: 'https://www.successpointschool.online/contact',
    type: 'website',
    images: [
      {
        url: '/images/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'Contact Success Point School',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact School Administration | Success Point School',
    description:
      'Campus address, admissions helpline (+91 8051217686), visiting hours, and online inquiry form.',
    images: ['/images/logo.jpeg'],
  },
};

const contactFAQs = [
  {
    question: 'What are the campus visiting and administrative office hours?',
    answer:
      'The administrative and admission office operates from Sunday to Friday, 08:00 AM to 02:30 PM. Saturday is a weekly holiday.',
  },
  {
    question: 'How can I contact the school for admission inquiries?',
    answer:
      'You can call our dedicated helpline at +91 8051217686 or email info@successpointschool.online, or submit an online query on our Contact page.',
  },
  {
    question: 'Where is the school campus located?',
    answer:
      'Success Point School campus is located in Knowledge City Zone on Main City Road, Pin - 800001.',
  },
];

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://www.successpointschool.online' },
          { name: 'Contact Us', url: 'https://www.successpointschool.online/contact' },
        ]}
      />
      <FAQJsonLd items={contactFAQs} />
      {children}
    </>
  );
}
