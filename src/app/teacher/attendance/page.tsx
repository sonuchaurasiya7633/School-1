'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  CalendarCheck,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Calendar,
  AlertCircle,
  RefreshCw,
  History,
  CheckSquare,
  XSquare,
  BookOpen,
} from 'lucide-react';
import { authFetch } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function TeacherAttendancePage() {
  const [activeTab, setActiveTab] = useState<'register' | 'history'>('register');
  const [classes, setClasses] = useState<any[]>([]);
  const [teacherAssigned, setTeacherAssigned] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<any[]>([]);
  const [existingAttDoc, setExistingAttDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // 1. Initial Load: Fetch Teacher Profile and Classes
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [resProfile, resClasses] = await Promise.all([
          authFetch('/api/user/profile'),
          authFetch('/api/admin/classes'),
        ]);

        const dataProfile = await resProfile.json();
        const dataClasses = await resClasses.json();

        const allClasses = dataClasses.classes || [];
        setClasses(allClasses);

        let defaultClassId = '';
        let defaultSection = 'A';

        // Check if teacher has assigned classes
        if (dataProfile.success && dataProfile.profile?.assignedClasses?.length > 0) {
          const assigned = dataProfile.profile.assignedClasses;
          setTeacherAssigned(assigned);
          const first = assigned[0];
          defaultClassId = first.class?._id || first.class;
          defaultSection = first.section || 'A';
        } else if (allClasses.length > 0) {
          defaultClassId = allClasses[0]._id;
        }

        if (defaultClassId) {
          setSelectedClass(defaultClassId);
          setSelectedSection(defaultSection);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // 2. Fetch Attendance for Selected Class + Section + Date
  const fetchAttendance = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const [resAtt, resStudents] = await Promise.all([
        authFetch(`/api/attendance?date=${selectedDate}&classId=${selectedClass}&section=${selectedSection}`),
        authFetch(`/api/admin/students?classId=${selectedClass}&section=${selectedSection}`),
      ]);

      const dataAtt = await resAtt.json();
      const dataStudents = await resStudents.json();

      const existingAtt = dataAtt.attendances?.[0] || null;
      setExistingAttDoc(existingAtt);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance();
    }
  }, [selectedClass, selectedSection, selectedDate]);

  // 3. Fetch History of sessions taken
  const fetchHistory = async () => {
    if (!selectedClass) return;
    try {
      setLoadingHistory(true);
      const res = await authFetch(`/api/attendance?classId=${selectedClass}&section=${selectedSection}`);
      const data = await res.json();
      if (data.success) {
        setHistoryList(data.attendances || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab, selectedClass, selectedSection]);

  // Bulk actions
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

  // Submit attendance register
  const handleSave = async () => {
    if (records.length === 0) {
      alert('No enrolled students in this class to record.');
      return;
    }

    try {
      setSaving(true);
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
        alert('Attendance register successfully saved & synchronized!');
        await fetchAttendance();
      } else {
        alert(data.message || 'Error recording attendance.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving attendance.');
    } finally {
      setSaving(false);
    }
  };

  // Counts
  const totalCount = records.length;
  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;
  const lateCount = records.filter((r) => r.status === 'Late' || r.status === 'Half Day').length;
  const attendanceRate = totalCount > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalCount) * 100) : 0;

  // Check if date is Sunday
  const isSunday = new Date(selectedDate).getDay() === 0;

  return (
    <DashboardShell
      title="Class Attendance Register"
      subtitle="Take daily attendance, edit existing registers, and verify student records"
      allowedRoles={['teacher']}
      onRefresh={fetchAttendance}
    >
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('register')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'register'
              ? 'bg-[#214F39] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Mark / Edit Register</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'history'
              ? 'bg-[#214F39] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Past Attendance Log</span>
        </button>
      </div>

      {activeTab === 'register' ? (
        <>
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
                  className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Class &amp; Stream
                </label>
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
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Section
                </label>
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
                onClick={handleSave}
                disabled={saving || records.length === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>
                  {saving
                    ? 'Saving...'
                    : existingAttDoc
                    ? 'Update Register'
                    : 'Submit Register'}
                </span>
              </button>
            </div>
          </div>

          {/* Overwrite & Status Notice */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2 text-xs">
              {existingAttDoc ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Marked for {formatDate(selectedDate)} by {existingAttDoc.recordedBy?.name || 'Faculty'}
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>New Roll Call — Not marked yet for {formatDate(selectedDate)}</span>
                </span>
              )}

              {isSunday && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Sunday (School Holiday)</span>
                </span>
              )}
            </div>

            {/* Bulk Action Buttons */}
            {records.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">Quick Actions:</span>
                <button
                  type="button"
                  onClick={() => markAll('Present')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition"
                >
                  <CheckSquare className="w-3 h-3" />
                  <span>All Present</span>
                </button>
                <button
                  type="button"
                  onClick={() => markAll('Absent')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 text-[11px] font-bold transition"
                >
                  <XSquare className="w-3 h-3" />
                  <span>All Absent</span>
                </button>
              </div>
            )}
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">Present</span>
              <p className="text-xl sm:text-2xl font-black text-emerald-700">{presentCount}</p>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold text-rose-800 uppercase">Absent</span>
              <p className="text-xl sm:text-2xl font-black text-rose-700">{absentCount}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold text-amber-800 uppercase">Late / Half</span>
              <p className="text-xl sm:text-2xl font-black text-amber-700">{lateCount}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold text-blue-800 uppercase">Class Rate</span>
              <p className="text-xl sm:text-2xl font-black text-blue-700">{attendanceRate}%</p>
            </div>
          </div>

          {/* Students Roll Call Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 whitespace-nowrap">Roll #</th>
                    <th className="py-3 px-4 whitespace-nowrap">Student Name</th>
                    <th className="py-3 px-4 whitespace-nowrap">User ID</th>
                    <th className="py-3 px-4 whitespace-nowrap">Mark Status</th>
                    <th className="py-3 px-4 whitespace-nowrap">Teacher Remarks / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Loading classroom students...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        No enrolled students found in this class &amp; section.
                      </td>
                    </tr>
                  ) : (
                    records.map((r, idx) => (
                      <tr key={r.studentId} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap">
                          #{r.rollNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 text-sm whitespace-nowrap">
                          {r.name}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                          {r.userId}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
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
                        <td className="py-3 px-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={r.remarks}
                            onChange={(e) => handleRemarksChange(idx, e.target.value)}
                            placeholder="Optional reason (e.g. sick leave, tardy)"
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
        </>
      ) : (
        /* History Tab */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Recorded Attendance Registers
              </h3>
              <p className="text-[11px] text-slate-500">
                All daily attendance sessions submitted for {classes.find((c) => c._id === selectedClass)?.name} (Sec {selectedSection})
              </p>
            </div>
            <button
              onClick={fetchHistory}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4">Present</th>
                  <th className="py-3 px-4">Absent</th>
                  <th className="py-3 px-4">Recorded By</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingHistory ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Loading history...
                    </td>
                  </tr>
                ) : historyList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No attendance sessions recorded yet for this class &amp; section.
                    </td>
                  </tr>
                ) : (
                  historyList.map((h) => {
                    const pres = h.records.filter((r: any) => r.status === 'Present').length;
                    const abs = h.records.filter((r: any) => r.status === 'Absent').length;
                    return (
                      <tr key={h._id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{formatDate(h.date)}</td>
                        <td className="py-3 px-4">{h.class?.name}</td>
                        <td className="py-3 px-4 font-semibold">{h.section}</td>
                        <td className="py-3 px-4 font-bold text-emerald-700">{pres}</td>
                        <td className="py-3 px-4 font-bold text-rose-700">{abs}</td>
                        <td className="py-3 px-4 text-slate-600">{h.recordedBy?.name || 'Teacher'}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedDate(h.date);
                              setActiveTab('register');
                            }}
                            className="px-2.5 py-1 bg-[#214F39] text-white rounded text-[11px] font-bold hover:bg-emerald-800 transition"
                          >
                            Edit Register
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
