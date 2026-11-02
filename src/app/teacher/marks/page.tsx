'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Award, Save, CheckCircle2 } from 'lucide-react';
import { calculateGrade } from '@/lib/utils';

export default function TeacherMarksPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marksState, setMarksState] = useState<{ [key: string]: { score: string; remarks: string } }>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      if (dataE.success && dataE.exams?.length > 0) {
        setExams(dataE.exams);
        setSelectedExam(dataE.exams[0]._id);
      }
      if (dataC.success && dataC.classes?.length > 0) {
        setClasses(dataC.classes);
        setSelectedClass(dataC.classes[0]._id);
      }
      if (dataS.success && dataS.subjects?.length > 0) {
        setSubjects(dataS.subjects);
        setSelectedSubject(dataS.subjects[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchMarksAndStudents = async () => {
    if (!selectedClass || !selectedExam || !selectedSubject) return;
    try {
      setLoading(true);
      const [resSt, resMarks] = await Promise.all([
        fetch(`/api/admin/students?classId=${selectedClass}&section=A`),
        fetch(`/api/marks?examId=${selectedExam}&classId=${selectedClass}&subjectId=${selectedSubject}`),
      ]);

      const dataSt = await resSt.json();
      const dataMarks = await resMarks.json();

      const stList = dataSt.students || [];
      const mList = dataMarks.marks || [];
      setStudents(stList);

      const stateMap: any = {};
      stList.forEach((st: any) => {
        const found = mList.find((m: any) => m.student?._id === st.user?._id || m.student === st.user?._id);
        stateMap[st.user?._id] = {
          score: found ? String(found.marksObtained) : '85',
          remarks: found ? found.remarks : 'Good performance',
        };
      });
      setMarksState(stateMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass && selectedExam && selectedSubject) {
      fetchMarksAndStudents();
    }
  }, [selectedExam, selectedClass, selectedSubject]);

  const handleScoreChange = (studentId: string, score: string) => {
    setMarksState({
      ...marksState,
      [studentId]: {
        ...marksState[studentId],
        score,
      },
    });
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setMarksState({
      ...marksState,
      [studentId]: {
        ...marksState[studentId],
        remarks,
      },
    });
  };

  const handleSaveMarks = async () => {
    try {
      setSaving(true);
      const marksData = students.map((st) => {
        const item = marksState[st.user?._id] || { score: '0', remarks: '' };
        return {
          studentId: st.user?._id,
          marksObtained: Number(item.score),
          maxMarks: 100,
          remarks: item.remarks,
        };
      });

      const res = await fetch('/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: selectedExam,
          classId: selectedClass,
          section: 'A',
          subjectId: selectedSubject,
          marksData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Student marks saved successfully!');
        fetchMarksAndStudents();
      } else {
        alert(data.message || 'Error saving marks.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell
      title="Examination Marks Entry"
      subtitle="Input and submit student marks for assigned exam schedules"
      allowedRoles={['teacher']}
      onRefresh={fetchMarksAndStudents}
    >
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Select Exam</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold"
            >
              {exams.map((ex) => (
                <option key={ex._id} value={ex._id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold"
            >
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold"
            >
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSaveMarks}
          disabled={saving || students.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save & Record Marks'}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Roll</th>
                <th className="py-3 px-4 whitespace-nowrap">Student Name</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Marks Obtained (Max: 100)</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Grade</th>
                <th className="py-3 px-4 whitespace-nowrap">Evaluator Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => {
                const val = marksState[st.user?._id] || { score: '0', remarks: '' };
                const grade = calculateGrade(Number(val.score), 100);
                return (
                  <tr key={st.user?._id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap">#{st.rollNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-800 text-sm whitespace-nowrap">
                      {st.user?.name}
                      <span className="block text-[11px] font-mono text-slate-400 font-normal">{st.user?.userId}</span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <input
                        type="number"
                        max={100}
                        min={0}
                        value={val.score}
                        onChange={(e) => handleScoreChange(st.user?._id, e.target.value)}
                        className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-center font-bold text-sm text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="font-bold text-emerald-600 text-sm">{grade}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={val.remarks}
                        onChange={(e) => handleRemarksChange(st.user?._id, e.target.value)}
                        placeholder="e.g. Excellent math skills"
                        className="w-full max-w-sm px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
