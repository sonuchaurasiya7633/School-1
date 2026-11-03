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
    <header className="h-20 bg-white/80 backdrop-blur-2xl border-b border-white/60 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
      {/* Title & Mobile Hamburger */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2.5 text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white rounded-2xl transition border border-slate-200/80 shadow-2xs"
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
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh Live Data"
            className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:text-emerald-700 bg-white/80 hover:bg-white rounded-full transition-all duration-200 border border-slate-200/80 shadow-2xs flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sync</span>
          </button>
        )}

        {/* Academic Session Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white/80 text-slate-700 rounded-full text-xs font-bold border border-slate-200/80 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>Session 2026-27</span>
        </div>

        {/* User Capsule Pill (like in reference images) */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200/80">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-black text-slate-900 leading-none truncate max-w-[140px]">
              {user?.name}
            </span>
            <span
              className={`inline-block text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full border mt-1 shadow-2xs ${roleTheme.text} ${roleTheme.bg}`}
            >
              {user?.role}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-sm shadow-md ring-2 ring-white/90 shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name ? user.name.charAt(0) : 'U'}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
