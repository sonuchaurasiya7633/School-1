'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AvatarUploader } from '@/components/common/AvatarUploader';
import { useAuth } from '@/context/AuthContext';
import {
  UserCheck,
  Lock,
  Save,
  CheckCircle,
  ShieldAlert,
  User,
  BookOpen,
  Phone,
  MapPin,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { authFetch } from '@/lib/api';

export default function TeacherProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Editable Profile Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    gender: 'Male',
    dateOfBirth: '',
    qualification: '',
    specialization: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.user) {
        setProfile(data.user);
        setTeacherProfile(data.user.profile);

        setFormData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          gender: data.user.gender || 'Male',
          dateOfBirth: data.user.dateOfBirth || '',
          qualification: data.user.profile?.qualification || '',
          specialization: data.user.profile?.specialization || '',
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to load faculty profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Profile Details Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSavingProfile(true);

    try {
      const res = await authFetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Faculty profile details updated and synchronized successfully!');
        if (data.user) {
          setProfile(data.user);
          setTeacherProfile(data.user.profile);
        }
        await refreshUser();
      } else {
        setErrorMsg(data.message || 'Error updating faculty profile.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error updating profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Password Change
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
        setSuccessMsg('Faculty password successfully changed!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setErrorMsg(data.message || 'Error updating password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error updating password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <DashboardShell
      title="Faculty Profile & Credentials"
      subtitle="Edit your instructor profile, academic qualifications, specialization, and manage password security"
      allowedRoles={['teacher']}
    >
      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs rounded-2xl flex items-center gap-2.5 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-800 text-xs rounded-2xl flex items-center gap-2.5 shadow-xs">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Edit Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card with Avatar */}
          <div className="bg-white/85 backdrop-blur-xl rounded-[28px] border border-white/90 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="shrink-0">
              <AvatarUploader
                currentAvatar={profile?.avatar}
                name={profile?.name || 'Teacher'}
                size="xl"
                onSuccess={(url) => {
                  setProfile((p: any) => ({ ...p, avatar: url }));
                  refreshUser();
                }}
              />
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                  Verified Faculty
                </span>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                  Emp ID: {profile?.userId}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5 truncate">
                {profile?.name || 'Teacher'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">{profile?.email}</p>

              {/* Read-Only Stats */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/80 font-bold text-slate-700">
                  Specialization: {teacherProfile?.specialization || 'Mathematics'}
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/80 font-semibold text-slate-600">
                  Degree: {teacherProfile?.qualification || 'M.Sc., B.Ed'}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form
            onSubmit={handleProfileSubmit}
            className="bg-white/85 backdrop-blur-xl rounded-[28px] border border-white/90 p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Faculty & Academic Details</h3>
                  <p className="text-xs text-slate-500">Update your teacher name, qualification, and contact details</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Faculty Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-500 font-semibold"
                    placeholder="e.g. Ramesh Kumar Sharma"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Contact Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-500 font-mono"
                    placeholder="+91 98222 33445"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Academic Qualifications</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-500 font-medium"
                    placeholder="e.g. M.Sc., B.Ed | CTET Qualified"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Subject Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-500 font-medium"
                    placeholder="e.g. Mathematics & Statistics"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-500 font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Campus Residential Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-500 leading-relaxed"
                  placeholder="Staff Quarter / Address"
                />
              </div>
            </div>

            {/* Active Class Allocations (Read-Only) */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-slate-400 block mb-2 font-black uppercase tracking-wider text-[11px]">
                Active Classroom Allocations (Managed by Super Admin)
              </span>
              <div className="flex flex-wrap gap-2">
                {teacherProfile?.assignedClasses?.length > 0 ? (
                  teacherProfile.assignedClasses.map((ac: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-slate-50 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>{ac.class?.name || 'Class'} (Sec {ac.section}) — {ac.subject?.name || 'Subject'}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Class 10-A (Mathematics)</span>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {savingProfile ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Faculty Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Change Password & Security (1 col) */}
        <div className="space-y-6">
          <div className="bg-white/85 backdrop-blur-xl rounded-[28px] border border-white/90 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Change Password</h3>
                <p className="text-[11px] text-slate-500">Update your faculty portal login password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-full transition text-xs shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
              >
                {savingPassword ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => logout()}
                className="w-full py-2.5 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-full transition text-center"
              >
                Sign Out of Faculty Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
