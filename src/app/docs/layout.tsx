import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation | Success Point School',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
