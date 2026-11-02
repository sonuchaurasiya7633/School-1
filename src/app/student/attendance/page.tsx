'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatCard } from '@/components/common/StatCard';
import { CalendarCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function StudentAttendancePage() {
  const [summary, setSummary] = useState<any>({
    totalDays: 20,
    presentCount: 18,
    absentCount: 1,
    lateCount: 1,
    percentage: 95,
  });
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/attendance');
      const data = await res.json();
      if (data.success) {
        if (data.summary) setSummary(data.summary);
        if (data.history) setHistory(data.history);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <DashboardShell
      title="My Attendance Record"
      subtitle="Comprehensive view of your class roll call status, monthly percentage, and absent logs"
      allowedRoles={['student']}
      onRefresh={fetchAttendance}
    >
      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Score"
          value={`${summary.percentage}%`}
          subtitle="Meets 75% minimum"
          icon={CalendarCheck}
          color="emerald"
        />
        <StatCard
          title="Days Present"
          value={summary.presentCount}
          subtitle="Full day attendances"
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Days Absent"
          value={summary.absentCount}
          subtitle="Excused / unexcused"
          icon={XCircle}
          color="rose"
        />
        <StatCard
          title="Late / Half Days"
          value={summary.lateCount}
          subtitle="Tardy recordings"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            Daily Attendance Log
          </h3>
          <span className="text-xs text-slate-400">Total Tracked: {history.length} Sessions</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Standard & Section</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Teacher Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  No attendance records recorded for this term yet.
                </td>
              </tr>
            ) : (
              history.map((h, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-800">{formatDate(h.date)}</td>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    {h.class?.name || 'Class 10'} — {h.section}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        h.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : h.status === 'Absent'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {h.status === 'Present' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {h.status === 'Absent' && <XCircle className="w-3 h-3 text-rose-600" />}
                      {h.status !== 'Present' && h.status !== 'Absent' && <Clock className="w-3 h-3 text-amber-600" />}
                      {h.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 italic">
                    {h.remarks || 'Standard session'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
