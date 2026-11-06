'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Calendar,
  Plus,
  Save,
  Clock,
  BookOpen,
  User,
  X,
  AlertTriangle,
  Coffee,
  CheckCircle2,
  Copy,
  ShieldAlert,
} from 'lucide-react';
import { authFetch } from '@/lib/api';

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
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string; conflicts?: string[] } | null>(null);

  const workingDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const holidayDays = ['Saturday'];
  const isSelectedDayHoliday = holidayDays.includes(selectedDay);

  const defaultSlots = [
    { periodNumber: 1, startTime: '08:30 AM', endTime: '09:15 AM', subject: '', teacher: '', room: 'Room 101', isBreak: false, title: '' },
    { periodNumber: 2, startTime: '09:15 AM', endTime: '10:00 AM', subject: '', teacher: '', room: 'Room 101', isBreak: false, title: '' },
    { periodNumber: 3, startTime: '10:00 AM', endTime: '10:45 AM', subject: '', teacher: '', room: 'Room 101', isBreak: false, title: '' },
    { periodNumber: 4, startTime: '10:45 AM', endTime: '11:15 AM', subject: '', teacher: '', room: '', isBreak: true, title: 'Recess / Snack Break' },
    { periodNumber: 5, startTime: '11:15 AM', endTime: '12:00 PM', subject: '', teacher: '', room: 'Computer Lab', isBreak: false, title: '' },
    { periodNumber: 6, startTime: '12:00 PM', endTime: '12:45 PM', subject: '', teacher: '', room: 'Science Lab', isBreak: false, title: '' },
    { periodNumber: 7, startTime: '12:45 PM', endTime: '01:30 PM', subject: '', teacher: '', room: '', isBreak: true, title: 'Lunch Break' },
    { periodNumber: 8, startTime: '01:30 PM', endTime: '02:15 PM', subject: '', teacher: '', room: 'Room 101', isBreak: false, title: '' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resC, resS, resT] = await Promise.all([
        authFetch('/api/admin/classes'),
        authFetch('/api/admin/subjects'),
        authFetch('/api/admin/teachers'),
      ]);

      const dataC = await resC.json();
      const dataS = await resS.json();
      const dataT = await resT.json();

      if (dataC.success && dataC.classes?.length > 0) {
        setClasses(dataC.classes);
        if (!selectedClass) setSelectedClass(dataC.classes[0]._id);
      }
      if (dataS.success) setSubjects(dataS.subjects || []);
      if (dataT.success) setTeachers(dataT.teachers || []);
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
    if (!selectedClass || isSelectedDayHoliday) return;
    try {
      setFeedback(null);
      const res = await authFetch(`/api/timetable?classId=${selectedClass}&section=${selectedSection}&day=${selectedDay}`);
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
              isBreak: Boolean(p.isBreak),
              title: p.title || '',
            }))
          );
        } else {
          // Initialize template with subjects and teachers
          const subId = subjects[0]?._id || '';
          const tchId = teachers[0]?.user?._id || '';
          setPeriods(
            defaultSlots.map((s, idx) => ({
              ...s,
              subject: s.isBreak ? '' : subjects[idx % subjects.length]?._id || subId,
              teacher: s.isBreak ? '' : teachers[idx % teachers.length]?.user?._id || tchId,
            }))
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedClass && !isSelectedDayHoliday) {
      fetchTimetable();
    }
  }, [selectedClass, selectedSection, selectedDay, subjects, teachers]);

  const handlePeriodChange = (index: number, field: string, value: any) => {
    const updated = [...periods];
    updated[index][field] = value;
    if (field === 'isBreak' && value === true) {
      updated[index].subject = '';
      updated[index].teacher = '';
      if (!updated[index].title) updated[index].title = 'Break';
    }
    setPeriods(updated);
  };

  const handleSave = async (force = false) => {
    if (isSelectedDayHoliday) {
      alert(`Cannot schedule periods on ${selectedDay}. ${selectedDay} is a fixed weekly holiday (OFF).`);
      return;
    }

    try {
      setSaving(true);
      setFeedback(null);

      const res = await authFetch('/api/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass,
          section: selectedSection,
          day: selectedDay,
          periods,
          forceSave: force,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          text: `Timetable for ${selectedDay} saved successfully with zero conflicts!`,
        });
        fetchTimetable();
      } else if (data.hasConflicts) {
        setFeedback({
          type: 'error',
          text: data.message,
          conflicts: data.conflicts,
        });
      } else {
        setFeedback({
          type: 'error',
          text: data.message || 'Error saving timetable schedule.',
        });
      }
    } catch (err: any) {
      console.error(err);
      setFeedback({ type: 'error', text: err.message || 'Network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyToAllWorkingDays = async () => {
    if (isSelectedDayHoliday) return;
    if (!confirm(`Do you want to copy the ${selectedDay} schedule to Tuesday, Wednesday, Thursday, and Friday for this class & section?`)) {
      return;
    }

    try {
      setSaving(true);
      setFeedback(null);
      const otherWorkingDays = workingDays.filter((d) => d !== selectedDay);

      for (const targetDay of otherWorkingDays) {
        await authFetch('/api/timetable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            classId: selectedClass,
            section: selectedSection,
            day: targetDay,
            periods,
            forceSave: true,
          }),
        });
      }

      setFeedback({
        type: 'success',
        text: `Successfully replicated timetable to all working days (Monday — Friday)!`,
      });
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error copying schedule.' });
    } finally {
      setSaving(false);
    }
  };

  const addPeriodRow = (isBreak = false) => {
    const nextNum = periods.length + 1;
    setPeriods([
      ...periods,
      {
        periodNumber: nextNum,
        startTime: '02:15 PM',
        endTime: '03:00 PM',
        subject: isBreak ? '' : subjects[0]?._id || '',
        teacher: isBreak ? '' : teachers[0]?.user?._id || '',
        room: isBreak ? '' : 'Room 101',
        isBreak,
        title: isBreak ? 'Short Break' : '',
      },
    ]);
  };

  const removePeriodRow = (index: number) => {
    setPeriods(periods.filter((_, i) => i !== index));
  };

  const currentClassObj = classes.find((c) => c._id === selectedClass);
  const sectionsList = currentClassObj?.sections || ['A', 'B'];

  return (
    <DashboardShell
      title="Timetable & Schedule Management"
      subtitle="Design weekly class timetables, configure period timings, break intervals, and eliminate teacher overlaps"
      allowedRoles={['admin']}
      onRefresh={fetchTimetable}
    >
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 mb-4 rounded-xl text-xs font-semibold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-bold">{feedback.text}</p>
              {feedback.conflicts && feedback.conflicts.length > 0 && (
                <ul className="list-disc pl-5 mt-2 space-y-1 text-rose-700">
                  {feedback.conflicts.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Class, Section & Working Day Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Class Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Select Class *</label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  const cl = classes.find((c) => c._id === e.target.value);
                  if (cl && cl.sections && cl.sections.length > 0) {
                    setSelectedSection(cl.sections[0]);
                  }
                }}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold bg-slate-50"
              >
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold bg-slate-50"
              >
                {sectionsList.map((sec: string) => (
                  <option key={sec} value={sec}>
                    Section {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          {!isSelectedDayHoliday && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyToAllWorkingDays}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                title="Copy current day schedule to all working days"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy to All Working Days</span>
              </button>

              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Validating & Saving...' : 'Save Schedule'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Working Day Selector Tabs */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <span className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
            Weekly Working Days & Holiday Schedule:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Monday - Friday */}
            {workingDays.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedDay === day
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{day}</span>
              </button>
            ))}

            {/* Saturday - FIXED HOLIDAY (OFF BY DEFAULT) */}
            <button
              onClick={() => setSelectedDay('Saturday')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                selectedDay === 'Saturday'
                  ? 'bg-rose-600 text-white border-rose-700'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <span>Saturday (OFF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* HOLIDAY SCREEN (Saturday & Sunday) */}
      {isSelectedDayHoliday ? (
        <div className="bg-white rounded-2xl border border-rose-200 p-10 text-center shadow-xs">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-black text-slate-900">
            {selectedDay} is a Mandatory Weekly Holiday (OFF)
          </h3>
          <p className="text-xs text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
            In accordance with the school academic calendar policy, <strong>Saturday and Sunday</strong> are
            designated weekly holidays. School is closed. No teaching periods, classes, or teacher duty
            assignments can be scheduled on these days.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold">
            <span>Official Operating Hours: Monday to Friday (08:30 AM — 02:15 PM)</span>
          </div>
        </div>
      ) : (
        /* WORKING DAY PERIOD EDITOR */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                {selectedDay} Schedule — {currentClassObj?.name} (Section {selectedSection})
              </h3>
              <p className="text-[11px] text-slate-500">
                Total Configured Slots: {periods.length} (including breaks)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => addPeriodRow(false)}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Class Period</span>
              </button>

              <button
                type="button"
                onClick={() => addPeriodRow(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Add Break / Lunch</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-center">Period #</th>
                  <th className="py-3 px-4">Start Time</th>
                  <th className="py-3 px-4">End Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Subject / Activity</th>
                  <th className="py-3 px-4">Assigned Educator</th>
                  <th className="py-3 px-4">Room / Facility</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {periods.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No periods configured for {selectedDay}. Click "Add Class Period" to get started.
                    </td>
                  </tr>
                ) : (
                  periods.map((p, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        p.isBreak ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-bold text-slate-700 whitespace-nowrap">
                        {p.isBreak ? (
                          <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                            BREAK
                          </span>
                        ) : (
                          `Period ${p.periodNumber || idx + 1}`
                        )}
                      </td>

                      {/* Start Time */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={p.startTime}
                          onChange={(e) => handlePeriodChange(idx, 'startTime', e.target.value)}
                          placeholder="08:30 AM"
                          className="w-24 px-2 py-1 border border-slate-200 rounded text-xs font-medium"
                        />
                      </td>

                      {/* End Time */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={p.endTime}
                          onChange={(e) => handlePeriodChange(idx, 'endTime', e.target.value)}
                          placeholder="09:15 AM"
                          className="w-24 px-2 py-1 border border-slate-200 rounded text-xs font-medium"
                        />
                      </td>

                      {/* Period Type Toggle */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <select
                          value={p.isBreak ? 'break' : 'class'}
                          onChange={(e) =>
                            handlePeriodChange(idx, 'isBreak', e.target.value === 'break')
                          }
                          className="px-2 py-1 border border-slate-200 rounded text-[11px] font-semibold"
                        >
                          <option value="class">Class Period</option>
                          <option value="break">Recess / Break</option>
                        </select>
                      </td>

                      {/* Subject or Break Title */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {p.isBreak ? (
                          <input
                            type="text"
                            value={p.title}
                            onChange={(e) => handlePeriodChange(idx, 'title', e.target.value)}
                            placeholder="e.g. Lunch Break / Recess"
                            className="w-48 px-2 py-1 border border-amber-300 rounded text-xs font-bold text-amber-800 bg-amber-50"
                          />
                        ) : (
                          <select
                            value={p.subject}
                            onChange={(e) => handlePeriodChange(idx, 'subject', e.target.value)}
                            className="w-48 px-2 py-1 border border-slate-200 rounded text-xs font-semibold"
                          >
                            <option value="">Select Subject</option>
                            {subjects.map((s) => (
                              <option key={s._id} value={s._id}>
                                {s.name} ({s.code})
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      {/* Educator */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {p.isBreak ? (
                          <span className="text-slate-400 italic text-[11px]">— Duty Free —</span>
                        ) : (
                          <select
                            value={p.teacher}
                            onChange={(e) => handlePeriodChange(idx, 'teacher', e.target.value)}
                            className="w-48 px-2 py-1 border border-slate-200 rounded text-xs"
                          >
                            <option value="">Select Faculty Teacher</option>
                            {teachers.map((t) => (
                              <option key={t.user?._id || t._id} value={t.user?._id || t._id}>
                                {t.user?.name || 'Teacher'} ({t.user?.userId || 'TCH'})
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      {/* Room */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {p.isBreak ? (
                          <span className="text-slate-400 italic text-[11px]">Cafeteria / Ground</span>
                        ) : (
                          <input
                            type="text"
                            value={p.room}
                            onChange={(e) => handlePeriodChange(idx, 'room', e.target.value)}
                            placeholder="Room 101"
                            className="w-28 px-2 py-1 border border-slate-200 rounded text-xs"
                          />
                        )}
                      </td>

                      {/* Delete Row */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => removePeriodRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                          title="Remove period"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
