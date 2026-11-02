'use client';

import React from 'react';
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Printer, X, CheckCircle } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeData: {
    studentName: string;
    studentUserId: string;
    className: string;
    receiptNumber: string;
    date: string;
    paymentMethod: string;
    amount: number;
    remarks?: string;
    totalFee: number;
    paidAmount: number;
    dueAmount: number;
  } | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, feeData }) => {
  if (!isOpen || !feeData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Actions */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 print:hidden sticky top-0 z-10">
          <span className="text-xs sm:text-sm font-semibold text-slate-700">Official Fee Receipt</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Receipt</span>
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

        {/* Receipt Printable Content */}
        <div id="printable-receipt" className="p-4 sm:p-8 print:p-0">
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
              Sector 14, Education Zone, SPS Campus • contact@successpointschool.edu • +91 98765 43210
            </p>
            <div className="inline-block mt-3 px-4 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs uppercase tracking-wider">
              Fee Payment Voucher & Receipt
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-6 text-sm border-b border-slate-200">
            <div>
              <p className="text-xs text-slate-500">Student Name</p>
              <p className="font-bold text-slate-800">{feeData.studentName}</p>
              <p className="text-xs text-slate-500 mt-2">Student ID / Roll</p>
              <p className="font-medium text-slate-700">{feeData.studentUserId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Receipt No.</p>
              <p className="font-bold text-emerald-700">{feeData.receiptNumber}</p>
              <p className="text-xs text-slate-500 mt-2">Payment Date</p>
              <p className="font-medium text-slate-700">{formatDate(feeData.date)}</p>
            </div>
          </div>

          <div className="my-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs text-left">
                  <th className="py-2 whitespace-nowrap">Description</th>
                  <th className="py-2 whitespace-nowrap">Mode</th>
                  <th className="py-2 text-right whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 font-medium text-slate-800 whitespace-nowrap">
                    Tuition Fee ({feeData.className})
                    {feeData.remarks && <span className="block text-xs text-slate-400">{feeData.remarks}</span>}
                  </td>
                  <td className="py-3 text-slate-600 whitespace-nowrap">{feeData.paymentMethod}</td>
                  <td className="py-3 text-right font-bold text-slate-800 whitespace-nowrap">
                    {formatCurrency(feeData.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Total Class Fee:</span>
              <span className="font-semibold">{formatCurrency(feeData.totalFee)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Total Amount Paid To Date:</span>
              <span>{formatCurrency(feeData.paidAmount)}</span>
            </div>
            <div className="flex justify-between text-rose-600 font-bold border-t border-slate-200 pt-1.5 text-sm">
              <span>Remaining Balance / Due:</span>
              <span>{formatCurrency(feeData.dueAmount)}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold">Officially Verified & Recorded</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <span>Authorized Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
