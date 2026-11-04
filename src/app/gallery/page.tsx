'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import {
  Sparkles,
  Camera,
  Layers,
  ArrowRight,
  BookOpen,
  Monitor,
  Trophy,
  School,
  CheckCircle2,
} from 'lucide-react';

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const facilities = [
    {
      id: 1,
      title: 'Digital Smart Classrooms',
      category: 'smart-class',
      description:
        'Audio-visual interactive whiteboards, HD projector systems, and multimedia lessons ensuring engaging conceptual learning.',
      icon: Monitor,
      tag: 'Technology',
    },
    {
      id: 2,
      title: 'Advanced Science Laboratories',
      category: 'labs',
      description:
        'Equipped Physics, Chemistry, and Biology experimental workstations adhering to modern educational safety standards.',
      icon: Layers,
      tag: 'Laboratories',
    },
    {
      id: 3,
      title: 'High-Tech Computer Lab',
      category: 'labs',
      description:
        'Modern networked desktop computers with internet access for Coding, Information Technology, DCA, and digital literacy training.',
      icon: Monitor,
      tag: 'Computing',
    },
    {
      id: 4,
      title: 'Well-Stocked Knowledge Library',
      category: 'labs',
      description:
        'Over 5,000+ academic textbooks, reference encyclopedias, competitive exam materials, journals, and quiet reading zones.',
      icon: BookOpen,
      tag: 'Library',
    },
    {
      id: 5,
      title: 'Spacious Sports Ground & Play Arena',
      category: 'sports',
      description:
        'Dedicated fields for Cricket, Football, Badminton, Volleyball, and athletics fostering physical fitness and teamwork.',
      icon: Trophy,
      tag: 'Athletics',
    },
    {
      id: 6,
      title: 'Secure & Clean Campus Campus',
      category: 'campus',
      description:
        'CCTV-monitored premises, filtered RO drinking water points, clean sanitation blocks, and dedicated security guards.',
      icon: School,
      tag: 'Infrastructure',
    },
    {
      id: 7,
      title: 'Annual Science & Art Exhibition',
      category: 'activities',
      description:
        'Students actively design working science models, robotics experiments, and fine art displays for parents and visitors.',
      icon: Sparkles,
      tag: 'Co-Curricular',
    },
    {
      id: 8,
      title: 'Indoor Games & Activity Room',
      category: 'sports',
      description:
        'Chess, Carrom, Table Tennis, and creative toy rooms for pre-primary and primary students to unwind and sharpen reflexes.',
      icon: Trophy,
      tag: 'Recreation',
    },
  ];

  const filteredFacilities =
    activeFilter === 'all'
      ? facilities
      : facilities.filter((f) => f.category === activeFilter);

  const filters = [
    { id: 'all', label: 'All Facilities' },
    { id: 'smart-class', label: 'Smart Classrooms' },
    { id: 'labs', label: 'Labs & Library' },
    { id: 'sports', label: 'Sports & Games' },
    { id: 'activities', label: 'Exhibitions & Events' },
    { id: 'campus', label: 'Campus Safety' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col font-sans selection:bg-[#214F39] selection:text-white transition-colors">
      <PublicHeader activePage="gallery" />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#214F39] to-emerald-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#E8B4A8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
            style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Campus Tour & Facilities</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Modern Infrastructure Supporting <br className="hidden sm:block" />
            <span className="text-[#E8B4A8]">Experiential & Creative Learning</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Take a virtual tour of our campus: interactive smart classrooms, experimental laboratories, rich library, expansive sports grounds, and vibrant student activities.
          </p>
        </div>
      </section>

      {/* Facilities Grid with Category Filter */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
            {filters.map((fil) => {
              const isActive = activeFilter === fil.id;
              return (
                <button
                  key={fil.id}
                  onClick={() => setActiveFilter(fil.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-2xs ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                  }`}
                  style={isActive ? { backgroundColor: '#214F39' } : {}}
                >
                  {fil.label}
                </button>
              );
            })}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFacilities.map((fac) => {
              const Icon = fac.icon;
              return (
                <div
                  key={fac.id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div className="p-7">
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: '#FAF8F5',
                          color: '#214F39',
                          border: '1px solid #E8B4A8',
                        }}
                      >
                        <Icon className="w-6 h-6 text-[#214F39]" />
                      </div>
                      <span
                        className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: '#FAF8F5',
                          borderColor: '#E8B4A8',
                          color: '#214F39',
                        }}
                      >
                        {fac.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-stone-900 group-hover:text-[#214F39] transition-colors">
                      {fac.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
                      {fac.description}
                    </p>
                  </div>

                  <div className="px-7 py-4 bg-[#FAF8F5] border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-semibold">
                    <span className="flex items-center gap-1.5 text-[#214F39]">
                      <CheckCircle2 className="w-4 h-4 text-[#214F39]" />
                      Fully Functional
                    </span>
                    <span className="text-[11px] text-stone-400">Campus Amenity</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Campus Visit CTA */}
      <section className="py-16 bg-[#214F39] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Visit Our Campus in Person
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
            We welcome parents and students for guided school tours during campus working hours (Monday to Saturday, 08:00 AM – 02:30 PM).
          </p>
          <div className="pt-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md"
              style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
            >
              <span>Get Campus Directions & Contact</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
