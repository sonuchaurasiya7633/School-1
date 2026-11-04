'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Phone,
  Mail,
  ArrowRight,
  Menu,
  X,
  Home,
  Info,
  BookOpen,
  Award,
  Users,
  Camera,
  Bell,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  Clock,
  Sparkles,
  School,
  LogIn,
  Calendar,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import { usePublicThemeLanguage } from '@/context/PublicThemeLanguageContext';

interface PublicHeaderProps {
  activePage?: string;
}

export default function PublicHeader({ activePage }: PublicHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [settings, setSettings] = useState({
    schoolName: 'Success Point School',
    tagline: 'Best Education, Good Results.',
    phone: '+91 98765 43210',
    email: 'info@successpointschool.edu',
    announcement: 'Welcome to Success Point School — Admissions Open for Session 2026-2027',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileNavOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev) => ({
            ...prev,
            schoolName: data.settings.schoolName || prev.schoolName,
            tagline: data.settings.tagline || prev.tagline,
            phone: data.settings.phone || prev.phone,
            email: data.settings.email || prev.email,
            announcement: data.settings.announcement || prev.announcement,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const { theme, toggleTheme, language, toggleLanguage, t } = usePublicThemeLanguage();

  const navLinks = [
    { label: t('nav.home', 'Home'), href: '/', icon: Home },
    { label: t('nav.about', 'About Us'), href: '/about', icon: Info },
    { label: t('nav.academics', 'Academics'), href: '/academics', icon: BookOpen },
    { label: t('nav.admissions', 'Admissions'), href: '/admissions', icon: Award, badge: '2026-27' },
    { label: t('nav.faculty', 'Faculty & Team'), href: '/faculty', icon: Users },
    { label: t('nav.campus', 'Campus & Facilities'), href: '/gallery', icon: Camera },
    { label: t('nav.notices', 'Notice Board'), href: '/notices', icon: Bell },
    { label: t('nav.calendar', 'Calendar'), href: '/calendar', icon: Calendar, badge: '2027' },
    { label: t('nav.contact', 'Contact'), href: '/contact', icon: Phone },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md shadow-xs border-b border-stone-200 dark:border-stone-800 transition-colors">
        {/* MAIN NAVIGATION BAR */}
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* School Brand / Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0 mr-2">
              <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-white p-1 border-2 border-[#214F39]/20 shadow-xs group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo.jpeg"
                  alt="Success Point School"
                  width={52}
                  height={52}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <div className="min-w-0">
                <span
                  className="block font-black text-sm sm:text-lg md:text-xl tracking-tight transition truncate dark:text-emerald-400"
                  style={{ color: theme === 'dark' ? '#34d399' : '#214F39' }}
                >
                  {settings.schoolName.toUpperCase()}
                </span>
                <span className="block text-[9px] sm:text-[11px] font-bold text-stone-500 dark:text-stone-400 tracking-wider uppercase truncate">
                  {settings.tagline}
                </span>
              </div>
            </Link>

          {/* Desktop Navigation Links (XL Screens) */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-5 text-[13px] font-bold text-stone-600 dark:text-stone-300">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-1 transition-colors relative flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#214F39] dark:text-emerald-400 font-black'
                      : 'hover:text-[#214F39] dark:hover:text-emerald-300'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase"
                      style={{ backgroundColor: '#FAF8F5', color: '#214F39', border: '1px solid #E8B4A8' }}
                    >
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 inset-x-0 h-0.5 rounded-full"
                      style={{ backgroundColor: '#214F39' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden xl:flex items-center gap-2">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold hover:border-[#214F39] transition active:scale-95"
              title="Switch Language: English / हिन्दी"
            >
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className={language === 'en' ? 'text-[#214F39] dark:text-emerald-400 font-black' : 'text-stone-400'}>
                EN
              </span>
              <span className="text-stone-300 dark:text-stone-600">|</span>
              <span className={language === 'hi' ? 'text-[#214F39] dark:text-emerald-400 font-black' : 'text-stone-400'}>
                हिन्दी
              </span>
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:border-[#214F39] transition active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>

            {user ? (
              <Link
                href={
                  user.role === 'admin'
                    ? '/admin/dashboard'
                    : user.role === 'teacher'
                    ? '/teacher/dashboard'
                    : '/student/dashboard'
                }
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition hover:opacity-95"
                style={{ backgroundColor: '#214F39' }}
              >
                <span>{t('header.dashboard', 'Dashboard')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition hover:opacity-95"
                style={{ backgroundColor: '#214F39' }}
              >
                <LogIn className="w-3.5 h-3.5 text-[#E8B4A8]" />
                <span>{t('header.login', 'Portal Login')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Mobile Right Controls: Language + Theme + Hamburger Menu */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2">
            {/* Language Switcher Mobile */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold flex items-center gap-1 hover:border-[#214F39] transition"
              title="Toggle English / हिन्दी"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Dark / Light Mode Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:border-[#214F39] transition"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:text-[#214F39] transition shadow-2xs flex items-center gap-1.5"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-5 h-5" />
              <span className="text-xs font-bold hidden xs:inline">Menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>

      {/* 3. PREMIUM MOBILE SLIDE-OVER DRAWER (PORTALED DIRECTLY TO DOCUMENT.BODY TO PREVENT ANY CLIPPING/STACKING BUGS) */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[99999] overflow-hidden xl:hidden transition-all duration-300 ${
              mobileNavOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
            }`}
            aria-hidden={!mobileNavOpen}
          >
            {/* Backdrop Overlay */}
            <div
              className={`fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
                mobileNavOpen ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation overlay"
            />

            {/* Slide-out Drawer Panel */}
            <div
              className={`fixed inset-y-0 right-0 z-[100000] w-full max-w-[340px] sm:max-w-md h-full h-[100dvh] bg-[#FAF8F5] dark:bg-stone-900 shadow-2xl flex flex-col justify-between border-l border-stone-200 dark:border-stone-800 transform transition-transform duration-300 ease-in-out ${
                mobileNavOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{
                boxShadow: '-12px 0 40px -10px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Drawer Top Header */}
              <div className="p-4 sm:p-5 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 shadow-2xs">
                <Link
                  href="/"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-3 min-w-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-white p-1 border border-[#214F39]/20 shadow-xs overflow-hidden shrink-0">
                    <Image
                      src="/images/logo.jpeg"
                      alt="Success Point School"
                      width={40}
                      height={40}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <span
                      className="block font-black text-sm tracking-tight truncate dark:text-emerald-400"
                      style={{ color: theme === 'dark' ? '#34d399' : '#214F39' }}
                    >
                      {settings.schoolName}
                    </span>
                    <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider truncate">
                      {settings.tagline}
                    </span>
                  </div>
                </Link>

                {/* Close Button */}
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 flex items-center justify-center transition shrink-0 ml-2 shadow-2xs active:scale-95"
                  aria-label="Close drawer menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="p-4 sm:p-5 space-y-5 flex-1 overflow-y-auto overscroll-contain">
                {/* Mobile Quick Preference: Theme & Language */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      {language === 'en' ? 'Language:' : 'भाषा:'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={toggleLanguage}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:border-emerald-500 border border-stone-300 dark:border-stone-600 transition"
                    >
                      {language === 'en' ? 'Switch to हिन्दी' : 'Switch to English'}
                    </button>
                  </div>
                </div>
                {/* 1. PORTAL LOGIN SECTION (FEATURED PROMINENTLY INSIDE DRAWER) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                      <LogIn className="w-3.5 h-3.5 text-[#214F39]" />
                      <span>School Portals Login</span>
                    </span>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
                    >
                      Secure Access
                    </span>
                  </div>

                  {user ? (
                    <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white"
                          style={{ backgroundColor: '#214F39' }}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                          <p className="text-[10px] text-stone-500 capitalize">{user.role} Session Active</p>
                        </div>
                      </div>
                      <Link
                        href={
                          user.role === 'admin'
                            ? '/admin/dashboard'
                            : user.role === 'teacher'
                            ? '/teacher/dashboard'
                            : '/student/dashboard'
                        }
                        onClick={() => setMobileNavOpen(false)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition"
                        style={{ backgroundColor: '#214F39' }}
                      >
                        <span>Open My Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Student Login Tile */}
                      <Link
                        href="/login?role=student"
                        onClick={() => setMobileNavOpen(false)}
                        className="p-3.5 rounded-2xl bg-white border border-stone-200/90 hover:border-[#214F39]/50 shadow-2xs transition group flex flex-col justify-between"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                          style={{ backgroundColor: 'rgba(33, 79, 57, 0.08)', color: '#214F39' }}
                        >
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-stone-900 group-hover:text-[#214F39] transition">
                            Student Login
                          </p>
                          <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                            Lectures & Tasks
                          </p>
                        </div>
                      </Link>

                      {/* Teacher Login Tile */}
                      <Link
                        href="/login?role=teacher"
                        onClick={() => setMobileNavOpen(false)}
                        className="p-3.5 rounded-2xl bg-white border border-stone-200/90 hover:border-[#214F39]/50 shadow-2xs transition group flex flex-col justify-between"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                          style={{ backgroundColor: 'rgba(232, 180, 168, 0.25)', color: '#214F39' }}
                        >
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-stone-900 group-hover:text-[#214F39] transition">
                            Teacher Login
                          </p>
                          <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                            Homework & Marks
                          </p>
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Single Unified Login Button */}
                  <Link
                    href="/login"
                    onClick={() => setMobileNavOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-95"
                    style={{ backgroundColor: '#214F39' }}
                  >
                    <span>General Portal Sign-In</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E8B4A8]" />
                  </Link>
                </div>

                {/* 2. MAIN INSTITUTIONAL NAVIGATION LINKS */}
                <div className="space-y-2">
                  <span className="block px-1 text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
                    Explore School Pages
                  </span>

                  <div className="space-y-1.5">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileNavOpen(false)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                            isActive
                              ? 'text-white shadow-sm'
                              : 'bg-white text-stone-700 hover:text-[#214F39] border border-stone-200/80 hover:bg-stone-50'
                          }`}
                          style={
                            isActive
                              ? { backgroundColor: '#214F39' }
                              : {}
                          }
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={`w-4 h-4 ${
                                isActive ? 'text-[#E8B4A8]' : 'text-[#214F39]'
                              }`}
                            />
                            <span>{link.label}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {link.badge && (
                              <span
                                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                                  isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-[#FAF8F5] text-[#214F39] border border-[#E8B4A8]'
                                }`}
                              >
                                {link.badge}
                              </span>
                            )}
                            <ChevronRight
                              className={`w-3.5 h-3.5 ${
                                isActive ? 'text-white/80' : 'text-stone-400'
                              }`}
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 3. SUPER ADMIN CONSOLE LINK */}
                <div className="pt-2">
                  <Link
                    href="/admin"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-purple-950/20 border border-purple-900/30 text-purple-900 hover:bg-purple-900/30 transition text-xs font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      <span>Super Admin Console</span>
                    </div>
                    <span className="text-[10px] text-purple-600 font-mono">/admin</span>
                  </Link>
                </div>
              </div>

              {/* Drawer Bottom Footer Contact Bar */}
              <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-2.5 text-xs text-stone-600 shrink-0">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#214F39] shrink-0" />
                  <a href={`tel:${settings.phone}`} className="font-semibold text-stone-800 hover:underline">
                    {settings.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#214F39] shrink-0" />
                  <span className="truncate">{settings.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                  <Clock className="w-3 h-3 text-[#214F39] shrink-0" />
                  <span>Mon-Sat: 08:00 AM – 02:30 PM</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
