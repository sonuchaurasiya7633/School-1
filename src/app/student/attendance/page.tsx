'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatCard } from '@/components/common/StatCard';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Send,
  X,
  FileText,
  Filter,
  Check,
  HelpCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { authFetch } from '@/lib/api';

export default function StudentAttendancePage() {
  const [summary, setSummary] = useState<any>({
    totalDays: 0,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    percentage: 100,
    isLowAttendance: false,
    warningMessage: null,
  });
  const [history, setHistory] = useState<any[]>([]);
  const [corrections, setCorrections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'log' | 'requests'>('log');

  // Correction Request Modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    date: new Date().toISOString().split('T')[0],
    currentStatus: 'Absent',
    requestedStatus: 'Present',
    reason: '',
  });
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Month filter
  const [monthFilter, setMonthFilter] = useState('');

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const url = monthFilter ? `/api/attendance?month=${monthFilter}` : '/api/attendance';
      const [resAtt, resCorr] = await Promise.all([
        authFetch(url),
        authFetch('/api/attendance/corrections'),
      ]);

      const dataAtt = await resAtt.json();
      const dataCorr = await resCorr.json();

      if (dataAtt.success) {
        if (dataAtt.summary) setSummary(dataAtt.summary);
        if (dataAtt.history) setHistory(dataAtt.history);
      }
      if (dataCorr.success) {
        setCorrections(dataCorr.corrections || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [monthFilter]);

  // Open correction modal for a specific day
  const handleOpenCorrection = (dayRecord?: any) => {
    if (dayRecord) {
      setRequestForm({
        date: dayRecord.date,
        currentStatus: dayRecord.status,
        requestedStatus: 'Present',
        reason: '',
      });
    } else {
      setRequestForm({
        date: new Date().toISOString().split('T')[0],
        currentStatus: 'Absent',
        requestedStatus: 'Present',
        reason: '',
      });
    }
    setShowRequestModal(true);
  };

  // Submit Correction Request
  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.reason.trim()) {
      alert('Please provide a valid explanation or medical reason for attendance correction.');
      return;
    }

    try {
      setSubmittingRequest(true);
      const res = await authFetch('/api/attendance/corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestForm),
      });

      const data = await res.json();
      if (data.success) {
        alert('Correction request submitted! Administration will review your request.');
        setShowRequestModal(false);
        await fetchAttendance();
        setActiveTab('requests');
      } else {
        alert(data.message || 'Error submitting request.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting correction request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <DashboardShell
      title="My Attendance Record"
      subtitle="Comprehensive view of your class roll call status, monthly percentage, absent logs, and correction requests"
      allowedRoles={['student']}
      onRefresh={fetchAttendance}
    >
      {/* Low Attendance Warning Alert (< 75%) */}
      {summary.percentage < 75 && summary.totalDays >= 3 && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-rose-950">
                Low Attendance Alert: {summary.percentage}% (Minimum 75% Required)
              </h4>
              <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                Your cumulative attendance is below the mandatory 75% limit set by the school board. You risk being debarred from final examinations unless attendance is improved or valid medical leave requests are approved.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenCorrection()}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 transition"
          >
            Submit Correction Request
          </button>
        </div>
      )}

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Attendance Score"
          value={`${summary.percentage}%`}
          subtitle={summary.percentage >= 75 ? 'Meets 75% requirement' : 'Below 75% minimum'}
          icon={CalendarCheck}
          color={summary.percentage >= 75 ? 'emerald' : 'rose'}
        />
        <StatCard
          title="Days Present"
          value={summary.presentCount}
          subtitle="Full day attendances"
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Days Absent"
          value={summary.absentCount}
          subtitle="Leaves & absences"
          icon={XCircle}
          color="rose"
        />
        <StatCard
          title="Late / Half Days"
          value={summary.lateCount}
          subtitle="Tardy recordings"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Action Bar & Tabs */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('log')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'log'
                ? 'bg-[#214F39] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Attendance History Log
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-[#214F39] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>My Correction Requests</span>
            {corrections.length > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-500 text-white rounded-full text-[10px]">
                {corrections.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 font-semibold"
          />
          {monthFilter && (
            <button
              onClick={() => setMonthFilter('')}
              className="text-xs text-rose-600 hover:underline font-bold"
            >
              Clear
            </button>
          )}

          <button
            onClick={() => handleOpenCorrection()}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Request Correction</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Attendance Log */}
      {activeTab === 'log' ? (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Daily Attendance Log
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Total Recorded: {history.length} Sessions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4 whitespace-nowrap">Date</th>
                  <th className="py-3 px-4 whitespace-nowrap">Standard &amp; Section</th>
                  <th className="py-3 px-4 whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 whitespace-nowrap">Teacher Remarks</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading attendance records...
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No attendance records found for this period.
                    </td>
                  </tr>
                ) : (
                  history.map((h, idx) => (
                    <tr key={h._id || idx} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {formatDate(h.date)}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {h.class?.name || 'Class'} — Sec {h.section}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            h.status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : h.status === 'Absent'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {h.status === 'Present' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {h.status === 'Absent' && <XCircle className="w-3 h-3 text-rose-600" />}
                          {h.status !== 'Present' && h.status !== 'Absent' && (
                            <Clock className="w-3 h-3 text-amber-600" />
                          )}
                          {h.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 italic whitespace-nowrap">
                        {h.remarks || 'Standard session'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {h.status !== 'Present' && (
                          <button
                            onClick={() => handleOpenCorrection(h)}
                            className="px-2 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded text-[11px] font-bold transition border border-emerald-200"
                          >
                            Correct This
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab 2: Correction Requests */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                My Attendance Correction Requests
              </h3>
              <p className="text-[11px] text-slate-500">
                Track status of requested attendance updates and approvals
              </p>
            </div>
            <button
              onClick={() => handleOpenCorrection()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
            >
              + New Request
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Marked As</th>
                  <th className="py-3 px-4">Requested</th>
                  <th className="py-3 px-4">Reason / Medical Slip</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Admin Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {corrections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      No correction requests submitted yet.
                    </td>
                  </tr>
                ) : (
                  corrections.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{formatDate(c.date)}</td>
                      <td className="py-3 px-4 font-semibold text-rose-700">{c.currentStatus}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">{c.requestedStatus}</td>
                      <td className="py-3 px-4 text-slate-700 max-w-xs">{c.reason}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            c.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {c.reviewRemarks || (c.status === 'Pending' ? 'Under Review' : '—')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Correction Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Request Attendance Correction</h3>
                <p className="text-xs text-slate-500">Submit official request for administrative verification</p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCorrection} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Session Date *</label>
                <input
                  type="date"
                  required
                  value={requestForm.date}
                  onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Currently Marked</label>
                  <select
                    value={requestForm.currentStatus}
                    onChange={(e) => setRequestForm({ ...requestForm, currentStatus: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-semibold text-rose-700"
                  >
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Present">Present</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Requested Status</label>
                  <select
                    value={requestForm.requestedStatus}
                    onChange={(e) => setRequestForm({ ...requestForm, requestedStatus: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold text-emerald-700"
                  >
                    <option value="Present">Present</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Late">Late</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Reason &amp; Explanation *
                </label>
                <textarea
                  required
                  rows={3}
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                  placeholder="e.g. I was present during science practicals / Had submitted medical certificate to Class Teacher..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm"
                >
                  {submittingRequest ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
