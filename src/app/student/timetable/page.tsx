'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function StudentTimetablePage() {
  const [timetables, setTimetables] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/timetable');
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

  return (
    <DashboardShell
      title="Class Weekly Timetable"
      subtitle="View your daily periods, subject assignments, teacher in charge, and classroom locations"
      allowedRoles={['student']}
      onRefresh={fetchTimetable}
    >
      {/* Day Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              selectedDay === day
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-800">
              {selectedDay} Schedule — Classroom Timetable
            </h3>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
            {currentDayEntry?.periods?.length || 5} Periods
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {currentDayEntry?.periods?.length > 0 ? (
            currentDayEntry.periods.map((p: any) => (
              <div
                key={p.periodNumber}
                className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 hover:border-emerald-400 transition"
              >
                <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                  <span className="font-bold text-slate-700">Period {p.periodNumber}</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border">{p.room || 'Room 201'}</span>
                </div>

                <h4 className="font-bold text-sm text-slate-800">{p.subject?.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1">Teacher: {p.teacher?.name}</p>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{p.startTime} - {p.endTime}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-5 py-12 text-center text-slate-400 text-xs">
              No class schedule found for {selectedDay}.
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
