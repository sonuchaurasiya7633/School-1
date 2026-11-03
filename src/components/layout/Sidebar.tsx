'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Award,
  Calendar,
  Bell,
  Settings,
  BookCheck,
  UserCheck,
  LogOut,
  ShieldCheck,
  Video,
  ChevronRight,
  ExternalLink,
  Globe,
  FileText,
  CalendarDays,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const adminNav = [
    { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Website CMS', href: '/admin/website', icon: Globe },
    { name: 'Faculty Directory', href: '/admin/faculty', icon: UserCheck },
    { name: 'Admission Leads', href: '/admin/inquiries', icon: FileText },
    { name: 'Students Directory', href: '/admin/students', icon: GraduationCap },
    { name: 'Faculty & Teachers', href: '/admin/teachers', icon: Users },
    { name: 'Classes & Subjects', href: '/admin/classes', icon: BookOpen },
    { name: 'Daily Attendance', href: '/admin/attendance', icon: CalendarCheck },
    { name: 'Fee Collection', href: '/admin/fees', icon: CreditCard },
    { name: 'Exams & Marksheets', href: '/admin/exams', icon: Award },
    { name: 'Class Timetable', href: '/admin/timetable', icon: Calendar },
    { name: 'School Calendar', href: '/admin/calendar', icon: CalendarDays },
    { name: 'School Notices', href: '/admin/notices', icon: Bell },
    { name: 'School Settings', href: '/admin/settings', icon: Settings },
  ];

  const teacherNav = [
    { name: 'Overview', href: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Assigned Students', href: '/teacher/students', icon: GraduationCap },
    { name: 'Daily Attendance', href: '/teacher/attendance', icon: CalendarCheck },
    { name: 'Homework & Tasks', href: '/teacher/homework', icon: BookCheck },
    { name: 'Video Lectures', href: '/teacher/lectures', icon: Video },
    { name: 'Exams & Marks', href: '/teacher/marks', icon: Award },
    { name: 'My Schedule', href: '/teacher/timetable', icon: Calendar },
    { name: 'Staff Notices', href: '/teacher/notices', icon: Bell },
    { name: 'Faculty Profile', href: '/teacher/profile', icon: UserCheck },
  ];

  const studentNav = [
    { name: 'Student Overview', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Academic Profile', href: '/student/profile', icon: UserCheck },
    { name: 'Attendance Record', href: '/student/attendance', icon: CalendarCheck },
    { name: 'Homework & Tasks', href: '/student/homework', icon: BookCheck },
    { name: 'Video Lectures', href: '/student/lectures', icon: Video },
    { name: 'Exams & Results', href: '/student/results', icon: Award },
    { name: 'Fee Receipts', href: '/student/fees', icon: CreditCard },
    { name: 'Class Schedule', href: '/student/timetable', icon: Calendar },
  ];

  const navItems =
    user?.role === 'admin'
      ? adminNav
      : user?.role === 'teacher'
      ? teacherNav
      : studentNav;

  const roleLabel =
    user?.role === 'admin'
      ? 'Super Admin'
      : user?.role === 'teacher'
      ? 'Faculty Teacher'
      : 'Student Portal';

  const roleBadgeStyle =
    user?.role === 'admin'
      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      : user?.role === 'teacher'
      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

  return (
    <aside className="w-64 max-w-full bg-slate-950 text-slate-300 flex flex-col h-full border-r border-slate-800/80 shadow-2xl relative select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3.5">
        <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-white p-1 shrink-0 shadow-lg border border-white/20">
          <Image
            src="/images/logo.jpeg"
            alt="Success Point School"
            width={44}
            height={44}
            className="object-contain w-full h-full"
            priority
          />
        </div>
        <div className="min-w-0">
          <h1 className="font-black text-sm tracking-tight text-white leading-tight truncate">
            SUCCESS POINT
          </h1>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1 ${roleBadgeStyle}`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{roleLabel}</span>
          </span>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Navigation Menu
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
            </Link>
          );
        })}

        {/* Quick Return to Public Website */}
        <div className="pt-4 mt-3 border-t border-slate-800/60">
          <Link
            href="/"
            onClick={onCloseMobile}
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-emerald-300 hover:bg-slate-900/60 transition"
          >
            <span>School Home Page</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </nav>

      {/* User Info & Profile Bar */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/70 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xs uppercase shadow-md shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name ? user.name.charAt(0) : 'U'}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {user?.name || 'User Account'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                {user?.userId || user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            title="Log Out of Session"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 shrink-0"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
