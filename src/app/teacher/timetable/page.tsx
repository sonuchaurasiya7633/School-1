'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  Coffee,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { authFetch } from '@/lib/api';

export default function TeacherTimetablePage() {
  const [timetables, setTimetables] = useState<any[]>([]);
  const [teacherTimetable, setTeacherTimetable] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);

  const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const holidayDays = ['Saturday', 'Sunday'];
  const isSelectedDayHoliday = holidayDays.includes(selectedDay);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/timetable');
      const data = await res.json();
      if (data.success) {
        setTimetables(data.timetables || []);
        setTeacherTimetable(data.teacherTimetable || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  // Filter schedule for the selected day across all classes where this teacher teaches
  const activeDayPeriods: Array<{
    periodNumber: number;
    startTime: string;
    endTime: string;
    className: string;
    section: string;
    subjectName: string;
    subjectCode: string;
    room: string;
    isBreak?: boolean;
    title?: string;
  }> = [];

  const sourceList = teacherTimetable.length > 0 ? teacherTimetable : timetables;

  sourceList.forEach((tt) => {
    if (tt.day === selectedDay) {
      const clsName = tt.class?.name || 'Class';
      const sec = tt.section || 'A';

      tt.periods?.forEach((p: any) => {
        activeDayPeriods.push({
          periodNumber: p.periodNumber,
          startTime: p.startTime,
          endTime: p.endTime,
          className: clsName,
          section: sec,
          subjectName: p.subject?.name || p.title || 'Period',
          subjectCode: p.subject?.code || '',
          room: p.room || 'Room 101',
          isBreak: Boolean(p.isBreak),
          title: p.title,
        });
      });
    }
  });

  // Sort by start time / period number
  activeDayPeriods.sort((a, b) => a.periodNumber - b.periodNumber);

  return (
    <DashboardShell
      title="My Faculty Teaching Schedule"
      subtitle="View your daily assigned classes, period timings, room allocations, and weekly teaching schedule"
      allowedRoles={['teacher']}
      onRefresh={fetchTimetable}
    >
      {/* Day Selector Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-4">
        <span className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
          Select Academic Day:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap">
          {workingDays.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                selectedDay === day
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{day}</span>
            </button>
          ))}

          {/* Saturday - FIXED HOLIDAY */}
          <button
            onClick={() => setSelectedDay('Saturday')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              selectedDay === 'Saturday'
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <span>Saturday (OFF)</span>
          </button>

          {/* Sunday - FIXED HOLIDAY */}
          <button
            onClick={() => setSelectedDay('Sunday')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              selectedDay === 'Sunday'
                ? 'bg-stone-700 text-white border-stone-800'
                : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
            }`}
          >
            <span>Sunday (OFF)</span>
          </button>
        </div>
      </div>

      {/* HOLIDAY SCREEN (Saturday & Sunday) */}
      {isSelectedDayHoliday ? (
        <div className="bg-white rounded-2xl border border-rose-200 p-10 text-center shadow-xs">
          <Coffee className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-black text-slate-900">
            {selectedDay} is a Weekly Holiday (School Closed)
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
            Faculty and students are off on <strong>{selectedDay}s</strong>. No teaching periods or academic
            responsibilities are scheduled.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Regular classes resume on Monday at 08:30 AM</span>
          </div>
        </div>
      ) : (
        /* WORKING DAY TEACHING SLOTS */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-800">
                {selectedDay} Assigned Teaching Periods
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
              {activeDayPeriods.length} Teaching Duties Scheduled
            </span>
          </div>

          {activeDayPeriods.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No teaching periods scheduled for you on {selectedDay}.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {activeDayPeriods.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition ${
                    p.isBreak
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50/80 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                    <span className="font-bold text-slate-800">
                      {p.isBreak ? 'Recess' : `Period ${p.periodNumber}`}
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-semibold border text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{p.room}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-1">{p.subjectName}</h4>
                  {p.subjectCode && (
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">
                      {p.subjectCode}
                    </span>
                  )}

                  <p className="text-xs font-semibold text-slate-700 mt-2">
                    Class: <span className="text-emerald-800">{p.className}</span> (Sec {p.section})
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {p.startTime} — {p.endTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
