import React from 'react';
import type { Metadata } from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import FacultySection from '@/components/home/FacultySection';
import DirectorSection from '@/components/home/DirectorSection';

export const metadata: Metadata = {
  title: 'Director & Qualified Faculty | Success Point School',
  description:
    'Meet the Director and dedicated, qualified educators at Success Point School. Committed to providing quality education, guidance, and a supportive learning environment.',
};

export default function FacultyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col font-sans selection:bg-[#214F39] selection:text-white">
      <PublicHeader activePage="faculty" />

      {/* Main Director & Faculty Sections */}
      <main className="flex-1">
        <DirectorSection id="director" />
        <FacultySection id="faculty" />
      </main>

      <PublicFooter />
    </div>
  );
}
