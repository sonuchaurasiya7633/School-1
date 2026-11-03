'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  BookOpen,
} from 'lucide-react';
import { AvatarUploader } from '@/components/common/AvatarUploader';
import { authFetch } from '@/lib/api';

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: 'Female',
    qualification: 'M.Sc., B.Ed',
    specialization: 'Mathematics',
    password: 'password123',
    assignedClassId: '',
    assignedSection: 'A',
    assignedSubjectId: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resTeachers, resClasses, resSubjects] = await Promise.all([
        authFetch('/api/admin/teachers'),
        authFetch('/api/admin/classes'),
        authFetch('/api/admin/subjects'),
      ]);

      const dataTeachers = await resTeachers.json();
      const dataClasses = await resClasses.json();
      const dataSubjects = await resSubjects.json();

      if (dataTeachers.success) setTeachers(dataTeachers.teachers);
      if (dataClasses.success) {
        setClasses(dataClasses.classes);
        if (dataClasses.classes.length > 0 && !formData.assignedClassId) {
          setFormData((prev) => ({ ...prev, assignedClassId: dataClasses.classes[0]._id }));
        }
      }
      if (dataSubjects.success) {
        setSubjects(dataSubjects.subjects);
        if (dataSubjects.subjects.length > 0 && !formData.assignedSubjectId) {
          setFormData((prev) => ({ ...prev, assignedSubjectId: dataSubjects.subjects[0]._id }));
        }
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

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const assignedClasses = [];
      if (formData.assignedClassId && formData.assignedSubjectId) {
        assignedClasses.push({
          class: formData.assignedClassId,
          section: formData.assignedSection,
          subject: formData.assignedSubjectId,
        });
      }

      const res = await authFetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          assignedClasses,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        fetchData();
      } else {
        alert(data.message || 'Error adding teacher.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    try {
      const res = await authFetch('/api/admin/teachers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: selectedTeacher._id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          qualification: formData.qualification,
          specialization: formData.specialization,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        fetchData();
      } else {
        alert(data.message || 'Error updating teacher.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this teacher?')) return;
    try {
      const res = await authFetch(`/api/admin/teachers?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (teacher: any) => {
    try {
      await authFetch('/api/admin/teachers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: teacher._id,
          isActive: !teacher.user?.isActive,
        }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (t: any) => {
    setSelectedTeacher(t);
    setFormData({
      ...formData,
      name: t.user?.name || '',
      email: t.user?.email || '',
      phone: t.user?.phone || '',
      qualification: t.qualification || '',
      specialization: t.specialization || '',
    });
    setShowEditModal(true);
  };

  return (
    <DashboardShell
      title="Teacher Management"
      subtitle="Register faculty, configure subject assignments, and manage teacher profiles"
      allowedRoles={['admin']}
      onRefresh={fetchData}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Faculty Members</h2>
          <p className="text-xs text-slate-500">Total assigned educators: {teachers.length}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Teacher</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teachers.map((t) => (
          <div key={t._id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <AvatarUploader
                    currentAvatar={t.user?.avatar}
                    name={t.user?.name}
                    targetUserId={t.user?._id || t.user?.userId}
                    size="md"
                    onSuccess={fetchData}
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{t.user?.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{t.user?.userId} • {t.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleActive(t)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    t.user?.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {t.user?.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Specialization:</span>
                  <span className="font-medium text-slate-700">{t.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Qualification:</span>
                  <span className="font-medium text-slate-700">{t.qualification}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact:</span>
                  <span className="font-medium text-slate-700">{t.user?.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Assigned Classes & Subjects
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {t.assignedClasses?.length > 0 ? (
                    t.assignedClasses.map((ac: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium border border-slate-200"
                      >
                        {ac.class?.name || 'Class'} ({ac.section}) — {ac.subject?.name || 'Subject'}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No classes assigned yet</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(t)}
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(t._id)}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">Register Faculty Member</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Teacher Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                    placeholder="e.g. Mrs. Anjali Mehta"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                    placeholder="anjali@school.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-2">Initial Class & Subject Assignment</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500">Class</label>
                    <select
                      value={formData.assignedClassId}
                      onChange={(e) => setFormData({ ...formData, assignedClassId: e.target.value })}
                      className="w-full mt-1 p-1.5 border border-slate-300 rounded-md"
                    >
                      {classes.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500">Section</label>
                    <input
                      type="text"
                      value={formData.assignedSection}
                      onChange={(e) => setFormData({ ...formData, assignedSection: e.target.value })}
                      className="w-full mt-1 p-1.5 border border-slate-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500">Subject</label>
                    <select
                      value={formData.assignedSubjectId}
                      onChange={(e) => setFormData({ ...formData, assignedSubjectId: e.target.value })}
                      className="w-full mt-1 p-1.5 border border-slate-300 rounded-md"
                    >
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">Edit Faculty Information</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4 text-xs">
              <div className="flex flex-col items-center justify-center py-2 px-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <AvatarUploader
                  currentAvatar={selectedTeacher?.user?.avatar}
                  name={selectedTeacher?.user?.name || formData.name}
                  targetUserId={selectedTeacher?.user?._id || selectedTeacher?.user?.userId}
                  size="lg"
                  onSuccess={(url: string) => {
                    setSelectedTeacher((prev: any) => ({
                      ...prev,
                      user: { ...prev.user, avatar: url },
                    }));
                    fetchData();
                  }}
                />
                <span className="text-[11px] text-slate-500 font-medium mt-1">Super Admin: Change Faculty Profile Picture</span>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Qualification</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                >
                  Update Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
