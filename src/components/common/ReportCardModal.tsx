'use client';

import React from 'react';
import Image from 'next/image';
import { Printer, X, Award, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface MarkItem {
  subjectName: string;
  subjectCode: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks?: string;
}

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: {
    studentName: string;
    rollNumber: string;
    studentUserId: string;
    className: string;
    examName: string;
    date: string;
    marks: MarkItem[];
  } | null;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  isOpen,
  onClose,
  reportData,
}) => {
  if (!isOpen || !reportData) return null;

  const totalMax = reportData.marks.reduce((acc, m) => acc + (m.maxMarks || 100), 0);
  const totalObtained = reportData.marks.reduce((acc, m) => acc + (m.marksObtained || 0), 0);
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : '0';
  const isPassed = Number(percentage) >= 35;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 print:hidden sticky top-0 z-10">
          <span className="text-xs sm:text-sm font-semibold text-slate-700">Official Academic Mark Sheet</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Report Card</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div id="printable-report" className="p-4 sm:p-8 print:p-0">
          <div className="text-center pb-6 border-b-2 border-emerald-700">
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
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">
              Best Education, Good Results.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Affiliated & Recognized Examination Board • Session 2026-2027
            </p>
            <div className="inline-block mt-3 px-4 py-1 bg-emerald-100 text-emerald-900 rounded-full font-bold text-xs uppercase tracking-wider">
              {reportData.examName} — Statement of Marks
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-5 text-sm border-b border-slate-200 bg-slate-50/50 px-4 rounded-lg my-4">
            <div>
              <p className="text-xs text-slate-500">Student Name</p>
              <p className="font-bold text-slate-800 text-base">{reportData.studentName}</p>
              <p className="text-xs text-slate-500 mt-2">Class & Section</p>
              <p className="font-medium text-slate-700">{reportData.className}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Roll Number</p>
              <p className="font-bold text-emerald-700 text-base">{reportData.rollNumber}</p>
              <p className="text-xs text-slate-500 mt-2">Registration ID</p>
              <p className="font-medium text-slate-700">{reportData.studentUserId}</p>
            </div>
          </div>

          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm border border-slate-200">
              <thead className="bg-slate-100 text-xs font-semibold text-slate-700">
                <tr>
                  <th className="py-2.5 px-3 text-left border-b whitespace-nowrap">Subject</th>
                  <th className="py-2.5 px-3 text-center border-b whitespace-nowrap">Max Marks</th>
                  <th className="py-2.5 px-3 text-center border-b whitespace-nowrap">Obtained</th>
                  <th className="py-2.5 px-3 text-center border-b whitespace-nowrap">Grade</th>
                  <th className="py-2.5 px-3 text-left border-b whitespace-nowrap">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.marks.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">
                      {m.subjectName} <span className="text-xs text-slate-400">({m.subjectCode})</span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{m.maxMarks}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{m.marksObtained}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-600">{m.grade}</td>
                    <td className="py-2.5 px-3 text-xs text-slate-500 whitespace-nowrap">{m.remarks || 'Good'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
                <tr>
                  <td className="py-3 px-3 text-slate-800">Grand Total</td>
                  <td className="py-3 px-3 text-center text-slate-600">{totalMax}</td>
                  <td className="py-3 px-3 text-center text-emerald-700 text-base">{totalObtained}</td>
                  <td colSpan={2} className="py-3 px-3 text-right">
                    <span className="text-xs text-slate-500 mr-2">Percentage:</span>
                    <span className="text-emerald-700 text-base">{percentage}%</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 my-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <div>
                <span className="text-xs text-slate-500">Overall Result Status</span>
                <p className={`font-bold text-sm ${isPassed ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {isPassed ? 'PASSED & PROMOTED WITH DISTINCTION' : 'NEEDS IMPROVEMENT'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Date of Declaration</span>
              <p className="font-semibold text-xs text-slate-700">{formatDate(reportData.date)}</p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-2 text-xs text-slate-500">
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
