'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAuth } from '@/context/AuthContext';
import { Settings, Save, Lock, RefreshCw, CheckCircle, ShieldAlert, UserCheck } from 'lucide-react';
import { AvatarUploader } from '@/components/common/AvatarUploader';
import { authFetch } from '@/lib/api';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<any>({
    schoolName: 'Success Point School',
    tagline: 'Best Education, Good Results.',
    code: 'SPS',
    logo: '/images/logo.jpeg',
    email: 'contact@successpointschool.edu',
    phone: '+91 98765 43210',
    address: 'Sector 14, Education Zone, SPS Campus',
    academicYear: '2026-2027',
    principalName: 'Dr. A. K. Sharma',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [reseedLoading, setReseedLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await authFetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSavingSettings(true);
    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('School parameters updated successfully!');
      } else {
        setErrorMsg(data.message || 'Error updating settings.');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await authFetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setErrorMsg(data.message || 'Error updating password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleReseed = async () => {
    if (!confirm('Reset database to clean initial state with sample data? This will reseed all tables.')) return;
    setReseedLoading(true);
    try {
      const res = await authFetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Database successfully reset and reseeded!');
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReseedLoading(false);
    }
  };

  return (
    <DashboardShell
      title="School Settings & Profile"
      subtitle="Configure institutional branding, principal details, credentials, and system data"
      allowedRoles={['admin']}
    >
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School Branding & Settings */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-5">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border p-0.5 shrink-0 bg-white shadow-xs">
              <Image
                src="/images/logo.jpeg"
                alt="Logo"
                width={48}
                height={48}
                className="object-contain w-full h-full"
              />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">School Identity & Profile</h3>
              <p className="text-xs text-slate-400">Printed on official vouchers, reports, and headers</p>
            </div>
          </div>

          <form onSubmit={handleSettingsSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700">School Name *</label>
                <input
                  type="text"
                  required
                  value={settings.schoolName}
                  onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Tagline / Motto</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-emerald-700 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700">School Code</label>
                <input
                  type="text"
                  value={settings.code}
                  onChange={(e) => setSettings({ ...settings, code: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg uppercase"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Academic Session</label>
                <input
                  type="text"
                  value={settings.academicYear}
                  onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Principal Name</label>
                <input
                  type="text"
                  value={settings.principalName}
                  onChange={(e) => setSettings({ ...settings, principalName: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700">Official Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Contact Phone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700">Campus Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving...' : 'Update Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Password & Reseed DB Column */}
        <div className="space-y-6">
          {/* Admin Profile Photo Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-4">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-800">Admin Profile Photo</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-2 text-center">
              <AvatarUploader
                currentAvatar={user?.avatar}
                name={user?.name || 'Admin'}
                size="xl"
              />
              <p className="mt-3 text-xs font-bold text-slate-800">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-slate-500">{user?.email}</p>
              <span className="mt-1 px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Super Admin
              </span>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-4">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-800">Change Admin Password</h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition"
              >
                {savingPassword ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Database Reset & Reseed Box */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 shadow-xs">
            <h4 className="font-bold text-xs text-amber-900">Developer & Demo Reseed</h4>
            <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
              Reset all collections and populate clean demo students, classes, attendance records, homework, exams, and fees.
            </p>
            <button
              onClick={handleReseed}
              disabled={reseedLoading}
              className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${reseedLoading ? 'animate-spin' : ''}`} />
              <span>{reseedLoading ? 'Resetting...' : 'Reseed Demo Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
