'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Calendar as CalendarIcon,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  Sun,
  BookOpen,
} from 'lucide-react';
import { authFetch } from '@/lib/api';
import {
  ISchoolCalendarEvent,
  CalendarStats,
  HolidayCategory,
  SchoolDayStatus,
} from '@/types/calendar';
import { calculate2027CalendarStats } from '@/data/calendarData2027';

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<ISchoolCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [academicYear, setAcademicYear] = useState('2027');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ISchoolCalendarEvent | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<ISchoolCalendarEvent>>({
    title: '',
    date: '2027-01-01',
    endDate: '',
    category: 'general',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    description: '',
    instructions: '',
    academicYear: '2027',
  });

  const showToast = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`/api/admin/calendar?year=${academicYear}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
      } else {
        showToast('error', data.message || 'Failed to fetch calendar');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error fetching calendar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [academicYear]);

  // Recalculate stats live
  const { stats } = useMemo(() => {
    return calculate2027CalendarStats(events);
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCat =
        selectedCategory === 'all' || ev.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.date.includes(searchQuery);
      return matchCat && matchSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      date: '2027-01-01',
      endDate: '',
      category: 'general',
      schoolStatus: 'closed',
      isApproved: true,
      isOptional: false,
      description: '',
      instructions: '',
      academicYear,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (ev: ISchoolCalendarEvent) => {
    setEditingEvent(ev);
    setFormData({
      title: ev.title,
      date: ev.date,
      endDate: ev.endDate || '',
      category: ev.category,
      schoolStatus: ev.schoolStatus,
      isApproved: ev.isApproved,
      isOptional: ev.isOptional,
      description: ev.description || '',
      instructions: ev.instructions || '',
      academicYear: ev.academicYear || academicYear,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      showToast('error', 'Title and Date are required');
      return;
    }

    try {
      setSaving(true);
      const targetId = editingEvent?._id || editingEvent?.id;

      if (targetId) {
        // PUT
        const res = await authFetch('/api/admin/calendar', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: targetId, ...formData }),
        });
        const data = await res.json();
        if (data.success) {
          showToast('success', 'Calendar event updated successfully');
          setShowModal(false);
          fetchCalendar();
        } else {
          showToast('error', data.message || 'Failed to update');
        }
      } else {
        // POST
        const res = await authFetch('/api/admin/calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          showToast('success', 'Calendar event created successfully');
          setShowModal(false);
          fetchCalendar();
        } else {
          showToast('error', data.message || 'Failed to create');
        }
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this calendar event?'))
      return;

    try {
      const res = await authFetch(`/api/admin/calendar?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Event removed from calendar');
        setEvents((prev) => prev.filter((e) => (e._id || e.id) !== id));
      } else {
        showToast('error', data.message || 'Failed to delete');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error deleting event');
    }
  };

  const handleToggleApproval = async (ev: ISchoolCalendarEvent) => {
    const targetId = ev._id || ev.id;
    if (!targetId) return;

    const newApproval = !ev.isApproved;
    // If approved, default closed if optional, else keep current
    const newStatus: SchoolDayStatus = newApproval ? 'closed' : 'open';

    try {
      const res = await authFetch('/api/admin/calendar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: targetId,
          isApproved: newApproval,
          schoolStatus: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEvents((prev) =>
          prev.map((item) =>
            (item._id || item.id) === targetId
              ? { ...item, isApproved: newApproval, schoolStatus: newStatus }
              : item
          )
        );
        showToast(
          'success',
          `${ev.title} is now ${newApproval ? 'Approved (Closed)' : 'Unapproved (Open)'}`
        );
      }
    } catch (err: any) {
      showToast('error', 'Failed to toggle approval status');
    }
  };

  const handleReseedDefaults = async () => {
    if (
      !window.confirm(
        'Reset calendar to official Bihar Government 2027 holiday gazette? This will restore all 12 General, 24 Public, and 22 Optional holidays.'
      )
    )
      return;

    try {
      setSaving(true);
      const res = await authFetch('/api/admin/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reseed', academicYear }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Calendar reseeded with official 2027 gazette!');
        fetchCalendar();
      } else {
        showToast('error', data.message || 'Failed to reseed');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error reseeding calendar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell
      title="School Calendar & Holiday CMS"
      subtitle="Manage Academic Year 2027 schedule, Bihar Govt gazetted holidays, vacations, exams, and weekly working rules"
    >
      <div className="space-y-6">
        {/* TOAST NOTIFICATION */}
        {notification && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-md transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
        )}

        {/* TOP STATS BANNER */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center">
            <span className="block text-2xl font-black text-stone-900">
              {stats.totalCalendarDays}
            </span>
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Total Days 2027
            </span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm text-center">
            <span className="block text-2xl font-black text-emerald-800">
              {stats.totalWorkingDays}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
              Working Day Eq.
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center">
            <span className="block text-2xl font-black text-stone-900">
              {stats.totalFullWorkingDays}
            </span>
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Full Days (Sun–Thu)
            </span>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm text-center">
            <span className="block text-2xl font-black text-amber-800">
              {stats.totalFridayHalfDays}
            </span>
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
              Friday Half Days
            </span>
          </div>
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 shadow-sm text-center">
            <span className="block text-2xl font-black text-rose-800">
              {stats.totalApprovedHolidays}
            </span>
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
              Approved Closures
            </span>
          </div>
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 shadow-sm text-center">
            <span className="block text-2xl font-black text-stone-700">
              {stats.totalWeekendDays}
            </span>
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Saturday Offs
            </span>
          </div>
        </div>

        {/* ACTION & CONTROL BAR */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#214F39] text-white text-xs font-bold hover:bg-[#183B2B] active:scale-95 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Holiday / Vacation / Event
            </button>

            <button
              onClick={handleReseedDefaults}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 active:scale-95 transition-all border border-stone-200"
            >
              <RotateCcw className="w-4 h-4 text-stone-600" />
              Reset 2027 Bihar Govt Reference
            </button>

            <a
              href="/calendar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 active:scale-95 transition-all border border-emerald-200"
            >
              <ExternalLink className="w-4 h-4" />
              Live Public Preview
            </a>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#214F39]"
            />
          </div>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: `All Events (${events.length})` },
            {
              id: 'general',
              label: `General Holidays (${
                events.filter((e) => e.category === 'general').length
              })`,
            },
            {
              id: 'public',
              label: `Public N.I. (${
                events.filter((e) => e.category === 'public').length
              })`,
            },
            {
              id: 'optional',
              label: `Optional / Restricted (${
                events.filter((e) => e.category === 'optional').length
              })`,
            },
            {
              id: 'school',
              label: `School Vacations & Meets (${
                events.filter((e) => e.category === 'school').length
              })`,
            },
            {
              id: 'exam',
              label: `Examinations (${
                events.filter((e) => e.category === 'exam').length
              })`,
            },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#214F39] text-white shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* EVENTS TABLE */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 uppercase font-black tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Date / Period</th>
                  <th className="py-3.5 px-4">Event / Holiday Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">School Closure Status</th>
                  <th className="py-3.5 px-4 text-center">Approved by SPS</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredEvents.map((ev) => {
                  const evId = ev._id || ev.id;
                  return (
                    <tr
                      key={evId}
                      className="hover:bg-stone-50/70 transition-colors"
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-stone-900">
                        {ev.date}
                        {ev.endDate && (
                          <span className="block text-[10px] text-stone-500 font-normal">
                            to {ev.endDate}
                          </span>
                        )}
                      </td>

                      {/* Title & Description */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-stone-900 text-sm block">
                          {ev.title}
                        </span>
                        {ev.description && (
                          <span className="text-stone-500 line-clamp-1 block text-[11px] mt-0.5">
                            {ev.description}
                          </span>
                        )}
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            ev.category === 'general'
                              ? 'bg-orange-100 text-orange-900'
                              : ev.category === 'public'
                              ? 'bg-pink-100 text-pink-900'
                              : ev.category === 'optional'
                              ? 'bg-sky-100 text-sky-900'
                              : ev.category === 'school'
                              ? 'bg-purple-100 text-purple-900'
                              : 'bg-teal-100 text-teal-900'
                          }`}
                        >
                          {ev.category}
                        </span>
                      </td>

                      {/* School Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            ev.schoolStatus === 'closed'
                              ? 'bg-rose-100 text-rose-800'
                              : ev.schoolStatus === 'half_day'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {ev.schoolStatus === 'closed'
                            ? 'School Closed'
                            : ev.schoolStatus === 'half_day'
                            ? 'Half Day'
                            : 'School Open'}
                        </span>
                      </td>

                      {/* Quick Approval Toggle */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleApproval(ev)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            ev.isApproved
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                          title="Click to toggle approved school status"
                        >
                          {ev.isApproved ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Approved
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5" />
                              Unapproved
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(ev)}
                            className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all"
                            title="Edit Event"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(evId)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: ADD / EDIT CALENDAR EVENT */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden">
              <div className="bg-[#214F39] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#E8B4A8]" />
                  <h3 className="text-lg font-black">
                    {editingEvent ? 'Edit Calendar Event' : 'Add Calendar Event'}
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
                {/* Title */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Event / Holiday Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Guru Govind Singh Jayanti"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#214F39]"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Start Date (YYYY-MM-DD) *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#214F39]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      End Date (Optional Vacation)
                    </label>
                    <input
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#214F39]"
                    />
                  </div>
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as HolidayCategory,
                        })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#214F39]"
                    >
                      <option value="general">General Holiday (Exec)</option>
                      <option value="public">Public Holiday (N.I. Act)</option>
                      <option value="optional">Optional / Restricted</option>
                      <option value="school">School Vacation / Event</option>
                      <option value="exam">Examination Shift</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      School Closure Status
                    </label>
                    <select
                      value={formData.schoolStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          schoolStatus: e.target.value as SchoolDayStatus,
                        })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#214F39]"
                    >
                      <option value="closed">School Closed</option>
                      <option value="half_day">Half Day (Classes in AM)</option>
                      <option value="open">School Open (Regular)</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800">
                    <input
                      type="checkbox"
                      checked={formData.isApproved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isApproved: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-[#214F39]"
                    />
                    Approve for School Calendar
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800">
                    <input
                      type="checkbox"
                      checked={formData.isOptional}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isOptional: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-[#214F39]"
                    />
                    Optional / Restricted Holiday
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of holiday or occasion..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#214F39]"
                  />
                </div>

                {/* Instructions */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Special Instructions (Uniform, Timings, Homework)
                  </label>
                  <input
                    type="text"
                    value={formData.instructions || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, instructions: e.target.value })
                    }
                    placeholder="e.g. Flag hoisting at 8:30 AM in ceremonial uniform"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#214F39]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-[#214F39] text-white font-bold hover:bg-[#183B2B] active:scale-95 transition-all shadow-sm"
                  >
                    {saving ? 'Saving...' : 'Save Calendar Event'}
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
