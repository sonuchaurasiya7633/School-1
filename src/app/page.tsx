'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import DirectorSection from '@/components/home/DirectorSection';
import FacultySection from '@/components/home/FacultySection';
import { usePublicThemeLanguage } from '@/context/PublicThemeLanguageContext';
import { formatDate } from '@/lib/utils';
import {
  Sparkles,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  Bell,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Video,
  Award,
  ChevronRight,
  Monitor,
  HeartHandshake,
  Star,
  FileCheck2,
  Atom,
  TrendingUp,
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = usePublicThemeLanguage();
  const [notices, setNotices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    schoolName: 'Success Point School',
    tagline: 'Best Education, Good Results.',
    heroBadge: 'Success Point School • Empowering Future Leaders',
    heroTitle: 'Building Knowledge, Character & Academic Brilliance',
    heroSubtitle:
      'Welcome to the digital learning campus of Success Point School (S.P.S.). We provide state-of-the-art classroom education, recorded video lectures, continuous evaluation, and dedicated student care.',
    heroCta1Text: 'Apply for Admission 2026-27',
    heroCta1Link: '/admissions',
    heroCta2Text: 'Explore Programs & Streams',
    heroCta2Link: '/academics',
    admissionsOpen: true,

    statsStudents: '1,400+',
    statsStudentsSub: 'Nursery to Class 12th',
    statsFaculty: '35+',
    statsFacultySub: 'B.Ed / D.El.Ed Certified',
    statsSmartClasses: '100%',
    statsSmartClassesSub: 'Audio/Video Enabled',
    statsDistinction: '99.4%',
    statsDistinctionSub: 'Consistent Top Ranks',

    aboutHomeBadge: 'About Our Institution',
    aboutHomeTitle: 'Empowering Students with Knowledge, Ethics & Modern Skills',
    aboutHomeDesc:
      'At Success Point School, education transcends routine textbooks. We blend rigorous academic instruction with interactive smart classroom technologies, moral values, debate, sports, and science exhibitions.',
    aboutHomeFeature1: 'Activity-Based Kindergarten',
    aboutHomeFeature2: 'Digital Video Lecture Portal',
    aboutHomeFeature3: 'Science, Arts & Commerce Streams',
    aboutHomeFeature4: 'CCTV Safe & Secure Campus',

    admissionsBannerBadge: 'Enrollment Open 2026-2027',
    admissionsBannerTitle: 'Give Your Child the Advantage of Quality Education',
    admissionsBannerDesc:
      'Admissions are now open for Nursery through Class 11th. Seats are allotted on a first-come, first-served basis following our interaction assessment.',

    testimonials: [],
  });

  useEffect(() => {
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev: any) => ({
            ...prev,
            ...data.settings,
          }));
        }
      })
      .catch(() => {});

    fetch('/api/public/notices')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.notices?.length) {
          setNotices(data.notices);
        }
      })
      .catch(() => {});
  }, []);

  const testimonials = [
    {
      name: 'Rameshwar Roy',
      relation: 'Parent of Class 8th Student',
      text: 'The recorded video lectures feature has been a game changer for my son. When he misses a concept in class, he can re-watch the lecture from home and submit his homework effortlessly.',
      rating: 5,
    },
    {
      name: 'Pooja Verma',
      relation: 'Parent of Class 10th Student',
      text: 'Success Point School has very dedicated faculty teachers. The continuous test series, transparent report cards, and disciplined environment helped my daughter achieve top marks.',
      rating: 5,
    },
    {
      name: 'Amitabh Mishra',
      relation: 'Parent of Class 5th Student',
      text: 'From smart audio-visual classrooms to moral discipline and sports, SPS provides a truly balanced environment for a child’s overall character and intelligence.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col font-sans selection:bg-[#214F39] selection:text-white transition-colors relative">
      <PublicHeader activePage="home" />

      {/* 1. PREMIUM HERO SECTION (Ref: Modern Pastel Glass & Floating Orbs) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#214F39] via-[#1a3f2d] to-emerald-950 text-white pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Luminous Ambient Background Glow Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#E8B4A8]/20 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute top-1/2 -right-32 w-[420px] h-[420px] rounded-full bg-emerald-400/15 blur-3xl pointer-events-none animate-float-reverse" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#E8B4A8_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Human-Crafted Academic Announcement Ribbon */}
            <Link
              href="/admissions"
              className="group inline-flex items-center gap-2.5 sm:gap-3 p-1.5 pr-3.5 sm:pr-4 rounded-full bg-[#163a29]/80 hover:bg-[#163a29] border border-emerald-500/30 hover:border-[#E8B4A8]/60 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 mb-6 hover:scale-[1.02] active:scale-[0.98] max-w-full"
              title="Click to view Admissions 2026-27 details"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8B4A8] text-[#214F39] text-[11px] font-black uppercase tracking-wider shadow-xs shrink-0">
                <GraduationCap className="w-3.5 h-3.5 text-[#214F39]" />
                <span>Admissions 2026–27</span>
              </span>
              <span className="text-[11px] sm:text-xs md:text-[13px] font-semibold text-emerald-100 group-hover:text-white transition-colors truncate">
                {language === 'hi'
                  ? 'सत्र 2026-27 नामांकन प्रारंभ • ऑनलाइन आवेदन करें'
                  : 'Nursery to Class 11th • Apply Online'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E8B4A8] group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
            </Link>

            {/* Main Headline with Gradient Sheen Highlight */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.15]">
              {language === 'hi' ? (
                <>
                  सक्सेस पॉइंट स्कूल
                  <span className="block text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#E8B4A8] via-amber-200 to-emerald-200 mt-2 sm:mt-3">
                    ज्ञान, संस्कार एवं शैक्षणिक उत्कृष्टता
                  </span>
                </>
              ) : (
                <>
                  Success Point School
                  <span className="block text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#E8B4A8] via-amber-200 to-emerald-200 mt-2 sm:mt-3 tracking-tight">
                    Building Knowledge, Character &amp; Academic Brilliance
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="mt-5 sm:mt-7 text-xs sm:text-base md:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-normal">
              {language === 'hi'
                ? t(
                    'hero.subtitle',
                    'सक्सेस पॉइंट स्कूल (S.P.S.) के डिजिटल परिसर में आपका स्वागत है। आधुनिक स्मार्ट शिक्षा, सतत मूल्यांकन और उत्कृष्ट संस्कार।'
                  )
                : settings.heroSubtitle}
            </p>

            {/* Action CTA Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
              <Link
                href={settings.heroCta1Link || '/admissions'}
                className="w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] group"
                style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
              >
                <Award className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-12" />
                <span>
                  {language === 'hi'
                    ? t('hero.cta_apply', 'प्रवेश हेतु आवेदन करें')
                    : settings.heroCta1Text || 'Apply for Admission 2026-27'}
                </span>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={settings.heroCta2Link || '/academics'}
                className="w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-2xl border border-white/25 backdrop-blur-md transition-all flex items-center justify-center gap-2 text-center hover:scale-[1.02] active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4 text-[#E8B4A8] shrink-0" />
                <span>
                  {language === 'hi'
                    ? t('hero.cta_programs', 'पाठ्यक्रम एवं कक्षाएं')
                    : settings.heroCta2Text || 'Explore Programs & Streams'}
                </span>
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 font-bold text-xs uppercase tracking-wider rounded-2xl border border-emerald-700/60 backdrop-blur-md transition-all flex items-center justify-center gap-2 text-center hover:scale-[1.02] active:scale-[0.98]"
              >
                <GraduationCap className="w-4 h-4 text-[#E8B4A8] shrink-0" />
                <span>
                  {language === 'hi' ? 'डैशबोर्ड लॉगिन' : 'Go to Dashboard'}
                </span>
              </Link>
            </div>
          </div>

          {/* Interactive Floating Micro-Cards (Inspired by Reference UI: Progress Rings & Badges) */}
          <div className="mt-14 sm:mt-18 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Card 1: Interactive Learning Progress */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg flex items-center gap-3.5 text-left transform transition hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shrink-0 shadow-md">
                <Monitor className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-200">
                  <span>Interactive Learning</span>
                  <span className="text-white font-extrabold">60% Daily</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                  <div className="w-[60%] h-full bg-gradient-to-r from-emerald-400 to-[#E8B4A8] rounded-full" />
                </div>
                <p className="text-[10px] text-emerald-100/70 mt-1.5 truncate">
                  Recorded lectures &amp; homework sync
                </p>
              </div>
            </div>

            {/* Card 2: Smart AV Classrooms */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg flex items-center gap-3.5 text-left transform transition hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#E8B4A8] to-amber-300 flex items-center justify-center text-[#214F39] shrink-0 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-extrabold text-white">Smart AV Campus</span>
                </div>
                <p className="text-[11px] text-emerald-200 font-semibold mt-0.5">
                  100% Digital Classrooms
                </p>
                <p className="text-[10px] text-emerald-100/70 mt-1 truncate">
                  Visual concepts &amp; audio learning
                </p>
              </div>
            </div>

            {/* Card 3: Academic Excellence */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg flex items-center gap-3.5 text-left transform transition hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-200">
                  <span>Board Pass Distinction</span>
                  <span className="text-white font-extrabold">99.4%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                  <div className="w-[99.4%] h-full bg-gradient-to-r from-amber-300 to-emerald-400 rounded-full" />
                </div>
                <p className="text-[10px] text-emerald-100/70 mt-1.5 truncate">
                  First division board results
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KEY STATS RIBBON (Glass Metric Widgets) */}
      <section className="relative -mt-6 sm:-mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Metric 1 */}
          <div className="glass-panel glass-card-hover rounded-3xl p-5 sm:p-6 border border-white/80 dark:border-stone-800 shadow-md text-center flex flex-col justify-between">
            <div className="w-11 h-11 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#214F39] dark:text-emerald-400 mb-3 shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-[#214F39] dark:text-emerald-400 tracking-tight">
                {settings.statsStudents || '1,400+'}
              </p>
              <p className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mt-1">
                {language === 'hi' ? t('stats.students', 'नामांकित छात्र') : 'Enrolled Students'}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-200/50 dark:border-stone-800 text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {settings.statsStudentsSub || 'Nursery to Class 12th'}
            </div>
          </div>

          {/* Metric 2 */}
          <div className="glass-panel glass-card-hover rounded-3xl p-5 sm:p-6 border border-white/80 dark:border-stone-800 shadow-md text-center flex flex-col justify-between">
            <div className="w-11 h-11 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-3 shadow-2xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                {settings.statsFaculty || '35+'}
              </p>
              <p className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mt-1">
                {language === 'hi' ? t('stats.faculty', 'योग्य एवं अनुभवी शिक्षक') : 'Qualified Faculty'}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-200/50 dark:border-stone-800 text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {settings.statsFacultySub || 'B.Ed / D.El.Ed / CTET'}
            </div>
          </div>

          {/* Metric 3 */}
          <div className="glass-panel glass-card-hover rounded-3xl p-5 sm:p-6 border border-white/80 dark:border-stone-800 shadow-md text-center flex flex-col justify-between">
            <div className="w-11 h-11 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-400 mb-3 shadow-2xs">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-[#214F39] dark:text-emerald-400 tracking-tight">
                {settings.statsSmartClasses || '100%'}
              </p>
              <p className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mt-1">
                Smart Classrooms
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-200/50 dark:border-stone-800 text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {settings.statsSmartClassesSub || 'Audio / Video Interactive'}
            </div>
          </div>

          {/* Metric 4 */}
          <div className="glass-panel glass-card-hover rounded-3xl p-5 sm:p-6 border border-white/80 dark:border-stone-800 shadow-md text-center flex flex-col justify-between">
            <div className="w-11 h-11 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-400 mb-3 shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-[#214F39] dark:text-emerald-400 tracking-tight">
                {settings.statsDistinction || '99.4%'}
              </p>
              <p className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mt-1">
                Board Distinction
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-200/50 dark:border-stone-800 text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {settings.statsDistinctionSub || 'Consistent Top Ranks'}
            </div>
          </div>
        </div>
      </section>

      {/* 3. DIRECTOR PROFILE SECTION */}
      <DirectorSection id="director" />

      {/* 4. ABOUT SCHOOL SPOTLIGHT */}
      <section className="py-20 sm:py-24 bg-white dark:bg-stone-900 border-b border-stone-200/80 dark:border-stone-800 transition-colors relative overflow-hidden">
        {/* Soft pastel ambient glow in background */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-[#E8B4A8]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-[#214F39] dark:text-emerald-400 border border-[#E8B4A8] dark:border-stone-700 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{settings.aboutHomeBadge || 'About Our Institution'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-stone-100 leading-[1.2] tracking-tight">
                {settings.aboutHomeTitle || (
                  <>
                    Empowering Students with <br />
                    <span className="text-[#214F39] dark:text-emerald-400">Knowledge, Ethics &amp; Modern Skills</span>
                  </>
                )}
              </h2>

              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {settings.aboutHomeDesc ||
                  'At Success Point School, education transcends routine textbooks. We blend rigorous academic instruction with interactive smart classroom technologies, moral values, debate, sports, and science exhibitions.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-[#214F39] dark:text-emerald-400 shrink-0" />
                  <span>{settings.aboutHomeFeature1 || 'Activity-Based Kindergarten'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-[#214F39] dark:text-emerald-400 shrink-0" />
                  <span>{settings.aboutHomeFeature2 || 'Digital Video Lecture Portal'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-[#214F39] dark:text-emerald-400 shrink-0" />
                  <span>{settings.aboutHomeFeature3 || 'Science, Arts & Commerce Streams'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-[#214F39] dark:text-emerald-400 shrink-0" />
                  <span>{settings.aboutHomeFeature4 || 'CCTV Safe & Secure Campus'}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition shadow-md hover:scale-[1.02] active:scale-[0.98] bg-[#214F39] text-white hover:opacity-95"
                >
                  <span>Read Full About Us &amp; Vision</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 4 Feature Cards (Ref: Pastel Icon Containers & Clean Rounded Borders) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 sm:p-6 rounded-3xl glass-panel glass-card-hover border border-stone-200/70 dark:border-stone-800 space-y-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center shadow-xs text-[#214F39] dark:text-emerald-400">
                  <Monitor className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100">Smart E-Learning</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                  Recorded video lectures and online homework submissions directly accessible from every student dashboard.
                </p>
                <div className="pt-2 text-[11px] font-bold text-[#214F39] dark:text-emerald-400 flex items-center gap-1">
                  <span>100% Online Sync</span>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl glass-panel glass-card-hover border border-stone-200/70 dark:border-stone-800 space-y-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center shadow-xs text-blue-700 dark:text-blue-400">
                  <Atom className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100">Science Practical Labs</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                  Well-equipped Physics, Chemistry, and Biology experimental setups fostering hands-on scientific discovery.
                </p>
                <div className="pt-2 text-[11px] font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                  <span>Experimental Learning</span>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl glass-panel glass-card-hover border border-stone-200/70 dark:border-stone-800 space-y-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center shadow-xs text-purple-700 dark:text-purple-400">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100">Continuous Assessment</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                  Diagnostic chapter tests, periodic feedback, and automated report card marksheets for continuous progress tracking.
                </p>
                <div className="pt-2 text-[11px] font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1">
                  <span>Continuous Evaluation</span>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl glass-panel glass-card-hover border border-stone-200/70 dark:border-stone-800 space-y-3.5">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center shadow-xs text-rose-700 dark:text-rose-400">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100">Individual Mentoring</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                  Dedicated, compassionate faculty educators who nurture every student’s confidence, moral values, and strengths.
                </p>
                <div className="pt-2 text-[11px] font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                  <span>Student Centered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ACADEMIC PROGRAM DIVISIONS PREVIEW */}
      <section className="py-20 bg-[#FAF8F5] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs"
                style={{ backgroundColor: '#FFFFFF', color: '#214F39', borderColor: '#E8B4A8' }}
              >
                Curriculum Structure
              </span>
              <h2 className="text-3xl font-black text-stone-900 mt-2">
                Academic Programs & Streams
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Holistic curriculum tailored for intellectual clarity, board excellence, and character building.
              </p>
            </div>
            <Link
              href="/academics"
              className="mt-4 md:mt-0 text-xs font-bold text-[#214F39] flex items-center gap-1 hover:underline"
            >
              <span>Explore Detailed Academic Syllabus</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-lg transition flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-[#214F39] border border-emerald-200">
                  Pre-Primary & Primary
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-4">
                  Foundational & Primary Stage
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Interactive storytelling, phonics, mental math, moral education, and creative art in an engaging environment.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#214F39]">
                <span>Nursery to Class 5th</span>
                <Link href="/academics" className="flex items-center gap-1 hover:underline">
                  Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-lg transition flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                  Middle & Secondary
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-4">
                  Secondary Board Excellence
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Intensive Science, Mathematics, Social Sciences, Computer applications, laboratory experiments, and board exam series.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#214F39]">
                <span>Class 6th to 10th</span>
                <Link href="/academics" className="flex items-center gap-1 hover:underline">
                  Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-lg transition flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
                  Senior Secondary
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-4">
                  Specialized Career Streams
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Dedicated Science (Medical/Non-Medical), Commerce, and Arts streams with college guidance and competitive exam orientation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#214F39]">
                <span>Class 11th & 12th</span>
                <Link href="/academics" className="flex items-center gap-1 hover:underline">
                  Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MEET OUR QUALIFIED FACULTY SECTION */}
      <FacultySection id="faculty" />

      {/* 7. ADMISSIONS 2026-27 CALLOUT (Glassmorphic Gradient Banner) */}
      <section className="py-16 sm:py-20 bg-transparent relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[32px] overflow-hidden p-8 sm:p-12 lg:p-14 shadow-2xl border border-emerald-700/40 bg-gradient-to-br from-[#1a3f2d] via-[#214F39] to-[#122b1f] text-white">
            {/* Ambient Floating Glow Orbs */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#E8B4A8]/20 blur-3xl animate-float-slow" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl animate-float-reverse" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#E8B4A8] text-[#214F39] shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  {settings.admissionsBannerBadge || 'Enrollment Open 2026-2027'}
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {settings.admissionsBannerTitle || 'Give Your Child the Advantage of Quality Education'}
                </h2>
                <p className="text-xs sm:text-base text-emerald-100/90 leading-relaxed font-normal">
                  {settings.admissionsBannerDesc ||
                    'Admissions are now open for Nursery through Class 11th. Seats are allotted on a first-come, first-served basis following our interaction assessment.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full lg:w-auto">
                <Link
                  href="/admissions"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl text-center bg-[#E8B4A8] text-[#214F39] hover:bg-white hover:scale-105 active:scale-95"
                >
                  Submit Admission Inquiry
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl font-black text-xs uppercase tracking-wider border border-white/30 text-white hover:bg-white/10 transition-all duration-300 text-center hover:scale-105 active:scale-95 backdrop-blur-md"
                >
                  Visit Campus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NOTICE BOARD PREVIEW (Glassmorphic Cards Ref: Image 2 & 3) */}
      <section id="notices" className="py-20 bg-white dark:bg-stone-900 border-b border-stone-200/80 dark:border-stone-800 transition-colors relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 bg-stone-100 dark:bg-stone-800 text-[#214F39] dark:text-emerald-400 border border-[#E8B4A8] dark:border-stone-700 shadow-2xs">
                <Bell className="w-3.5 h-3.5" />
                <span>Notice Board</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                Latest School Circulars & Updates
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1.5">
                Official holiday schedules, examination announcements, and school events.
              </p>
            </div>
            <Link
              href="/notices"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#214F39] dark:text-emerald-400 hover:underline px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 transition"
            >
              <span>View All Circulars</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notices.length > 0 ? (
              notices.slice(0, 3).map((notice, idx) => (
                <div
                  key={notice._id || idx}
                  className="glass-panel glass-card-hover rounded-3xl p-6 sm:p-7 border border-stone-200/80 dark:border-stone-800 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 dark:text-stone-400">
                        <Calendar className="w-3.5 h-3.5 text-[#214F39] dark:text-emerald-400" />
                        {notice.date ? formatDate(notice.date) : 'Today'}
                      </span>
                      {notice.isPinned && (
                        <span className="font-extrabold text-[10px] px-2.5 py-0.5 rounded-full bg-[#E8B4A8] text-[#214F39] shadow-2xs">
                          ● IMPORTANT
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-snug line-clamp-2">
                      {notice.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2.5 leading-relaxed line-clamp-4">
                      {notice.content}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                    <span>Issued: {notice.author?.name || 'School Office'}</span>
                    <span className="inline-flex items-center gap-1 font-bold text-[#214F39] dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="glass-panel glass-card-hover rounded-3xl p-6 sm:p-7 border border-stone-200/80 dark:border-stone-800 shadow-md flex flex-col justify-between">
                  <div>
                    <span className="font-extrabold text-[10px] px-2.5 py-0.5 rounded-full bg-[#E8B4A8] text-[#214F39] inline-block mb-3">
                      ADMISSIONS
                    </span>
                    <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                      Admissions Open for Academic Year 2026-27
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2.5 leading-relaxed">
                      Registrations are open for Nursery to Class 11th. Contact school reception or submit registration details online.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400">
                    Admission Cell
                  </div>
                </div>

                <div className="glass-panel glass-card-hover rounded-3xl p-6 sm:p-7 border border-stone-200/80 dark:border-stone-800 shadow-md flex flex-col justify-between">
                  <div>
                    <span className="font-extrabold text-[10px] px-2.5 py-0.5 rounded-full bg-[#E8B4A8] text-[#214F39] inline-block mb-3">
                      EVENTS
                    </span>
                    <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                      Annual Science Exhibition & Sports Week
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2.5 leading-relaxed">
                      Students are invited to submit their science and robotics project models by next Friday to their respective science faculty teachers.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400">
                    Co-Curricular Committee
                  </div>
                </div>

                <div className="glass-panel glass-card-hover rounded-3xl p-6 sm:p-7 border border-stone-200/80 dark:border-stone-800 shadow-md flex flex-col justify-between">
                  <div>
                    <span className="font-extrabold text-[10px] px-2.5 py-0.5 rounded-full bg-[#E8B4A8] text-[#214F39] inline-block mb-3">
                      E-LEARNING
                    </span>
                    <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                      New Video Lectures & Notes Uploaded
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2.5 leading-relaxed">
                      Subject teachers have uploaded fresh video lecture sessions and chapter problem sets. Access them anytime from your Student Portal.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400">
                    Academic Desk
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 9. PARENT & STUDENT TESTIMONIALS (Ref: Image 1 & 3 Soft Cards) */}
      <section className="py-20 sm:py-24 bg-[#FAF8F5] dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-[#E8B4A8]/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border shadow-2xs bg-white dark:bg-stone-800 text-[#214F39] dark:text-emerald-400 border-[#E8B4A8] dark:border-stone-700">
              Voices of Trust
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 mt-3 tracking-tight">
              What Parents Say About Us
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base mt-2">
              Building lasting bonds of excellence and trust between educators and families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {(settings.testimonials && settings.testimonials.length > 0
              ? settings.testimonials
              : testimonials
            ).map((t: any, i: number) => (
              <div
                key={i}
                className="glass-panel glass-card-hover p-7 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {[...Array(t.rating || 5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-500 drop-shadow-2xs" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800">
                  <h4 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">{t.name}</h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">{t.relation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
