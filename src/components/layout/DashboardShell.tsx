'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UserRole } from '@/types';

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

  return (
    <div className="flex h-screen bg-slate-100/90 font-sans antialiased text-slate-800 overflow-hidden">
      {/* Desktop Sidebar (w-64) */}
      <div className="hidden md:flex md:shrink-0 h-full w-64">
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
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onRefresh={onRefresh}
        />
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6 pb-12">{children}</div>
        </main>
      </div>
    </div>
  );
};
