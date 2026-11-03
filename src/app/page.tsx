'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import DirectorSection from '@/components/home/DirectorSection';
import FacultySection from '@/components/home/FacultySection';
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
  const [notices, setNotices] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    schoolName: 'Success Point School',
    tagline: 'Best Education, Good Results.',
    heroTitle: 'Building Knowledge, Character & Academic Brilliance',
    heroSubtitle:
      'Welcome to the digital learning campus of Success Point School (S.P.S.). We provide state-of-the-art classroom education, recorded video lectures, continuous evaluation, and dedicated student care.',
    admissionsOpen: true,
  });

  useEffect(() => {
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev) => ({
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
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col font-sans selection:bg-[#214F39] selection:text-white">
      <PublicHeader activePage="home" />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#214F39] via-[#1a3f2d] to-emerald-950 text-white py-14 sm:py-24 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(#E8B4A8_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold mb-5 sm:mb-6 shadow-sm max-w-full"
            style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#214F39] shrink-0" />
            <span className="truncate">Success Point School • Empowering Future Leaders</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {settings.heroTitle}
          </h1>

          <p className="mt-4 sm:mt-6 text-xs sm:text-base md:text-lg text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            {settings.heroSubtitle}
          </p>

          {/* Quick CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
            <Link
              href="/admissions"
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 hover:opacity-95 text-center"
              style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Apply for Admission 2026-27</span>
            </Link>
            <Link
              href="/academics"
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition flex items-center justify-center gap-2 text-center"
            >
              <BookOpen className="w-4 h-4 text-[#E8B4A8] shrink-0" />
              <span>Explore Programs & Streams</span>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-emerald-900/80 hover:bg-emerald-900 text-emerald-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-emerald-700/60 transition flex items-center justify-center gap-2 text-center"
            >
              <GraduationCap className="w-4 h-4 text-[#E8B4A8] shrink-0" />
              <span>Student & Faculty Portal</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. KEY STATS RIBBON */}
      <section className="bg-white border-b border-stone-200 py-6 sm:py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            <div className="p-2 sm:p-3">
              <p className="text-2xl sm:text-4xl font-black text-[#214F39] tracking-tight">1,400+</p>
              <p className="text-[11px] sm:text-xs font-bold text-stone-600 uppercase tracking-wider mt-1">
                Enrolled Students
              </p>
              <p className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">Nursery to Class 12th</p>
            </div>
            <div className="p-2 sm:p-3">
              <p className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">35+</p>
              <p className="text-[11px] sm:text-xs font-bold text-stone-600 uppercase tracking-wider mt-1">
                Qualified Faculty
              </p>
              <p className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">B.Ed / D.El.Ed Certified</p>
            </div>
            <div className="p-2 sm:p-3">
              <p className="text-2xl sm:text-4xl font-black text-[#214F39] tracking-tight">100%</p>
              <p className="text-[11px] sm:text-xs font-bold text-stone-600 uppercase tracking-wider mt-1">
                Smart Classrooms
              </p>
              <p className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">Audio/Video Enabled</p>
            </div>
            <div className="p-2 sm:p-3">
              <p className="text-2xl sm:text-4xl font-black text-[#214F39] tracking-tight">99.4%</p>
              <p className="text-[11px] sm:text-xs font-bold text-stone-600 uppercase tracking-wider mt-1">
                Board Distinction
              </p>
              <p className="text-[10px] sm:text-[11px] text-stone-400 mt-0.5">Consistent Top Ranks</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DIRECTOR PROFILE SECTION */}
      <DirectorSection id="director" />

      {/* 4. ABOUT SCHOOL SPOTLIGHT */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: '#FAF8F5', color: '#214F39', border: '1px solid #E8B4A8' }}
              >
                <span>About Our Institution</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight">
                Empowering Students with <br />
                <span style={{ color: '#214F39' }}>Knowledge, Ethics & Modern Skills</span>
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                At Success Point School, education transcends routine textbooks. We blend rigorous academic instruction with interactive smart classroom technologies, moral values, debate, sports, and science exhibitions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-[#214F39] shrink-0" />
                  <span>Activity-Based Kindergarten</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-[#214F39] shrink-0" />
                  <span>Digital Video Lecture Portal</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-[#214F39] shrink-0" />
                  <span>Science, Arts & Commerce Streams</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <CheckCircle2 className="w-4 h-4 text-[#214F39] shrink-0" />
                  <span>CCTV Safe & Secure Campus</span>
                </div>
              </div>
              <div className="pt-3">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
                  style={{ backgroundColor: '#214F39', color: '#FFFFFF' }}
                >
                  <span>Read Full About Us & Vision</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[#E8B4A8]">
                  <Monitor className="w-5 h-5 text-[#214F39]" />
                </div>
                <h4 className="font-bold text-sm text-stone-900">Smart E-Learning</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Recorded lectures and online homework submission on every student dashboard.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[#E8B4A8]">
                  <Atom className="w-5 h-5 text-[#214F39]" />
                </div>
                <h4 className="font-bold text-sm text-stone-900">Science Practical Labs</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Equipped Physics, Chemistry, and Biology experimental setups.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[#E8B4A8]">
                  <FileCheck2 className="w-5 h-5 text-[#214F39]" />
                </div>
                <h4 className="font-bold text-sm text-stone-900">Continuous Assessment</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Regular diagnostic tests, periodic feedback, and automated marksheet records.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF8F5] border border-stone-200/90 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[#E8B4A8]">
                  <HeartHandshake className="w-5 h-5 text-[#214F39]" />
                </div>
                <h4 className="font-bold text-sm text-stone-900">Individual Mentoring</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Caring educators who nurture every student’s confidence and strengths.
                </p>
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

      {/* 7. ADMISSIONS 2026-27 CALLOUT */}
      <section className="py-16 bg-[#214F39] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-[#1a3f2d] to-emerald-950 p-8 sm:p-12 rounded-3xl border border-emerald-800/80 shadow-2xl">
            <div className="space-y-3 max-w-2xl">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-xs"
                style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
              >
                Enrollment Open 2026-2027
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Give Your Child the Advantage of Quality Education
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Admissions are now open for Nursery through Class 11th. Seats are allotted on a first-come, first-served basis following our interaction assessment.
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
      <section id="notices" className="py-16 bg-white border-b border-stone-200">
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
      <section className="py-20 bg-[#FAF8F5] border-b border-stone-200">
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
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {[...Array(t.rating)].map((_, s) => (
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
      <section id="portals" className="py-20 bg-white border-b border-stone-200">
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

      <PublicFooter />
    </div>
  );
}
