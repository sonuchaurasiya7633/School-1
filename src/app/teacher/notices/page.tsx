'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Bell, Plus, Pin, Calendar, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TeacherNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetRole: 'student',
    classId: '',
    isPinned: false,
  });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const [resN, resC] = await Promise.all([
        fetch('/api/notices'),
        fetch('/api/admin/classes'),
      ]);
      const dataN = await resN.json();
      const dataC = await resC.json();

      if (dataN.success) setNotices(dataN.notices);
      if (dataC.success) {
        setClasses(dataC.classes);
        if (dataC.classes.length > 0 && !formData.classId) {
          setFormData((prev) => ({ ...prev, classId: dataC.classes[0]._id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setFormData({ title: '', content: '', targetRole: 'student', classId: classes[0]?._id || '', isPinned: false });
        fetchNotices();
      } else {
        alert(data.message || 'Error posting notice.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardShell
      title="School & Class Announcements"
      subtitle="Read staff circulars and broadcast class notices to your students"
      allowedRoles={['teacher']}
      onRefresh={fetchNotices}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Notice Bulletin</h2>
          <p className="text-xs text-slate-500">Active announcements: {notices.length}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Post Class Notice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {notices.map((n) => (
          <div
            key={n._id}
            className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between ${
              n.isPinned ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200/80'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {n.isPinned && (
                    <span className="p-1 rounded bg-amber-100 text-amber-700">
                      <Pin className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <h3 className="font-bold text-sm text-slate-800">{n.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  {n.targetRole}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed whitespace-pre-wrap">{n.content}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(n.date)}</span>
                <span>•</span>
                <span>By {n.author?.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Class Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">Post Class Announcement</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Announcement Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Science Fair Project Submission Date"
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Class</label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                >
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Notice Details *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detail instructions for your students..."
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
