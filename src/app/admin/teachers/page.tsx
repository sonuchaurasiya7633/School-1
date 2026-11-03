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
  Copy,
  Check,
  Key,
  GraduationCap,
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
  const [editAssignedClasses, setEditAssignedClasses] = useState<any[]>([]);
  const [newAssignClass, setNewAssignClass] = useState('');
  const [newAssignSection, setNewAssignSection] = useState('A');
  const [newAssignSubject, setNewAssignSubject] = useState('');

  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    userId: string;
    email: string;
    password: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

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
        const createdUser = data.teacher?.user;
        const savedPass = formData.password || 'password123';
        setCreatedCredentials({
          name: createdUser?.name || formData.name,
          userId: createdUser?.userId || '',
          email: createdUser?.email || formData.email,
          password: savedPass,
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          gender: 'Female',
          qualification: 'M.Sc., B.Ed',
          specialization: 'Mathematics',
          password: 'password123',
          assignedClassId: classes[0]?._id || '',
          assignedSection: 'A',
          assignedSubjectId: subjects[0]?._id || '',
        });
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
      const formattedAssigned = editAssignedClasses.map((ac) => ({
        class: ac.class,
        section: ac.section,
        subject: ac.subject,
      }));

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
          password: formData.password || undefined,
          assignedClasses: formattedAssigned,
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

  const handleAddAssignedClass = () => {
    if (!newAssignClass || !newAssignSubject) {
      alert('Please select both a Class and a Subject.');
      return;
    }

    const clsObj = classes.find((c) => c._id === newAssignClass);
    const subObj = subjects.find((s) => s._id === newAssignSubject);

    // Check duplicate
    const isDup = editAssignedClasses.some(
      (ac) =>
        ac.class === newAssignClass &&
        ac.section === newAssignSection &&
        ac.subject === newAssignSubject
    );

    if (isDup) {
      alert('This Class + Section + Subject is already assigned to this teacher.');
      return;
    }

    setEditAssignedClasses((prev) => [
      ...prev,
      {
        class: newAssignClass,
        className: clsObj?.name || 'Class',
        section: newAssignSection,
        subject: newAssignSubject,
        subjectName: subObj?.name || 'Subject',
      },
    ]);
  };

  const handleRemoveAssignedClass = (index: number) => {
    setEditAssignedClasses((prev) => prev.filter((_, i) => i !== index));
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
      password: '',
    });

    const initialAssigned = (t.assignedClasses || []).map((ac: any) => ({
      class: ac.class?._id || ac.class,
      className: ac.class?.name || 'Class',
      section: ac.section || 'A',
      subject: ac.subject?._id || ac.subject,
      subjectName: ac.subject?.name || 'Subject',
    }));
    setEditAssignedClasses(initialAssigned);
    setNewAssignClass(classes[0]?._id || '');
    setNewAssignSection('A');
    setNewAssignSubject(subjects[0]?._id || '');
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

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => openEditModal(t)}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Assign Classes & Subjects</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(t)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit Teacher Profile"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Delete Teacher"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-black text-slate-800 text-base">Edit Faculty & Manage Assignments</h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {selectedTeacher?.user?.userId} • {selectedTeacher?.user?.email}
                </p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4 text-xs">
              <div className="flex flex-col items-center justify-center py-3 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Email Address (Login ID)</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Password Reset Field */}
              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200">
                <label className="font-bold text-amber-900 block text-xs mb-1">
                  Reset Teacher Login Password (Optional)
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter new password, or leave blank to keep unchanged"
                  className="w-full p-2 border border-amber-300 rounded-lg text-xs bg-white text-slate-900 placeholder:text-slate-400"
                />
                <span className="text-[10px] text-amber-800 mt-1 block">
                  Agar teacher password bhool jaye, to yaha naya password enter kar ke update kar sakte hain.
                </span>
              </div>

              {/* Class-wise & Subject-wise Assignment Section */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 text-xs">
                    Assigned Classes & Subjects ({editAssignedClasses.length})
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Class-wise & Subject-wise</span>
                </div>

                {/* Current Assignments List */}
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {editAssignedClasses.length > 0 ? (
                    editAssignedClasses.map((ac, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-1.5 bg-white rounded-xl border border-emerald-200 shadow-2xs text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="font-bold text-slate-800">
                            {ac.className || 'Class'} ({ac.section})
                          </span>
                          <span className="text-slate-400">—</span>
                          <span className="font-semibold text-emerald-800">{ac.subjectName || 'Subject'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAssignedClass(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Remove assignment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic py-1">No classes or subjects assigned yet.</p>
                  )}
                </div>

                {/* Add New Class-wise / Subject-wise Assignment Row */}
                <div className="pt-2 border-t border-emerald-200/60">
                  <span className="block text-[11px] font-bold text-emerald-900 mb-1.5">
                    + Assign Another Class & Subject
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 items-center">
                    <div className="sm:col-span-3">
                      <select
                        value={newAssignClass}
                        onChange={(e) => setNewAssignClass(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                      >
                        <option value="">Select Class</option>
                        {classes.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <input
                        type="text"
                        value={newAssignSection}
                        onChange={(e) => setNewAssignSection(e.target.value.toUpperCase())}
                        placeholder="Sec"
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs text-center font-bold bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <select
                        value={newAssignSubject}
                        onChange={(e) => setNewAssignSubject(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <button
                        type="button"
                        onClick={handleAddAssignedClass}
                        className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-xs transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Save & Update Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Created Credentials Success Modal */}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-emerald-100 text-slate-800 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Teacher Registered Successfully!</h3>
                  <p className="text-xs text-slate-500">Teacher login credentials generated</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCreatedCredentials(null);
                  setCopied(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-emerald-200/60">
                <span className="text-emerald-900 font-semibold">Teacher Name:</span>
                <span className="font-bold text-slate-900">{createdCredentials.name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-emerald-200/60">
                <span className="text-emerald-900 font-semibold">Teacher User ID:</span>
                <span className="font-mono font-black text-emerald-800">{createdCredentials.userId}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-emerald-200/60">
                <span className="text-emerald-900 font-semibold">Teacher Gmail / Email:</span>
                <span className="font-mono font-bold text-slate-800">{createdCredentials.email}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-emerald-900 font-semibold">Login Password:</span>
                <span className="font-mono font-black bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-950">
                  {createdCredentials.password}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Ye login credentials teacher ko de dijiye. Teacher <strong className="text-slate-800">/login</strong> par ja kar apna <strong>Email ya User ID</strong> aur <strong>Password</strong> enter kar ke dashboard access kar sakte hain.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  const text = `Success Point School - Teacher Faculty Credentials\nName: ${createdCredentials.name}\nTeacher ID: ${createdCredentials.userId}\nLogin Email: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\nLogin Portal: ${window.location.origin}/login?role=teacher`;
                  navigator.clipboard.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 3000);
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Credentials Copied!' : 'Copy Teacher Credentials'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreatedCredentials(null);
                  setCopied(false);
                }}
                className="px-5 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
