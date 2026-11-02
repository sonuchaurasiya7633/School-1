'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { CalendarCheck, Save, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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
      const allStudents = dataStudents.students || [];

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

  const handleSave = async () => {
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
        alert('Attendance submitted successfully!');
        fetchAttendance();
      } else {
        alert(data.message || 'Error recording attendance.');
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
      title="Class Attendance Register"
      subtitle="Take daily attendance for assigned classroom sections"
      allowedRoles={['teacher']}
      onRefresh={fetchAttendance}
    >
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
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold"
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
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || records.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Submitting...' : 'Submit Attendance Register'}</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
          <span className="text-xs font-bold text-emerald-800">Present</span>
          <p className="text-xl font-black text-emerald-700">{presentCount}</p>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
          <span className="text-xs font-bold text-rose-800">Absent</span>
          <p className="text-xl font-black text-rose-700">{absentCount}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
          <span className="text-xs font-bold text-amber-800">Late</span>
          <p className="text-xl font-black text-amber-700">{lateCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Roll</th>
                <th className="py-3 px-4 whitespace-nowrap">Student Name</th>
                <th className="py-3 px-4 whitespace-nowrap">Mark Status</th>
                <th className="py-3 px-4 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r, idx) => (
                <tr key={r.studentId} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap">#{r.rollNumber}</td>
                  <td className="py-3 px-4 font-bold text-slate-800 text-sm whitespace-nowrap">{r.name}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {['Present', 'Absent', 'Late'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(idx, st)}
                          className={`px-3 py-1 rounded-md font-bold text-xs transition ${
                            r.status === st
                              ? st === 'Present'
                                ? 'bg-emerald-600 text-white'
                                : st === 'Absent'
                                ? 'bg-rose-600 text-white'
                                : 'bg-amber-500 text-white'
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
                      placeholder="e.g. Leave note, tardy..."
                      className="w-full max-w-xs px-2 py-1 text-xs border border-slate-200 rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
