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
  Play,
  Target,
  Eye,
  Trophy,
  Compass,
  X,
  School,
  Building2,
  PhoneCall,
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = usePublicThemeLanguage();
  const [notices, setNotices] = useState<any[]>([]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
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

  const portals = [
    {
      role: 'student',
      title: 'Student E-Learning Portal',
      subtitle: 'Recorded Lectures, Homework & Notes',
      badge: 'Student Sign-In',
      color: 'from-emerald-600 to-teal-700',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: GraduationCap,
      features: [
        'Watch recorded video lectures by teachers',
        'Submit daily homework & view grades',
        'Check monthly attendance logs',
        'Access term examination report card & marks',
      ],
      target: '/login?role=student',
    },
    {
      role: 'teacher',
      title: 'Teacher & Faculty Portal',
      subtitle: 'Lecture Uploads & Homework Grading',
      badge: 'Faculty Sign-In',
      color: 'from-blue-600 to-indigo-700',
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Users,
      features: [
        'Upload recorded video lectures & PDF study notes',
        'Assign homework & grade student submissions',
        'Mark daily class attendance',
        'Enter student exam marks & generate marksheet',
      ],
      target: '/login?role=teacher',
    },
    {
      role: 'admin',
      title: 'Super Admin Console',
      subtitle: 'School Operations & Web CMS',
      badge: 'Restricted Administration',
      color: 'from-purple-600 to-pink-700',
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: ShieldCheck,
      features: [
        'Manage website content, notices & faculty directory',
        'Automated class marksheet generation',
        'Fee collection, receipts & admission inquiries',
        'Complete student, teacher & class management',
      ],
      target: '/admin',
    },
  ];

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
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col font-sans selection:bg-[#214F39] selection:text-white transition-colors">
      <PublicHeader activePage="home" />

      {/* 1. HERO SECTION (REFERENCE DESIGN ALIGNED) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF9F6] via-white to-[#FAF9F6] dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 pt-8 sm:pt-14 pb-20 sm:pb-28 transition-colors">
        {/* Subtle geometric dot grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#5B45B2_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#34d399_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-10 dark:opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-purple-50 dark:bg-purple-950/70 text-[#5B45B2] dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#5B45B2] dark:text-purple-300 shrink-0" />
                <span>
                  {language === 'hi'
                    ? 'भविष्य का निर्माण • उत्कृष्टता की राह'
                    : 'SHAPING MINDS. BUILDING FUTURES.'}
                </span>
              </div>

              {/* Bold Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl 2xl:text-7xl font-black tracking-tight text-stone-900 dark:text-white leading-[1.08]">
                {language === 'hi' ? (
                  <>
                    उज्ज्वल भविष्य <br />
                    <span className="text-[#5B45B2] dark:text-purple-400">के निर्माण हेतु</span>
                  </>
                ) : (
                  <>
                    For A Better <br />
                    <span className="text-[#5B45B2] dark:text-purple-400">Tomorrow</span>
                  </>
                )}
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base lg:text-lg text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
                {language === 'hi'
                  ? 'छात्रों को ज्ञान, संस्कार और आधुनिक कौशलों से सशक्त बनाकर जिम्मेदार वैश्विक नागरिक बनाना।'
                  : 'Empowering students with knowledge, values, and skills to become responsible global citizens.'}
              </p>

              {/* Interactive CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-1">
                <Link
                  href={settings.heroCta2Link || '/academics'}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#5B45B2] hover:bg-[#4d39a3] text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                >
                  <span>{language === 'hi' ? 'पाठ्यक्रम देखें' : 'Explore More'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 text-xs sm:text-sm font-bold border border-stone-200 dark:border-stone-700 shadow-xs hover:border-[#5B45B2] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 group"
                >
                  <span className="w-6 h-6 rounded-full bg-purple-50 dark:bg-purple-900/60 text-[#5B45B2] dark:text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </span>
                  <span>{language === 'hi' ? 'वीडियो देखें' : 'Watch Video'}</span>
                </button>

                <Link
                  href={settings.heroCta1Link || '/admissions'}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-[#214F39] dark:text-emerald-300 text-xs sm:text-sm font-bold border border-emerald-200 dark:border-emerald-800 transition active:scale-95"
                >
                  <Award className="w-4 h-4 text-[#214F39] dark:text-emerald-300" />
                  <span>{language === 'hi' ? 'प्रवेश आवेदन' : 'Apply Now'}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Graphic with Students & Curved Accent Wave */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* Flowing Curved Accent Ribbon (Matching reference screenshot) */}
              <div className="absolute -right-8 -bottom-10 w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] bg-gradient-to-tr from-[#5B45B2] via-[#7C3AED] to-purple-400 rounded-full opacity-20 blur-3xl pointer-events-none" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-44 sm:w-64 h-[120%] bg-gradient-to-l from-[#5B45B2]/20 via-[#5B45B2]/5 to-transparent rounded-l-[140px] pointer-events-none -mr-4 sm:-mr-8" />

              {/* Main Student Hero Image Container */}
              <div className="relative z-10 w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 group bg-stone-100 dark:bg-stone-900">
                <Image
                  src="/images/hero-students.jpg"
                  alt="Success Point School Students"
                  width={750}
                  height={550}
                  priority
                  className="w-full h-[340px] sm:h-[420px] lg:h-[480px] object-cover object-top group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Floating Bottom Card Over Hero Image */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-white/80 dark:border-stone-700/80 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5B45B2] text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                      SPS
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
                        Academic Excellence
                      </p>
                      <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 truncate">
                        Nursery to Class 12th • CBSE & State Board
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                    Admissions Open
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING STATS RIBBON (OVERLAPPING CARD FROM REFERENCE) */}
      <section className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xl p-5 sm:p-7 transition-colors">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-stone-100 dark:divide-stone-800">
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5 p-2 pt-3 md:pt-2">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-[#5B45B2] dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-800">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                  25+
                </p>
                <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Years of Excellence
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5 p-2 pt-3 md:pt-2 md:pl-6">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                  1500+
                </p>
                <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Students Enrolled
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 p-2 pt-3 md:pt-2 md:pl-6">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                  120+
                </p>
                <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Expert Teachers
                </p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5 p-2 pt-3 md:pt-2 md:pl-6">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-800">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                  50+
                </p>
                <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Awards Won
                </p>
              </div>
            </div>

            {/* Stat 5 */}
            <div className="flex items-center gap-3.5 p-2 pt-3 md:pt-2 md:pl-6 col-span-2 md:col-span-1">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-800">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                  98%
                </p>
                <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Parent Satisfaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SCHOOL — MISSION & VISION SECTION (REFERENCE DESIGN ALIGNED) */}
      <section className="py-20 sm:py-24 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Campus Study Image + Floating Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-stone-800 group">
                <Image
                  src="/images/students-group.jpg"
                  alt="Students at Success Point School"
                  width={600}
                  height={450}
                  className="w-full h-[320px] sm:h-[380px] object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Badge (Bottom Left, exactly as seen in reference image) */}
                <div className="absolute bottom-4 left-4 p-3.5 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-white/80 dark:border-stone-700 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-[#5B45B2] dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
                    <School className="w-5 h-5 text-[#5B45B2]" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white leading-tight">
                      Excellence in Education
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                      Since 1998
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Mission and Vision Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Mission Card */}
              <div className="p-7 rounded-3xl bg-[#FAF9F6] dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-[#5B45B2] dark:text-purple-300 flex items-center justify-center mb-4 border border-purple-100 dark:border-purple-800">
                    <Target className="w-6 h-6 text-[#5B45B2]" />
                  </div>
                  <h3 className="text-xl font-black text-stone-900 dark:text-white tracking-tight">
                    Our Mission
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
                    To provide a nurturing and inclusive environment that encourages academic excellence, creativity and character development to prepare students for a successful future.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B45B2] dark:text-purple-400 hover:underline group"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Vision Card */}
              <div className="p-7 rounded-3xl bg-[#FAF9F6] dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-800">
                    <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-black text-stone-900 dark:text-white tracking-tight">
                    Our Vision
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
                    To be a leading international school recognized for delivering quality education and inspiring students to achieve their full potential and make a positive impact on the world.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline group"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROGRAMS WE OFFER (EXACTLY MATCHING BOTTOM OF REFERENCE SCREENSHOT) */}
      <section className="py-20 sm:py-24 bg-[#FAF9F6] dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white tracking-wider uppercase">
              PROGRAMS WE OFFER
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              A wide range of academic and co-curricular programs designed to bring out the best in every student.
            </p>
          </div>

          {/* Program Image Cards Grid (6 Real Images & Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Program 1: Pre-Primary */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
                  <Image
                    src="/images/classroom.jpg"
                    alt="Foundational Pre-Primary Classroom"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-[#5B45B2] dark:text-purple-300 border border-white/60">
                    Nursery to UKG
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Foundational & Pre-Primary
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                    Interactive storytelling, phonics, motor skills, creative arts, and joyful play-based learning in an engaging environment.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-stone-100 dark:border-stone-800/60 mt-4 flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-400">Early Years</span>
                <Link
                  href="/academics"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#5B45B2] dark:text-purple-400 hover:underline"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Program 2: Primary */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
                  <Image
                    src="/images/students-group.jpg"
                    alt="Primary School Stage"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-emerald-700 dark:text-emerald-300 border border-white/60">
                    Class 1st to 5th
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Primary Stage Curriculum
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                    Conceptual mathematics, environmental sciences, reading comprehension, language fluency, and moral discipline.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-stone-100 dark:border-stone-800/60 mt-4 flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-400">Primary Wing</span>
                <Link
                  href="/academics"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#5B45B2] dark:text-purple-400 hover:underline"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Program 3: Middle School */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
                  <Image
                    src="/images/computer-lab.jpg"
                    alt="Middle School IT & Computer Lab"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-blue-700 dark:text-blue-300 border border-white/60">
                    Class 6th to 8th
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Middle School & IT Coding
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                    Analytical problem solving, computer lab sessions, programming fundamentals, and introductory scientific experiments.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-stone-100 dark:border-stone-800/60 mt-4 flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-400">Middle Wing</span>
                <Link
                  href="/academics"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#5B45B2] dark:text-purple-400 hover:underline"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Program 4: Secondary Board */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
                  <Image
                    src="/images/science-lab.jpg"
                    alt="Secondary Board Laboratory"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-amber-700 dark:text-amber-300 border border-white/60">
                    Class 9th & 10th
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Secondary Board Excellence
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                    Rigorous preparation for 10th board exams, structured mock test series, physics, chemistry, biology laboratory work.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-stone-100 dark:border-stone-800/60 mt-4 flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-400">Board Division</span>
                <Link
                  href="/academics"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#5B45B2] dark:text-purple-400 hover:underline"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Program 5: Senior Secondary Streams */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
                  <Image
                    src="/images/library.jpg"
                    alt="Senior Secondary Library & Research"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-purple-700 dark:text-purple-300 border border-white/60">
                    Class 11th & 12th
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Senior Secondary Streams
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                    Specialized career pathways in Science (PCM / PCB), Commerce with Accounts & Economics, and Humanities / Arts.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-stone-100 dark:border-stone-800/60 mt-4 flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-400">Senior Secondary</span>
                <Link
                  href="/academics"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#5B45B2] dark:text-purple-400 hover:underline"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Program 6: Sports & Co-Curricular */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
                  <Image
                    src="/images/sports-field.jpg"
                    alt="Sports Ground & Physical Education"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-rose-700 dark:text-rose-300 border border-white/60">
                    All Grades
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Sports & Holistic Development
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                    Physical education, football, cricket, track athletics, yoga, debate competitions, cultural celebrations, and arts.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-stone-100 dark:border-stone-800/60 mt-4 flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-400">Co-Curricular</span>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#5B45B2] dark:text-purple-400 hover:underline"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CAMPUS INFRASTRUCTURE SPOTLIGHT */}
      <section className="py-20 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-50 dark:bg-purple-950/70 text-[#5B45B2] dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5B45B2]" />
                <span>Modern Infrastructure</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white leading-tight">
                Empowering Students with <br />
                <span className="text-[#5B45B2] dark:text-purple-400">Smart Technology & Creative Spaces</span>
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                At Success Point School, educational infrastructure goes beyond conventional walls. We provide cutting-edge smart audio-visual classrooms, STEM laboratories, fully networked IT centers, and safe sports environments.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Activity-Based Smart Classrooms</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Digital Video Lecture Portal</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Physics, Chem & Bio Laboratories</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CCTV 24x7 Secured Campus</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition shadow-md bg-[#214F39] hover:bg-[#1a3f2d] text-white active:scale-95"
                >
                  <span>Explore Campus Facilities & Gallery</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF9F6] dark:bg-stone-800/80 border border-stone-200/90 dark:border-stone-700 space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-white dark:bg-stone-700 flex items-center justify-center border border-purple-200 dark:border-purple-800 text-[#5B45B2] dark:text-purple-300 shadow-2xs">
                  <Monitor className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">Smart Classrooms</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Interactive screens, audio-visual instruction, and recorded lectures available on student dashboards.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF9F6] dark:bg-stone-800/80 border border-stone-200/90 dark:border-stone-700 space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-white dark:bg-stone-700 flex items-center justify-center border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 shadow-2xs">
                  <Atom className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">Practical Science Labs</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Dedicated apparatus and safety equipment for Physics, Chemistry, and Biology experiments.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF9F6] dark:bg-stone-800/80 border border-stone-200/90 dark:border-stone-700 space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-white dark:bg-stone-700 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-300 shadow-2xs">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">Continuous Evaluation</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Regular diagnostic tests, periodic feedback, and online marksheet records for every pupil.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF9F6] dark:bg-stone-800/80 border border-stone-200/90 dark:border-stone-700 space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-white dark:bg-stone-700 flex items-center justify-center border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 shadow-2xs">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">Personalized Mentorship</h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Caring educators who nurture each child’s intellectual curiosity, ethics, and character.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MEET OUR QUALIFIED FACULTY SECTION */}
      <FacultySection id="faculty" />

      {/* 7. ADMISSIONS 2026-27 CALLOUT */}
      <section className="py-16 bg-[#214F39] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#1a3f2d] to-emerald-950 p-8 sm:p-12 rounded-3xl border border-emerald-800/80 shadow-2xl">
            <div className="space-y-3 max-w-2xl">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-xs"
                style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
              >
                {settings.admissionsBannerBadge || 'Enrollment Open 2026-2027'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {settings.admissionsBannerTitle || 'Give Your Child the Advantage of Quality Education'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {settings.admissionsBannerDesc ||
                  'Admissions are now open for Nursery through Class 11th. Seats are allotted on a first-come, first-served basis following our interaction assessment.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/admissions"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md text-center"
                style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
              >
                Submit Admission Inquiry Online
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider border border-white/30 text-white hover:bg-white/10 transition text-center"
              >
                Visit Campus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NOTICE BOARD PREVIEW */}
      <section id="notices" className="py-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2"
                style={{ backgroundColor: '#FAF8F5', color: '#214F39', border: '1px solid #E8B4A8' }}
              >
                <Bell className="w-3.5 h-3.5 text-[#214F39]" />
                <span>Notice Board</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Latest School Circulars & Updates
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Official holiday schedules, examination announcements, and school events.
              </p>
            </div>
            <Link
              href="/notices"
              className="mt-4 md:mt-0 text-xs font-bold text-[#214F39] hover:underline flex items-center gap-1"
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
                  className="bg-[#FAF8F5] rounded-3xl p-6 border border-stone-200/80 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                      <span className="flex items-center gap-1 text-[11px] font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#214F39]" />
                        {notice.date ? formatDate(notice.date) : 'Today'}
                      </span>
                      {notice.isPinned && (
                        <span
                          className="font-bold text-[10px] px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
                        >
                          IMPORTANT
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-stone-900 leading-snug line-clamp-2">
                      {notice.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2.5 leading-relaxed line-clamp-4">
                      {notice.content}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                    <span>Issued: {notice.author?.name || 'School Office'}</span>
                    <span className="font-bold" style={{ color: '#214F39' }}>
                      Verified
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-stone-200 shadow-2xs">
                  <span
                    className="font-bold text-[10px] px-2 py-0.5 rounded-full inline-block mb-2"
                    style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
                  >
                    ADMISSIONS
                  </span>
                  <h3 className="font-bold text-base text-stone-900">
                    Admissions Open for Academic Year 2026-27
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Registrations are open for Nursery to Class 11th. Contact school reception or submit registration details online.
                  </p>
                  <p className="text-[11px] text-stone-400 mt-4">Admission Cell</p>
                </div>

                <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-stone-200 shadow-2xs">
                  <span
                    className="font-bold text-[10px] px-2 py-0.5 rounded-full inline-block mb-2"
                    style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
                  >
                    EVENTS
                  </span>
                  <h3 className="font-bold text-base text-stone-900">
                    Annual Science Exhibition & Sports Week
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Students are invited to submit their science and robotics project models by next Friday to their respective science faculty teachers.
                  </p>
                  <p className="text-[11px] text-stone-400 mt-4">Co-Curricular Committee</p>
                </div>

                <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-stone-200 shadow-2xs">
                  <span
                    className="font-bold text-[10px] px-2 py-0.5 rounded-full inline-block mb-2"
                    style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
                  >
                    E-LEARNING
                  </span>
                  <h3 className="font-bold text-base text-stone-900">
                    New Video Lectures & Notes Uploaded
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    Subject teachers have uploaded fresh video lecture sessions and chapter problem sets. Access them anytime from your Student Portal.
                  </p>
                  <p className="text-[11px] text-stone-400 mt-4">Academic Desk</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 9. PARENT & STUDENT TESTIMONIALS */}
      <section className="py-20 bg-[#FAF8F5] dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs"
              style={{ backgroundColor: '#FFFFFF', color: '#214F39', borderColor: '#E8B4A8' }}
            >
              Voices of Trust
            </span>
            <h2 className="text-3xl font-black text-stone-900 mt-2">
              What Parents Say About Us
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Building lasting bonds of excellence and trust between educators and families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(settings.testimonials && settings.testimonials.length > 0
              ? settings.testimonials
              : testimonials
            ).map((t: any, i: number) => (
              <div
                key={i}
                className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {[...Array(t.rating || 5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <h4 className="font-bold text-sm text-stone-900">{t.name}</h4>
                  <p className="text-[11px] text-stone-500">{t.relation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. DIGITAL PORTALS UNIFIED ACCESS */}
      <section id="portals" className="py-20 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs"
              style={{ backgroundColor: '#FAF8F5', color: '#214F39', borderColor: '#E8B4A8' }}
            >
              One Unified Access Point
            </span>
            <h2 className="text-3xl font-black text-stone-900 mt-2">
              Role-Based Digital Portals
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Dedicated interfaces designed for students, teachers, and school administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portals.map((portal) => {
              const Icon = portal.icon;
              return (
                <div
                  key={portal.role}
                  className="bg-[#FAF8F5] rounded-3xl border border-stone-200/90 hover:border-[#214F39]/50 p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl border ${portal.iconBg} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 bg-white text-stone-700 rounded-full border border-stone-200">
                        {portal.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-stone-900 group-hover:text-[#214F39] transition">
                      {portal.title}
                    </h3>
                    <p className="text-xs font-semibold text-stone-500 mt-0.5">
                      {portal.subtitle}
                    </p>

                    <div className="mt-6 space-y-2.5">
                      {portal.features.map((feat, fidx) => (
                        <div key={fidx} className="flex items-center gap-2 text-xs text-stone-700">
                          <CheckCircle2 className="w-4 h-4 text-[#214F39] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-stone-200/70">
                    <Link
                      href={portal.target}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 group-hover:bg-[#214F39] text-white rounded-xl text-xs font-bold transition shadow-md"
                    >
                      <span>Sign In to {portal.title}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAMPUS VIDEO TOUR MODAL */}
      {videoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-800 bg-stone-900/90">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#5B45B2] flex items-center justify-center text-white">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Success Point School — Virtual Campus Tour
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Discover Our Smart Classrooms, Labs & Student Life
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Container (16:9 Aspect Ratio) */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&rel=0"
                title="Success Point School Campus Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer Call to Action */}
            <div className="p-4 sm:p-5 bg-stone-950 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-stone-400 text-center sm:text-left">
                Admissions open for Academic Session 2026-27 • Nursery to Class 12th
              </p>
              <Link
                href="/admissions"
                onClick={() => setVideoModalOpen(false)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#5B45B2] hover:bg-[#4d39a3] text-white text-xs font-bold transition shadow-sm"
              >
                <span>Apply for Admission Online</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <PublicFooter />
    </div>
  );
}
