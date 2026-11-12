import React from 'react';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import FacultySection from '@/components/home/FacultySection';
import DirectorSection from '@/components/home/DirectorSection';
import { Users } from 'lucide-react';

export default function FacultyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col font-sans selection:bg-[#214F39] selection:text-white transition-colors">
      <PublicHeader activePage="faculty" />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#214F39] to-emerald-950 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#E8B4A8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
            style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Leadership &amp; Educators</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Director &amp; Qualified{' '}
            <span className="text-[#E8B4A8]">Teaching Faculty</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Meet our dedicated leadership and certified subject educators committed to academic distinction, mentorship, and holistic student growth at Success Point School.
          </p>
        </div>
      </section>

      {/* Main Director & Faculty Sections */}
      <main className="flex-1">
        <DirectorSection id="director" />
        <FacultySection id="faculty" />
      </main>

      <PublicFooter />
    </div>
  );
}
