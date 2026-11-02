'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { formatDate } from '@/lib/utils';
import {
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();
      if (data.success && data.inquiries) {
        setInquiries(data.inquiries);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: `Status updated to ${newStatus}.` });
        loadInquiries();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete inquiry for "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Inquiry record removed.' });
        loadInquiries();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inq.studentName.toLowerCase().includes(q) ||
      inq.parentName.toLowerCase().includes(q) ||
      inq.phone.includes(q) ||
      inq.applyingClass.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardShell title="Admission Inquiries & Registrations">
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Admissions CRM
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Online Admission Leads & Inquiries
            </h1>
            <p className="text-xs text-slate-400">
              Prospective students and parents who registered interest via the public website forms.
            </p>
          </div>

          <button
            onClick={loadInquiries}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {statusMsg.text && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 shadow-sm border ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{statusMsg.text}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, parent name, phone, or class..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="Admitted">Admitted</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Student & Parent</th>
                  <th className="py-4 px-6">Class Applying</th>
                  <th className="py-4 px-6">Contact Number</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6">Inquiry Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredInquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-white text-sm">{inq.studentName}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Parent: <span className="text-slate-200">{inq.parentName}</span>
                        </p>
                        {inq.message && (
                          <p className="text-[11px] text-slate-500 italic mt-1 max-w-xs truncate">
                            &ldquo;{inq.message}&rdquo;
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {inq.applyingClass}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <a
                        href={`tel:${inq.phone}`}
                        className="flex items-center gap-1.5 text-slate-200 hover:text-purple-400 transition font-mono font-medium"
                      >
                        <Phone className="w-3.5 h-3.5 text-purple-400" />
                        <span>{inq.phone}</span>
                      </a>
                      {inq.email && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{inq.email}</p>
                      )}
                    </td>

                    <td className="py-4 px-6 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {inq.createdAt ? formatDate(inq.createdAt) : 'Recently'}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                          inq.status === 'Admitted'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : inq.status === 'Contacted'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : inq.status === 'Cancelled'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Admitted">Admitted</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(inq._id, inq.studentName)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredInquiries.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-sm">No admission inquiries found</p>
                <p className="text-xs mt-1">Inquiries submitted on the website will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
