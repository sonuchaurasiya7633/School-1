'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Check,
  X,
  AlertCircle,
  Calendar,
  Sparkles,
  Search,
  School,
  Lock,
} from 'lucide-react';
import { authFetch } from '@/lib/api';

interface AcademicSessionItem {
  _id: string;
  sessionName: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
  isAdmissionOpen: boolean;
  status: 'upcoming' | 'active' | 'completed' | 'archived';
  description?: string;
  createdAt?: string;
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<AcademicSessionItem[]>([]);
  const [currentSessionName, setCurrentSessionName] = useState('2026-2027');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<AcademicSessionItem | null>(null);
  const [form, setForm] = useState({
    sessionName: '',
    startDate: '',
    endDate: '',
    status: 'upcoming' as AcademicSessionItem['status'],
    isCurrent: false,
    isAdmissionOpen: true,
    description: '',
  });

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4500);
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/sessions');
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions || []);
        if (data.currentSession) {
          setCurrentSessionName(data.currentSession);
        }
      } else {
        showToast('error', data.message || 'Failed to fetch sessions.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error fetching sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const openAddModal = () => {
    setEditingSession(null);
    setForm({
      sessionName: '',
      startDate: '',
      endDate: '',
      status: 'upcoming',
      isCurrent: false,
      isAdmissionOpen: true,
      description: '',
    });
    setShowModal(true);
  };

  const openEditModal = (item: AcademicSessionItem) => {
    setEditingSession(item);
    setForm({
      sessionName: item.sessionName,
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      status: item.status,
      isCurrent: item.isCurrent,
      isAdmissionOpen: item.isAdmissionOpen,
      description: item.description || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sessionName.trim()) {
      showToast('error', 'Session name is required (e.g. 2027-2028).');
      return;
    }

    try {
      setSaving(true);
      const method = editingSession ? 'PUT' : 'POST';
      const payload = editingSession ? { id: editingSession._id, ...form } : form;

      const res = await authFetch('/api/admin/sessions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          'success',
          editingSession
            ? `Academic session "${data.session.sessionName}" updated successfully.`
            : `New academic session "${data.session.sessionName}" created successfully.`
        );
        setShowModal(false);
        fetchSessions();
      } else {
        showToast('error', data.message || 'Failed to save session.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Network error.');
    } finally {
      setSaving(false);
    }
  };

  const handleSetCurrent = async (item: AcademicSessionItem) => {
    if (item.isCurrent) return;
    if (
      !confirm(
        `Are you sure you want to set "${item.sessionName}" as the Current Active Academic Session? This will update school settings and public dashboards.`
      )
    )
      return;

    try {
      const res = await authFetch('/api/admin/sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item._id, isCurrent: true, status: 'active' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `Active Academic Session switched to "${item.sessionName}"!`);
        fetchSessions();
      } else {
        showToast('error', data.message || 'Failed to switch active session.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error updating session.');
    }
  };

  const handleToggleAdmission = async (item: AcademicSessionItem) => {
    try {
      const newStatus = !item.isAdmissionOpen;
      const res = await authFetch('/api/admin/sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item._id, isAdmissionOpen: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          'success',
          `Admissions for "${item.sessionName}" are now ${newStatus ? 'OPEN' : 'CLOSED'}.`
        );
        fetchSessions();
      }
    } catch (err: any) {
      showToast('error', 'Error toggling admission status.');
    }
  };

  const handleDelete = async (item: AcademicSessionItem) => {
    if (item.isCurrent) {
      alert('Cannot delete the currently active academic session. Switch to another session first.');
      return;
    }
    if (!confirm(`Are you sure you want to delete session "${item.sessionName}"?`)) return;

    try {
      const res = await authFetch(`/api/admin/sessions?id=${item._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `Session "${item.sessionName}" removed successfully.`);
        fetchSessions();
      } else {
        showToast('error', data.message || 'Failed to delete session.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error deleting session.');
    }
  };

  const filteredSessions = sessions.filter(
    (s) =>
      s.sessionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardShell
      title="Academic Sessions Management"
      subtitle="Create new academic sessions, designate active school years, and configure admissions intake periods"
      allowedRoles={['admin']}
      onRefresh={fetchSessions}
    >
      <div className="space-y-6">
        {/* TOAST ALERTS */}
        {statusMsg.text && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold shadow-xs transition-all ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* METRICS BANNER */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Sessions
            </span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">
              {sessions.length}
            </span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Active Session
            </span>
            <span className="text-2xl font-black text-emerald-800 mt-1 block">
              {currentSessionName}
            </span>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-xs">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
              Upcoming
            </span>
            <span className="text-2xl font-black text-blue-800 mt-1 block">
              {sessions.filter((s) => s.status === 'upcoming').length}
            </span>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-xs">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Admissions Open
            </span>
            <span className="text-2xl font-black text-amber-800 mt-1 block">
              {sessions.filter((s) => s.isAdmissionOpen).length} Sessions
            </span>
          </div>
        </div>

        {/* CONTROLS HEADER */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Academic Session</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search session (e.g. 2027)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* SESSIONS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                item.isCurrent
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-gradient-to-b from-emerald-50/30 to-white'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-xl ${
                        item.isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <School className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">
                        {item.sessionName}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Academic Year
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {item.isCurrent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        ACTIVE CURRENT
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Duration Dates */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 space-y-1.5 my-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Session Term:</span>
                    <span className="font-bold text-slate-700">
                      {item.startDate || 'Apr 01'} — {item.endDate || 'Mar 31'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Admission Window:</span>
                    <button
                      type="button"
                      onClick={() => handleToggleAdmission(item)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                        item.isAdmissionOpen
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                      title="Click to toggle admission status"
                    >
                      {item.isAdmissionOpen ? 'Admissions Open ✓' : 'Admissions Closed ✕'}
                    </button>
                  </div>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* CARD BOTTOM ACTIONS */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {!item.isCurrent ? (
                  <button
                    onClick={() => handleSetCurrent(item)}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Set as Active</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active in CMS
                  </span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                    title="Edit Session"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={item.isCurrent}
                    className={`p-1.5 rounded-lg transition ${
                      item.isCurrent
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                    title={item.isCurrent ? 'Cannot delete active session' : 'Delete Session'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredSessions.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">No academic sessions found</p>
              <p className="text-xs text-slate-400">Click &quot;Create New Academic Session&quot; to register a school session.</p>
            </div>
          )}
        </div>

        {/* MODAL: CREATE / EDIT ACADEMIC SESSION */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-300" />
                  <h3 className="text-base font-black">
                    {editingSession ? 'Edit Academic Session' : 'Create Academic Session'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
                {/* Session Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Academic Session Name * (e.g. 2027-2028)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.sessionName}
                    onChange={(e) => setForm({ ...form, sessionName: e.target.value })}
                    placeholder="e.g. 2027-2028 or 2028-2029"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Standard convention: Four-digit start and end year separated by a hyphen.
                  </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Session Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="upcoming">Upcoming Session</option>
                    <option value="active">Active Running Session</option>
                    <option value="completed">Completed / Past Session</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={form.isCurrent}
                      onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    Set as Current Active Session (Updates website & CMS)
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={form.isAdmissionOpen}
                      onChange={(e) => setForm({ ...form, isAdmissionOpen: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    Open Public Admissions for this session
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Notes / Description</label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description or curriculum focus for this academic session..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-xs"
                  >
                    {saving ? 'Saving...' : editingSession ? 'Update Session' : 'Create Session'}
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
