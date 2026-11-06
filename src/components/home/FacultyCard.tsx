'use client';

import React from 'react';
import { FacultyMember } from '@/data/facultyData';
import { GraduationCap, Building2, Award, User, Sparkles, BookOpen } from 'lucide-react';

interface FacultyCardProps {
  member: FacultyMember;
}

export default function FacultyCard({ member }: FacultyCardProps) {
  // Extract initials for the avatar if needed
  const initials = member.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className="group relative flex flex-col justify-between h-full glass-panel glass-card-hover rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Top Accent Gradient Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#214F39] via-[#E8B4A8] to-[#214F39] group-hover:h-2 transition-all duration-300" />

      {/* Card Header & Avatar (Ref: Circular Glow Avatar) */}
      <div className="p-6 pb-4 flex flex-col items-center text-center">
        {/* Profile Photo Placeholder with Glowing Ring */}
        <div className="relative mb-4">
          <div className="absolute -inset-1 rounded-full bg-[#E8B4A8]/40 blur-sm group-hover:blur-md transition-all duration-300" />
          <div
            className="w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center p-1 border-2 transition-transform duration-300 group-hover:scale-105 relative z-10 bg-white dark:bg-stone-800 border-[#E8B4A8]"
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-[#214F39] dark:text-emerald-400 relative overflow-hidden bg-stone-50 dark:bg-stone-900"
              aria-label={`Profile for ${member.name}`}
            >
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={`${member.name} - ${member.qualification || 'Faculty'}, Success Point School`}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <User className="w-10 h-10 text-[#214F39]/70 dark:text-emerald-400/80 group-hover:text-[#214F39] transition-colors" strokeWidth={1.5} />
              )}
            </div>
          </div>

          {/* Academic Verification Badge */}
          <span
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white dark:border-stone-800 shadow-xs z-20 bg-[#214F39] text-white"
            title="Verified Faculty Member"
          >
            <Sparkles className="w-3 h-3 text-[#E8B4A8]" />
          </span>
        </div>

        {/* Faculty Member Name */}
        <h3
          className="font-extrabold text-base sm:text-lg tracking-tight transition-colors line-clamp-2 text-stone-900 dark:text-stone-100 group-hover:text-[#214F39] dark:group-hover:text-emerald-400"
        >
          {member.name}
        </h3>

        {/* Status Pill Badge (Ref: Image 3 Pill Badges) */}
        <span
          className="inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Verified Faculty
        </span>
      </div>

      {/* Card Details: Qualification & University */}
      <div className="px-6 pb-6 pt-2 flex-1 flex flex-col justify-between space-y-3.5 border-t border-stone-100 dark:border-stone-800">
        <div className="space-y-3">
          {/* Educational Qualification */}
          <div className="flex items-start gap-2.5 text-left">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{
                backgroundColor: 'rgba(33, 79, 57, 0.08)',
                color: '#214F39',
              }}
            >
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Qualification
              </span>
              <p className="text-xs sm:text-[13px] font-semibold text-stone-900 leading-snug">
                {member.qualification}
              </p>
            </div>
          </div>

          {/* University Details (Where available) */}
          {member.university && (
            <div className="flex items-start gap-2.5 text-left">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: 'rgba(232, 180, 168, 0.25)',
                  color: '#214F39',
                }}
              >
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  University / Board
                </span>
                <p className="text-xs text-stone-800 font-medium leading-snug">
                  {member.university}
                </p>
              </div>
            </div>
          )}

          {/* Additional Certifications / Status (Where available) */}
          {member.additional && (
            <div className="flex items-start gap-2.5 text-left">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: '#FAF8F5',
                  color: '#214F39',
                  border: '1px solid #E8B4A8',
                }}
              >
                <Award className="w-4 h-4 text-[#214F39]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Additional
                </span>
                <span
                  className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: 'rgba(232, 180, 168, 0.2)',
                    color: '#214F39',
                  }}
                >
                  {member.additional}
                </span>
              </div>
            </div>
          )}
          {/* Assigned Classes & Subjects (Where available) */}
          {member.assignedClasses && member.assignedClasses.length > 0 && (
            <div className="flex items-start gap-2.5 text-left pt-2 border-t border-stone-100">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: 'rgba(33, 79, 57, 0.08)',
                  color: '#214F39',
                }}
              >
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Assigned Classes
                </span>
                <div className="flex flex-wrap gap-1">
                  {member.assignedClasses.map((ac: any, idx: number) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold"
                    >
                      {ac.class?.name || 'Class'} (Sec {ac.section || 'A'}) — {ac.subject?.name || 'Subject'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Bar */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1.5 font-medium">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#214F39' }}
            />
            Academic Staff
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded"
            style={{
              backgroundColor: '#FAF8F5',
              color: '#214F39',
            }}
          >
            Verified
          </span>
        </div>
      </div>
    </div>
  );
}
