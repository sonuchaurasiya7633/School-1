'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UserRole } from '@/types';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Award,
  BookCheck,
  Video,
  UserCheck,
  Menu,
  Sparkles,
} from 'lucide-react';

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  allowedRoles?: UserRole[];
  onRefresh?: () => void;
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  title,
  subtitle,
  allowedRoles,
  onRefresh,
  children,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        if (allowedRoles?.includes('admin')) {
          router.push('/admin/login');
        } else {
          router.push('/login');
        }
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'admin') router.push('/admin/dashboard');
        else if (user.role === 'teacher') router.push('/teacher/dashboard');
        else if (user.role === 'student') router.push('/student/dashboard');
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">SUCCESS POINT SCHOOL</h3>
            <p className="text-xs text-slate-400 mt-1">Authenticating secure session...</p>
          </div>
        </div>
      </div>
    );
  }

  // Quick mobile navigation dock items based on role (matching the reference mobile app UI)
  const mobileNavItems =
    user.role === 'admin'
      ? [
          { name: 'Home', href: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Students', href: '/admin/students', icon: GraduationCap },
          { name: 'Faculty', href: '/admin/teachers', icon: UserCheck },
          { name: 'Classes', href: '/admin/classes', icon: BookOpen },
        ]
      : user.role === 'teacher'
      ? [
          { name: 'Home', href: '/teacher/dashboard', icon: LayoutDashboard },
          { name: 'Attendance', href: '/teacher/attendance', icon: CalendarCheck },
          { name: 'Homework', href: '/teacher/homework', icon: BookCheck },
          { name: 'Lectures', href: '/teacher/lectures', icon: Video },
        ]
      : [
          { name: 'Home', href: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Homework', href: '/student/homework', icon: BookCheck },
          { name: 'Lectures', href: '/student/lectures', icon: Video },
          { name: 'Results', href: '/student/results', icon: Award },
        ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#faf8f5] via-[#f1f5f9] to-[#f5f3ff] font-sans antialiased text-slate-800 overflow-hidden relative selection:bg-emerald-600 selection:text-white">
      {/* Ambient background soft glowing orbs (like in reference images) */}
      <div className="pointer-events-none fixed -top-32 -right-32 w-96 h-96 bg-purple-200/35 rounded-full blur-3xl opacity-70" />
      <div className="pointer-events-none fixed top-1/3 -left-32 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl opacity-60" />
      <div className="pointer-events-none fixed -bottom-32 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl opacity-60" />

      {/* Desktop Sidebar (w-64) */}
      <div className="hidden md:flex md:shrink-0 h-full w-64 relative z-20">
        <Sidebar />
      </div>

      {/* Mobile Drawer with Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-950 z-10 shadow-2xl transform transition-transform duration-300">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onRefresh={onRefresh}
        />
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 scroll-smooth pb-28 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>

        {/* Floating Mobile Dock Bar (like in all 3 reference images) */}
        <div className="md:hidden fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto pointer-events-none">
          <nav className="pointer-events-auto bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-full px-2.5 py-1.5 flex items-center justify-around">
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-bold mt-0.5 tracking-tight">{item.name}</span>
                </Link>
              );
            })}

            {/* Menu Drawer Toggle Pill */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-full text-slate-500 hover:text-slate-900 transition-all"
              aria-label="Open full menu"
            >
              <Menu className="w-4 h-4" />
              <span className="text-[10px] font-bold mt-0.5 tracking-tight">Menu</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

