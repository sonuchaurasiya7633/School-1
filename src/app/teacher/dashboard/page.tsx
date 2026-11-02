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
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      title={`Faculty Dashboard — ${user?.name || 'Teacher'}`}
      subtitle="Today's teaching schedule, student assignments, and notices"
      allowedRoles={['teacher']}
      onRefresh={fetchTeacherData}
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Classes"
          value={assignedClassesCount}
          subtitle="Active classroom batches"
          icon={GraduationCap}
          color="blue"
        />
        <StatCard
          title="Active Homework"
          value={homeworkList.length}
          subtitle={`${pendingHomeworkCount} pending review`}
          icon={BookCheck}
          color="emerald"
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
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Teaching Schedule (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-800">Assigned Classes & Subjects</h3>
            </div>
            <Link
              href="/teacher/attendance"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Mark Attendance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile?.assignedClasses?.length > 0 ? (
              profile.assignedClasses.map((ac: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/70 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Section {ac.section}
                      </span>
                      <h4 className="font-bold text-base text-slate-800 mt-1">{ac.class?.name || 'Class 10'}</h4>
                    </div>
                    <BookOpen className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-2">
                    Subject: {ac.subject?.name || 'General Mathematics'}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                    <Link
                      href={`/teacher/attendance`}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      Take Attendance
                    </Link>
                    <Link
                      href={`/teacher/homework`}
                      className="text-blue-600 font-bold hover:underline"
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

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
            <Link
              href="/teacher/attendance"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
            >
              Mark Class Attendance
            </Link>
            <Link
              href="/teacher/homework"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg"
            >
              Assign Homework
            </Link>
            <Link
              href="/teacher/lectures"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
            >
              Upload Video Lecture
            </Link>
            <Link
              href="/teacher/marks"
              className="px-3.5 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg"
            >
              Enter Exam Marks
            </Link>
          </div>
        </div>

        {/* Notices & Announcements (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-800">Faculty Notices</h3>
            </div>
            <Link href="/teacher/notices" className="text-xs font-semibold text-emerald-600">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {notices.slice(0, 4).map((n) => (
              <div key={n._id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{n.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.content}</p>
                <span className="text-[10px] text-slate-400 block mt-1.5">{formatDate(n.date)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
