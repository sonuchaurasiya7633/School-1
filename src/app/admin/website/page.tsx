'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  GraduationCap,
  Bell,
  School,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { authFetch } from '@/lib/api';
import { AvatarUploader } from '@/components/common/AvatarUploader';

export default function AdminWebsiteCMSPage() {
  const [formData, setFormData] = useState({
    schoolName: 'Success Point School',
    tagline: 'Best Education, Good Results.',
    phone: '+91 98765 43210',
    email: 'info@successpointschool.edu',
    address: 'Success Point Campus, Knowledge City, Pin - 800001',
    announcement: 'Welcome to Success Point School — Admissions Open for Session 2026-2027',
    admissionsOpen: true,
    heroTitle: 'Building Knowledge, Character & Academic Brilliance',
    heroSubtitle:
      'Welcome to the digital learning campus of Success Point School (S.P.S.). We provide state-of-the-art classroom education, recorded video lectures, continuous evaluation, and dedicated student care.',
    directorName: 'Subodh Kumar Sharma',
    directorDesignation: 'Director',
    directorQualifications: 'M.A. | D.El.Ed | B.Ed | CTET | STET',
    directorMessage:
      'Dedicated to fostering an atmosphere of intellectual curiosity, moral discipline, and comprehensive educational development for every student at Success Point School.',
    directorImage: '/images/director.jpg',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    authFetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setFormData((prev) => ({
            ...prev,
            ...data.settings,
          }));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Website content and Director details updated successfully!');
      } else {
        setErrorMsg(data.message || 'Failed to update website content.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell title="Website CMS & Content Manager">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Website Manager
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Public School Website & Director CMS
            </h1>
            <p className="text-xs text-slate-400">
              Update the Director profile, announcement ticker, hero banner, and contact information displayed across the public pages.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20 flex items-center gap-1.5"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: Director Profile Details */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Director Profile & Leadership</h2>
                <p className="text-xs text-slate-400">
                  Configure the Director information displayed prominently in the Director Section.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Director Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.directorName}
                  onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Designation / Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.directorDesignation}
                  onChange={(e) =>
                    setFormData({ ...formData, directorDesignation: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Educational Qualifications (Single Line Display)
              </label>
              <input
                type="text"
                required
                value={formData.directorQualifications}
                onChange={(e) =>
                  setFormData({ ...formData, directorQualifications: e.target.value })
                }
                placeholder="M.A. | D.El.Ed | B.Ed | CTET | STET"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Director Leadership Statement / Message
              </label>
              <textarea
                rows={3}
                required
                value={formData.directorMessage}
                onChange={(e) => setFormData({ ...formData, directorMessage: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Director Official Portrait / Photo
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800 mb-3">
                <AvatarUploader
                  currentAvatar={formData.directorImage}
                  name={formData.directorName || 'Director'}
                  targetUserId="director"
                  size="lg"
                  onSuccess={(url) => {
                    setFormData((prev) => ({ ...prev, directorImage: url }));
                    setSuccessMsg('Director photo updated on Cloudinary & live website!');
                  }}
                />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">Click Camera to Upload Photo</p>
                  <p className="text-[11px] text-slate-400">
                    Upload directly to Cloudinary or specify an image URL below. This photo will appear in the Director's message section on the website.
                  </p>
                </div>
              </div>
              <input
                type="text"
                required
                value={formData.directorImage}
                onChange={(e) => setFormData({ ...formData, directorImage: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                placeholder="Image URL or Cloudinary Link"
              />
            </div>
          </div>

          {/* SECTION 2: Announcement & Hero Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Announcement & Hero Banner</h2>
                <p className="text-xs text-slate-400">
                  Update the top announcement ticker and homepage hero headlines.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Top Announcement Bar Notice
              </label>
              <input
                type="text"
                required
                value={formData.announcement}
                onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Hero Headline Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Admissions Status
                </label>
                <select
                  value={formData.admissionsOpen ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData({ ...formData, admissionsOpen: e.target.value === 'true' })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="true">Admissions Open (Active 2026-27)</option>
                  <option value="false">Admissions Paused / Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Hero Subtitle Description
              </label>
              <textarea
                rows={2}
                required
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* SECTION 3: School Contact Info */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 flex items-center justify-center">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Campus Contact & Communication</h2>
                <p className="text-xs text-slate-400">
                  Phone helpline and official contact email displayed on headers and footers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  School Phone Helpline
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                School Campus Address
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-purple-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Website Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
