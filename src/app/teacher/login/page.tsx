'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function TeacherLoginPage() {
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
      const result = await login(identifier, password);
      if (result.success) {
        if (result.user?.role !== 'teacher') {
          setError('Access Denied. Only registered Faculty & Teachers can access this portal.');
        } else {
          router.push('/teacher/dashboard');
        }
      } else {
        setError(result.message || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-[#13231a] to-stone-950 flex flex-col justify-center py-6 sm:py-12 px-3.5 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-emerald-600 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#E8B4A8]/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Top back link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 flex items-center justify-between text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to School Website</span>
        </Link>
      </div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block relative w-20 h-20 rounded-2xl bg-white p-1.5 shadow-2xl mb-4 border border-emerald-500/30">
          <Image
            src="/images/logo.jpeg"
            alt="Success Point School"
            width={80}
            height={80}
            className="object-contain w-full h-full"
            priority
          />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span>Educator &amp; Faculty Console</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Teacher Portal Login
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Secure attendance, lecture uploads, and homework grading console.
        </p>
      </div>

      {/* Card Form */}
      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-stone-900/90 backdrop-blur-xl py-6 sm:py-8 px-4 sm:px-10 shadow-2xl rounded-2xl sm:rounded-3xl border border-stone-800 relative">
          {error && (
            <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                Teacher ID or Registered Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. TCH001 or name@successpoint.edu.in"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm bg-stone-950/80 border border-stone-700 text-white placeholder-stone-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm bg-stone-950/80 border border-stone-700 text-white placeholder-stone-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#214F39] hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2 border border-emerald-500/30"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Faculty Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Teacher Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-6 pt-5 border-t border-stone-800 text-center">
            <p className="text-[11px] text-stone-400">
              Need account assistance? Contact school administrative office.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
