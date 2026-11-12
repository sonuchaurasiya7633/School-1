import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student & Staff Portal Sign-In',
  description: 'Authorized sign-in gateway for enrolled students, faculty, and administration of Success Point School.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
