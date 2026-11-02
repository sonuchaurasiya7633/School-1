'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { FACULTY_MEMBERS, FACULTY_FILTERS, FacultyMember } from '@/data/facultyData';
import FacultyCard from './FacultyCard';
import { Search, X, Users, BookOpen, GraduationCap, CheckCircle2, RotateCcw } from 'lucide-react';

interface FacultySectionProps {
  id?: string;
  className?: string;
}

export default function FacultySection({ id = 'faculty', className = '' }: FacultySectionProps) {
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(FACULTY_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/public/faculty')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.faculty?.length) {
          const mapped: FacultyMember[] = data.faculty.map((item: any) => ({
            id: item._id || item.id,
            name: item.name,
            qualification: item.qualification,
            university: item.university || '',
            additional: item.additional || '',
            tags: item.category ? [item.category.toLowerCase()] : ['general'],
          }));
          setFacultyList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Filtered & searched faculty members
  const filteredFaculty = useMemo(() => {
    return facultyList.filter((member) => {
      // 1. Category Filter matching
      let matchesFilter = true;
      if (selectedFilter !== 'all') {
        const textToMatch = `${member.qualification} ${member.additional || ''} ${member.tags?.join(' ') || ''}`.toLowerCase();
        if (selectedFilter === 'post-graduate') {
          matchesFilter = textToMatch.includes('m.sc') || textToMatch.includes('m.com') || textToMatch.includes('post-graduate');
        } else if (selectedFilter === 'science') {
          matchesFilter = textToMatch.includes('b.sc') || textToMatch.includes('m.sc') || textToMatch.includes('botany') || textToMatch.includes('zoology') || textToMatch.includes('science');
        } else if (selectedFilter === 'arts') {
          matchesFilter = textToMatch.includes('b.a') || textToMatch.includes('m.com') || textToMatch.includes('political') || textToMatch.includes('hindi') || textToMatch.includes('english') || textToMatch.includes('arts') || textToMatch.includes('commerce');
        } else if (selectedFilter === 'training') {
          matchesFilter = textToMatch.includes('b.ed') || textToMatch.includes('d.el.ed') || textToMatch.includes('n.t.t') || textToMatch.includes('training');
        } else {
          matchesFilter = !!member.tags?.includes(selectedFilter);
        }
      }

      // 2. Search Query matching (name, qualification, university, additional)
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inName = member.name.toLowerCase().includes(query);
        const inQual = member.qualification.toLowerCase().includes(query);
        const inUniv = member.university ? member.university.toLowerCase().includes(query) : false;
        const inAdd = member.additional ? member.additional.toLowerCase().includes(query) : false;
        matchesSearch = inName || inQual || inUniv || inAdd;
      }

      return matchesFilter && matchesSearch;
    });
  }, [facultyList, searchQuery, selectedFilter]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedFilter('all');
  };

  return (
    <section
      id={id}
      aria-labelledby="faculty-heading"
      className={`py-20 relative transition-colors ${className}`}
      style={{
        backgroundColor: '#FAF8F5', // Light Cream
      }}
    >
      {/* Decorative Subtle Background Accents */}
      <div
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E8B4A8] to-transparent opacity-60"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: '#E8B4A8' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Eyebrow Pill */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-xs"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#214F39',
              border: '1px solid #E8B4A8',
            }}
          >
            <Users className="w-3.5 h-3.5 text-[#214F39]" />
            <span>Our Teaching Team</span>
          </div>

          {/* Section Title */}
          <h2
            id="faculty-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
            style={{ color: '#214F39' }}
          >
            Meet Our Qualified Faculty
          </h2>

          {/* Section Subtitle */}
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed pt-1">
            Our dedicated and qualified educators are committed to providing quality education,
            guidance, and a supportive learning environment for every student.
          </p>

          {/* Quick Academic Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-stone-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#214F39]" />
              {facultyList.length} Qualified Educators
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#214F39]" />
              B.Ed, D.El.Ed & N.T.T Certified
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#214F39]" />
              Science, Arts & Commerce Faculty
            </span>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="mt-12 bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4 text-[#214F39]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search faculty by name, qualification, or university..."
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#214F39] focus:border-[#214F39] transition text-stone-900 placeholder:text-stone-400 bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results Count Badge */}
            <div className="flex items-center justify-between md:justify-end gap-2 text-xs font-semibold text-stone-600 shrink-0">
              <span
                className="px-3 py-1 rounded-lg"
                style={{
                  backgroundColor: '#FAF8F5',
                  color: '#214F39',
                  border: '1px solid rgba(232, 180, 168, 0.6)',
                }}
              >
                Showing {filteredFaculty.length} of {facultyList.length} Faculty Members
              </span>

              {(searchQuery || selectedFilter !== 'all') && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-[#214F39] underline font-medium transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Qualification Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs font-medium">
            <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider shrink-0 mr-1">
              Filter:
            </span>
            {FACULTY_FILTERS.map((filter) => {
              const isActive = selectedFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 shrink-0 font-medium ${
                    isActive
                      ? 'shadow-xs font-bold'
                      : 'hover:bg-stone-100 text-stone-600'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: '#214F39',
                          color: '#FFFFFF',
                        }
                      : {
                          backgroundColor: '#FAF8F5',
                          border: '1px solid #E8B4A8',
                        }
                  }
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* RESPONSIVE FACULTY GRID (Desktop: 4, Tablet: 2, Mobile: 1) */}
        <div className="mt-10">
          {filteredFaculty.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFaculty.map((member) => (
                <FacultyCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            /* Empty State when no results match search/filter */
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4">
              <div
                className="w-14 h-14 mx-auto rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: '#FAF8F5',
                  color: '#214F39',
                  border: '1px solid #E8B4A8',
                }}
              >
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-stone-800">
                No Faculty Members Found
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                We couldn&apos;t find any faculty members matching &quot;{searchQuery}&quot;. Please check the spelling or clear the filter.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-bold rounded-xl transition"
                style={{
                  backgroundColor: '#214F39',
                  color: '#FFFFFF',
                }}
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
