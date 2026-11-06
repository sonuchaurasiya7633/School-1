'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ReportCardModal, ReportCardData } from '@/components/common/ReportCardModal';
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
  Send,
  CheckCheck,
  AlertTriangle,
  RotateCcw,
  Users,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { authFetch } from '@/lib/api';

export default function AdminExamsPage() {
  const [activeTab, setActiveTab] = useState<'schedules' | 'approvals' | 'tabulation'>('schedules');
  const [exams, setExams] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  // Selected Exam for Review & Tabulation
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [examMarks, setExamMarks] = useState<any[]>([]);
  const [loadingMarks, setLoadingMarks] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [reportData, setReportData] = useState<ReportCardData | null>(null);
  const [showReportCard, setShowReportCard] = useState(false);

  // Create Exam Form
  const [examForm, setExamForm] = useState({
    name: 'Annual Examination 2027',
    session: '2026-2027',
    startDate: '2027-02-15',
    endDate: '2027-02-28',
    classId: '',
    isPublished: false,
  });

  const [scheduleItems, setScheduleItems] = useState<
    Array<{
      subjectId: string;
      date: string;
      time: string;
      maxMarks: number;
      passMarks: number;
      teacherId: string;
    }>
  >([]);

  // 1. Initial Load: Exams, Classes, Subjects, Teachers
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resE, resC, resS, resT] = await Promise.all([
        authFetch('/api/exams'),
        authFetch('/api/admin/classes'),
        authFetch('/api/admin/subjects'),
        authFetch('/api/admin/teachers'),
      ]);

      const dataE = await resE.json();
      const dataC = await resC.json();
      const dataS = await resS.json();
      const dataT = await resT.json();

      const examList = dataE.exams || [];
      setExams(examList);
      if (examList.length > 0 && !selectedExamId) {
        setSelectedExamId(examList[0]._id);
      }

      if (dataC.success) {
        setClasses(dataC.classes || []);
        if (dataC.classes?.length > 0 && !examForm.classId) {
          setExamForm((prev) => ({ ...prev, classId: dataC.classes[0]._id }));
        }
      }

      if (dataS.success) {
        setSubjects(dataS.subjects || []);
        // Setup initial schedule items
        if (scheduleItems.length === 0 && dataS.subjects?.length > 0) {
          setScheduleItems(
            dataS.subjects.slice(0, 5).map((s: any, idx: number) => ({
              subjectId: s._id,
              date: new Date(Date.now() + 86400000 * (idx + 3)).toISOString().split('T')[0],
              time: '09:00 AM - 12:00 PM',
              maxMarks: 100,
              passMarks: 35,
              teacherId: '',
            }))
          );
        }
      }

      if (dataT.success) {
        setTeachers(dataT.teachers || []);
      }
    } catch (err) {
      console.error('Error fetching admin exam data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Fetch Marks for Selected Exam
  const fetchMarksForExam = async (examId: string) => {
    if (!examId) return;
    try {
      setLoadingMarks(true);
      const res = await authFetch(`/api/marks?examId=${examId}`);
      const data = await res.json();
      if (data.success) {
        setExamMarks(data.marks || []);
      }
    } catch (err) {
      console.error('Error loading marks for review:', err);
    } finally {
      setLoadingMarks(false);
    }
  };

  useEffect(() => {
    if (selectedExamId) {
      fetchMarksForExam(selectedExamId);
    }
  }, [selectedExamId]);

  const selectedExam = useMemo(() => {
    return exams.find((e) => e._id === selectedExamId);
  }, [exams, selectedExamId]);

  // Create Exam Handler
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const schedule = scheduleItems.map((item) => ({
        subject: item.subjectId,
        date: item.date,
        time: item.time,
        maxMarks: Number(item.maxMarks),
        passMarks: Number(item.passMarks),
        ...(item.teacherId ? { teacher: item.teacherId } : {}),
      }));

      const res = await authFetch('/api/exams', {
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
        await fetchData();
        if (data.exam?._id) setSelectedExamId(data.exam._id);
      } else {
        alert(data.message || 'Error creating exam schedule.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Exam Publish
  const handleTogglePublish = async (exam: any) => {
    try {
      await authFetch('/api/exams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: exam._id,
          name: exam.name,
          session: exam.session,
          startDate: exam.startDate,
          endDate: exam.endDate,
          classId: exam.class?._id || exam.class,
          isPublished: !exam.isPublished,
          schedule: exam.schedule,
        }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk Approve or Publish
  const handleBulkAction = async (action: 'approve_all' | 'publish_all') => {
    if (!selectedExamId) return;
    const confirmText =
      action === 'publish_all'
        ? 'Are you sure you want to approve & publish all marks for this exam? Students will immediately be able to view their official report cards.'
        : 'Are you sure you want to approve all submitted marks for this exam?';

    if (!confirm(confirmText)) return;

    try {
      const res = await authFetch('/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          examId: selectedExamId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        await fetchMarksForExam(selectedExamId);
        await fetchData();
      } else {
        alert(data.message || 'Error executing action.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Subject-level Approval / Publish / Reject
  const handleSubjectAction = async (
    subjectId: string,
    action: 'approve' | 'publish' | 'reject'
  ) => {
    if (!selectedExam) return;
    const subjectMarks = examMarks.filter(
      (m) => (m.subject?._id || m.subject) === subjectId
    );

    if (subjectMarks.length === 0) {
      alert('No marks submitted for this subject yet.');
      return;
    }

    try {
      const marksData = subjectMarks.map((m) => ({
        studentId: m.student?._id || m.student,
        marksObtained: m.marksObtained,
        maxMarks: m.maxMarks,
        passMarks: m.passMarks,
        isAbsent: m.isAbsent,
        remarks: m.remarks,
      }));

      const res = await authFetch('/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          examId: selectedExam._id,
          classId: selectedExam.class?._id || selectedExam.class,
          section: 'A',
          subjectId,
          marksData,
          reviewRemarks:
            action === 'reject'
              ? prompt('Please enter correction instructions for the teacher:') || 'Revision required'
              : `Admin ${action}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchMarksForExam(selectedExam._id);
      } else {
        alert(data.message || 'Action failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Auto Generate Baseline Marksheets (Testing/Seeding)
  const handleAutoGenerateMarksheets = async (exam: any) => {
    try {
      setGenerating(exam._id);
      const res = await authFetch('/api/admin/exams/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam._id,
          classId: exam.class?._id || exam.class,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Marksheets automatically generated and published!');
        await fetchData();
        setSelectedExamId(exam._id);
        await fetchMarksForExam(exam._id);
      } else {
        alert(data.message || 'Error generating marksheets.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(null);
    }
  };

  // Delete Exam Schedule
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exam schedule and associated marks?')) return;
    try {
      await authFetch(`/api/exams?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Group marks by student for Tabulation Register & Rankings
  const studentTabulation = useMemo(() => {
    const studentMap: { [sId: string]: any } = {};

    examMarks.forEach((m) => {
      const sId = m.student?._id;
      if (!sId) return;

      if (!studentMap[sId]) {
        studentMap[sId] = {
          student: m.student,
          class: m.class,
          section: m.section,
          rollNumber: m.student?.rollNumber || '101',
          marks: {},
          totalMax: 0,
          totalObtained: 0,
          hasFailedSubject: false,
        };
      }

      const subId = m.subject?._id || m.subject;
      studentMap[sId].marks[subId] = m;
      studentMap[sId].totalMax += m.maxMarks || 100;
      studentMap[sId].totalObtained += m.isAbsent ? 0 : m.marksObtained || 0;

      if (m.isAbsent || m.marksObtained < (m.passMarks || 35)) {
        studentMap[sId].hasFailedSubject = true;
      }
    });

    const list = Object.values(studentMap).map((st: any) => {
      const pct = st.totalMax > 0 ? ((st.totalObtained / st.totalMax) * 100).toFixed(1) : '0';
      const isPassed = !st.hasFailedSubject && Number(pct) >= 35;
      const overallGrade = !isPassed
        ? 'F'
        : Number(pct) >= 90
        ? 'A+'
        : Number(pct) >= 80
        ? 'A'
        : Number(pct) >= 70
        ? 'B+'
        : Number(pct) >= 60
        ? 'B'
        : Number(pct) >= 50
        ? 'C'
        : 'D';

      return {
        ...st,
        percentage: pct,
        isPassed,
        overallGrade,
      };
    });

    // Sort by total obtained descending to assign ranks
    list.sort((a, b) => b.totalObtained - a.totalObtained);
    return list.map((st, idx) => ({
      ...st,
      rank: st.isPassed ? idx + 1 : '—',
    }));
  }, [examMarks]);

  // Overall class stats
  const classAnalytics = useMemo(() => {
    const totalStudents = studentTabulation.length;
    const passedStudents = studentTabulation.filter((s) => s.isPassed).length;
    const failedStudents = totalStudents - passedStudents;
    const passPercentage =
      totalStudents > 0 ? ((passedStudents / totalStudents) * 100).toFixed(1) : '0';
    const classAvgScore =
      totalStudents > 0
        ? (
            studentTabulation.reduce((acc, s) => acc + Number(s.percentage), 0) /
            totalStudents
          ).toFixed(1)
        : '0';

    return { totalStudents, passedStudents, failedStudents, passPercentage, classAvgScore };
  }, [studentTabulation]);

  // Open single report card modal
  const openSingleReportCard = (row: any) => {
    if (!selectedExam) return;
    const markItems = Object.values(row.marks).map((m: any) => ({
      subjectName: m.subject?.name || 'Subject',
      subjectCode: m.subject?.code || 'SUB',
      marksObtained: m.isAbsent ? 0 : m.marksObtained,
      maxMarks: m.maxMarks || 100,
      passMarks: m.passMarks || 35,
      isAbsent: Boolean(m.isAbsent),
      grade: m.isAbsent ? 'AB' : m.grade,
      remarks: m.remarks,
    }));

    setReportData({
      studentName: row.student?.name || 'Student',
      rollNumber: row.rollNumber || '101',
      studentUserId: row.student?.userId || 'STD001',
      className: `${selectedExam.class?.name || 'Class 10'} — Section ${row.section || 'A'}`,
      examName: selectedExam.name,
      session: selectedExam.session || '2026-2027',
      date: new Date().toISOString(),
      isPassed: row.isPassed,
      percentage: row.percentage,
      totalMaxMarks: row.totalMax,
      totalMarksObtained: row.totalObtained,
      overallGrade: row.overallGrade,
      marks: markItems,
    });
    setShowReportCard(true);
  };

  return (
    <DashboardShell
      title="Exam & Marksheet Management"
      subtitle="Create examinations, inspect teacher marks, approve submissions, and publish official report cards"
      allowedRoles={['admin']}
      onRefresh={fetchData}
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2">
        <button
          onClick={() => setActiveTab('schedules')}
          className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition ${
            activeTab === 'schedules'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Exam Schedules & Setup</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition ${
            activeTab === 'approvals'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCheck className="w-4 h-4" />
          <span>Marks Review & Approval Queue</span>
        </button>

        <button
          onClick={() => setActiveTab('tabulation')}
          className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition ${
            activeTab === 'tabulation'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Tabulation Register & Merit Rankings</span>
        </button>
      </div>

      {/* ===================== TAB 1: SCHEDULES ===================== */}
      {activeTab === 'schedules' && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Term Evaluation Schedules</h2>
              <p className="text-xs text-slate-500">Configured examination terms: {exams.length}</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Examination</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {exams.map((ex) => (
              <div
                key={ex._id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                        {ex.class?.name || 'Class 10'} • Session {ex.session || '2026-27'}
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
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Published to Students
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
                    <span>
                      Duration: {formatDate(ex.startDate)} — {formatDate(ex.endDate)}
                    </span>
                  </div>

                  {/* Paper Schedule List */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Exam Papers ({ex.schedule?.length || 0} Scheduled)
                    </span>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {ex.schedule?.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded-lg border border-slate-100"
                        >
                          <div>
                            <span className="font-semibold text-slate-700">
                              {item.subject?.name || 'Subject'}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Max: {item.maxMarks} • Pass: {item.passMarks}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {formatDate(item.date)}
                          </span>
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
                      title="Auto-generate baseline marks for all students enrolled in this class"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{generating === ex._id ? 'Generating...' : 'Auto-Generate Marks'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedExamId(ex._id);
                        setActiveTab('tabulation');
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Review & Tabulate</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(ex._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: APPROVAL QUEUE ===================== */}
      {activeTab === 'approvals' && (
        <div>
          {/* Exam Selector Strip */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500">
                  Select Examination Term
                </label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="mt-0.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 bg-slate-50"
                >
                  {exams.map((ex) => (
                    <option key={ex._id} value={ex._id}>
                      {ex.name} ({ex.class?.name || 'Class 10'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('approve_all')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Approve All Submitted Marks</span>
              </button>

              <button
                onClick={() => handleBulkAction('publish_all')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                <Send className="w-4 h-4" />
                <span>Publish Official Results to Students</span>
              </button>
            </div>
          </div>

          {/* Subject-Wise Approval Cards */}
          <div className="space-y-4">
            {selectedExam?.schedule?.map((item: any) => {
              const subId = item.subject?._id || item.subject;
              const subMarks = examMarks.filter(
                (m) => (m.subject?._id || m.subject) === subId
              );

              const enteredCount = subMarks.length;
              const absentCount = subMarks.filter((m) => m.isAbsent).length;
              const passCount = subMarks.filter(
                (m) => !m.isAbsent && m.marksObtained >= (item.passMarks || 35)
              ).length;

              // Subject status
              let subStatus = 'Not Entered';
              if (enteredCount > 0) {
                if (subMarks.some((m) => m.status === 'Published')) subStatus = 'Published';
                else if (subMarks.some((m) => m.status === 'Approved')) subStatus = 'Approved';
                else if (subMarks.some((m) => m.status === 'Submitted')) subStatus = 'Submitted';
                else subStatus = 'Draft';
              }

              return (
                <div
                  key={subId}
                  className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-800">
                        {item.subject?.name || 'Subject'}{' '}
                        <span className="text-xs font-normal text-slate-400">
                          ({item.subject?.code || 'SUB'})
                        </span>
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          subStatus === 'Published'
                            ? 'bg-blue-100 text-blue-800'
                            : subStatus === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : subStatus === 'Submitted'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {subStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span>Max Marks: {item.maxMarks}</span>
                      <span>Pass Marks: {item.passMarks}</span>
                      <span>Marks Entered: {enteredCount}</span>
                      <span>Absent: {absentCount}</span>
                      <span className="text-emerald-700 font-semibold">
                        Pass Rate: {enteredCount > 0 ? ((passCount / enteredCount) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSubjectAction(subId, 'approve')}
                      disabled={enteredCount === 0}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-xs transition"
                    >
                      Approve Marks
                    </button>

                    <button
                      onClick={() => handleSubjectAction(subId, 'publish')}
                      disabled={enteredCount === 0}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-xs transition"
                    >
                      Publish
                    </button>

                    <button
                      onClick={() => handleSubjectAction(subId, 'reject')}
                      disabled={enteredCount === 0}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-semibold rounded-lg border border-slate-200 transition"
                    >
                      Request Revision
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: TABULATION & RANKINGS ===================== */}
      {activeTab === 'tabulation' && (
        <div>
          {/* Top Analytics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <p className="text-[11px] text-slate-500 font-bold uppercase">Evaluated Students</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">
                {classAnalytics.totalStudents}
              </p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <p className="text-[11px] text-slate-500 font-bold uppercase">Passed</p>
              <p className="text-xl font-bold text-emerald-600 mt-0.5">
                {classAnalytics.passedStudents}
              </p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <p className="text-[11px] text-slate-500 font-bold uppercase">Failed / Needs Review</p>
              <p className="text-xl font-bold text-rose-600 mt-0.5">
                {classAnalytics.failedStudents}
              </p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <p className="text-[11px] text-slate-500 font-bold uppercase">Pass Percentage</p>
              <p className="text-xl font-bold text-indigo-600 mt-0.5">
                {classAnalytics.passPercentage}%
              </p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <p className="text-[11px] text-slate-500 font-bold uppercase">Class Average</p>
              <p className="text-xl font-bold text-amber-600 mt-0.5">
                {classAnalytics.classAvgScore}%
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500">
                  Select Exam
                </label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 bg-slate-50"
                >
                  {exams.map((ex) => (
                    <option key={ex._id} value={ex._id}>
                      {ex.name} ({ex.class?.name || 'Class 10'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Class Tabulation Register</span>
            </button>
          </div>

          {/* Tabulation Register Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 text-center">Rank</th>
                    <th className="py-3 px-4">Roll #</th>
                    <th className="py-3 px-4">Student Name</th>
                    {selectedExam?.schedule?.map((item: any) => (
                      <th key={item.subject?._id || item.subject} className="py-3 px-3 text-center">
                        {item.subject?.name || 'Subject'}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Max: {item.maxMarks}
                        </span>
                      </th>
                    ))}
                    <th className="py-3 px-3 text-center">Grand Total</th>
                    <th className="py-3 px-3 text-center">% Score</th>
                    <th className="py-3 px-3 text-center">Grade</th>
                    <th className="py-3 px-3 text-center">Result</th>
                    <th className="py-3 px-4 text-center">Report Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentTabulation.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8 + (selectedExam?.schedule?.length || 0)}
                        className="py-8 text-center text-slate-400"
                      >
                        No student marks recorded for this examination yet.
                      </td>
                    </tr>
                  ) : (
                    studentTabulation.map((row) => (
                      <tr key={row.student?._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 text-center font-black text-emerald-800">
                          {row.rank === 1 ? '🥇 1st' : row.rank === 2 ? '🥈 2nd' : row.rank === 3 ? '🥉 3rd' : row.rank}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap">
                          #{row.rollNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                          {row.student?.name}
                          <span className="block text-[10px] font-mono text-slate-400 font-normal">
                            {row.student?.userId}
                          </span>
                        </td>

                        {/* Subject Marks */}
                        {selectedExam?.schedule?.map((item: any) => {
                          const subId = item.subject?._id || item.subject;
                          const m = row.marks[subId];
                          return (
                            <td key={subId} className="py-3 px-3 text-center whitespace-nowrap">
                              {!m ? (
                                <span className="text-slate-300 font-medium">—</span>
                              ) : m.isAbsent ? (
                                <span className="text-rose-600 font-bold">AB</span>
                              ) : (
                                <span className="font-semibold text-slate-800">
                                  {m.marksObtained}
                                </span>
                              )}
                            </td>
                          );
                        })}

                        <td className="py-3 px-3 text-center font-bold text-slate-900 whitespace-nowrap">
                          {row.totalObtained} / {row.totalMax}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-700 whitespace-nowrap">
                          {row.percentage}%
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-800 whitespace-nowrap">
                          {row.overallGrade}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={`font-bold text-[11px] px-2 py-0.5 rounded ${
                              row.isPassed
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {row.isPassed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => openSingleReportCard(row)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-lg text-[11px] font-semibold transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">Schedule New Examination</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
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
                  placeholder="e.g. Annual Assessment 2027"
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Academic Session *</label>
                  <input
                    type="text"
                    required
                    value={examForm.session}
                    onChange={(e) => setExamForm({ ...examForm, session: e.target.value })}
                    placeholder="2026-2027"
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Target Class *</label>
                  <select
                    required
                    value={examForm.classId}
                    onChange={(e) => setExamForm({ ...examForm, classId: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {classes.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={examForm.startDate}
                    onChange={(e) => setExamForm({ ...examForm, startDate: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">End Date *</label>
                  <input
                    type="date"
                    required
                    value={examForm.endDate}
                    onChange={(e) => setExamForm({ ...examForm, endDate: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Scheduled Papers */}
              <div className="pt-3 border-t border-slate-100">
                <label className="font-bold text-slate-700 block mb-2">
                  Configure Exam Papers & Subjects
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {scheduleItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-3 gap-2"
                    >
                      <div className="col-span-3 flex justify-between items-center">
                        <select
                          value={item.subjectId}
                          onChange={(e) => {
                            const updated = [...scheduleItems];
                            updated[idx].subjectId = e.target.value;
                            setScheduleItems(updated);
                          }}
                          className="p-1 border border-slate-300 rounded text-xs font-semibold w-full mr-2"
                        >
                          {subjects.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.name} ({s.code})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            setScheduleItems(scheduleItems.filter((_, i) => i !== idx));
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block">Date</label>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => {
                            const updated = [...scheduleItems];
                            updated[idx].date = e.target.value;
                            setScheduleItems(updated);
                          }}
                          className="w-full p-1 border border-slate-200 rounded text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block">Max Marks</label>
                        <input
                          type="number"
                          value={item.maxMarks}
                          onChange={(e) => {
                            const updated = [...scheduleItems];
                            updated[idx].maxMarks = Number(e.target.value);
                            setScheduleItems(updated);
                          }}
                          className="w-full p-1 border border-slate-200 rounded text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block">Pass Marks</label>
                        <input
                          type="number"
                          value={item.passMarks}
                          onChange={(e) => {
                            const updated = [...scheduleItems];
                            updated[idx].passMarks = Number(e.target.value);
                            setScheduleItems(updated);
                          }}
                          className="w-full p-1 border border-slate-200 rounded text-[11px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (subjects.length > 0) {
                      setScheduleItems([
                        ...scheduleItems,
                        {
                          subjectId: subjects[0]._id,
                          date: new Date().toISOString().split('T')[0],
                          time: '09:00 AM - 12:00 PM',
                          maxMarks: 100,
                          passMarks: 35,
                          teacherId: '',
                        },
                      ]);
                    }
                  }}
                  className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Subject Paper
                </button>
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Save Exam Schedule
                </button>
              </div>
            </form>
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
