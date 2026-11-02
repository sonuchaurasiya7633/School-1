'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Menu, Calendar, RefreshCw, Sparkles } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu: () => void;
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onOpenMobileMenu, onRefresh }) => {
  const { user } = useAuth();

  const roleTheme =
    user?.role === 'admin'
      ? { text: 'text-purple-600', bg: 'bg-purple-500/10 border-purple-500/20' }
      : user?.role === 'teacher'
      ? { text: 'text-blue-600', bg: 'bg-blue-500/10 border-blue-500/20' }
      : { text: 'text-emerald-600', bg: 'bg-emerald-500/10 border-emerald-500/20' };

  return (
    <header className="h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Title & Mobile Hamburger */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition border border-slate-200"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Actions & User Badge */}
      <div className="flex items-center gap-3 shrink-0">
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh Live Data"
            className="p-2 sm:px-3 sm:py-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 border border-slate-200/80 flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:inline">Sync Data</span>
          </button>
        )}

        {/* Academic Session Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 text-slate-700 rounded-xl text-xs font-bold border border-slate-200/80">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Session 2026-27</span>
        </div>

        {/* User Role Tag */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-black text-slate-900 leading-none truncate max-w-[140px]">
              {user?.name}
            </span>
            <span
              className={`inline-block text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full border mt-1 ${roleTheme.text} ${roleTheme.bg}`}
            >
              {user?.role}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-sm shadow-md ring-2 ring-white">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
