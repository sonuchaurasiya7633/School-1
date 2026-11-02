'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Calendar, Clock, BookOpen, MapPin } from 'lucide-react';

export default function TeacherTimetablePage() {
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

  const activeDaySchedule = timetables.filter((t) => t.day === selectedDay);

  return (
    <DashboardShell
      title="My Faculty Timetable"
      subtitle="View your weekly teaching schedule, room allocations, and period timings"
      allowedRoles={['teacher']}
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

      <div className="space-y-4">
        {activeDaySchedule.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200/80 text-slate-400 text-xs">
            No periods scheduled for {selectedDay}.
          </div>
        ) : (
          activeDaySchedule.map((tt) => (
            <div key={tt._id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-800">
                    {tt.class?.name} — Section {tt.section}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                  {selectedDay}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {tt.periods?.map((p: any) => (
                  <div
                    key={p.periodNumber}
                    className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 hover:border-emerald-400 transition"
                  >
                    <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                      <span className="font-bold text-slate-700">Period {p.periodNumber}</span>
                      <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border">{p.room || 'Room 201'}</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-800">{p.subject?.name}</h4>
                    <span className="text-[10px] text-emerald-600 font-bold font-mono">{p.subject?.code}</span>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.startTime} - {p.endTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardShell>
  );
}
