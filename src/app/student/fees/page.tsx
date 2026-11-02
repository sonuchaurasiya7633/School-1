'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatCard } from '@/components/common/StatCard';
import { ReceiptModal } from '@/components/common/ReceiptModal';
import { useAuth } from '@/context/AuthContext';
import { CreditCard, CheckCircle2, Clock, Printer } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function StudentFeesPage() {
  const { user } = useAuth();
  const [feeRecord, setFeeRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Receipt Modal
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fees');
      const data = await res.json();
      if (data.success && data.fees?.length > 0) {
        setFeeRecord(data.fees[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const openReceipt = (payment: any) => {
    if (!feeRecord) return;
    setReceiptData({
      studentName: user?.name || feeRecord.student?.name,
      studentUserId: user?.userId || feeRecord.student?.userId,
      className: feeRecord.class?.name || 'Class 10',
      receiptNumber: payment.receiptNumber,
      date: payment.date,
      paymentMethod: payment.paymentMethod,
      amount: payment.amount,
      remarks: payment.remarks,
      totalFee: feeRecord.totalAmount,
      paidAmount: feeRecord.paidAmount,
      dueAmount: feeRecord.dueAmount,
    });
    setShowReceipt(true);
  };

  return (
    <DashboardShell
      title="Fees & Payment History"
      subtitle="View your tuition breakdown, settled amounts, remaining dues, and download official vouchers"
      allowedRoles={['student']}
      onRefresh={fetchFees}
    >
      {/* 3 Fee Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Term Fee"
          value={formatCurrency(feeRecord?.totalAmount || 16000)}
          subtitle={feeRecord?.monthOrTerm || 'Term 1'}
          icon={CreditCard}
          color="blue"
        />
        <StatCard
          title="Total Amount Paid"
          value={formatCurrency(feeRecord?.paidAmount || 11000)}
          subtitle="Settled to school accounts"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(feeRecord?.dueAmount || 5000)}
          subtitle={feeRecord?.dueAmount > 0 ? 'Pending payment' : 'No balance due'}
          icon={Clock}
          color={feeRecord?.dueAmount > 0 ? 'rose' : 'emerald'}
        />
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Recorded Payment Transactions & Receipts
            </h3>
            <p className="text-[11px] text-slate-500">Official verified payments recorded by accounts office</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
            Status: {feeRecord?.status || 'Partial'}
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">Receipt Number</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4 text-right">Amount Paid</th>
              <th className="py-3 px-4 text-right">Receipt Voucher</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {feeRecord?.payments?.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  No fee payment transactions recorded yet.
                </td>
              </tr>
            ) : (
              feeRecord?.payments?.map((p: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-bold text-slate-800 font-mono">
                    {p.receiptNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{formatDate(p.date)}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{p.paymentMethod}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-700 text-sm">
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openReceipt(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Voucher</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Official Printable Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        feeData={receiptData}
      />
    </DashboardShell>
  );
}
