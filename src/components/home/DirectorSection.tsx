'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Shield,
  Sparkles,
  School,
  BookmarkCheck,
} from 'lucide-react';

interface DirectorSectionProps {
  id?: string;
  className?: string;
  initialData?: {
    directorName?: string;
    directorDesignation?: string;
    directorQualifications?: string;
    directorMessage?: string;
    directorImage?: string;
  };
}

export default function DirectorSection({
  id = 'director',
  className = '',
  initialData,
}: DirectorSectionProps) {
  const [data, setData] = useState({
    name: initialData?.directorName || 'Subodh Kumar Sharma',
    designation: initialData?.directorDesignation || 'Director',
    qualificationsLine: initialData?.directorQualifications || 'M.A. | D.El.Ed | B.Ed | CTET | STET',
    message:
      initialData?.directorMessage ||
      'Dedicated to fostering an atmosphere of intellectual curiosity, moral discipline, and comprehensive educational development for every student at Success Point School.',
    image: initialData?.directorImage || '/images/director.jpg',
  });

  useEffect(() => {
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.settings) {
          const s = resData.settings;
          setData({
            name: s.directorName || 'Subodh Kumar Sharma',
            designation: s.directorDesignation || 'Director',
            qualificationsLine: s.directorQualifications || 'M.A. | D.El.Ed | B.Ed | CTET | STET',
            message:
              s.directorMessage ||
              'Dedicated to fostering an atmosphere of intellectual curiosity, moral discipline, and comprehensive educational development for every student at Success Point School.',
            image: s.directorImage || '/images/director.jpg',
          });
        }
      })
      .catch(() => {});
  }, []);

  const qualifications = [
    { title: 'M.A.', label: 'Master of Arts' },
    { title: 'D.El.Ed', label: 'Diploma in Elementary Education' },
    { title: 'B.Ed', label: 'Bachelor of Education' },
    { title: 'CTET', label: 'Central Teacher Eligibility Test' },
    { title: 'STET', label: 'State Teacher Eligibility Test' },
  ];

  return (
    <section
      id={id}
      aria-labelledby="director-heading"
      className={`py-16 sm:py-20 relative bg-[#FAF8F5] dark:bg-stone-950 transition-colors ${className}`}
    >
      {/* Decorative Subtle Accent Divider */}
      <div
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E8B4A8] to-transparent opacity-60"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-xs mb-3 bg-white dark:bg-stone-900 text-[#214F39] dark:text-emerald-400 border border-[#E8B4A8] dark:border-stone-700"
          >
            <Shield className="w-3.5 h-3.5 text-[#214F39] dark:text-emerald-400" />
            <span>Institutional Leadership</span>
          </div>

          <h2
            id="director-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#214F39] dark:text-emerald-400"
          >
            Meet Our Director
          </h2>

          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed mt-2">
            Guiding Success Point School with educational vision, academic leadership, and dedication to student excellence.
          </p>
        </div>

        {/* Director Profile Card (Desktop: Two Columns, Mobile: Single Column) */}
        <div
          className="glass-panel rounded-[32px] border border-stone-200/80 dark:border-stone-800 shadow-xl overflow-hidden max-w-5xl mx-auto"
        >
          {/* Top Decorative Border in Deep Green and Soft Peach */}
          <div className="h-2 w-full bg-gradient-to-r from-[#214F39] via-[#E8B4A8] to-[#214F39]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12 items-center">
            {/* LEFT COLUMN: Large Professional Director Photo */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-xs sm:max-w-sm">
                {/* Background Glow Ring */}
                <div
                  className="absolute -inset-1 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500 bg-[#E8B4A8]"
                  aria-hidden="true"
                />

                {/* Photo Frame Container */}
                <div
                  className="relative rounded-2xl overflow-hidden border-4 shadow-lg bg-white dark:bg-stone-800 border-white dark:border-stone-700"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
                    <Image
                      src={data.image}
                      alt={`${data.name} - ${data.designation}, Success Point School`}
                      width={480}
                      height={600}
                      className="object-cover object-top w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out"
                      priority
                    />
                  </div>

                  {/* Verification Pill Overlay */}
                  <div
                    className="absolute bottom-3 inset-x-3 backdrop-blur-md px-3.5 py-2 rounded-xl border flex items-center justify-between shadow-md bg-[#214F39]/90 border-[#E8B4A8]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-white text-xs font-bold tracking-wide uppercase">
                        {data.designation}
                      </span>
                    </div>
                    <span className="text-[#E8B4A8] text-[11px] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#E8B4A8]" />
                      Success Point School
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Director Details & Qualifications */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Designation Badge */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-[#214F39] dark:text-emerald-400 border border-[#E8B4A8] dark:border-stone-700 shadow-2xs"
              >
                <School className="w-3.5 h-3.5 text-[#214F39] dark:text-emerald-400" />
                <span>{data.designation}</span>
              </div>

              {/* Prominent Name */}
              <div>
                <h3
                  className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-stone-900 dark:text-stone-100"
                >
                  {data.name}
                </h3>
                <p className="text-sm sm:text-base font-bold text-[#214F39] dark:text-emerald-400 mt-1">
                  {data.designation}, Success Point School
                </p>
              </div>

              {/* Direct Qualifications Line */}
              <div
                className="p-3.5 sm:p-4 rounded-2xl border flex items-center justify-center lg:justify-start gap-2.5 flex-wrap bg-stone-50 dark:bg-stone-800/80 border-stone-200/80 dark:border-stone-700"
              >
                <GraduationCap className="w-5 h-5 text-[#214F39] dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Qualifications:
                </span>
                <span
                  className="text-sm sm:text-base font-black tracking-wide"
                  style={{ color: '#214F39' }}
                >
                  {data.qualificationsLine}
                </span>
              </div>

              {/* Elegant Individual Badges Grid */}
              <div className="space-y-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 text-center lg:text-left">
                  Academic & Professional Credentials
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {qualifications.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:border-[#214F39]/40 transition-colors shadow-2xs"
                      style={{
                        borderColor: 'rgba(232, 180, 168, 0.4)',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: '#FAF8F5',
                          color: '#214F39',
                          border: '1px solid #E8B4A8',
                        }}
                      >
                        <Award className="w-4 h-4 text-[#214F39]" />
                      </div>
                      <div className="min-w-0 text-left">
                        <span
                          className="block text-xs font-black tracking-tight"
                          style={{ color: '#214F39' }}
                        >
                          {item.title}
                        </span>
                        <span className="block text-[11px] text-stone-500 truncate">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leadership Commitment Quote */}
              <div className="pt-4 border-t border-stone-100 flex items-start gap-3 text-left">
                <BookmarkCheck className="w-5 h-5 text-[#214F39] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                  &ldquo;{data.message}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
