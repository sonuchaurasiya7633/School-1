'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  GraduationCap,
  Building2,
  Award,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Layers,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { AvatarUploader } from '@/components/common/AvatarUploader';
import { authFetch } from '@/lib/api';

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: '',
    qualification: '',
    university: '',
    additional: '',
    category: 'General',
    order: 1,
    isActive: true,
    assignedClasses: [] as Array<{ class: string; section: string; subject: string }>,
  });

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const loadFaculty = async () => {
    setLoading(true);
    try {
      const [resF, resC, resS] = await Promise.all([
        authFetch('/api/admin/faculty'),
        authFetch('/api/admin/classes'),
        authFetch('/api/admin/subjects'),
      ]);
      const dataF = await resF.json();
      const dataC = await resC.json();
      const dataS = await resS.json();

      if (dataF.success && dataF.faculty) {
        setFaculty(dataF.faculty);
      }
      if (dataC.success && dataC.classes) {
        setClasses(dataC.classes);
      }
      if (dataS.success && dataS.subjects) {
        setSubjects(dataS.subjects);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      name: '',
      qualification: '',
      university: '',
      additional: '',
      category: 'General',
      order: faculty.length + 1,
      isActive: true,
      assignedClasses: [],
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      qualification: item.qualification,
      university: item.university || '',
      additional: item.additional || '',
      category: item.category || 'General',
      order: item.order || 1,
      isActive: item.isActive !== false,
      assignedClasses: (item.assignedClasses || []).map((ac: any) => ({
        class: ac.class?._id || ac.class || '',
        section: ac.section || 'A',
        subject: ac.subject?._id || ac.subject || '',
      })),
    });
    setModalOpen(true);
  };

  const addClassAssignment = () => {
    setForm((prev) => ({
      ...prev,
      assignedClasses: [
        ...prev.assignedClasses,
        {
          class: classes[0]?._id || '',
          section: 'A',
          subject: subjects[0]?._id || '',
        },
      ],
    }));
  };

  const updateClassAssignment = (index: number, field: string, value: any) => {
    const updated = [...form.assignedClasses];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, assignedClasses: updated }));
  };

  const removeClassAssignment = (index: number) => {
    setForm((prev) => ({
      ...prev,
      assignedClasses: prev.assignedClasses.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const method = editingItem ? 'PUT' : 'POST';
      const payload = editingItem ? { id: editingItem._id, ...form } : form;

      const res = await authFetch('/api/admin/faculty', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({
          type: 'success',
          text: editingItem
            ? 'Teacher details and class/subject allocations updated successfully!'
            : 'New teacher added to directory and assigned to classes successfully!',
        });
        setModalOpen(false);
        loadFaculty();
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Error saving faculty member.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Network error.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the faculty directory?`)) {
      return;
    }

    try {
      const res = await authFetch(`/api/admin/faculty?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: `Removed ${name} from faculty directory.` });
        loadFaculty();
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Error deleting faculty member.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Network error.' });
    }
  };

  const filteredFaculty = faculty.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.qualification.toLowerCase().includes(q) ||
      (f.university && f.university.toLowerCase().includes(q))
    );
  });

  return (
    <DashboardShell title="Faculty Directory Management">
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Staff Administration
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Public Faculty & Teaching Team CMS
            </h1>
            <p className="text-xs text-slate-400">
              Manage the 11+ faculty educators displayed on the school website and faculty directory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/faculty"
              target="_blank"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20 flex items-center gap-1.5"
            >
              <span>View Faculty Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty Member</span>
            </button>
          </div>
        </div>

        {statusMsg.text && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 shadow-sm border ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span className="font-semibold">{statusMsg.text}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty by name, degree, or university..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="text-xs text-slate-400 font-bold shrink-0">
            Total Educators: <span className="text-purple-400">{faculty.length}</span>
          </div>
        </div>

        {/* Faculty SaaS Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Faculty Name</th>
                  <th className="py-4 px-6">Qualification</th>
                  <th className="py-4 px-6">Assigned Class & Subject</th>
                  <th className="py-4 px-6">University / Board</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredFaculty.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <AvatarUploader
                          currentAvatar={item.avatar}
                          name={item.name}
                          targetUserId={item._id}
                          size="sm"
                          onSuccess={loadFaculty}
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{item.name}</p>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                            Order #{item.order || 0}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                        {item.qualification}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      {item.assignedClasses?.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {item.assignedClasses.map((ac: any, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold"
                            >
                              <BookOpen className="w-3 h-3 text-emerald-400" />
                              <span>
                                {ac.class?.name || 'Class'} (Sec {ac.section || 'A'}) — {ac.subject?.name || 'Subject'}
                              </span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {item.university ? (
                        <span className="text-slate-300 font-medium">{item.university}</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.isActive !== false
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {item.isActive !== false ? 'Active Visible' : 'Hidden'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-bold flex items-center gap-1 transition"
                          title="Assign Classes & Subjects"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Assign</span>
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Edit Faculty Member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                          title="Delete Faculty Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Add / Edit */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">
                  {editingItem ? 'Edit Faculty Member' : 'Add New Faculty Member'}
                </h3>
                <p className="text-xs text-slate-400">
                  Fill in the verified qualification, name, and university details.
                </p>
              </div>

              {editingItem && (
                <div className="flex items-center gap-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <AvatarUploader
                    currentAvatar={editingItem.avatar}
                    name={editingItem.name}
                    targetUserId={editingItem._id}
                    size="md"
                    onSuccess={(newUrl) => {
                      setEditingItem({ ...editingItem, avatar: newUrl });
                      loadFaculty();
                    }}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Faculty Photo</p>
                    <p className="text-[11px] text-slate-400">Click camera badge to upload or change image</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Faculty Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ridhi Vinayak Jha"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Educational Qualifications *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.qualification}
                    onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                    placeholder="e.g. M.Com, B.Ed"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    University / Board (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.university}
                    onChange={(e) => setForm({ ...form, university: e.target.value })}
                    placeholder="e.g. L.N.M.U, Darbhanga"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Class & Subject Allocations */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Assign Classes & Subjects</span>
                      </label>
                      <p className="text-[11px] text-slate-400">Map this teacher to specific class standards, sections & subjects</p>
                    </div>
                    <button
                      type="button"
                      onClick={addClassAssignment}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Add Assignment</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {form.assignedClasses?.map((ac, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs"
                      >
                        <div className="flex-1 w-full">
                          <label className="text-[10px] text-slate-400 block mb-0.5">Class</label>
                          <select
                            value={ac.class}
                            onChange={(e) => updateClassAssignment(idx, 'class', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-medium"
                          >
                            <option value="">Select Class</option>
                            {classes.map((c) => (
                              <option key={c._id} value={c._id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-full sm:w-24">
                          <label className="text-[10px] text-slate-400 block mb-0.5">Section</label>
                          <input
                            type="text"
                            value={ac.section}
                            onChange={(e) => updateClassAssignment(idx, 'section', e.target.value.toUpperCase())}
                            placeholder="A"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white text-center font-bold"
                          />
                        </div>

                        <div className="flex-1 w-full">
                          <label className="text-[10px] text-slate-400 block mb-0.5">Subject</label>
                          <select
                            value={ac.subject}
                            onChange={(e) => updateClassAssignment(idx, 'subject', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-medium"
                          >
                            <option value="">Select Subject</option>
                            {subjects.map((s) => (
                              <option key={s._id} value={s._id}>
                                {s.name} ({s.code})
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeClassAssignment(idx)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition self-end sm:self-center mt-1 sm:mt-4"
                          title="Remove assignment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {form.assignedClasses?.length === 0 && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-950/40 p-3 rounded-xl border border-dashed border-slate-800 text-center">
                        No classes assigned yet. Click &quot;+ Add Assignment&quot; to map this teacher to a class & subject.
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Additional Status (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.additional}
                      onChange={(e) => setForm({ ...form, additional: e.target.value })}
                      placeholder="e.g. B.Ed (Appearing)"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Display Order #
                    </label>
                    <input
                      type="number"
                      value={form.order}
                      onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="rounded border-slate-800 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isActive" className="text-xs text-slate-300 font-medium">
                    Show this faculty member on the public website directory
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingItem ? 'Update Faculty' : 'Add Faculty'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
