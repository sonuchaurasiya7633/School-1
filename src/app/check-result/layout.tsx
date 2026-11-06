import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Check Results | Success Point School',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function CheckResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
