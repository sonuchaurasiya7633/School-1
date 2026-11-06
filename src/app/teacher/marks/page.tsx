'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Award,
  Save,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  UserX,
  FileCheck2,
} from 'lucide-react';
import { calculateGrade } from '@/lib/utils';
import { authFetch } from '@/lib/api';

interface StudentMarkState {
  score: string;
  isAbsent: boolean;
  remarks: string;
  status?: string;
  isExisting?: boolean;
}

export default function TeacherMarksPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // Assigned filter
  const [assignedClasses, setAssignedClasses] = useState<any[]>([]);

  // Selection states
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  // Marks state: studentId -> { score, isAbsent, remarks, status }
  const [marksState, setMarksState] = useState<{ [studentId: string]: StudentMarkState }>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. Initial Load: Fetch Profile, Exams, Classes, Subjects
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [resProfile, resExams, resClasses, resSubjects] = await Promise.all([
        authFetch('/api/user/profile'),
        authFetch('/api/exams'),
        authFetch('/api/admin/classes'),
        authFetch('/api/admin/subjects'),
      ]);

      const dataProfile = await resProfile.json();
      const dataExams = await resExams.json();
      const dataClasses = await resClasses.json();
      const dataSubjects = await resSubjects.json();

      const profileAssigned = dataProfile.profile?.assignedClasses || [];
      setAssignedClasses(profileAssigned);

      const examList = dataExams.exams || [];
      setExams(examList);
      if (examList.length > 0) {
        setSelectedExamId(examList[0]._id);
      }

      // Filter classes: if teacher has assignedClasses, prioritize them
      let availableClasses = dataClasses.classes || [];
      if (profileAssigned.length > 0) {
        const assignedClassIds = new Set(
          profileAssigned.map((ac: any) => ac.class?._id || ac.class)
        );
        const filtered = availableClasses.filter((c: any) => assignedClassIds.has(c._id));
        if (filtered.length > 0) availableClasses = filtered;
      }
      setClasses(availableClasses);
      if (availableClasses.length > 0) {
        setSelectedClassId(availableClasses[0]._id);
      }

      // Filter subjects: if teacher has assignedClasses, filter by selected class
      const allSubjects = dataSubjects.subjects || [];
      setSubjects(allSubjects);
      if (allSubjects.length > 0) {
        setSelectedSubjectId(allSubjects[0]._id);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Compute selected exam details
  const currentExam = useMemo(() => {
    return exams.find((e) => e._id === selectedExamId);
  }, [exams, selectedExamId]);

  // Compute schedule item for the selected subject
  const currentSubjectSchedule = useMemo(() => {
    if (!currentExam || !currentExam.schedule) return null;
    return currentExam.schedule.find(
      (s: any) => (s.subject?._id || s.subject) === selectedSubjectId
    );
  }, [currentExam, selectedSubjectId]);

  const maxMarks = currentSubjectSchedule?.maxMarks || 100;
  const passMarks = currentSubjectSchedule?.passMarks || 35;

  // 2. Fetch Students & Existing Marks
  const fetchMarksAndStudents = async () => {
    if (!selectedClassId || !selectedExamId || !selectedSubjectId) return;
    try {
      setLoading(true);
      setFeedbackMsg(null);

      const [resSt, resMarks] = await Promise.all([
        authFetch(`/api/admin/students?classId=${selectedClassId}&section=${selectedSection}`),
        authFetch(
          `/api/marks?examId=${selectedExamId}&classId=${selectedClassId}&section=${selectedSection}&subjectId=${selectedSubjectId}`
        ),
      ]);

      const dataSt = await resSt.json();
      const dataMarks = await resMarks.json();

      const stList = dataSt.students || [];
      const mList = dataMarks.marks || [];
      setStudents(stList);

      const stateMap: { [key: string]: StudentMarkState } = {};
      stList.forEach((st: any) => {
        const sId = st.user?._id;
        if (!sId) return;
        const found = mList.find(
          (m: any) => (m.student?._id || m.student) === sId
        );

        if (found) {
          stateMap[sId] = {
            score: found.isAbsent ? '0' : String(found.marksObtained ?? ''),
            isAbsent: Boolean(found.isAbsent),
            remarks: found.remarks || '',
            status: found.status || 'Draft',
            isExisting: true,
          };
        } else {
          // Clean unentered state (NO dummy 85)
          stateMap[sId] = {
            score: '',
            isAbsent: false,
            remarks: '',
            status: 'Draft',
            isExisting: false,
          };
        }
      });

      setMarksState(stateMap);
    } catch (err) {
      console.error('Error fetching marks & students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedExamId && selectedClassId && selectedSubjectId) {
      fetchMarksAndStudents();
    }
  }, [selectedExamId, selectedClassId, selectedSection, selectedSubjectId]);

  // Overall status of the current subject marksheet
  const overallStatus = useMemo(() => {
    const entries = Object.values(marksState);
    if (entries.length === 0 || !entries.some((e) => e.isExisting)) return 'Unsaved';
    if (entries.some((e) => e.status === 'Published')) return 'Published';
    if (entries.some((e) => e.status === 'Approved')) return 'Approved';
    if (entries.some((e) => e.status === 'Submitted')) return 'Submitted';
    return 'Draft';
  }, [marksState]);

  // Update handlers
  const handleScoreChange = (studentId: string, val: string) => {
    const num = Number(val);
    if (val !== '' && (num < 0 || num > maxMarks)) {
      // Prevent exceeding maxMarks
      return;
    }
    setMarksState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: val,
        isAbsent: false,
      },
    }));
  };

  const handleAbsentToggle = (studentId: string) => {
    setMarksState((prev) => {
      const current = prev[studentId] || { score: '', isAbsent: false, remarks: '' };
      const nextAbsent = !current.isAbsent;
      return {
        ...prev,
        [studentId]: {
          ...current,
          isAbsent: nextAbsent,
          score: nextAbsent ? '0' : '',
        },
      };
    });
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setMarksState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  // Submit action: 'save_draft' | 'submit_approval'
  const handleSaveOrSubmit = async (action: 'save_draft' | 'submit_approval') => {
    if (students.length === 0) return;

    // Check if any active (non-absent) student has missing score when submitting for approval
    if (action === 'submit_approval') {
      const missingScores = students.filter((st) => {
        const item = marksState[st.user?._id];
        return !item || (!item.isAbsent && item.score === '');
      });

      if (missingScores.length > 0) {
        if (
          !confirm(
            `${missingScores.length} student(s) have not been entered or marked Absent. Do you want to submit anyway? Unentered marks will default to 0.`
          )
        ) {
          return;
        }
      }
    }

    try {
      if (action === 'submit_approval') setSubmitting(true);
      else setSaving(true);
      setFeedbackMsg(null);

      const marksData = students.map((st) => {
        const item = marksState[st.user?._id] || { score: '0', isAbsent: false, remarks: '' };
        return {
          studentId: st.user?._id,
          marksObtained: item.isAbsent ? 0 : Number(item.score || 0),
          maxMarks,
          passMarks,
          isAbsent: item.isAbsent,
          remarks: item.remarks,
        };
      });

      const res = await authFetch('/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          examId: selectedExamId,
          classId: selectedClassId,
          section: selectedSection,
          subjectId: selectedSubjectId,
          marksData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackMsg({
          type: 'success',
          text:
            action === 'submit_approval'
              ? 'Marks submitted successfully for Admin approval!'
              : 'Draft marks saved successfully!',
        });
        await fetchMarksAndStudents();
      } else {
        setFeedbackMsg({
          type: 'error',
          text: data.message || 'Failed to record marks.',
        });
      }
    } catch (err: any) {
      console.error(err);
      setFeedbackMsg({ type: 'error', text: err.message || 'Network error occurred.' });
    } finally {
      setSaving(false);
      setSubmitting(false);
    }
  };

  // Quick statistics
  const stats = useMemo(() => {
    let entered = 0;
    let absent = 0;
    let totalScore = 0;

    Object.values(marksState).forEach((item) => {
      if (item.isAbsent) {
        absent++;
        entered++;
      } else if (item.score !== '') {
        entered++;
        totalScore += Number(item.score);
      }
    });

    const average = entered - absent > 0 ? (totalScore / (entered - absent)).toFixed(1) : '0';
    return { entered, absent, total: students.length, average };
  }, [marksState, students]);

  return (
    <DashboardShell
      title="Examination Marks Entry"
      subtitle="Input, validate, and submit student marks exam-wise for Admin verification"
      allowedRoles={['teacher']}
      onRefresh={fetchMarksAndStudents}
    >
      {/* Notifications */}
      {feedbackMsg && (
        <div
          className={`p-3.5 mb-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600">
            &times;
          </button>
        </div>
      )}

      {/* Filter and Configuration Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Exam Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Select Examination *
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold bg-slate-50"
              >
                {exams.map((ex) => (
                  <option key={ex._id} value={ex._id}>
                    {ex.name} ({ex.session || '2026-27'})
                  </option>
                ))}
              </select>
            </div>

            {/* Class Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Class *</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold bg-slate-50"
              >
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold bg-slate-50"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Subject *</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold bg-slate-50"
              >
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveOrSubmit('save_draft')}
              disabled={saving || submitting || students.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving Draft...' : 'Save as Draft'}</span>
            </button>

            <button
              onClick={() => handleSaveOrSubmit('submit_approval')}
              disabled={saving || submitting || students.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit for Admin Approval'}</span>
            </button>
          </div>
        </div>

        {/* Status Badge & Exam Rules Strip */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">
              Grading Baseline: <strong>Max Marks: {maxMarks}</strong> • <strong>Passing Marks: {passMarks}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Current Sheet Status:</span>
            {overallStatus === 'Published' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Published to Students
              </span>
            )}
            {overallStatus === 'Approved' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved by Admin
              </span>
            )}
            {overallStatus === 'Submitted' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Awaiting Admin Approval
              </span>
            )}
            {overallStatus === 'Draft' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                <Save className="w-3.5 h-3.5 text-slate-500" /> Saved as Draft
              </span>
            )}
            {overallStatus === 'Unsaved' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                Not Yet Entered
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] text-slate-500 font-bold uppercase">Total Students</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">{stats.total}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] text-slate-500 font-bold uppercase">Marks Recorded</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">
            {stats.entered} / {stats.total}
          </p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] text-slate-500 font-bold uppercase">Absent Count</p>
          <p className="text-xl font-bold text-rose-600 mt-0.5">{stats.absent}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-[11px] text-slate-500 font-bold uppercase">Avg Obtained Score</p>
          <p className="text-xl font-bold text-indigo-600 mt-0.5">{stats.average}</p>
        </div>
      </div>

      {/* Marks Entry Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Roll #</th>
                <th className="py-3 px-4 whitespace-nowrap">Student Name</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Attendance</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Marks Obtained (Max: {maxMarks})</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Calculated Grade</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Result Status</th>
                <th className="py-3 px-4 whitespace-nowrap">Remarks / Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No students found enrolled in this class & section.
                  </td>
                </tr>
              ) : (
                students.map((st) => {
                  const sId = st.user?._id;
                  const item = marksState[sId] || { score: '', isAbsent: false, remarks: '' };
                  const numScore = item.isAbsent ? 0 : Number(item.score);
                  const isEntered = item.isAbsent || item.score !== '';
                  const grade = isEntered
                    ? calculateGrade(numScore, maxMarks, item.isAbsent, passMarks)
                    : '-';
                  const isPassed = !item.isAbsent && isEntered && numScore >= passMarks;

                  return (
                    <tr
                      key={sId}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        item.isAbsent ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap">
                        #{st.rollNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800 text-sm whitespace-nowrap">
                        {st.user?.name}
                        <span className="block text-[11px] font-mono text-slate-400 font-normal">
                          {st.user?.userId}
                        </span>
                      </td>

                      {/* Attendance Toggle */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleAbsentToggle(sId)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition border ${
                            item.isAbsent
                              ? 'bg-rose-100 text-rose-700 border-rose-300'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {item.isAbsent ? (
                            <>
                              <UserX className="w-3.5 h-3.5" /> Absent (AB)
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" /> Present
                            </>
                          )}
                        </button>
                      </td>

                      {/* Score Input */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {item.isAbsent ? (
                          <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 font-bold rounded-lg text-xs">
                            ABSENT
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              max={maxMarks}
                              value={item.score}
                              placeholder="0"
                              onChange={(e) => handleScoreChange(sId, e.target.value)}
                              className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-center font-bold text-sm text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                            />
                            <span className="text-[11px] text-slate-400">/ {maxMarks}</span>
                          </div>
                        )}
                      </td>

                      {/* Grade */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`font-bold text-sm px-2 py-0.5 rounded ${
                            grade === 'AB'
                              ? 'bg-rose-100 text-rose-700'
                              : grade.includes('F')
                              ? 'bg-rose-50 text-rose-600'
                              : 'text-emerald-700 bg-emerald-50'
                          }`}
                        >
                          {grade}
                        </span>
                      </td>

                      {/* Pass / Fail Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {!isEntered ? (
                          <span className="text-slate-400 font-medium">Pending</span>
                        ) : item.isAbsent ? (
                          <span className="text-rose-600 font-bold">Absent</span>
                        ) : isPassed ? (
                          <span className="text-emerald-700 font-bold">Passed</span>
                        ) : (
                          <span className="text-rose-600 font-bold">Failed</span>
                        )}
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => handleRemarksChange(sId, e.target.value)}
                          placeholder="e.g. Good grasp of concepts"
                          className="w-full max-w-xs px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
