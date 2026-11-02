'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Video,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen,
  Calendar,
  Sparkles,
  X,
  FileText,
  Search,
  PlayCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TeacherLecturesPage() {
  const [lectures, setLectures] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    section: 'A',
    subjectId: '',
    videoUrl: '',
    attachmentUrl: '',
    tagInput: 'Important, Revision',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resL, resC, resS] = await Promise.all([
        fetch('/api/lectures'),
        fetch('/api/admin/classes'),
        fetch('/api/admin/subjects'),
      ]);

      const dataL = await resL.json();
      const dataC = await resC.json();
      const dataS = await resS.json();

      if (dataL.success) setLectures(dataL.lectures || []);
      if (dataC.success && dataC.classes?.length > 0) {
        setClasses(dataC.classes);
        if (!formData.classId) setFormData((prev) => ({ ...prev, classId: dataC.classes[0]._id }));
      }
      if (dataS.success && dataS.subjects?.length > 0) {
        setSubjects(dataS.subjects);
        if (!formData.subjectId) setFormData((prev) => ({ ...prev, subjectId: dataS.subjects[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tags = formData.tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/lectures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          classId: formData.classId,
          section: formData.section,
          subjectId: formData.subjectId,
          videoUrl: formData.videoUrl,
          attachmentUrl: formData.attachmentUrl,
          tags,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setFormData({
          title: '',
          description: '',
          classId: classes[0]?._id || '',
          section: 'A',
          subjectId: subjects[0]?._id || '',
          videoUrl: '',
          attachmentUrl: '',
          tagInput: 'Important, Revision',
        });
        fetchData();
      } else {
        alert(data.message || 'Error uploading lecture.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this lecture video?')) return;
    try {
      await fetch(`/api/lectures?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLectures = lectures.filter((lec) => {
    const q = searchQuery.toLowerCase();
    return (
      lec.title?.toLowerCase().includes(q) ||
      lec.subject?.name?.toLowerCase().includes(q) ||
      lec.class?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardShell
      title="Video Lectures & Study Materials"
      subtitle="Upload recorded video classes, YouTube tutorials, and PDF lecture notes for students"
      allowedRoles={['teacher']}
      onRefresh={fetchData}
    >
      {/* Action Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, subject or class..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Lecture</span>
        </button>
      </div>

      {/* Lectures Grid */}
      {filteredLectures.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
            <Video className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-slate-800">No Lectures Uploaded Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Start by uploading recorded lectures or YouTube video links so students can watch and revise from their dashboard.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
          >
            + Upload First Lecture
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLectures.map((lec) => (
            <div
              key={lec._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {lec.subject?.name} • {lec.class?.name} ({lec.section || 'A'})
                  </span>
                  <button
                    onClick={() => handleDelete(lec._id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete lecture"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">{lec.title}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {lec.description}
                </p>

                {/* Tags */}
                {lec.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {lec.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                {lec.videoUrl && (
                  <a
                    href={lec.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition"
                  >
                    <span className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-emerald-600" />
                      <span>Watch Lecture Video</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {lec.attachmentUrl && (
                  <a
                    href={lec.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>Download Study Notes (PDF)</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Uploaded: {formatDate(lec.createdAt)}</span>
                  <span>By: {lec.teacher?.name || 'You'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Lecture Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-base">Upload Video Lecture</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Lecture Topic / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Chapter 5: Trigonometry & Identities"
                  className="w-full mt-1 p-2.5 border border-slate-300 rounded-lg font-medium text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Class *</label>
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
                  <label className="font-semibold text-slate-700">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Subject *</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  >
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Video Link (YouTube, Drive, or Cloud URL) *</label>
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... or Drive Link"
                  className="w-full mt-1 p-2.5 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">PDF / Notes Link (Optional)</label>
                <input
                  type="url"
                  value={formData.attachmentUrl}
                  onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                  placeholder="https://drive.google.com/file/... or Docs URL"
                  className="w-full mt-1 p-2.5 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Lecture Summary / Topics Covered</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail what formulas or concepts were discussed in this recorded session..."
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tagInput}
                  onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                  placeholder="Algebra, BoardExam, Practice"
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Save & Publish Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
