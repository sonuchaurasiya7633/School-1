'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, Lock, Mail, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

function StudentLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(identifier, password, 'student');
      if (result.success) {
        if (result.user?.role !== 'student') {
          setError('Access Denied: This login portal is strictly for Students.');
        } else {
          router.push('/student/dashboard');
        }
      } else {
        setError(result.message || 'Login failed. Please verify your Student ID and password.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow-2xl rounded-2xl sm:rounded-3xl border border-slate-200">
      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-xs text-emerald-950 uppercase tracking-wide">
            Student Dashboard Access
          </h3>
          <p className="text-[11px] text-emerald-700">
            Attendance, Video Lectures, Homework &amp; Results
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Student ID or Registered Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. STD001 or student@successpoint.edu.in"
              className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#214F39] hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Opening Student Dashboard...</span>
            </>
          ) : (
            <>
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400">
          Forgot your Student ID or Password? Please contact the school reception desk.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-6 sm:py-10 px-3.5 sm:px-6 lg:px-8 selection:bg-emerald-500 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4 flex items-center justify-between text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to School Website</span>
        </Link>
        <span className="text-slate-500 text-[11px]">Academic Year 2026-27</span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block relative w-20 h-20 rounded-2xl bg-white p-1.5 shadow-xl mb-3 hover:scale-105 transition-transform">
          <Image
            src="/images/logo.jpeg"
            alt="Success Point School"
            width={80}
            height={80}
            className="object-contain w-full h-full"
            priority
          />
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">SUCCESS POINT SCHOOL</h2>
        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mt-0.5">
          Student Portal
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Access your digital classroom, daily homework, and examination results
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense
          fallback={
            <div className="bg-white py-12 text-center rounded-3xl shadow-xl">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 mt-2">Loading Student Dashboard...</p>
            </div>
          }
        >
          <StudentLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
