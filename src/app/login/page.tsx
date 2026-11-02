'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Users, GraduationCap, Lock, Mail, AlertCircle, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';

function LoginFormContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role');

  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [activeRole, setActiveRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialRole === 'teacher') {
      setActiveRole('teacher');
    } else if (initialRole === 'student') {
      setActiveRole('student');
    }
  }, [initialRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(identifier, password);
      if (!result.success) {
        setError(result.message || 'Login failed. Please verify credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (role: 'student' | 'teacher') => {
    setActiveRole(role);
    setError('');
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200">
      {/* Student vs Teacher Switcher */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Select Your Login Role:
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => selectRole('student')}
            className={`py-3 px-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
              activeRole === 'student'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
              activeRole === 'student' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xs">Student Portal</span>
            <span className="text-[10px] text-slate-500">Classes, Tasks & Results</span>
          </button>

          <button
            type="button"
            onClick={() => selectRole('teacher')}
            className={`py-3 px-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
              activeRole === 'teacher'
                ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
              activeRole === 'teacher' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              <Users className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xs">Teacher Portal</span>
            <span className="text-[10px] text-slate-500">Lectures, Marks & Tasks</span>
          </button>
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
            {activeRole === 'student' ? 'Student Email / ID (e.g. STD001)' : 'Teacher Email / ID (e.g. TCH001)'}
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
              placeholder={activeRole === 'student' ? 'Enter Student ID or Email' : 'Enter Teacher ID or Email'}
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
          className={`w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-md text-xs font-extrabold uppercase tracking-wider text-white transition disabled:opacity-50 ${
            activeRole === 'student'
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In as {activeRole === 'student' ? 'Student' : 'Faculty Teacher'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 relative overflow-hidden">
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
          Student & Teacher Portal
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Access your digital classroom, daily homework, and recorded video lectures
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense
          fallback={
            <div className="bg-white py-12 text-center rounded-3xl shadow-xl">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500 mt-2">Loading authentication portal...</p>
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}
