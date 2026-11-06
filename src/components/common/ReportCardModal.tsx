'use client';

import React from 'react';
import Image from 'next/image';
import { Printer, X, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface MarkItem {
  subjectName: string;
  subjectCode: string;
  marksObtained: number;
  maxMarks: number;
  passMarks?: number;
  isAbsent?: boolean;
  grade: string;
  remarks?: string;
}

export interface ReportCardData {
  studentName: string;
  rollNumber: string;
  studentUserId: string;
  className: string;
  parentName?: string;
  examName: string;
  session?: string;
  date: string;
  marks: MarkItem[];
  isPassed?: boolean;
  percentage?: number | string;
  totalMaxMarks?: number;
  totalMarksObtained?: number;
  overallGrade?: string;
}

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportCardData | null;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  isOpen,
  onClose,
  reportData,
}) => {
  if (!isOpen || !reportData) return null;

  const totalMax =
    reportData.totalMaxMarks ??
    reportData.marks.reduce((acc, m) => acc + (m.maxMarks || 100), 0);

  const totalObtained =
    reportData.totalMarksObtained ??
    reportData.marks.reduce((acc, m) => acc + (m.isAbsent ? 0 : m.marksObtained || 0), 0);

  const percentage =
    reportData.percentage !== undefined
      ? String(reportData.percentage)
      : totalMax > 0
      ? ((totalObtained / totalMax) * 100).toFixed(1)
      : '0';

  const hasFailedSubject = reportData.marks.some(
    (m) => m.isAbsent || (m.marksObtained < (m.passMarks || 35))
  );

  const isPassed =
    reportData.isPassed !== undefined
      ? reportData.isPassed
      : !hasFailedSubject && Number(percentage) >= 35;

  const overallGrade =
    reportData.overallGrade ||
    (!isPassed
      ? 'F'
      : Number(percentage) >= 90
      ? 'A+'
      : Number(percentage) >= 80
      ? 'A'
      : Number(percentage) >= 70
      ? 'B+'
      : Number(percentage) >= 60
      ? 'B'
      : Number(percentage) >= 50
      ? 'C'
      : 'D');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 print:hidden sticky top-0 z-10">
          <span className="text-xs sm:text-sm font-semibold text-slate-700">Official Academic Mark Sheet</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save as PDF</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Marksheet Sheet */}
        <div id="printable-report" className="p-6 sm:p-8 print:p-0">
          {/* School Header */}
          <div className="text-center pb-5 border-b-2 border-emerald-800">
            <div className="flex justify-center mb-2">
              <div className="relative w-16 h-16">
                <Image
                  src="/images/logo.jpeg"
                  alt="Success Point School"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">SUCCESS POINT SCHOOL</h2>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mt-0.5">
              Best Education, Good Results.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Affiliated & Recognized Examination Board • Academic Session {reportData.session || '2026-2027'}
            </p>
            <div className="inline-block mt-3 px-4 py-1 bg-emerald-100 text-emerald-900 rounded-full font-bold text-xs uppercase tracking-wider">
              {reportData.examName} — Statement of Marks
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200 bg-slate-50/70 px-4 rounded-xl my-4">
            <div>
              <p className="text-[11px] text-slate-500 uppercase font-semibold">Student Name</p>
              <p className="font-bold text-slate-900 text-sm">{reportData.studentName}</p>
              {reportData.parentName && (
                <>
                  <p className="text-[11px] text-slate-500 uppercase font-semibold mt-2">Parent / Guardian</p>
                  <p className="font-medium text-slate-700">{reportData.parentName}</p>
                </>
              )}
              <p className="text-[11px] text-slate-500 uppercase font-semibold mt-2">Class & Section</p>
              <p className="font-semibold text-slate-800">{reportData.className}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500 uppercase font-semibold">Roll Number</p>
              <p className="font-black text-emerald-700 text-base">#{reportData.rollNumber}</p>
              <p className="text-[11px] text-slate-500 uppercase font-semibold mt-2">Student ID</p>
              <p className="font-mono font-medium text-slate-700">{reportData.studentUserId}</p>
              <p className="text-[11px] text-slate-500 uppercase font-semibold mt-2">Issue Date</p>
              <p className="font-medium text-slate-600">{formatDate(reportData.date)}</p>
            </div>
          </div>

          {/* Subject-Wise Marks Table */}
          <div className="overflow-x-auto my-4">
            <table className="w-full text-xs border border-slate-200">
              <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 text-left border-b">Subject</th>
                  <th className="py-2.5 px-3 text-center border-b">Max Marks</th>
                  <th className="py-2.5 px-3 text-center border-b">Pass Marks</th>
                  <th className="py-2.5 px-3 text-center border-b">Obtained</th>
                  <th className="py-2.5 px-3 text-center border-b">Grade</th>
                  <th className="py-2.5 px-3 text-left border-b">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.marks.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {m.subjectName}{' '}
                      <span className="text-[11px] text-slate-400 font-normal">({m.subjectCode})</span>
                    </td>
                    <td className="py-2 px-3 text-center text-slate-600">{m.maxMarks}</td>
                    <td className="py-2 px-3 text-center text-slate-500">{m.passMarks || 35}</td>
                    <td className="py-2 px-3 text-center font-bold">
                      {m.isAbsent ? (
                        <span className="text-rose-600 font-bold">ABSENT</span>
                      ) : (
                        <span className="text-slate-900">{m.marksObtained}</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center font-bold">
                      <span
                        className={
                          m.isAbsent || m.grade === 'AB'
                            ? 'text-rose-600'
                            : m.grade.includes('F')
                            ? 'text-rose-600'
                            : 'text-emerald-700'
                        }
                      >
                        {m.isAbsent ? 'AB' : m.grade}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-500">{m.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300 text-xs">
                <tr>
                  <td className="py-3 px-3 text-slate-900">Grand Total</td>
                  <td className="py-3 px-3 text-center text-slate-700">{totalMax}</td>
                  <td className="py-3 px-3 text-center text-slate-400">—</td>
                  <td className="py-3 px-3 text-center text-emerald-800 text-sm font-black">
                    {totalObtained}
                  </td>
                  <td colSpan={2} className="py-3 px-3 text-right">
                    <span className="text-slate-500 mr-2 font-normal">Percentage:</span>
                    <span className="text-emerald-800 text-sm font-black">{percentage}%</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Result Status Banner */}
          <div
            className={`flex items-center justify-between p-4 rounded-xl border my-4 ${
              isPassed
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {isPassed ? (
                <Award className="w-6 h-6 text-emerald-700" />
              ) : (
                <AlertCircle className="w-6 h-6 text-rose-600" />
              )}
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-500 block">
                  Final Examination Result
                </span>
                <p className="font-black text-sm tracking-wide">
                  {isPassed ? 'PASSED & PROMOTED' : 'NEEDS IMPROVEMENT / FAILED'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase font-bold text-slate-500 block">Overall Grade</span>
              <p className="font-black text-base text-emerald-800">{overallGrade}</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-2 text-[11px] text-slate-500">
            <div>
              <div className="w-36 border-b border-slate-400 mb-1"></div>
              <span>Class Teacher's Signature</span>
            </div>
            <div className="text-right">
              <div className="w-36 border-b border-slate-400 mb-1 ml-auto"></div>
              <span>Principal / Controller of Examinations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
