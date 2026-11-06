'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ReportCardModal, ReportCardData } from '@/components/common/ReportCardModal';
import { useAuth } from '@/context/AuthContext';
import {
  Award,
  Printer,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { authFetch } from '@/lib/api';

export default function StudentResultsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [marks, setMarks] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Search Roll No State
  const [searchedRoll, setSearchedRoll] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Report Card Modal
  const [reportData, setReportData] = useState<ReportCardData | null>(null);
  const [showReportCard, setShowReportCard] = useState(false);

  // 1. Initial Load: Fetch published exams and student profile
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [resE, resMe] = await Promise.all([
        authFetch('/api/exams'),
        authFetch('/api/auth/me'),
      ]);

      const dataE = await resE.json();
      const dataMe = await resMe.json();

      const publishedExams = (dataE.exams || []).filter((e: any) => e.isPublished);
      setExams(publishedExams);

      if (publishedExams.length > 0) {
        setSelectedExamId(publishedExams[0]._id);
      }

      if (dataMe.success && dataMe.user?.profile) {
        setProfile(dataMe.user.profile);
      }
    } catch (err) {
      console.error('Error fetching initial results data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 2. Fetch Marks for Selected Exam
  const fetchExamMarks = async () => {
    if (!selectedExamId) return;
    try {
      setLoading(true);
      const res = await authFetch(`/api/marks?examId=${selectedExamId}&status=Published`);
      const data = await res.json();
      if (data.success) {
        setMarks(data.marks || []);
      }
    } catch (err) {
      console.error('Error fetching marks for exam:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedExamId) {
      fetchExamMarks();
    }
  }, [selectedExamId]);

  // Current selected exam object
  const currentExam = useMemo(() => {
    return exams.find((e) => e._id === selectedExamId);
  }, [exams, selectedExamId]);

  // Calculations
  const calculations = useMemo(() => {
    const totalMax = marks.reduce((acc, m) => acc + (m.maxMarks || 100), 0);
    const totalObtained = marks.reduce(
      (acc, m) => acc + (m.isAbsent ? 0 : m.marksObtained || 0),
      0
    );
    const percentage = totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(1)) : 0;
    const hasFailedAny = marks.some(
      (m) => m.isAbsent || m.marksObtained < (m.passMarks || 35)
    );
    const isPassed = marks.length > 0 && !hasFailedAny && percentage >= 35;

    let overallGrade = 'F';
    if (isPassed) {
      if (percentage >= 90) overallGrade = 'A+';
      else if (percentage >= 80) overallGrade = 'A';
      else if (percentage >= 70) overallGrade = 'B+';
      else if (percentage >= 60) overallGrade = 'B';
      else if (percentage >= 50) overallGrade = 'C';
      else overallGrade = 'D';
    }

    return { totalMax, totalObtained, percentage, isPassed, overallGrade };
  }, [marks]);

  const openReportCard = () => {
    if (!currentExam) return;
    setReportData({
      studentName: user?.name || 'Student Name',
      rollNumber: profile?.rollNumber || '101',
      studentUserId: user?.userId || 'STD001',
      className: `${profile?.class?.name || currentExam.class?.name || 'Class 10'} — Section ${
        profile?.section || 'A'
      }`,
      parentName: profile?.parentName,
      examName: currentExam.name,
      session: currentExam.session || '2026-2027',
      date: new Date().toISOString(),
      isPassed: calculations.isPassed,
      percentage: calculations.percentage,
      totalMaxMarks: calculations.totalMax,
      totalMarksObtained: calculations.totalObtained,
      overallGrade: calculations.overallGrade,
      marks: marks.map((m) => ({
        subjectName: m.subject?.name || 'Subject',
        subjectCode: m.subject?.code || 'SUB',
        marksObtained: m.isAbsent ? 0 : m.marksObtained,
        maxMarks: m.maxMarks || 100,
        passMarks: m.passMarks || 35,
        isAbsent: Boolean(m.isAbsent),
        grade: m.isAbsent ? 'AB' : m.grade,
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

    try {
      const res = await authFetch(
        `/api/results/check?rollNumber=${encodeURIComponent(searchedRoll.trim())}${
          selectedExamId ? `&examId=${selectedExamId}` : ''
        }`
      );
      const data = await res.json();
      if (data.success && data.reportCard) {
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
      title="Examination Results & Official Marksheet"
      subtitle="View verified academic results, subject-wise scores, and download printable marksheet"
      allowedRoles={['student']}
      onRefresh={fetchExamMarks}
    >
      {/* Exam Selector Strip */}
      {exams.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500">
                Declared Examination Results
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="mt-0.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 bg-slate-50"
              >
                {exams.map((ex) => (
                  <option key={ex._id} value={ex._id}>
                    {ex.name} ({ex.session || '2026-27'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={openReportCard}
            disabled={marks.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Marksheet</span>
          </button>
        </div>
      )}

      {/* Top Banner Card */}
      {marks.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
              Official Evaluation Summary • {currentExam?.name}
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">
              Cumulative Score:{' '}
              <span className="text-emerald-700">{calculations.percentage}%</span>{' '}
              <span className="text-base font-bold text-slate-500">
                (Grade: {calculations.overallGrade})
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Roll #{profile?.rollNumber || '101'} • {calculations.totalObtained} / {calculations.totalMax} Total Marks • Result:{' '}
              <strong
                className={
                  calculations.isPassed ? 'text-emerald-700' : 'text-rose-600'
                }
              >
                {calculations.isPassed ? 'PASSED & PROMOTED' : 'NEEDS IMPROVEMENT / FAILED'}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${
                calculations.isPassed
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              {calculations.isPassed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Passed
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Needs Improvement
                </>
              )}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center shadow-xs mb-4">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 text-base">No Published Results Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Results for your class examinations will appear here once officially approved and published by the administration.
          </p>
        </div>
      )}

      {/* Roll Number Search Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Search className="w-4 h-4 text-emerald-600" />
          <span>Verify & Inspect Marksheet by Roll Number:</span>
        </div>

        <form onSubmit={handleRollSearch} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchedRoll}
            onChange={(e) => setSearchedRoll(e.target.value)}
            placeholder="e.g. 101 or STD001"
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs w-48 font-medium focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={searchLoading}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold rounded-lg transition shrink-0"
          >
            {searchLoading ? 'Checking...' : 'Check Marksheet'}
          </button>
        </form>
      </div>

      {searchError && (
        <div className="p-3 mb-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
          {searchError}
        </div>
      )}

      {/* Subject-Wise Marks Table */}
      {marks.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Subject-Wise Performance Statement</h3>
            <span className="text-xs text-slate-500">
              Exam Schedule: {formatDate(currentExam?.startDate)} — {formatDate(currentExam?.endDate)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4 text-center">Subject Code</th>
                  <th className="py-3 px-4 text-center">Max Marks</th>
                  <th className="py-3 px-4 text-center">Passing Marks</th>
                  <th className="py-3 px-4 text-center">Marks Obtained</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-center">Result Status</th>
                  <th className="py-3 px-4">Evaluator Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marks.map((m) => {
                  const isAb = Boolean(m.isAbsent);
                  const passScore = m.passMarks || 35;
                  const isPass = !isAb && m.marksObtained >= passScore;

                  return (
                    <tr
                      key={m._id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isAb ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                        {m.subject?.name || 'Subject'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-500 whitespace-nowrap">
                        {m.subject?.code || '—'}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 whitespace-nowrap">
                        {m.maxMarks || 100}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500 whitespace-nowrap">
                        {passScore}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {isAb ? (
                          <span className="inline-block px-2.5 py-0.5 bg-rose-100 text-rose-700 font-bold rounded">
                            ABSENT
                          </span>
                        ) : (
                          <span className="font-bold text-slate-900 text-sm">
                            {m.marksObtained}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`font-bold text-xs px-2 py-0.5 rounded ${
                            isAb || m.grade === 'AB'
                              ? 'bg-rose-100 text-rose-700'
                              : m.grade.includes('F')
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {isAb ? 'AB' : m.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {isAb ? (
                          <span className="text-rose-600 font-bold">Absent</span>
                        ) : isPass ? (
                          <span className="text-emerald-700 font-bold">Passed</span>
                        ) : (
                          <span className="text-rose-600 font-bold">Failed</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {m.remarks || 'Satisfactory effort'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Report Card Modal */}
      <ReportCardModal
        isOpen={showReportCard}
        onClose={() => setShowReportCard(false)}
        reportData={reportData}
      />
    </DashboardShell>
  );
}
