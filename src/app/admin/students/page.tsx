'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: 'Male',
    dateOfBirth: '',
    rollNumber: '',
    classId: '',
    section: 'A',
    parentName: '',
    parentPhone: '',
    bloodGroup: 'O+',
    password: 'password123',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resStudents, resClasses] = await Promise.all([
        fetch(`/api/admin/students?search=${encodeURIComponent(search)}&classId=${selectedClass}`),
        fetch('/api/admin/classes'),
      ]);

      const dataStudents = await resStudents.json();
      const dataClasses = await resClasses.json();

      if (dataStudents.success) setStudents(dataStudents.students);
      if (dataClasses.success) setClasses(dataClasses.classes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClass]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          gender: 'Male',
          dateOfBirth: '',
          rollNumber: '',
          classId: '',
          section: 'A',
          parentName: '',
          parentPhone: '',
          bloodGroup: 'O+',
          password: 'password123',
        });
        fetchData();
      } else {
        alert(data.message || 'Error creating student.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent._id,
          ...formData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        fetchData();
      } else {
        alert(data.message || 'Error updating student.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this student record?')) return;
    try {
      const res = await fetch(`/api/admin/students?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (student: any) => {
    try {
      await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student._id,
          isActive: !student.user.isActive,
        }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (student: any) => {
    setSelectedStudent(student);
    setFormData({
      name: student.user.name,
      email: student.user.email,
      phone: student.user.phone || '',
      address: student.user.address || '',
      gender: student.user.gender || 'Male',
      dateOfBirth: student.user.dateOfBirth || '',
      rollNumber: student.rollNumber,
      classId: student.class?._id || '',
      section: student.section,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      bloodGroup: student.bloodGroup || 'O+',
      password: '',
    });
    setShowEditModal(true);
  };

  const openViewModal = (student: any) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  return (
    <DashboardShell
      title="Student Management"
      subtitle="Register, update, search, and manage student enrollments"
      allowedRoles={['admin']}
      onRefresh={fetchData}
    >
      {/* Top Filter and Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, roll, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (classes.length > 0) {
                setFormData((prev) => ({ ...prev, classId: classes[0]._id }));
              }
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-4 px-5">Student Identity</th>
                <th className="py-4 px-4">Roll Number</th>
                <th className="py-4 px-4">Class & Section</th>
                <th className="py-4 px-4">Parent Details</th>
                <th className="py-4 px-4">Account Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading students...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                          {s.user?.name ? s.user.name.charAt(0) : 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{s.user?.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{s.user?.userId} • {s.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      #{s.rollNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {s.class?.name || 'Class 10'} — {s.section}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{s.parentName}</p>
                      <p className="text-slate-400 text-[11px]">{s.parentPhone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(s)}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition ${
                          s.user?.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {s.user?.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openViewModal(s)}
                          title="View Profile"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(s)}
                          title="Edit Details"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          title="Delete Record"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">Enroll New Student</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Aryan Sharma"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="aryan@school.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Class *</label>
                  <select
                    required
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Section *</label>
                  <input
                    type="text"
                    required
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                    placeholder="A"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                    placeholder="104"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                    placeholder="Rajesh Sharma"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Parent Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                    placeholder="+91 98123 45678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Blood Group</label>
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                    placeholder="O+"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Temporary Password</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                    placeholder="password123"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">Update Student Record</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div className="grid grid-cols-3 gap-3">
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
                  <label className="font-semibold text-slate-700">Section</label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Roll Number</label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Parent Name</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Parent Phone</label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  />
                </div>
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Profile Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Student Profile</span>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white text-2xl font-black flex items-center justify-center mx-auto shadow-md">
                {selectedStudent.user?.name?.charAt(0)}
              </div>
              <h3 className="font-bold text-lg text-slate-800 mt-2">{selectedStudent.user?.name}</h3>
              <p className="text-xs text-emerald-600 font-semibold font-mono">
                {selectedStudent.user?.userId} • Roll #{selectedStudent.rollNumber}
              </p>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl text-xs border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Class & Section:</span>
                <span className="font-semibold text-slate-800">
                  {selectedStudent.class?.name} - {selectedStudent.section}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parent Name:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parent Contact:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.parentPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.bloodGroup || 'O+'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className={`font-bold ${selectedStudent.user?.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {selectedStudent.user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
