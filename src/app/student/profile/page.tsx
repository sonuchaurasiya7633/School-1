'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAuth } from '@/context/AuthContext';
import { UserCheck, Lock, CheckCircle, ShieldAlert } from 'lucide-react';

export default function StudentProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingPassword, setSavingPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.user) {
        setProfile(data.user);
        setStudentProfile(data.user.profile);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Your password was successfully updated!');
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

  return (
    <DashboardShell
      title="My Student Profile"
      subtitle="View personal, academic, and parent details, and manage portal security"
      allowedRoles={['student']}
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
        {/* Personal & Academic Details */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center gap-4 pb-5 border-b border-slate-200 mb-5">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white text-2xl font-black flex items-center justify-center shadow-md">
              {profile?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">{profile?.name}</h3>
              <p className="text-xs text-emerald-600 font-semibold font-mono">
                Student ID: {profile?.userId} • Roll #{studentProfile?.rollNumber}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{profile?.email}</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block mb-1">Enrolled Standard</span>
                <p className="font-bold text-slate-800 text-sm">
                  {studentProfile?.class?.name} — Section {studentProfile?.section}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Blood Group</span>
                <p className="font-bold text-slate-800 text-sm">{studentProfile?.bloodGroup || 'O+'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block mb-1">Parent / Guardian Name</span>
                <p className="font-semibold text-slate-700">{studentProfile?.parentName}</p>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Emergency Parent Contact</span>
                <p className="font-semibold text-slate-700">{studentProfile?.parentPhone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block mb-1">Residential Address</span>
                <p className="font-semibold text-slate-700">{profile?.address || 'City Residential'}</p>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Enrollment Date</span>
                <p className="font-semibold text-slate-700">{studentProfile?.admissionDate || '2023-04-01'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-4">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-800">Change Password</h3>
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
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition mt-2"
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => logout()}
              className="w-full py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-lg transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
