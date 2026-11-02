import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import DirectorSection from '@/components/home/DirectorSection';
import {
  Sparkles,
  Target,
  Compass,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Success Point School',
  description:
    'Learn about Success Point School, our history, educational philosophy, visionary leadership, and commitment to academic excellence.',
};

export default function AboutPage() {
  const values = [
    {
      title: 'Academic Distinction',
      description:
        'A challenging curriculum focusing on deep conceptual understanding, analytical thinking, and preparation for competitive examinations.',
      icon: GraduationCap,
    },
    {
      title: 'Moral & Ethical Character',
      description:
        'Inculcating universal values, discipline, empathy, leadership, and respect for cultural heritage and community responsibility.',
      icon: Target,
    },
    {
      title: 'Technology-Enabled Learning',
      description:
        'Modern smart classrooms, recorded video lectures for continuous revision, and interactive homework evaluation platforms.',
      icon: BookOpen,
    },
    {
      title: 'Holistic Personality Development',
      description:
        'Encouraging sports, debates, science exhibitions, arts, and cultural activities for all-round physical and mental development.',
      icon: Compass,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col font-sans selection:bg-[#214F39] selection:text-white">
      <PublicHeader activePage="about" />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#214F39] to-emerald-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#E8B4A8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
            style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Success Point School • Established with Purpose</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Nurturing Minds, Inspiring Character & <br className="hidden sm:block" />
            <span className="text-[#E8B4A8]">Shaping Future Leaders</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Founded on the ideals of quality education and inclusive growth, Success Point School provides students from Nursery to Senior Secondary with an empowering environment to excel academically and ethically.
          </p>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="p-8 rounded-3xl border shadow-sm relative overflow-hidden"
              style={{
                backgroundColor: '#FAF8F5',
                borderColor: '#E8B4A8',
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-5 shadow-xs"
                style={{ backgroundColor: '#214F39' }}
              >
                <Compass className="w-6 h-6 text-[#E8B4A8]" />
              </div>
              <h2 className="text-2xl font-black tracking-tight" style={{ color: '#214F39' }}>
                Our Vision
              </h2>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                To be a premier educational institution recognized for scholarly excellence, holistic character development, and technological empowerment — enabling students to become compassionate, knowledgeable, and resilient global citizens.
              </p>
              <ul className="mt-6 space-y-2 text-xs font-semibold text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#214F39]" />
                  Emphasis on conceptual clarity over rote memorization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#214F39]" />
                  Ethical discipline and social responsibility
                </li>
              </ul>
            </div>

            <div
              className="p-8 rounded-3xl border shadow-sm relative overflow-hidden"
              style={{
                backgroundColor: '#FAF8F5',
                borderColor: '#E8B4A8',
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-5 shadow-xs"
                style={{ backgroundColor: '#214F39' }}
              >
                <Target className="w-6 h-6 text-[#E8B4A8]" />
              </div>
              <h2 className="text-2xl font-black tracking-tight" style={{ color: '#214F39' }}>
                Our Mission
              </h2>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                To provide accessible, high-standard education through dedicated pedagogy, qualified faculty, audio-visual smart classrooms, regular assessments, and comprehensive extracurricular platforms that unlock each child&apos;s innate potential.
              </p>
              <ul className="mt-6 space-y-2 text-xs font-semibold text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#214F39]" />
                  Individual student mentoring and continuous feedback
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#214F39]" />
                  Seamless blend of traditional ethics and modern e-learning
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Profile: Director Subodh Kumar Sharma */}
      <DirectorSection id="director" />

      {/* Core Values Section */}
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
              Educational Pillars
            </span>
            <h2 className="text-3xl font-black tracking-tight mt-2" style={{ color: '#214F39' }}>
              The Core Values That Guide Us
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Every initiative, lesson plan, and student activity at Success Point School is rooted in our foundational pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="bg-[#FAF8F5] p-6 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-[#214F39]"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E8B4A8',
                      }}
                    >
                      <Icon className="w-5 h-5 text-[#214F39]" />
                    </div>
                    <h3 className="font-bold text-base text-stone-900 leading-snug">
                      {val.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center text-[11px] font-bold text-[#214F39]">
                    <span>SPS Principle</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Institutional Milestones & Stats */}
      <section className="py-16 bg-[#214F39] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-5xl font-black text-[#E8B4A8]">1,400+</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-100 mt-1">
                Students Enrolled
              </p>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">Nursery to Class 12th</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-5xl font-black text-white">35+</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-100 mt-1">
                Expert Faculty
              </p>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">Qualified & Dedicated</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-5xl font-black text-[#E8B4A8]">99.4%</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-100 mt-1">
                Board Result
              </p>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">High Academic Standing</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-5xl font-black text-white">100%</p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-100 mt-1">
                Smart Classrooms
              </p>
              <p className="text-[11px] text-emerald-200/70 mt-0.5">Digital & Audio-Visual</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA to Explore Faculty & Admissions */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#214F39]">
            Ready to Experience the Success Point Standard?
          </h2>
          <p className="text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Meet our educators, explore our academic curriculum, or submit an admission inquiry for the 2026-2027 academic session.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/faculty"
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-stone-300 text-stone-800 hover:bg-white transition shadow-xs"
            >
              Meet Our Teaching Team
            </Link>
            <Link
              href="/admissions"
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition"
              style={{ backgroundColor: '#214F39' }}
            >
              Online Admissions 2026-27
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
