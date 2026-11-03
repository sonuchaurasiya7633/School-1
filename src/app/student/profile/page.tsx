'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { AvatarUploader } from '@/components/common/AvatarUploader';
import { useAuth } from '@/context/AuthContext';
import {
  UserCheck,
  Lock,
  CheckCircle,
  ShieldAlert,
  Save,
  User,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Users,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { authFetch } from '@/lib/api';

export default function StudentProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Editable Profile Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    gender: 'Male',
    dateOfBirth: '',
    bloodGroup: 'O+',
    parentName: '',
    parentPhone: '',
    emergencyContact: '',
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
        setStudentProfile(data.user.profile);

        setFormData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          gender: data.user.gender || 'Male',
          dateOfBirth: data.user.dateOfBirth || '',
          bloodGroup: data.user.profile?.bloodGroup || 'O+',
          parentName: data.user.profile?.parentName || '',
          parentPhone: data.user.profile?.parentPhone || '',
          emergencyContact: data.user.profile?.emergencyContact || '',
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to load profile details.');
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
        setSuccessMsg('Your profile details have been successfully updated!');
        if (data.user) {
          setProfile(data.user);
          setStudentProfile(data.user.profile);
        }
        await refreshUser();
      } else {
        setErrorMsg(data.message || 'Error updating profile.');
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
        setSuccessMsg('Your password was successfully updated!');
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
      title="My Student Profile & Settings"
      subtitle="Edit your personal details, guardian contact, profile picture, and manage portal security"
      allowedRoles={['student']}
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
        {/* Left Column: Edit Profile Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card with Avatar */}
          <div className="bg-white/85 backdrop-blur-xl rounded-[28px] border border-white/90 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="shrink-0">
              <AvatarUploader
                currentAvatar={profile?.avatar}
                name={profile?.name || 'Student'}
                size="xl"
                onSuccess={(url) => {
                  setProfile((p: any) => ({ ...p, avatar: url }));
                  refreshUser();
                }}
              />
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Enrolled Student
                </span>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                  ID: {profile?.userId}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5 truncate">
                {profile?.name || 'Student'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">{profile?.email}</p>

              {/* Read-Only Academic Badges */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/80 font-bold text-slate-700">
                  Class: {studentProfile?.class?.name || 'Class 10'} (Sec {studentProfile?.section || 'A'})
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/80 font-bold text-slate-700">
                  Roll No: #{studentProfile?.rollNumber || '101'}
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/80 font-semibold text-slate-500">
                  Enrolled: {studentProfile?.admissionDate || '2026-04-01'}
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
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Personal & Parent Details</h3>
                  <p className="text-xs text-slate-500">Update your name, contacts, and guardian details</p>
                </div>
              </div>
            </div>

            {/* Form Fields: Personal */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">1. Student Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Student Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 font-semibold"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Student Contact Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 font-mono"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 font-medium"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Residential Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 leading-relaxed"
                  placeholder="House / Street, Landmark, City, Postal Code"
                />
              </div>
            </div>

            {/* Form Fields: Parent & Emergency */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">2. Parent & Medical Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 font-medium"
                    placeholder="Father's or Mother's Name"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Parent Mobile Number</label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 font-mono"
                    placeholder="+91 91234 56789"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Emergency Contact Number</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 font-mono"
                    placeholder="Alternate Emergency Phone"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 font-bold text-rose-600"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
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
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Details</span>
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
                <p className="text-[11px] text-slate-500">Update your student portal login password</p>
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
                Log Out of Student Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
