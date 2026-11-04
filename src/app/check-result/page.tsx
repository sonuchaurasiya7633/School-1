'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, GraduationCap } from 'lucide-react';

export default function CheckResultPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to Student Portal Login
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 1800);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 max-w-md w-full text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Student Privacy Protected
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-3">
            Private Student Marksheet
          </h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Examination results and term report cards are strictly confidential and accessible exclusively within each student&apos;s verified account dashboard.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 transition shadow-lg"
            style={{ backgroundColor: '#E8B4A8' }}
          >
            <GraduationCap className="w-4 h-4 text-slate-950" />
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </Link>
        </div>

        <p className="text-[11px] text-slate-500">
          Redirecting automatically in 2 seconds...
        </p>
      </div>
    </div>
  );
}
