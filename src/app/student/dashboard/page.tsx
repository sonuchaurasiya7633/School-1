'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatCard } from '@/components/common/StatCard';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  CalendarCheck,
  BookCheck,
  Award,
  CreditCard,
  Bell,
  ArrowRight,
  Clock,
  Sparkles,
  Flame,
  CheckCircle2,
  Video,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<any>(null);
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [feeData, setFeeData] = useState<any>(null);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [resMe, resAtt, resHw, resN, resFee, resM] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/attendance'),
        fetch('/api/homework'),
        fetch('/api/notices'),
        fetch('/api/fees'),
        fetch('/api/marks'),
      ]);

      const dataMe = await resMe.json();
      const dataAtt = await resAtt.json();
      const dataHw = await resHw.json();
      const dataN = await resN.json();
      const dataFee = await resFee.json();
      const dataM = await resM.json();

      if (dataMe.success && dataMe.user?.profile) setProfile(dataMe.user.profile);
      if (dataAtt.success && dataAtt.summary) setAttendanceSummary(dataAtt.summary);
      if (dataHw.success && dataHw.homework) setHomeworkList(dataHw.homework);
      if (dataN.success && dataN.notices) setNotices(dataN.notices);
      if (dataFee.success && dataFee.fees?.length > 0) setFeeData(dataFee.fees[0]);
      if (dataM.success && dataM.marks) setMarks(dataM.marks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const totalMax = marks.reduce((acc, m) => acc + (m.maxMarks || 100), 0);
  const totalObt = marks.reduce((acc, m) => acc + (m.marksObtained || 0), 0);
  const overallPercentage = totalMax > 0 ? ((totalObt / totalMax) * 100).toFixed(0) : '88';

  const pendingHomework = homeworkList.filter(
    (h) => !h.submissions?.some((s: any) => s.student?._id === user?._id || s.student === user?._id)
  );
  const completedHomework = homeworkList.filter(
    (h) => h.submissions?.some((s: any) => s.student?._id === user?._id || s.student === user?._id)
  );

  const displayedHomework =
    taskFilter === 'pending'
      ? pendingHomework
      : taskFilter === 'completed'
      ? completedHomework
      : homeworkList;

  return (
    <DashboardShell
      title={`Hi, ${user?.name?.split(' ')[0] || 'Student'}`}
      subtitle={`Roll #${profile?.rollNumber || '101'} • ${profile?.class?.name || 'Class 10'} (${profile?.section || 'A'})`}
      allowedRoles={['student']}
      onRefresh={fetchStudentData}
    >
      {/* 1. App-like Hero Card (Inspired by Reference Image 1 & 2) */}
      <div className="bg-white/85 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        {/* Soft atmospheric gradient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-200/40 via-emerald-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Academic Session 2026-2027 • On Track</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Learning & Performance Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Keep going! You&apos;re doing great. Review today&apos;s lectures, complete assignments, and track your distinction score.
            </p>

            {/* Overall Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-700">Overall Progress</span>
                <span className="text-purple-600 font-extrabold">{overallPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(Number(overallPercentage), 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3 Metric Squircle Chips (Matching Reference Image 1 & 3) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div className="bg-slate-50/90 rounded-[24px] p-4 text-center border border-slate-200/70 shadow-2xs hover:shadow-xs transition">
              <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
                <Flame className="w-5 h-5" />
              </div>
              <p className="text-lg sm:text-xl font-black text-slate-900 leading-none">
                {attendanceSummary?.percentage || 95}%
              </p>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                Attendance
              </span>
            </div>

            <div className="bg-slate-50/90 rounded-[24px] p-4 text-center border border-slate-200/70 shadow-2xs hover:shadow-xs transition">
              <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-lg sm:text-xl font-black text-slate-900 leading-none">
                {attendanceSummary?.presentCount || 18}d
              </p>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                Present
              </span>
            </div>

            <div className="bg-slate-50/90 rounded-[24px] p-4 text-center border border-slate-200/70 shadow-2xs hover:shadow-xs transition">
              <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-lg sm:text-xl font-black text-slate-900 leading-none">
                {homeworkList.length - pendingHomework.length}
              </p>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 Modern Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Attendance Rate"
          value={`${attendanceSummary?.percentage || 95}%`}
          subtitle={`${attendanceSummary?.presentCount || 18} days present`}
          icon={CalendarCheck}
          color="emerald"
          badge="Healthy"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingHomework.length}
          subtitle="Assignments due soon"
          icon={BookCheck}
          color="amber"
          badge={pendingHomework.length > 0 ? 'Due' : 'Done'}
        />
        <StatCard
          title="Academic Score"
          value={`${overallPercentage}%`}
          subtitle="Term evaluation score"
          icon={Award}
          color="purple"
          badge="Merit"
        />
        <StatCard
          title="Fee Status"
          value={feeData?.status || 'Paid'}
          subtitle={`Due: ${formatCurrency(feeData?.dueAmount || 0)}`}
          icon={CreditCard}
          color={feeData?.dueAmount > 0 ? 'rose' : 'emerald'}
          badge={feeData?.dueAmount > 0 ? 'Payment Due' : 'Verified'}
        />
      </div>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Homework & Tasks with Segmented Tabs (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/85 backdrop-blur-xl rounded-[32px] border border-white/90 p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 mb-5">
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                  Assigned Homework & Practice Tasks
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Faculty curriculum assignments</p>
              </div>

              {/* Segmented Filter Pills (Matching Reference Image 2 & 3) */}
              <div className="inline-flex p-1 bg-slate-100/90 rounded-full border border-slate-200/70 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setTaskFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    taskFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({homeworkList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTaskFilter('pending')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    taskFilter === 'pending'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  To Do ({pendingHomework.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTaskFilter('completed')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    taskFilter === 'completed'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Done ({completedHomework.length})
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-3.5">
              {displayedHomework.length > 0 ? (
                displayedHomework.slice(0, 4).map((hw) => {
                  const submission = hw.submissions?.find(
                    (s: any) => s.student?._id === user?._id || s.student === user?._id
                  );
                  const isSubmitted = !!submission;
                  return (
                    <div
                      key={hw._id}
                      className="p-5 bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              {hw.subject?.name || 'General'}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">• Class Assignment</span>
                          </div>
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition">
                            {hw.title}
                          </h4>
                        </div>

                        {/* Status Chip with Glowing Dot (Matching Reference Image 3) */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shrink-0 ${
                            isSubmitted
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSubmitted ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                            }`}
                          />
                          <span>{isSubmitted ? 'Completed' : 'Pending'}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                        {hw.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Due: <strong>{formatDate(hw.dueDate)}</strong></span>
                        </div>
                        <Link
                          href="/student/homework"
                          className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                        >
                          <span>{isSubmitted ? 'View Submission' : 'Submit Now'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No tasks in this category!</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">You are all caught up with your coursework.</p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
              <Link
                href="/student/homework"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <span>View All Tasks & Homework History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Academic Marksheet Performance Summary */}
          <div className="bg-white/85 backdrop-blur-xl rounded-[32px] border border-white/90 p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900">Academic Examination Marks</h3>
                  <p className="text-[11px] text-slate-400">Published examination results</p>
                </div>
              </div>
              <Link
                href="/student/results"
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 hover:underline"
              >
                <span>Full Marksheet</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {marks.slice(0, 3).map((m) => (
                <div
                  key={m._id}
                  className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/70 text-center shadow-2xs"
                >
                  <span className="text-xs font-bold text-slate-500 block truncate">
                    {m.subject?.name || 'Subject'}
                  </span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {m.marksObtained}
                    <span className="text-xs text-slate-400 font-normal">/{m.maxMarks || 100}</span>
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-black text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                    Grade {m.grade}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Video Lectures, Bulletins & Quick Links (1 col) */}
        <div className="space-y-6">
          {/* Quick Learning Card (Matching Image 1 & 3) */}
          <div className="bg-gradient-to-br from-emerald-800 via-[#214F39] to-emerald-950 text-white p-6 sm:p-7 rounded-[32px] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
                E-Learning Portal
              </span>
              <h4 className="text-lg font-black leading-snug">Recorded Video Lectures</h4>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Watch classroom lectures recorded by subject teachers and download study notes anytime.
              </p>

              <div className="pt-2">
                <Link
                  href="/student/lectures"
                  className="w-full py-2.5 px-4 bg-white text-emerald-900 rounded-xl font-bold text-xs shadow-md hover:bg-emerald-50 transition flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4 text-emerald-700" />
                  <span>Open Video Library</span>
                </Link>
              </div>
            </div>
          </div>

          {/* School Bulletins & Circulars */}
          <div className="bg-white/85 backdrop-blur-xl rounded-[32px] border border-white/90 p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm text-slate-900">Official Circulars</h3>
              </div>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 3).map((n) => (
                <div
                  key={n._id}
                  className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 hover:bg-white transition"
                >
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{n.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {n.content}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1.5 font-medium">
                    {formatDate(n.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
