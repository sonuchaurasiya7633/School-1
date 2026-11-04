'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import {
  BookOpen,
  GraduationCap,
  Video,
  CheckCircle2,
  Atom,
  TrendingUp,
  Palette,
  ArrowRight,
} from 'lucide-react';

export default function AcademicsPage() {
  const [settings, setSettings] = useState<any>({
    academicsPageTitle: 'Comprehensive Curriculum Designed for Intellectual Mastery & Distinction',
    academicsPageSubtitle:
      'From playful foundational learning to rigorous senior secondary preparation, our structured curriculum develops critical thinking, conceptual clarity, and exam excellence.',
    academicsScienceDesc:
      'Rigorous scientific pedagogy with state-of-the-art laboratory practicals. Prepares students for Engineering, Medicine, Research, and Technical fields.',
    academicsCommerceDesc:
      'Comprehensive financial, managerial, and economic acumen. Ideal for Chartered Accountancy (CA), Management (BBA/MBA), Banking, and Entrepreneurship.',
    academicsArtsDesc:
      'Deep understanding of societal structures, governance, global affairs, and literature. Ideal for Civil Services (UPSC), Law, Journalism, and Academia.',
  });

  useEffect(() => {
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev: any) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});
  }, []);

  const levels = [
    {
      level: 'Foundational Stage',
      classes: 'Nursery, LKG & UKG',
      description:
        'Activity-based play and learn pedagogy nurturing sensory motor skills, basic vocabulary, numbers, moral stories, and creative curiosity in a loving atmosphere.',
      highlights: ['Activity-based learning', 'Phonics & Basic Math', 'Creative Arts & Motor Skills'],
    },
    {
      level: 'Primary Wing',
      classes: 'Class 1st to 5th',
      description:
        'Building strong foundational clarity in English, Hindi, Mathematics, Environmental Studies, General Knowledge, and Computer basics with regular worksheets.',
      highlights: ['Language fluency', 'Logical reasoning', 'Interactive smart classroom sessions'],
    },
    {
      level: 'Middle School',
      classes: 'Class 6th to 8th',
      description:
        'Transitioning into structured academic disciplines: Science (Physics, Chemistry, Biology), Social Sciences, Advanced Mathematics, and Computer Applications.',
      highlights: ['Hands-on science experiments', 'Project-based assignments', 'Analytical thinking'],
    },
    {
      level: 'Secondary School',
      classes: 'Class 9th & 10th',
      description:
        'Rigorous curriculum mapped to board standards. Intensive problem-solving, recorded lecture revisions, chapter test series, and board preparation.',
      highlights: ['Board exam preparation', 'Pre-board diagnostic tests', 'Comprehensive study notes'],
    },
    {
      level: 'Senior Secondary',
      classes: 'Class 11th & 12th',
      description:
        'Specialized academic streams with dedicated faculty guidance, laboratory practicals, competitive exam orientation, and career counseling.',
      highlights: ['Science, Commerce & Arts streams', 'Advanced lab experiments', 'Career guidance'],
    },
  ];

  const streams = [
    {
      title: 'Science Stream',
      icon: Atom,
      tag: 'Medical & Non-Medical',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English'],
      description:
        settings.academicsScienceDesc ||
        'Rigorous scientific pedagogy with state-of-the-art laboratory practicals. Prepares students for Engineering, Medicine, Research, and Technical fields.',
    },
    {
      title: 'Commerce Stream',
      icon: TrendingUp,
      tag: 'Business & Finance',
      subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics / Informatics', 'English'],
      description:
        settings.academicsCommerceDesc ||
        'Comprehensive financial, managerial, and economic acumen. Ideal for Chartered Accountancy (CA), Management (BBA/MBA), Banking, and Entrepreneurship.',
    },
    {
      title: 'Arts & Humanities',
      icon: Palette,
      tag: 'Social Sciences & Law',
      subjects: ['Political Science', 'History', 'Geography', 'Economics', 'Hindi', 'English'],
      description:
        settings.academicsArtsDesc ||
        'Deep understanding of societal structures, governance, global affairs, and literature. Ideal for Civil Services (UPSC), Law, Journalism, and Academia.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col font-sans selection:bg-[#214F39] selection:text-white transition-colors">
      <PublicHeader activePage="academics" />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#214F39] to-emerald-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#E8B4A8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
            style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Excellence & Smart Pedagogy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {settings.academicsPageTitle || 'Comprehensive Curriculum Designed for Intellectual Mastery & Distinction'}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            {settings.academicsPageSubtitle ||
              'From playful foundational learning to rigorous senior secondary preparation, our structured curriculum develops critical thinking, conceptual clarity, and exam excellence.'}
          </p>
        </div>
      </section>

      {/* Academic Stages Overview */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs"
              style={{
                backgroundColor: '#FAF8F5',
                color: '#214F39',
                borderColor: '#E8B4A8',
              }}
            >
              School Divisions
            </span>
            <h2 className="text-3xl font-black tracking-tight mt-2" style={{ color: '#214F39' }}>
              Structured Academic Pathway
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Age-appropriate pedagogy structured to foster progressive intellectual development at every stage.
            </p>
          </div>

          <div className="space-y-6">
            {levels.map((lvl, idx) => (
              <div
                key={lvl.level}
                className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="lg:max-w-2xl space-y-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: '#214F39', color: '#FFFFFF' }}
                    >
                      {idx + 1}
                    </span>
                    <h3 className="text-xl font-black tracking-tight" style={{ color: '#214F39' }}>
                      {lvl.level}
                    </h3>
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E8B4A8',
                        color: '#214F39',
                      }}
                    >
                      {lvl.classes}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
                    {lvl.description}
                  </p>
                </div>

                <div className="lg:w-80 shrink-0 bg-white p-4 rounded-2xl border border-stone-200/80 space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Key Highlights:
                  </span>
                  {lvl.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#214F39] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Senior Secondary Streams */}
      <section className="py-16 bg-[#FAF8F5] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#214F39',
                borderColor: '#E8B4A8',
              }}
            >
              Class 11th & 12th
            </span>
            <h2 className="text-3xl font-black tracking-tight mt-2" style={{ color: '#214F39' }}>
              Academic Streams & Specializations
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Providing rigorous academic foundations, career guidance, and state-of-the-art laboratory facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {streams.map((stream) => {
              const Icon = stream.icon;
              return (
                <div
                  key={stream.title}
                  className="bg-white rounded-3xl p-7 border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(33, 79, 57, 0.08)', color: '#214F39' }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: '#FAF8F5',
                          borderColor: '#E8B4A8',
                          color: '#214F39',
                        }}
                      >
                        {stream.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-stone-900 tracking-tight">
                      {stream.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {stream.description}
                    </p>

                    <div className="mt-6 pt-4 border-t border-stone-100">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                        Core Subjects:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {stream.subjects.map((sub) => (
                          <span
                            key={sub}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-stone-100">
                    <Link
                      href="/admissions"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
                      style={{ backgroundColor: '#214F39', color: '#FFFFFF' }}
                    >
                      <span>Inquire for {stream.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modern E-Learning & Video Lectures Feature */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#214F39] to-emerald-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
              >
                Digital Learning Ecosystem
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                Recorded Video Lectures & Online Homework Evaluation
              </h2>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                Every classroom is backed by our integrated student learning portal. Students can re-watch recorded video lectures uploaded by subject teachers, download chapter notes, and submit daily homework assignments from home.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2"
                  style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
                >
                  <Video className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
                <Link
                  href="/faculty"
                  className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-white/30 text-white hover:bg-white/10 transition flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Meet Subject Faculty</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
