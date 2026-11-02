'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { GraduationCap, Search, Eye, X, Phone, User } from 'lucide-react';

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/students?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <DashboardShell
      title="My Class Students"
      subtitle="View student records, enrollment details, and parent contact information for your classes"
      allowedRoles={['teacher']}
      onRefresh={fetchStudents}
    >
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg"
          >
            Search
          </button>
        </form>

        <span className="text-xs font-bold text-slate-500">Total Assigned: {students.length} Learners</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((s) => (
          <div key={s._id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  {s.user?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{s.user?.name}</h3>
                  <span className="text-[11px] font-mono text-emerald-600 font-bold">
                    Roll #{s.rollNumber} • {s.class?.name} ({s.section})
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Student ID:</span>
                  <span className="font-mono font-medium">{s.user?.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Parent / Guardian:</span>
                  <span className="font-medium">{s.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Parent Phone:</span>
                  <span className="font-medium">{s.parentPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Blood Group:</span>
                  <span className="font-medium">{s.bloodGroup || 'O+'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(s)}
              className="mt-4 w-full py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Academic Info</span>
            </button>
          </div>
        ))}
      </div>

      {/* Student View Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Student Record</span>
              <button onClick={() => setSelectedStudent(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white text-xl font-bold flex items-center justify-center mx-auto shadow-sm">
                {selectedStudent.user?.name?.charAt(0)}
              </div>
              <h3 className="font-bold text-base text-slate-800 mt-2">{selectedStudent.user?.name}</h3>
              <p className="text-xs text-emerald-600 font-semibold font-mono">
                Roll #{selectedStudent.rollNumber} • {selectedStudent.class?.name} - Section {selectedStudent.section}
              </p>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl text-xs border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">User ID:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.user?.userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parent Name:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parent Phone:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.parentPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.bloodGroup || 'O+'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
