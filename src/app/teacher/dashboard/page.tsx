'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatCard } from '@/components/common/StatCard';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen,
  CalendarCheck,
  BookCheck,
  Bell,
  Clock,
  ArrowRight,
  GraduationCap,
  Calendar,
  Sparkles,
  Flame,
  CheckCircle2,
  FileText,
  Video,
  Award,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const [resMe, resTt, resHw, resN] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/timetable'),
        fetch('/api/homework'),
        fetch('/api/notices'),
      ]);

      const dataMe = await resMe.json();
      const dataTt = await resTt.json();
      const dataHw = await resHw.json();
      const dataN = await resN.json();

      if (dataMe.success && dataMe.user?.profile) setProfile(dataMe.user.profile);
      if (dataTt.success && dataTt.timetables) setTimetable(dataTt.timetables);
      if (dataHw.success && dataHw.homework) setHomeworkList(dataHw.homework);
      if (dataN.success && dataN.notices) setNotices(dataN.notices);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const assignedClassesCount = profile?.assignedClasses?.length || 2;
  const pendingHomeworkCount = homeworkList.filter((h) => h.submissions?.some((s: any) => s.status === 'Submitted')).length;

  return (
    <DashboardShell
      title={`Hi, ${user?.name?.split(' ')[0] || 'Teacher'}`}
      subtitle={`Faculty ID: ${profile?.employeeId || 'FAC-102'} • ${profile?.specialization || 'Mathematics'}`}
      allowedRoles={['teacher']}
      onRefresh={fetchTeacherData}
    >
      {/* 1. App-like Hero Card (Inspired by Reference Images 1 & 2) */}
      <div className="bg-white/85 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        {/* Soft atmospheric gradient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-teal-200/40 via-purple-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Faculty Portal • Session 2026-2027</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Faculty Command & Teaching Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Empower your students with daily attendance, structured homework review, and interactive digital lectures.
            </p>

            {/* Quick action buttons capsule */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <Link
                href="/teacher/attendance"
                className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Mark Attendance</span>
              </Link>
              <Link
                href="/teacher/homework"
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <BookCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Assign Homework</span>
              </Link>
              <Link
                href="/teacher/lectures"
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5 text-blue-600" />
                <span>Video Lecture</span>
              </Link>
            </div>
          </div>

          {/* 3 Metric Squircle Chips (Inspired by Reference Images 1 & 3) */}
          <div className="grid grid-cols-3 gap-3 shrink-0 lg:w-80">
            <div className="bg-white/90 backdrop-blur-md rounded-[22px] p-3.5 border border-white shadow-xs text-center flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-1.5">
                <Flame className="w-4 h-4 fill-orange-500" />
              </div>
              <div className="text-lg font-black text-slate-900 leading-none">{assignedClassesCount}</div>
              <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Classes</div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-[22px] p-3.5 border border-white shadow-xs text-center flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-slate-900 leading-none">{pendingHomeworkCount}</div>
              <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Pending</div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-[22px] p-3.5 border border-white shadow-xs text-center flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-lg font-black text-slate-900 leading-none">{homeworkList.length}</div>
              <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Assigned Classes"
          value={assignedClassesCount}
          subtitle="Active classroom batches"
          icon={GraduationCap}
          color="blue"
          badge="Live"
        />
        <StatCard
          title="Active Homework"
          value={homeworkList.length}
          subtitle={`${pendingHomeworkCount} pending review`}
          icon={BookCheck}
          color="emerald"
          trend="+5 tasks"
          trendDirection="up"
        />
        <StatCard
          title="Specialization"
          value={profile?.specialization || 'Mathematics'}
          subtitle={profile?.qualification || 'M.Sc., B.Ed'}
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="School Circulars"
          value={notices.length}
          subtitle="Staff announcements"
          icon={Bell}
          color="amber"
          badge="Notices"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Teaching Schedule (2 cols) */}
        <div className="lg:col-span-2 bg-white/85 backdrop-blur-xl rounded-[28px] sm:rounded-[32px] border border-white/90 p-5 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">Assigned Classes & Subjects</h3>
                <p className="text-xs text-slate-500">Your mapped teaching sections</p>
              </div>
            </div>
            <Link
              href="/teacher/attendance"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 transition"
            >
              <span>Take Attendance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile?.assignedClasses?.length > 0 ? (
              profile.assignedClasses.map((ac: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 bg-white/90 rounded-[22px] border border-slate-200/70 hover:border-emerald-500/40 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] uppercase font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          Section {ac.section}
                        </span>
                      </div>
                      <h4 className="font-black text-lg text-slate-900 mt-2">{ac.class?.name || 'Class 10'}</h4>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 flex items-center justify-center text-slate-400 transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-700 mt-3 flex items-center gap-1.5">
                    <span className="text-slate-400">Subject:</span>
                    <span>{ac.subject?.name || 'General Mathematics'}</span>
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <Link
                      href={`/teacher/attendance`}
                      className="text-emerald-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Attendance</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href={`/teacher/homework`}
                      className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition"
                    >
                      Assign Task
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center text-xs text-slate-400">
                You are currently mapped to Class 10-A (Mathematics) and Class 9-A (Mathematics).
              </div>
            )}
          </div>

          {/* Quick Actions Footer Pill Badges */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
            <Link
              href="/teacher/attendance"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-xs transition"
            >
              Mark Class Attendance
            </Link>
            <Link
              href="/teacher/homework"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-full transition"
            >
              Assign Homework
            </Link>
            <Link
              href="/teacher/lectures"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-xs transition"
            >
              Upload Video Lecture
            </Link>
            <Link
              href="/teacher/marks"
              className="px-4 py-2 border border-slate-200/90 hover:bg-slate-100 text-slate-700 font-bold rounded-full transition"
            >
              Enter Exam Marks
            </Link>
          </div>
        </div>

        {/* Notices & Announcements (1 col) */}
        <div className="bg-white/85 backdrop-blur-xl rounded-[28px] sm:rounded-[32px] border border-white/90 p-5 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">Faculty Notices</h3>
                  <p className="text-xs text-slate-500">School circulars & memos</p>
                </div>
              </div>
              <Link href="/teacher/notices" className="text-xs font-bold text-emerald-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 4).map((n) => (
                <div key={n._id} className="p-3.5 bg-white/90 rounded-[20px] border border-slate-200/70 hover:border-amber-400/50 transition">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{n.title}</h4>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{n.content}</p>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-2">{formatDate(n.date)}</span>
                </div>
              ))}
              {notices.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No staff announcements at this time.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link
              href="/teacher/notices"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-bold transition"
            >
              <span>View All Official Bulletins</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
