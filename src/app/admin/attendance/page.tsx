'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  CalendarCheck,
  Calendar,
  Filter,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
  Check,
  X,
  Trash2,
  Printer,
  Download,
  Users,
  CheckSquare,
  XSquare,
  RefreshCw,
} from 'lucide-react';
import { authFetch } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AdminAttendancePage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'corrections'>('daily');

  // Shared Filters
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Daily Roll Call State
  const [attendance, setAttendance] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loadingDaily, setLoadingDaily] = useState(true);
  const [savingDaily, setSavingDaily] = useState(false);

  // Monthly Report State
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [monthlyReport, setMonthlyReport] = useState<any>(null);
  const [loadingMonthly, setLoadingMonthly] = useState(false);

  // Correction Requests State
  const [corrections, setCorrections] = useState<any[]>([]);
  const [loadingCorrections, setLoadingCorrections] = useState(false);
  const [correctionFilter, setCorrectionFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [actionProcessingId, setActionProcessingId] = useState<string | null>(null);

  // 1. Initial Load: Classes
  useEffect(() => {
    authFetch('/api/admin/classes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.classes?.length > 0) {
          setClasses(data.classes);
          setSelectedClass(data.classes[0]._id);
        }
      });
  }, []);

  // 2. Fetch Daily Attendance
  const fetchDailyAttendance = async () => {
    if (!selectedClass) return;
    try {
      setLoadingDaily(true);
      const [resAtt, resStudents] = await Promise.all([
        authFetch(`/api/attendance?date=${selectedDate}&classId=${selectedClass}&section=${selectedSection}`),
        authFetch(`/api/admin/students?classId=${selectedClass}&section=${selectedSection}`),
      ]);

      const dataAtt = await resAtt.json();
      const dataStudents = await resStudents.json();

      const existingAtt = dataAtt.attendances?.[0] || null;
      setAttendance(existingAtt);

      const allStudents = dataStudents.students || [];

      if (existingAtt && existingAtt.records?.length > 0) {
        const mapped = allStudents.map((st: any) => {
          const rec = existingAtt.records.find(
            (r: any) =>
              (r.student?._id && r.student._id.toString() === st.user?._id?.toString()) ||
              (r.student && r.student.toString() === st.user?._id?.toString())
          );
          return {
            studentId: st.user?._id,
            name: st.user?.name,
            rollNumber: st.rollNumber,
            userId: st.user?.userId,
            status: rec ? rec.status : 'Present',
            remarks: rec?.remarks || '',
          };
        });
        setRecords(mapped);
      } else {
        const defaults = allStudents.map((st: any) => ({
          studentId: st.user?._id,
          name: st.user?.name,
          rollNumber: st.rollNumber,
          userId: st.user?.userId,
          status: 'Present',
          remarks: '',
        }));
        setRecords(defaults);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDaily(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'daily' && selectedClass) {
      fetchDailyAttendance();
    }
  }, [activeTab, selectedClass, selectedSection, selectedDate]);

  // 3. Fetch Monthly Report
  const fetchMonthlyReport = async () => {
    if (!selectedClass) return;
    try {
      setLoadingMonthly(true);
      const res = await authFetch(
        `/api/attendance?mode=monthly_report&classId=${selectedClass}&section=${selectedSection}&month=${selectedMonth}`
      );
      const data = await res.json();
      if (data.success) {
        setMonthlyReport(data.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMonthly(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'monthly' && selectedClass) {
      fetchMonthlyReport();
    }
  }, [activeTab, selectedClass, selectedSection, selectedMonth]);

  // 4. Fetch Correction Requests
  const fetchCorrections = async () => {
    try {
      setLoadingCorrections(true);
      const url =
        correctionFilter === 'All'
          ? '/api/attendance/corrections'
          : `/api/attendance/corrections?status=${correctionFilter}`;
      const res = await authFetch(url);
      const data = await res.json();
      if (data.success) {
        setCorrections(data.corrections || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCorrections(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'corrections') {
      fetchCorrections();
    }
  }, [activeTab, correctionFilter]);

  // Bulk actions for Daily Roll Call
  const markAll = (status: 'Present' | 'Absent' | 'Late') => {
    setRecords((prev) => prev.map((r) => ({ ...r, status })));
  };

  const handleStatusChange = (index: number, newStatus: string) => {
    const updated = [...records];
    updated[index].status = newStatus;
    setRecords(updated);
  };

  const handleRemarksChange = (index: number, remarks: string) => {
    const updated = [...records];
    updated[index].remarks = remarks;
    setRecords(updated);
  };

  // Save Daily Attendance
  const handleSaveDaily = async () => {
    if (records.length === 0) {
      alert('No enrolled students in this class.');
      return;
    }

    try {
      setSavingDaily(true);
      const res = await authFetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          classId: selectedClass,
          section: selectedSection,
          records: records.map((r) => ({
            student: r.studentId,
            status: r.status,
            remarks: r.remarks,
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Attendance entries successfully saved and synchronized!');
        await fetchDailyAttendance();
      } else {
        alert(data.message || 'Error saving attendance.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving attendance.');
    } finally {
      setSavingDaily(false);
    }
  };

  // Delete Attendance Session
  const handleDeleteSession = async () => {
    if (!attendance?._id) return;
    const confirmDel = window.confirm(
      `Are you sure you want to permanently delete the attendance session for ${formatDate(selectedDate)}?`
    );
    if (!confirmDel) return;

    try {
      const res = await authFetch(`/api/attendance?id=${attendance._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Session deleted successfully.');
        await fetchDailyAttendance();
      } else {
        alert(data.message || 'Failed to delete session.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Correction Approval / Rejection
  const handleReviewCorrection = async (
    requestId: string,
    action: 'Approved' | 'Rejected',
    studentName: string
  ) => {
    const remarks = prompt(
      `Enter administrative review note for ${action.toLowerCase()} of ${studentName}'s request (optional):`,
      action === 'Approved' ? 'Verified with attendance register' : 'Lack of valid medical/leave slip'
    );
    if (remarks === null) return; // User cancelled prompt

    try {
      setActionProcessingId(requestId);
      const res = await authFetch('/api/attendance/corrections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          action,
          reviewRemarks: remarks,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Correction request ${action} successfully! Attendance register has been synchronized.`);
        await fetchCorrections();
      } else {
        alert(data.message || 'Error updating correction request.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error updating correction request.');
    } finally {
      setActionProcessingId(null);
    }
  };

  // Export Monthly Register as CSV
  const exportMonthlyCSV = () => {
    if (!monthlyReport || !monthlyReport.studentStats) return;
    const header = ['Roll', 'Name', 'User ID', 'Total Days', 'Present', 'Absent', 'Late', 'Percentage (%)'];
    const rows = monthlyReport.studentStats.map((s: any) => [
      `"${s.rollNumber}"`,
      `"${s.name}"`,
      `"${s.userId}"`,
      s.totalSessions,
      s.presentCount,
      s.absentCount,
      s.lateCount,
      `${s.percentage}%`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((e: any) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Attendance_Report_${classes.find((c) => c._id === selectedClass)?.name || 'Class'}_${selectedMonth}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Counts
  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;
  const lateCount = records.filter((r) => r.status === 'Late' || r.status === 'Half Day').length;

  return (
    <DashboardShell
      title="Attendance Management & Analytics"
      subtitle="View, mark, correct student attendance registers, generate monthly reports, and approve correction requests"
      allowedRoles={['admin']}
      onRefresh={() => {
        if (activeTab === 'daily') fetchDailyAttendance();
        else if (activeTab === 'monthly') fetchMonthlyReport();
        else fetchCorrections();
      }}
    >
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'daily'
              ? 'bg-[#214F39] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Daily Roll Call &amp; Editor</span>
        </button>

        <button
          onClick={() => setActiveTab('monthly')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'monthly'
              ? 'bg-[#214F39] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Monthly Class Register &amp; Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('corrections')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'corrections'
              ? 'bg-[#214F39] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Correction Approvals</span>
          {corrections.filter((c) => c.status === 'Pending').length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-extrabold">
              {corrections.filter((c) => c.status === 'Pending').length}
            </span>
          )}
        </button>
      </div>

      {/* ================= TAB 1: DAILY ROLL CALL & CORRECTION ================= */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Session Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} {c.grade ? `(Grade ${c.grade})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {attendance && (
                <button
                  type="button"
                  onClick={handleDeleteSession}
                  className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                  title="Delete Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleSaveDaily}
                disabled={savingDaily || records.length === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{savingDaily ? 'Saving...' : 'Save & Correct Entries'}</span>
              </button>
            </div>
          </div>

          {/* Overwrite & Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2 text-xs">
              {attendance ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Recorded by {attendance.recordedBy?.name || 'Faculty'} ({attendance.recordedBy?.role || 'Admin'})
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>No register recorded yet for {formatDate(selectedDate)}</span>
                </span>
              )}
            </div>

            {records.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">Quick Actions:</span>
                <button
                  type="button"
                  onClick={() => markAll('Present')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition"
                >
                  <CheckSquare className="w-3 h-3" />
                  <span>Mark All Present</span>
                </button>
                <button
                  type="button"
                  onClick={() => markAll('Absent')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 text-[11px] font-bold transition"
                >
                  <XSquare className="w-3 h-3" />
                  <span>Mark All Absent</span>
                </button>
              </div>
            )}
          </div>

          {/* Summary Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-800">Present</span>
                <h4 className="text-2xl font-black text-emerald-700 mt-0.5">{presentCount}</h4>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-800">Absent</span>
                <h4 className="text-2xl font-black text-rose-700 mt-0.5">{absentCount}</h4>
              </div>
              <XCircle className="w-8 h-8 text-rose-500" />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-800">Late / Half Day</span>
                <h4 className="text-2xl font-black text-amber-700 mt-0.5">{lateCount}</h4>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          {/* Roll Call Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Roll</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Attendance Status</th>
                    <th className="py-3 px-4">Remarks / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingDaily ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Loading attendance register...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        No students enrolled in this class and section.
                      </td>
                    </tr>
                  ) : (
                    records.map((r, idx) => (
                      <tr key={r.studentId} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-bold text-slate-700">#{r.rollNumber}</td>
                        <td className="py-3 px-4 font-bold text-slate-800 text-sm">{r.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{r.userId}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {['Present', 'Absent', 'Late', 'Half Day'].map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleStatusChange(idx, st)}
                                className={`px-2.5 py-1 rounded-md font-bold text-xs transition ${
                                  r.status === st
                                    ? st === 'Present'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : st === 'Absent'
                                      ? 'bg-rose-600 text-white shadow-xs'
                                      : 'bg-amber-500 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={r.remarks}
                            onChange={(e) => handleRemarksChange(idx, e.target.value)}
                            placeholder="Optional remarks..."
                            className="w-full max-w-xs px-2.5 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-emerald-500"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MONTHLY REGISTER & ANALYTICS REPORT ================= */}
      {activeTab === 'monthly' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Select Month
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportMonthlyCSV}
                disabled={!monthlyReport || !monthlyReport.studentStats?.length}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Register</span>
              </button>
            </div>
          </div>

          {/* Monthly KPI Chips */}
          {monthlyReport && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-[11px] font-bold text-blue-800 uppercase">Working Sessions</span>
                <p className="text-2xl font-black text-blue-900 mt-0.5">{monthlyReport.totalSessions} Days</p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-800 uppercase">Class Average Rate</span>
                <p className="text-2xl font-black text-emerald-900 mt-0.5">{monthlyReport.classAvgPercentage}%</p>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-center">
                <span className="text-[11px] font-bold text-purple-800 uppercase">Enrolled Students</span>
                <p className="text-2xl font-black text-purple-900 mt-0.5">{monthlyReport.totalStudents}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
                <span className="text-[11px] font-bold text-rose-800 uppercase">Below 75% Defaulters</span>
                <p className="text-2xl font-black text-rose-900 mt-0.5">{monthlyReport.lowAttendanceCount}</p>
              </div>
            </div>
          )}

          {/* Monthly Register Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4">Roll</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">User ID</th>
                    <th className="py-3 px-4 text-center">Total Sessions</th>
                    <th className="py-3 px-4 text-center">Present</th>
                    <th className="py-3 px-4 text-center">Absent</th>
                    <th className="py-3 px-4 text-center">Late / Half</th>
                    <th className="py-3 px-4 text-center">Attendance %</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingMonthly ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Generating monthly register report...
                      </td>
                    </tr>
                  ) : !monthlyReport?.studentStats?.length ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-slate-400">
                        No enrolled students or attendance sessions found for this month.
                      </td>
                    </tr>
                  ) : (
                    monthlyReport.studentStats.map((st: any) => (
                      <tr key={st.studentId} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-700">#{st.rollNumber}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{st.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{st.userId}</td>
                        <td className="py-3 px-4 text-center font-medium">{st.totalSessions}</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-700">{st.presentCount}</td>
                        <td className="py-3 px-4 text-center font-bold text-rose-700">{st.absentCount}</td>
                        <td className="py-3 px-4 text-center font-bold text-amber-700">{st.lateCount}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-black text-sm ${
                              st.percentage >= 75 ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {st.percentage}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {st.isLowAttendance ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
                              Defaulter (&lt;75%)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                              Eligible
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CORRECTION APPROVALS ================= */}
      {activeTab === 'corrections' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Student Attendance Correction Requests
              </h3>
              <p className="text-[11px] text-slate-500">
                Review and approve student roll call corrections. Approving a request automatically updates the attendance document.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Filter:</span>
              {(['Pending', 'Approved', 'Rejected', 'All'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setCorrectionFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    correctionFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Session Date</th>
                    <th className="py-3 px-4">Marked As</th>
                    <th className="py-3 px-4">Requested</th>
                    <th className="py-3 px-4">Student Explanation</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingCorrections ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Loading correction requests...
                      </td>
                    </tr>
                  ) : corrections.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        No {correctionFilter !== 'All' ? correctionFilter.toLowerCase() : ''} correction requests found.
                      </td>
                    </tr>
                  ) : (
                    corrections.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900 text-sm">{c.student?.name}</p>
                          <span className="text-[11px] font-mono text-slate-400">{c.student?.userId}</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {c.class?.name} (Sec {c.section})
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">{formatDate(c.date)}</td>
                        <td className="py-3 px-4 font-bold text-rose-700">{c.currentStatus}</td>
                        <td className="py-3 px-4 font-bold text-emerald-700">{c.requestedStatus}</td>
                        <td className="py-3 px-4 text-slate-700 max-w-xs">{c.reason}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              c.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {c.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleReviewCorrection(c._id, 'Approved', c.student?.name)}
                                disabled={actionProcessingId === c._id}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleReviewCorrection(c._id, 'Rejected', c.student?.name)}
                                disabled={actionProcessingId === c._id}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium italic">
                              {c.reviewRemarks || `Processed`}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
