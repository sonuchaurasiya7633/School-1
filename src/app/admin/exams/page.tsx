'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ReportCardModal } from '@/components/common/ReportCardModal';
import {
  Award,
  Plus,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  X,
  Printer,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [examMarks, setExamMarks] = useState<any[]>([]);

  // Report Card Modal
  const [reportData, setReportData] = useState<any>(null);
  const [showReportCard, setShowReportCard] = useState(false);

  // New Exam Form
  const [examForm, setExamForm] = useState({
    name: 'Annual Examination 2027',
    startDate: '2027-02-15',
    endDate: '2027-02-28',
    classId: '',
    isPublished: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resE, resC, resS] = await Promise.all([
        fetch('/api/exams'),
        fetch('/api/admin/classes'),
        fetch('/api/admin/subjects'),
      ]);

      const dataE = await resE.json();
      const dataC = await resC.json();
      const dataS = await resS.json();

      if (dataE.success) setExams(dataE.exams);
      if (dataC.success) {
        setClasses(dataC.classes);
        if (dataC.classes.length > 0 && !examForm.classId) {
          setExamForm((prev) => ({ ...prev, classId: dataC.classes[0]._id }));
        }
      }
      if (dataS.success) setSubjects(dataS.subjects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const schedule = subjects.slice(0, 5).map((s, idx) => ({
        subject: s._id,
        date: new Date(Date.now() + 86400000 * (idx + 3)).toISOString().split('T')[0],
        time: '09:00 AM - 12:00 PM',
        maxMarks: 100,
        passMarks: 35,
      }));

      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...examForm,
          schedule,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        fetchData();
      } else {
        alert(data.message || 'Error creating exam.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublish = async (exam: any) => {
    try {
      await fetch('/api/exams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: exam._id,
          name: exam.name,
          startDate: exam.startDate,
          endDate: exam.endDate,
          classId: exam.class?._id,
          isPublished: !exam.isPublished,
          schedule: exam.schedule,
        }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoGenerateMarksheets = async (exam: any) => {
    try {
      setGenerating(exam._id);
      const res = await fetch('/api/admin/exams/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam._id,
          classId: exam.class?._id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Marksheets automatically generated and published!');
        await fetchData();
        await openMarksReview(exam);
      } else {
        alert(data.message || 'Error generating marksheets.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exam schedule?')) return;
    try {
      await fetch(`/api/exams?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openMarksReview = async (exam: any) => {
    setSelectedExam(exam);
    try {
      const res = await fetch(`/api/marks?examId=${exam._id}`);
      const data = await res.json();
      if (data.success) {
        setExamMarks(data.marks);
      }
      setShowMarksModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const openIndividualStudentReportCard = (studentGroup: any) => {
    setReportData({
      studentName: studentGroup.student?.name || 'Student',
      rollNumber: studentGroup.student?.rollNumber || studentGroup.rollNumber || '101',
      studentUserId: studentGroup.student?.userId || 'STD001',
      className: `${studentGroup.class?.name || 'Class 10'} — Section ${studentGroup.section || 'A'}`,
      examName: selectedExam?.name || 'Mid-Term Examination 2026',
      date: new Date().toISOString(),
      marks: studentGroup.marks.map((m: any) => ({
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

  // Group marks by student for convenient tabular marksheets
  const studentGroups: { [key: string]: any } = {};
  examMarks.forEach((m) => {
    const sId = m.student?._id;
    if (!sId) return;
    if (!studentGroups[sId]) {
      studentGroups[sId] = {
        student: m.student,
        class: m.class,
        section: m.section,
        rollNumber: m.student?.rollNumber || '101',
        marks: [],
        totalMax: 0,
        totalObtained: 0,
      };
    }
    studentGroups[sId].marks.push(m);
    studentGroups[sId].totalMax += m.maxMarks || 100;
    studentGroups[sId].totalObtained += m.marksObtained || 0;
  });

  const studentGroupsArray = Object.values(studentGroups).map((sg: any) => {
    const pct = sg.totalMax > 0 ? ((sg.totalObtained / sg.totalMax) * 100).toFixed(1) : '0';
    return {
      ...sg,
      percentage: pct,
      isPassed: Number(pct) >= 35,
      overallGrade:
        Number(pct) >= 90
          ? 'A+'
          : Number(pct) >= 80
          ? 'A'
          : Number(pct) >= 70
          ? 'B+'
          : Number(pct) >= 60
          ? 'B'
          : Number(pct) >= 50
          ? 'C'
          : Number(pct) >= 35
          ? 'D'
          : 'F',
    };
  });

  return (
    <DashboardShell
      title="Exam & Result Management"
      subtitle="Schedule examinations, auto-generate student marksheets, and publish official report cards"
      allowedRoles={['admin']}
      onRefresh={fetchData}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Examination Schedules & Marksheets</h2>
          <p className="text-xs text-slate-500">Configured evaluation terms: {exams.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Examination</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {exams.map((ex) => (
          <div key={ex._id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                    {ex.class?.name || 'Class 10'} Evaluation
                  </span>
                  <h3 className="font-bold text-base text-slate-800 mt-0.5">{ex.name}</h3>
                </div>
                <button
                  onClick={() => handleTogglePublish(ex)}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition ${
                    ex.isPublished
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}
                >
                  {ex.isPublished ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Published
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-amber-600" /> Draft (Unpublished)
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Duration: {formatDate(ex.startDate)} — {formatDate(ex.endDate)}</span>
              </div>

              {/* Schedule list */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Paper Schedule ({ex.schedule?.length || 0} Papers)
                </span>
                <div className="space-y-1.5">
                  {ex.schedule?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-700">{item.subject?.name}</span>
                      <span className="text-[11px] text-slate-500">{formatDate(item.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAutoGenerateMarksheets(ex)}
                  disabled={generating === ex._id}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50"
                  title="Auto-generate complete marksheets for all students enrolled in this class"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{generating === ex._id ? 'Generating...' : 'Auto-Generate Marksheets'}</span>
                </button>

                <button
                  onClick={() => openMarksReview(ex)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Review & Print</span>
                </button>
              </div>

              <button
                onClick={() => handleDelete(ex._id)}
                className="p-1.5 text-slate-400 hover:text-rose-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">Schedule Examination</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Exam Title *</label>
                <input
                  type="text"
                  required
                  value={examForm.name}
                  onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                  placeholder="e.g. Second Term Assessment"
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Class *</label>
                <select
                  required
                  value={examForm.classId}
                  onChange={(e) => setExamForm({ ...examForm, classId: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                >
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Start Date</label>
                  <input
                    type="date"
                    required
                    value={examForm.startDate}
                    onChange={(e) => setExamForm({ ...examForm, startDate: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">End Date</label>
                  <input
                    type="date"
                    required
                    value={examForm.endDate}
                    onChange={(e) => setExamForm({ ...examForm, endDate: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Create Exam Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Marks & Student Marksheets Modal */}
      {showMarksModal && selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Generated Marksheets — {selectedExam.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedExam.class?.name || 'Class 10'} • Marksheets are published privately to the Student Dashboard (/student/results).
                </p>
              </div>
              <button onClick={() => setShowMarksModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              {studentGroupsArray.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <p className="text-xs text-slate-500">
                    No marks recorded for this examination yet. You can auto-generate marksheets with one click!
                  </p>
                  <button
                    onClick={() => handleAutoGenerateMarksheets(selectedExam)}
                    disabled={generating === selectedExam._id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Auto-Generate Marksheets Now</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                    <span>
                      Total Marksheets Available: <strong>{studentGroupsArray.length} Students</strong>
                    </span>
                    <button
                      onClick={() => openIndividualStudentReportCard(studentGroupsArray[0])}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Consolidated Sample</span>
                    </button>
                  </div>

                  <table className="w-full text-xs text-left border rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                      <tr>
                        <th className="py-2.5 px-3">Student</th>
                        <th className="py-2.5 px-3">Roll No</th>
                        <th className="py-2.5 px-3 text-center">Subjects Evaluated</th>
                        <th className="py-2.5 px-3 text-center">Total Marks</th>
                        <th className="py-2.5 px-3 text-center">Percentage</th>
                        <th className="py-2.5 px-3 text-center">Overall Grade</th>
                        <th className="py-2.5 px-3 text-right">Individual Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentGroupsArray.map((sg, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-bold text-slate-800">
                            {sg.student?.name}
                            <span className="block text-[10px] font-mono text-slate-400 font-normal">
                              {sg.student?.userId}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-emerald-700 font-mono">
                            #{sg.rollNumber}
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-600">
                            {sg.marks.length} Subjects
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                            {sg.totalObtained} / {sg.totalMax}
                          </td>
                          <td className="py-2.5 px-3 text-center font-black text-emerald-700">
                            {sg.percentage}%
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded font-black text-xs text-emerald-700 bg-emerald-100">
                              {sg.overallGrade}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => openIndividualStudentReportCard(sg)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-[11px] font-semibold"
                            >
                              <Printer className="w-3 h-3 text-emerald-400" />
                              <span>Print Marksheet</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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
