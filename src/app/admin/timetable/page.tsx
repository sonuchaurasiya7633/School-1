'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Calendar, Plus, Save, Clock, BookOpen, User, X } from 'lucide-react';

export default function AdminTimetablePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [periods, setPeriods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const defaultSlots = [
    { periodNumber: 1, startTime: '08:30 AM', endTime: '09:15 AM', subject: '', teacher: '', room: 'Room 201' },
    { periodNumber: 2, startTime: '09:15 AM', endTime: '10:00 AM', subject: '', teacher: '', room: 'Physics Lab' },
    { periodNumber: 3, startTime: '10:00 AM', endTime: '10:45 AM', subject: '', teacher: '', room: 'Room 201' },
    { periodNumber: 4, startTime: '11:00 AM', endTime: '11:45 AM', subject: '', teacher: '', room: 'Computer Lab' },
    { periodNumber: 5, startTime: '11:45 AM', endTime: '12:30 PM', subject: '', teacher: '', room: 'Room 201' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resC, resS, resT] = await Promise.all([
        fetch('/api/admin/classes'),
        fetch('/api/admin/subjects'),
        fetch('/api/admin/teachers'),
      ]);

      const dataC = await resC.json();
      const dataS = await resS.json();
      const dataT = await resT.json();

      if (dataC.success && dataC.classes?.length > 0) {
        setClasses(dataC.classes);
        if (!selectedClass) setSelectedClass(dataC.classes[0]._id);
      }
      if (dataS.success) setSubjects(dataS.subjects);
      if (dataT.success) setTeachers(dataT.teachers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchTimetable = async () => {
    if (!selectedClass) return;
    try {
      const res = await fetch(`/api/timetable?classId=${selectedClass}&section=${selectedSection}`);
      const data = await res.json();
      if (data.success && data.timetables) {
        const dayEntry = data.timetables.find((t: any) => t.day === selectedDay);
        if (dayEntry && dayEntry.periods?.length > 0) {
          setPeriods(
            dayEntry.periods.map((p: any) => ({
              periodNumber: p.periodNumber,
              startTime: p.startTime,
              endTime: p.endTime,
              subject: p.subject?._id || p.subject || '',
              teacher: p.teacher?._id || p.teacher || '',
              room: p.room || 'Room 101',
            }))
          );
        } else {
          // Initialize with default template using available subjects/teachers
          const subId = subjects[0]?._id || '';
          const tchId = teachers[0]?.user?._id || '';
          setPeriods(
            defaultSlots.map((s, idx) => ({
              ...s,
              subject: subjects[idx % subjects.length]?._id || subId,
              teacher: teachers[idx % teachers.length]?.user?._id || tchId,
            }))
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable();
    }
  }, [selectedClass, selectedSection, selectedDay, subjects, teachers]);

  const handlePeriodChange = (index: number, field: string, value: any) => {
    const updated = [...periods];
    updated[index][field] = value;
    setPeriods(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass,
          section: selectedSection,
          day: selectedDay,
          periods,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Timetable schedule saved successfully!');
        fetchTimetable();
      } else {
        alert(data.message || 'Error saving timetable.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addPeriodRow = () => {
    const nextNum = periods.length + 1;
    setPeriods([
      ...periods,
      {
        periodNumber: nextNum,
        startTime: '01:00 PM',
        endTime: '01:45 PM',
        subject: subjects[0]?._id || '',
        teacher: teachers[0]?.user?._id || '',
        room: 'Room 201',
      },
    ]);
  };

  const removePeriodRow = (index: number) => {
    setPeriods(periods.filter((_, i) => i !== index));
  };

  return (
    <DashboardShell
      title="Timetable Management"
      subtitle="Design weekly class schedules, period timings, subject allocations, and faculty duties"
      allowedRoles={['admin']}
      onRefresh={fetchTimetable}
    >
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
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
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={addPeriodRow}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Period Slot</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Schedule'}</span>
          </button>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              selectedDay === day
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Period Slots Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-xs text-slate-800">
              {selectedDay} Schedule — Periods List
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Total Periods: {periods.length}</span>
        </div>

        <div className="p-4 space-y-3">
          {periods.map((p, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-6 gap-3 p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl items-center text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0">
                  {p.periodNumber}
                </span>
                <span className="font-bold text-slate-700">Period {p.periodNumber}</span>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Time Slot</label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={p.startTime}
                    onChange={(e) => handlePeriodChange(idx, 'startTime', e.target.value)}
                    className="w-20 px-2 py-1 border border-slate-300 rounded text-center text-xs"
                  />
                  <span>-</span>
                  <input
                    type="text"
                    value={p.endTime}
                    onChange={(e) => handlePeriodChange(idx, 'endTime', e.target.value)}
                    className="w-20 px-2 py-1 border border-slate-300 rounded text-center text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Subject</label>
                <select
                  value={p.subject}
                  onChange={(e) => handlePeriodChange(idx, 'subject', e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-800"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Teacher</label>
                <select
                  value={p.teacher}
                  onChange={(e) => handlePeriodChange(idx, 'teacher', e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-800"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.user?._id} value={t.user?._id}>
                      {t.user?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Classroom / Lab</label>
                <input
                  type="text"
                  value={p.room}
                  onChange={(e) => handlePeriodChange(idx, 'room', e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removePeriodRow(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
