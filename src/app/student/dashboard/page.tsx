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
  CheckCircle,
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

  return (
    <DashboardShell
      title={`Welcome back, ${user?.name || 'Student'}!`}
      subtitle={`Roll Number: #${profile?.rollNumber || '101'} • ${profile?.class?.name || 'Class 10'} (${profile?.section || 'A'})`}
      allowedRoles={['student']}
      onRefresh={fetchStudentData}
    >
      {/* 4 Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Rate"
          value={`${attendanceSummary?.percentage || 95}%`}
          subtitle={`${attendanceSummary?.presentCount || 18} days present`}
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingHomework.length}
          subtitle="Assignments due this week"
          icon={BookCheck}
          color="amber"
        />
        <StatCard
          title="Academic Score"
          value={`${overallPercentage}%`}
          subtitle="Mid-Term distinction"
          icon={Award}
          color="purple"
        />
        <StatCard
          title="Fee Status"
          value={feeData?.status || 'Paid'}
          subtitle={`Due: ${formatCurrency(feeData?.dueAmount || 0)}`}
          icon={CreditCard}
          color={feeData?.dueAmount > 0 ? 'rose' : 'emerald'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Homework to do (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BookCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Assigned Homework & Exercises</h3>
                  <p className="text-[11px] text-slate-400">Class tasks assigned by faculty</p>
                </div>
              </div>
              <Link
                href="/student/homework"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
              >
                <span>View All & Submit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {homeworkList.slice(0, 3).map((hw) => {
                const submission = hw.submissions?.find((s: any) => s.student?._id === user?._id || s.student === user?._id);
                const isSubmitted = !!submission;
                return (
                  <div key={hw._id} className="p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200/70 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {hw.subject?.name}
                        </span>
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1">{hw.title}</h4>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 border ${
                          isSubmitted
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {isSubmitted ? 'Submitted' : 'Pending'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{hw.description}</p>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Due: <strong>{formatDate(hw.dueDate)}</strong></span>
                      </div>
                      <Link
                        href="/student/homework"
                        className="text-emerald-600 font-bold hover:underline"
                      >
                        {isSubmitted ? 'View Submission' : 'Submit Now →'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Examination Results Summary */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-800">Recent Term Results</h3>
              </div>
              <Link href="/student/results" className="text-xs font-semibold text-emerald-600">
                View Report Card
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {marks.slice(0, 3).map((m) => (
                <div key={m._id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="text-xs font-semibold text-slate-500 block truncate">{m.subject?.name}</span>
                  <p className="text-xl font-black text-slate-800 mt-1">{m.marksObtained}</p>
                  <span className="text-[11px] font-bold text-emerald-600">Grade: {m.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notices & School Schedule (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-800">School Announcements</h3>
              </div>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 4).map((n) => (
                <div key={n._id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.content}</p>
                  <span className="text-[10px] text-slate-400 block mt-1">{formatDate(n.date)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-xl shadow-md">
            <h4 className="font-bold text-sm">Need Help with School Work?</h4>
            <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
              Check your weekly class timetable and review verified fee payment receipts anytime.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/student/lectures"
                className="px-3 py-1.5 bg-white text-emerald-800 text-xs font-bold rounded-lg shadow-xs hover:bg-emerald-50 transition"
              >
                ▶ Video Lectures
              </Link>
              <Link
                href="/student/timetable"
                className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Class Schedule
              </Link>
              <Link
                href="/student/fees"
                className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Fee Receipt
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
