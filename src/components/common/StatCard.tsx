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
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBox: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25',
      glow: 'group-hover:shadow-emerald-500/10',
      accent: 'text-emerald-600',
    },
    blue: {
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBox: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25',
      glow: 'group-hover:shadow-blue-500/10',
      accent: 'text-blue-600',
    },
    amber: {
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBox: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25',
      glow: 'group-hover:shadow-amber-500/10',
      accent: 'text-amber-600',
    },
    rose: {
      gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBox: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25',
      glow: 'group-hover:shadow-rose-500/10',
      accent: 'text-rose-600',
    },
    purple: {
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBox: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25',
      glow: 'group-hover:shadow-purple-500/10',
      accent: 'text-purple-600',
    },
    indigo: {
      gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      iconBox: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25',
      glow: 'group-hover:shadow-indigo-500/10',
      accent: 'text-indigo-600',
    },
    slate: {
      gradient: 'from-slate-500/10 via-slate-500/5 to-transparent',
      border: 'border-slate-300 hover:border-slate-400',
      iconBox: 'bg-slate-100 text-slate-700 border border-slate-200',
      glow: 'group-hover:shadow-slate-500/10',
      accent: 'text-slate-700',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={`group relative bg-white rounded-2xl p-4 sm:p-6 border ${scheme.border} shadow-sm hover:shadow-xl ${scheme.glow} transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between`}
    >
      {/* Subtle background ambient gradient */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${scheme.gradient} rounded-bl-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`}
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
              {title}
            </span>
            {badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {badge}
              </span>
            )}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5 truncate">
            {value}
          </h3>
        </div>

        <div
          className={`p-3 rounded-2xl ${scheme.iconBox} shadow-xs group-hover:scale-110 transition-transform duration-300 shrink-0`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      <div className="relative z-10 mt-4 pt-3 border-t border-slate-100/90 flex items-center justify-between text-xs">
        {subtitle && (
          <p className="text-slate-500 text-[11px] font-medium truncate">{subtitle}</p>
        )}
        {trend && (
          <div
            className={`inline-flex items-center gap-1 font-bold text-[11px] ml-auto shrink-0 ${
              trendDirection === 'down' ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {trendDirection === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
            {trendDirection === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};
