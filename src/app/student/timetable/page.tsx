'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Calendar,
  Clock,
  MapPin,
  Coffee,
  CheckCircle2,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import { authFetch } from '@/lib/api';

export default function StudentTimetablePage() {
  const [timetables, setTimetables] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);

  const workingDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const holidayDays = ['Saturday'];
  const isSelectedDayHoliday = holidayDays.includes(selectedDay);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/timetable');
      const data = await res.json();
      if (data.success && data.timetables) {
        setTimetables(data.timetables);
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

  const currentDayEntry = timetables.find((t) => t.day === selectedDay);
  const activePeriods = currentDayEntry?.periods || [];

  return (
    <DashboardShell
      title="Class Weekly Timetable"
      subtitle="View your daily periods, subject assignments, teacher in charge, and classroom locations"
      allowedRoles={['student']}
      onRefresh={fetchTimetable}
    >
      {/* Day Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-4">
        <span className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
          Select Day of Week:
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

          {/* Saturday - FIXED HOLIDAY (OFF BY DEFAULT) */}
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
        </div>
      </div>

      {/* HOLIDAY SCREEN (Saturday & Sunday) */}
      {isSelectedDayHoliday ? (
        <div className="bg-white rounded-2xl border border-rose-200 p-10 text-center shadow-xs">
          <Coffee className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-black text-slate-900">
            {selectedDay} is a Weekly Holiday — School Closed
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
            There are no classes or academic lectures scheduled for <strong>{selectedDay}</strong>. Enjoy
            your weekly holiday!
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Regular school hours: Monday to Friday (08:30 AM — 02:15 PM)</span>
          </div>
        </div>
      ) : (
        /* WORKING DAY SCHEDULE */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-800">
                {selectedDay} Schedule — Classroom Timetable
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
              {activePeriods.length} Scheduled Periods & Breaks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {activePeriods.length > 0 ? (
              activePeriods.map((p: any) => (
                <div
                  key={p.periodNumber}
                  className={`p-4 rounded-xl border transition ${
                    p.isBreak
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-slate-50/80 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                    <span className="font-bold text-slate-800">
                      {p.isBreak ? 'Recess / Break' : `Period ${p.periodNumber}`}
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-semibold border text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{p.isBreak ? 'Campus Ground' : p.room || 'Room 101'}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-1">
                    {p.isBreak ? p.title || 'Lunch / Recess' : p.subject?.name || 'Subject'}
                  </h4>

                  {!p.isBreak && (
                    <>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-emerald-700 font-mono font-bold">
                          {p.subject?.code}
                        </span>
                        {p.subject?.type && (
                          <span className="text-[9px] uppercase font-bold text-slate-400">
                            • {p.subject.type}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 font-medium mt-2 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Teacher: <strong>{p.teacher?.name || 'Assigned Educator'}</strong></span>
                      </p>
                    </>
                  )}

                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {p.startTime} — {p.endTime}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 py-12 text-center text-slate-400 text-xs">
                No class schedule found for {selectedDay}.
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
