'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ReportCardModal } from '@/components/common/ReportCardModal';
import { useAuth } from '@/context/AuthContext';
import { Award, Printer, Search, ExternalLink, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function StudentResultsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Search Roll No State
  const [searchedRoll, setSearchedRoll] = useState('');
  const [customReport, setCustomReport] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Report Card Modal
  const [reportData, setReportData] = useState<any>(null);
  const [showReportCard, setShowReportCard] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const [resE, resM, resMe] = await Promise.all([
        fetch('/api/exams', { credentials: 'include' }),
        fetch('/api/marks', { credentials: 'include' }),
        fetch('/api/auth/me', { credentials: 'include' }),
      ]);

      const dataE = await resE.json();
      const dataM = await resM.json();
      const dataMe = await resMe.json();

      if (dataE.success) setExams(dataE.exams);
      if (dataM.success) setMarks(dataM.marks);
      if (dataMe.success && dataMe.user?.profile) setProfile(dataMe.user.profile);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const totalMax = marks.reduce((acc, m) => acc + (m.maxMarks || 100), 0);
  const totalObt = marks.reduce((acc, m) => acc + (m.marksObtained || 0), 0);
  const percentage = totalMax > 0 ? ((totalObt / totalMax) * 100).toFixed(1) : '0';
  const isPassed = Number(percentage) >= 35;

  const openReportCard = () => {
    setReportData({
      studentName: user?.name || 'Rahul Verma',
      rollNumber: profile?.rollNumber || '101',
      studentUserId: user?.userId || 'STD001',
      className: `${profile?.class?.name || 'Class 10'} — Section ${profile?.section || 'A'}`,
      examName: exams[0]?.name || 'Mid-Term Examination 2026',
      date: new Date().toISOString(),
      marks: marks.map((m) => ({
        subjectName: m.subject?.name,
        subjectCode: m.subject?.code,
        marksObtained: m.marksObtained,
        maxMarks: m.maxMarks,
        grade: m.grade,
        remarks: m.remarks,
      })),
    });
    setShowReportCard(true);
  };

  const handleRollSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedRoll.trim()) return;

    setSearchLoading(true);
    setSearchError('');
    setCustomReport(null);

    try {
      const res = await fetch(`/api/results/check?rollNumber=${encodeURIComponent(searchedRoll.trim())}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success && data.reportCard) {
        setCustomReport(data.reportCard);
        setReportData(data.reportCard);
        setShowReportCard(true);
      } else {
        setSearchError(data.message || 'No result found for this Roll Number.');
      }
    } catch (err: any) {
      setSearchError(err.message || 'Error checking marksheet.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <DashboardShell
      title="Examination Results & Marksheet"
      subtitle="View your published marks, grades, cumulative percentage, or check by Roll Number"
      allowedRoles={['student']}
      onRefresh={fetchResults}
    >
      {/* Top Banner Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
            Academic Performance Summary
          </span>
          <h2 className="text-2xl font-black text-slate-800 mt-1">
            Overall Score: <span className="text-emerald-600">{percentage}%</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Roll #{profile?.rollNumber || '101'} • {totalObt} / {totalMax} Total Marks • Status:{' '}
            <strong className={isPassed ? 'text-emerald-700' : 'text-rose-600'}>
              {isPassed ? 'Passed & Promoted' : 'Needs Review'}
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openReportCard}
            disabled={marks.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Marksheet</span>
          </button>
        </div>
      </div>

      {/* Roll Number Search Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Search className="w-4 h-4 text-emerald-600" />
          <span>Verify & Check Marksheet by Roll Number:</span>
        </div>

        <form onSubmit={handleRollSearch} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchedRoll}
            onChange={(e) => setSearchedRoll(e.target.value)}
            placeholder="e.g. 101, 102, 103..."
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs w-48 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={searchLoading}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs transition"
          >
            {searchLoading ? 'Checking...' : 'Check'}
          </button>
        </form>
      </div>

      {searchError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
          {searchError}
        </div>
      )}

      {/* Marks Statement Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              {exams[0]?.name || 'Term Evaluation'} — Subject Marks Breakdown
            </h3>
          </div>
          <span className="text-xs text-slate-400">Published Marksheet</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Subject</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Maximum Marks</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Marks Obtained</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Grade</th>
                <th className="py-3 px-4 whitespace-nowrap">Teacher Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No examination marks have been published yet for your profile.
                  </td>
                </tr>
              ) : (
                marks.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                      {m.subject?.name} <span className="text-xs text-slate-400 font-mono">({m.subject?.code})</span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600 font-medium">{m.maxMarks}</td>
                    <td className="py-3 px-4 text-center font-black text-slate-800 text-sm">{m.marksObtained}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded font-black text-emerald-600 bg-emerald-50 text-xs">
                        {m.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 italic whitespace-nowrap">{m.remarks || 'Very good work'}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
              <tr>
                <td className="py-3 px-4 text-slate-800 whitespace-nowrap">Cumulative Total</td>
                <td className="py-3 px-4 text-center text-slate-600 whitespace-nowrap">{totalMax}</td>
                <td className="py-3 px-4 text-center text-emerald-700 text-sm whitespace-nowrap">{totalObt}</td>
                <td colSpan={2} className="py-3 px-4 text-right text-emerald-700 whitespace-nowrap">
                  Percentage: {percentage}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Official Printable Report Card Modal */}
      <ReportCardModal
        isOpen={showReportCard}
        onClose={() => setShowReportCard(false)}
        reportData={reportData}
      />
    </DashboardShell>
  );
}
