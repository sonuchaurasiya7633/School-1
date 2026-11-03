'use client';

import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'emerald' | 'blue' | 'amber' | 'rose' | 'purple' | 'indigo' | 'slate';
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'emerald',
  trend,
  trendDirection = 'up',
  badge,
}) => {
  const colorMap = {
    emerald: {
      gradient: 'from-emerald-500/15 via-teal-500/10 to-transparent',
      border: 'border-white/90 hover:border-emerald-300',
      iconBox: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/25',
      glow: 'hover:shadow-[0_16px_40px_rgba(16,185,129,0.12)]',
      accent: 'text-emerald-600',
      tagBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    },
    blue: {
      gradient: 'from-blue-500/15 via-indigo-500/10 to-transparent',
      border: 'border-white/90 hover:border-blue-300',
      iconBox: 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-600/25',
      glow: 'hover:shadow-[0_16px_40px_rgba(59,130,246,0.12)]',
      accent: 'text-blue-600',
      tagBg: 'bg-blue-50 text-blue-800 border-blue-200/80',
    },
    amber: {
      gradient: 'from-amber-500/15 via-orange-500/10 to-transparent',
      border: 'border-white/90 hover:border-amber-300',
      iconBox: 'bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-md shadow-amber-500/25',
      glow: 'hover:shadow-[0_16px_40px_rgba(245,158,11,0.12)]',
      accent: 'text-amber-600',
      tagBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
    },
    rose: {
      gradient: 'from-rose-500/15 via-pink-500/10 to-transparent',
      border: 'border-white/90 hover:border-rose-300',
      iconBox: 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25',
      glow: 'hover:shadow-[0_16px_40px_rgba(244,63,94,0.12)]',
      accent: 'text-rose-600',
      tagBg: 'bg-rose-50 text-rose-800 border-rose-200/80',
    },
    purple: {
      gradient: 'from-purple-500/15 via-fuchsia-500/10 to-transparent',
      border: 'border-white/90 hover:border-purple-300',
      iconBox: 'bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white shadow-md shadow-purple-600/25',
      glow: 'hover:shadow-[0_16px_40px_rgba(168,85,247,0.12)]',
      accent: 'text-purple-600',
      tagBg: 'bg-purple-50 text-purple-800 border-purple-200/80',
    },
    indigo: {
      gradient: 'from-indigo-500/15 via-violet-500/10 to-transparent',
      border: 'border-white/90 hover:border-indigo-300',
      iconBox: 'bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-600/25',
      glow: 'hover:shadow-[0_16px_40px_rgba(99,102,241,0.12)]',
      accent: 'text-indigo-600',
      tagBg: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
    },
    slate: {
      gradient: 'from-slate-500/15 via-slate-400/10 to-transparent',
      border: 'border-white/90 hover:border-slate-300',
      iconBox: 'bg-gradient-to-tr from-slate-700 to-slate-600 text-white shadow-md shadow-slate-700/25',
      glow: 'hover:shadow-[0_16px_40px_rgba(100,116,139,0.12)]',
      accent: 'text-slate-700',
      tagBg: 'bg-slate-100 text-slate-800 border-slate-200',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={`group relative bg-white/85 backdrop-blur-xl rounded-[28px] sm:rounded-[30px] p-5 sm:p-6 border ${scheme.border} shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${scheme.glow} transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between`}
    >
      {/* Subtle ambient light gradient in top corner */}
      <div
        className={`absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-bl ${scheme.gradient} rounded-full blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`}
      />

      <div>
        <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${scheme.iconBox}`}
          >
            <Icon className="w-6 h-6 drop-shadow-xs" />
          </div>

          <div className="flex items-center gap-1.5">
            {badge && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${scheme.tagBg}`}>
                {badge}
              </span>
            )}
            <div className="w-7 h-7 rounded-full bg-slate-100/80 group-hover:bg-slate-900 group-hover:text-white transition-colors flex items-center justify-center text-slate-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block truncate">
            {title}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
              {value}
            </h3>
            {trend && (
              <span
                className={`inline-flex items-center text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  trendDirection === 'up'
                    ? 'text-emerald-700 bg-emerald-100/80'
                    : trendDirection === 'down'
                    ? 'text-rose-700 bg-rose-100/80'
                    : 'text-slate-600 bg-slate-100'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>

      {subtitle && (
        <div className="relative z-10 mt-3 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span className="truncate">{subtitle}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-1" />
        </div>
      )}
    </div>
  );
};
