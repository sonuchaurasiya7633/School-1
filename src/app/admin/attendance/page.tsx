'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { CalendarCheck, Calendar, Filter, Save, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AdminAttendancePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/classes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.classes?.length > 0) {
          setClasses(data.classes);
          setSelectedClass(data.classes[0]._id);
        }
      });
  }, []);

  const fetchAttendance = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const [resAtt, resStudents] = await Promise.all([
        fetch(`/api/attendance?date=${selectedDate}&classId=${selectedClass}&section=${selectedSection}`),
        fetch(`/api/admin/students?classId=${selectedClass}&section=${selectedSection}`),
      ]);

      const dataAtt = await resAtt.json();
      const dataStudents = await resStudents.json();

      const existingAtt = dataAtt.attendances?.[0];
      setAttendance(existingAtt);

      const allStudents = dataStudents.students || [];
      setStudents(allStudents);

      // Populate records array
      if (existingAtt && existingAtt.records?.length > 0) {
        const mapped = allStudents.map((st: any) => {
          const rec = existingAtt.records.find((r: any) => r.student?._id === st.user?._id || r.student === st.user?._id);
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

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/attendance', {
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
        alert('Attendance entries saved/corrected successfully!');
        fetchAttendance();
      } else {
        alert(data.message || 'Error saving attendance.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;
  const lateCount = records.filter((r) => r.status === 'Late' || r.status === 'Half Day').length;

  return (
    <DashboardShell
      title="Attendance Management"
      subtitle="View, verify, and correct student attendance registers"
      allowedRoles={['admin']}
      onRefresh={fetchAttendance}
    >
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSaveAttendance}
          disabled={saving || records.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save & Correct Entries'}</span>
        </button>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800">Present Today</span>
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
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
                        className="w-full max-w-xs px-2 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
