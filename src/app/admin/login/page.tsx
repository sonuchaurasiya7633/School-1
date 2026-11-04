'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Building,
} from 'lucide-react';

export default function AdminLoginPage() {
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
        if (result.user?.role !== 'admin') {
          setError('Access Denied. Only authorized Administrators can access this console.');
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        setError(result.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-6 sm:py-12 px-3.5 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-purple-600 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full" />

      {/* Top back link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 flex items-center justify-start text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to School Website</span>
        </Link>
      </div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block relative w-20 h-20 rounded-2xl bg-white p-1.5 shadow-2xl mb-4 border border-purple-500/30">
          <Image
            src="/images/logo.jpeg"
            alt="Success Point School"
            width={80}
            height={80}
            className="object-contain w-full h-full"
            priority
          />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Restricted Access Console</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Super Admin Console
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Authorized management login for Success Point School (S.P.S.)
        </p>
      </div>

      {/* Card Form */}
      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/90 backdrop-blur-xl py-6 sm:py-8 px-4 sm:px-10 shadow-2xl rounded-2xl sm:rounded-3xl border border-slate-800 relative">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email or ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter admin ID or email"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-purple-600/30 text-xs uppercase font-extrabold text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating Admin...</span>
                </>
              ) : (
                <>
                  <span>Unlock Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-[11px] text-slate-500">
            <p>Protected by Success Point School Enterprise Security</p>
          </div>
        </div>
      </div>
    </div>
  );
}
