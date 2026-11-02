'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { BookCheck, Plus, Trash2, Eye, Calendar, Clock, CheckCircle, X, Award } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TeacherHomeworkPage() {
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    section: 'A',
    subjectId: '',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
  });

  // Grade Form State
  const [gradeState, setGradeState] = useState<{ [key: string]: { marks: string; feedback: string } }>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resH, resC, resS] = await Promise.all([
        fetch('/api/homework'),
        fetch('/api/admin/classes'),
        fetch('/api/admin/subjects'),
      ]);

      const dataH = await resH.json();
      const dataC = await resC.json();
      const dataS = await resS.json();

      if (dataH.success) setHomeworkList(dataH.homework);
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
      const res = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setFormData({
          title: '',
          description: '',
          classId: classes[0]?._id || '',
          section: 'A',
          subjectId: subjects[0]?._id || '',
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        });
        fetchData();
      } else {
        alert(data.message || 'Error creating homework.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this homework assignment?')) return;
    try {
      await fetch(`/api/homework?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openSubmissions = (hw: any) => {
    setSelectedHomework(hw);
    const initialGrades: any = {};
    hw.submissions?.forEach((s: any) => {
      initialGrades[s.student?._id] = {
        marks: s.marks !== undefined ? String(s.marks) : '10',
        feedback: s.feedback || 'Well done.',
      };
    });
    setGradeState(initialGrades);
    setShowSubmissionsModal(true);
  };

  const handleGradeSubmit = async (studentId: string) => {
    const gradeInfo = gradeState[studentId] || { marks: '10', feedback: 'Good job' };
    try {
      const res = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'grade',
          homeworkId: selectedHomework._id,
          studentId,
          marks: Number(gradeInfo.marks),
          feedback: gradeInfo.feedback,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Student submission graded and reviewed!');
        fetchData();
        setShowSubmissionsModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardShell
      title="Homework & Assignment Hub"
      subtitle="Create homework tasks, inspect student submissions, and award grades with teacher feedback"
      allowedRoles={['teacher']}
      onRefresh={fetchData}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Assigned Homework Tasks</h2>
          <p className="text-xs text-slate-500">Active assignments: {homeworkList.length}</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Homework</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {homeworkList.map((hw) => {
          const submissionCount = hw.submissions?.length || 0;
          return (
            <div
              key={hw._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      {hw.class?.name} ({hw.section}) • {hw.subject?.name}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-2">{hw.title}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                    {submissionCount} Submissions
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                  {hw.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Due Date: <strong>{formatDate(hw.dueDate)}</strong></span>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openSubmissions(hw)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Review Submissions ({submissionCount})</span>
                </button>
                <button
                  onClick={() => handleDelete(hw._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Remove Assignment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Homework Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">Assign New Homework</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Homework Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Chapter 4 Practice Questions"
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                <label className="font-semibold text-slate-700">Due Date *</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Instructions & Problem Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the exercise questions, format, or submission guidelines..."
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Publish Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Submissions Modal */}
      {showSubmissionsModal && selectedHomework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Submissions — {selectedHomework.title}</h3>
                <p className="text-xs text-slate-500">{selectedHomework.class?.name} • Due: {formatDate(selectedHomework.dueDate)}</p>
              </div>
              <button onClick={() => setShowSubmissionsModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {selectedHomework.submissions?.length === 0 ? (
                <p className="py-8 text-center text-slate-400">No students have submitted homework for this task yet.</p>
              ) : (
                selectedHomework.submissions.map((sub: any) => {
                  const studentId = sub.student?._id;
                  const currentGrade = gradeState[studentId] || { marks: sub.marks || '', feedback: sub.feedback || '' };
                  return (
                    <div key={studentId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{sub.student?.name}</h4>
                          <span className="text-[11px] font-mono text-slate-400">{sub.student?.userId}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.status === 'Reviewed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Student Answer:</span>
                        <p className="whitespace-pre-wrap">{sub.submissionText || 'No text submitted.'}</p>
                        {sub.fileUrl && (
                          <div className="mt-2 pt-2 border-t text-[11px] text-emerald-600 font-semibold">
                            Attachment: <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="underline">{sub.fileUrl}</a>
                          </div>
                        )}
                      </div>

                      {/* Grade Input */}
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div>
                          <label className="font-semibold text-slate-700">Marks (out of 10)</label>
                          <input
                            type="number"
                            max={10}
                            value={currentGrade.marks}
                            onChange={(e) =>
                              setGradeState({
                                ...gradeState,
                                [studentId]: { ...currentGrade, marks: e.target.value },
                              })
                            }
                            className="w-full mt-1 p-1.5 border border-slate-300 rounded text-xs font-bold"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="font-semibold text-slate-700">Teacher Remarks / Feedback</label>
                          <div className="flex gap-2 mt-1">
                            <input
                              type="text"
                              value={currentGrade.feedback}
                              onChange={(e) =>
                                setGradeState({
                                  ...gradeState,
                                  [studentId]: { ...currentGrade, feedback: e.target.value },
                                })
                              }
                              placeholder="e.g. Good work, check Q3 again"
                              className="flex-1 p-1.5 border border-slate-300 rounded text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleGradeSubmit(studentId)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs"
                            >
                              Grade
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
