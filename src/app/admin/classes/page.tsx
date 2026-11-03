'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { BookOpen, Plus, Edit2, Trash2, Users, Layers, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { authFetch } from '@/lib/api';

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editClass, setEditClass] = useState<any>(null);

  // Class Form
  const [classForm, setClassForm] = useState({
    name: '',
    grade: 10,
    sections: 'A, B',
    classTeacher: '',
    tuitionFee: 3000,
  });

  // Subject Form
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    classes: [] as string[],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resC, resS, resT, resF] = await Promise.all([
        authFetch('/api/admin/classes'),
        authFetch('/api/admin/subjects'),
        authFetch('/api/admin/teachers'),
        authFetch('/api/admin/faculty'),
      ]);
      const dataC = await resC.json();
      const dataS = await resS.json();
      const dataT = await resT.json();
      const dataF = await resF.json();

      if (dataC.success) setClasses(dataC.classes);
      if (dataS.success) setSubjects(dataS.subjects);
      if (dataT.success) setTeachers(dataT.teachers);
      if (dataF.success) setFaculty(dataF.faculty);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sectionsArray = classForm.sections.split(',').map((s) => s.trim()).filter(Boolean);
      const url = '/api/admin/classes';
      const method = editClass ? 'PUT' : 'POST';
      const payload = {
        ...(editClass && { id: editClass._id }),
        name: classForm.name,
        grade: Number(classForm.grade),
        sections: sectionsArray,
        classTeacher: classForm.classTeacher || undefined,
        tuitionFee: Number(classForm.tuitionFee),
      };

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowClassModal(false);
        setEditClass(null);
        setClassForm({ name: '', grade: 10, sections: 'A, B', classTeacher: '', tuitionFee: 3000 });
        fetchData();
      } else {
        alert(data.message || 'Error saving class.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch('/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subjectForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowSubjectModal(false);
        setSubjectForm({ name: '', code: '', classes: [] });
        fetchData();
      } else {
        alert(data.message || 'Error saving subject.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    try {
      await authFetch(`/api/admin/classes?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    try {
      await authFetch(`/api/admin/subjects?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditClass = (c: any) => {
    setEditClass(c);
    setClassForm({
      name: c.name,
      grade: c.grade,
      sections: c.sections.join(', '),
      classTeacher: c.classTeacher?._id || '',
      tuitionFee: c.tuitionFee || 3000,
    });
    setShowClassModal(true);
  };

  return (
    <DashboardShell
      title="Class & Subject Management"
      subtitle="Manage grade levels, sections, subjects, and assigned class educators"
      allowedRoles={['admin']}
      onRefresh={fetchData}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Academic Classes & Standards</h2>
              <p className="text-xs text-slate-500">Configured classes: {classes.length}</p>
            </div>
            <button
              onClick={() => {
                setEditClass(null);
                setClassForm({ name: '', grade: 10, sections: 'A, B', classTeacher: '', tuitionFee: 3000 });
                setShowClassModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Class</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classes.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        Grade {c.grade} Standard
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-lg mt-1">{c.name}</h3>
                    </div>
                    <span className="px-3 py-1 bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-xs">
                      {formatCurrency(c.tuitionFee)}/mo
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Configured Sections</span>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        {c.sections?.map((sec: string) => (
                          <span
                            key={sec}
                            className="px-2.5 py-1 bg-slate-100 text-slate-800 font-extrabold rounded-lg border border-slate-200 text-xs"
                          >
                            Section {sec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Class Teacher</span>
                      <p className="font-bold text-slate-800 text-xs">
                        {c.classTeacher?.name || <span className="text-slate-400 font-normal italic">Unassigned</span>}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100">
                      <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block mb-1">
                        Subject Educators
                      </span>
                      {(() => {
                        const classTeachers = teachers.filter((t) =>
                          t.assignedClasses?.some((ac: any) => (ac.class?._id || ac.class) === c._id)
                        ).map((t) => ({
                          id: t._id,
                          name: t.user?.name || 'Teacher',
                          subjects: t.assignedClasses
                            ?.filter((ac: any) => (ac.class?._id || ac.class) === c._id)
                            .map((ac: any) => ac.subject?.name || 'Subject')
                            .join(', '),
                        }));

                        const facultyEducators = faculty.filter((f) =>
                          f.assignedClasses?.some((ac: any) => (ac.class?._id || ac.class) === c._id)
                        ).map((f) => ({
                          id: f._id,
                          name: f.name,
                          subjects: f.assignedClasses
                            ?.filter((ac: any) => (ac.class?._id || ac.class) === c._id)
                            .map((ac: any) => ac.subject?.name || 'Subject')
                            .join(', '),
                        }));

                        // Merge without duplicate names
                        const combined = [...classTeachers];
                        facultyEducators.forEach((fe) => {
                          if (!combined.some((t) => t.name.toLowerCase() === fe.name.toLowerCase())) {
                            combined.push(fe);
                          }
                        });

                        if (combined.length === 0) {
                          return <span className="text-slate-400 text-[11px] italic">No teachers assigned yet</span>;
                        }
                        return (
                          <div className="flex flex-wrap gap-1">
                            {combined.map((t) => (
                              <span
                                key={t.id}
                                className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold"
                              >
                                {t.name} ({t.subjects})
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => openEditClass(c)}
                    className="px-3 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition text-xs font-bold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Class</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClass(c._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete Class"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects Column (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Curriculum Subjects</h2>
              <p className="text-xs text-slate-500">Active subjects: {subjects.length}</p>
            </div>
            <button
              onClick={() => setShowSubjectModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
            {subjects.map((sub) => (
              <div key={sub._id} className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition">
                <div>
                  <h4 className="font-bold text-xs text-slate-800">{sub.name}</h4>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">{sub.code}</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {sub.classes?.map((cls: any) => (
                      <span key={cls._id} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {cls.name}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSubject(sub._id)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add / Edit Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">
                {editClass ? 'Edit Class' : 'Create New Class'}
              </h3>
              <button onClick={() => setShowClassModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClassSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Class Name *</label>
                <input
                  type="text"
                  required
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  placeholder="e.g. Class 11"
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Numeric Grade *</label>
                  <input
                    type="number"
                    required
                    value={classForm.grade}
                    onChange={(e) => setClassForm({ ...classForm, grade: Number(e.target.value) })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Sections (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={classForm.sections}
                    onChange={(e) => setClassForm({ ...classForm, sections: e.target.value })}
                    placeholder="A, B, C"
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Class Teacher (Teacher Directory & Faculty)</label>
                <select
                  value={classForm.classTeacher}
                  onChange={(e) => setClassForm({ ...classForm, classTeacher: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
                >
                  <option value="">Select Faculty Teacher / Class Teacher</option>
                  <optgroup label="Teacher Directory & Faculty Members">
                    {faculty.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.name} — {f.qualification}
                      </option>
                    ))}
                  </optgroup>
                  {teachers.length > 0 && (
                    <optgroup label="Portal Teacher Accounts">
                      {teachers.map((t) => (
                        <option key={t.user?._id} value={t.user?._id}>
                          {t.user?.name} ({t.user?.userId || 'Portal'})
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Tuition Fee (Monthly INR)</label>
                <input
                  type="number"
                  value={classForm.tuitionFee}
                  onChange={(e) => setClassForm({ ...classForm, tuitionFee: Number(e.target.value) })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">Add Subject</h3>
              <button onClick={() => setShowSubjectModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubjectSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  placeholder="e.g. Hindi Literature"
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Subject Code *</label>
                <input
                  type="text"
                  required
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  placeholder="HIN101"
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg uppercase"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Applicable Classes</label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-lg">
                  {classes.map((c) => (
                    <label key={c._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subjectForm.classes.includes(c._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSubjectForm({ ...subjectForm, classes: [...subjectForm.classes, c._id] });
                          } else {
                            setSubjectForm({
                              ...subjectForm,
                              classes: subjectForm.classes.filter((id) => id !== c._id),
                            });
                          }
                        }}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
