'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatCard } from '@/components/common/StatCard';
import { ReceiptModal } from '@/components/common/ReceiptModal';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Printer,
  X,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminFeesPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showNewFeeModal, setShowNewFeeModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);

  // Receipt Modal
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Collect Payment Form State
  const [collectForm, setCollectForm] = useState({
    amount: '',
    paymentMethod: 'Cash',
    remarks: 'Term 1 fee installment',
  });

  // Create Fee Form State
  const [createFeeForm, setCreateFeeForm] = useState({
    studentId: '',
    classId: '',
    totalAmount: '16000',
    monthOrTerm: 'Term 1 (2026-2027)',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resF, resS, resC] = await Promise.all([
        fetch('/api/fees'),
        fetch('/api/admin/students'),
        fetch('/api/admin/classes'),
      ]);

      const dataF = await resF.json();
      const dataS = await resS.json();
      const dataC = await resC.json();

      if (dataF.success) setFees(dataF.fees);
      if (dataS.success) setStudents(dataS.students);
      if (dataC.success) setClasses(dataC.classes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCollectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee) return;

    try {
      const res = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeId: selectedFee._id,
          amount: Number(collectForm.amount),
          paymentMethod: collectForm.paymentMethod,
          remarks: collectForm.remarks,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCollectModal(false);
        fetchData();

        // Trigger Receipt Modal Preview
        setReceiptData({
          studentName: selectedFee.student?.name,
          studentUserId: selectedFee.student?.userId,
          className: selectedFee.class?.name,
          receiptNumber: data.receiptNumber,
          date: new Date().toISOString(),
          paymentMethod: collectForm.paymentMethod,
          amount: Number(collectForm.amount),
          remarks: collectForm.remarks,
          totalFee: selectedFee.totalAmount,
          paidAmount: selectedFee.paidAmount + Number(collectForm.amount),
          dueAmount: Math.max(0, selectedFee.dueAmount - Number(collectForm.amount)),
        });
        setShowReceipt(true);
      } else {
        alert(data.message || 'Error recording payment.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_fee',
          ...createFeeForm,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowNewFeeModal(false);
        fetchData();
      } else {
        alert(data.message || 'Error creating fee ledger.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openCollect = (fee: any) => {
    setSelectedFee(fee);
    setCollectForm({
      amount: String(fee.dueAmount),
      paymentMethod: 'Cash',
      remarks: 'Manual Fee Payment',
    });
    setShowCollectModal(true);
  };

  const openPastReceipt = (fee: any, payment: any) => {
    setReceiptData({
      studentName: fee.student?.name,
      studentUserId: fee.student?.userId,
      className: fee.class?.name,
      receiptNumber: payment.receiptNumber,
      date: payment.date,
      paymentMethod: payment.paymentMethod,
      amount: payment.amount,
      remarks: payment.remarks,
      totalFee: fee.totalAmount,
      paidAmount: fee.paidAmount,
      dueAmount: fee.dueAmount,
    });
    setShowReceipt(true);
  };

  // Filtered
  const filteredFees = fees.filter((f) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      f.student?.name?.toLowerCase().includes(q) ||
      f.student?.userId?.toLowerCase().includes(q) ||
      f.class?.name?.toLowerCase().includes(q)
    );
  });

  const totalCollected = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
  const totalPending = fees.reduce((acc, f) => acc + (f.dueAmount || 0), 0);
  const totalInvoiced = fees.reduce((acc, f) => acc + (f.totalAmount || 0), 0);

  return (
    <DashboardShell
      title="Fees & Revenue Management"
      subtitle="Define class-wise fees, record offline/manual collections, and issue payment vouchers"
      allowedRoles={['admin']}
      onRefresh={fetchData}
    >
      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Invoiced"
          value={formatCurrency(totalInvoiced)}
          subtitle="Annual term fees"
          icon={CreditCard}
          color="blue"
        />
        <StatCard
          title="Total Collected"
          value={formatCurrency(totalCollected)}
          subtitle="Realized revenue"
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="Pending Dues"
          value={formatCurrency(totalPending)}
          subtitle="Outstanding receivables"
          icon={Clock}
          color="rose"
        />
      </div>

      {/* Action and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={() => {
            if (students.length > 0) {
              setCreateFeeForm((prev) => ({
                ...prev,
                studentId: students[0].user?._id,
                classId: students[0].class?._id || (classes[0]?._id ?? ''),
              }));
            }
            setShowNewFeeModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Fee Invoice</span>
        </button>
      </div>

      {/* Fee Ledgers Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Total Fee</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Remaining Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading fee ledgers...
                  </td>
                </tr>
              ) : filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No fee records found.
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 text-sm">{fee.student?.name}</p>
                      <span className="text-[11px] font-mono text-slate-400">{fee.student?.userId}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {fee.class?.name || 'Class 10'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {formatCurrency(fee.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {formatCurrency(fee.paidAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-600">
                      {formatCurrency(fee.dueAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          fee.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fee.status === 'Partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {fee.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {fee.dueAmount > 0 && (
                          <button
                            onClick={() => openCollect(fee)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded shadow-xs"
                          >
                            Collect Payment
                          </button>
                        )}
                        {fee.payments?.length > 0 && (
                          <button
                            onClick={() => openPastReceipt(fee, fee.payments[fee.payments.length - 1])}
                            title="Print Latest Receipt"
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Payment Modal */}
      {showCollectModal && selectedFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Record Offline Payment</h3>
                <p className="text-xs text-slate-500">{selectedFee.student?.name} ({selectedFee.student?.userId})</p>
              </div>
              <button onClick={() => setShowCollectModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl my-4 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Total Class Fee:</span>
                <span className="font-bold">{formatCurrency(selectedFee.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Already Paid:</span>
                <span className="font-bold">{formatCurrency(selectedFee.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-rose-600 font-bold border-t pt-1">
                <span>Current Outstanding Due:</span>
                <span>{formatCurrency(selectedFee.dueAmount)}</span>
              </div>
            </div>

            <form onSubmit={handleCollectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Payment Amount (INR) *</label>
                <input
                  type="number"
                  required
                  max={selectedFee.dueAmount}
                  value={collectForm.amount}
                  onChange={(e) => setCollectForm({ ...collectForm, amount: e.target.value })}
                  className="w-full mt-1 p-2.5 border border-slate-300 rounded-lg text-sm font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Payment Method *</label>
                <select
                  value={collectForm.paymentMethod}
                  onChange={(e) => setCollectForm({ ...collectForm, paymentMethod: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                >
                  <option value="Cash">Cash (Manual Desk)</option>
                  <option value="Cheque">Bank Cheque / DD</option>
                  <option value="Bank Transfer">NEFT / RTGS Transfer</option>
                  <option value="Online/UPI">UPI / QR Code</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Payment Remarks / Reference</label>
                <input
                  type="text"
                  value={collectForm.remarks}
                  onChange={(e) => setCollectForm({ ...collectForm, remarks: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  placeholder="e.g. Receipt issued at admin window"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Fee Invoice Modal */}
      {showNewFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">Generate Student Fee Ledger</h3>
              <button onClick={() => setShowNewFeeModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFeeSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Select Student *</label>
                <select
                  required
                  value={createFeeForm.studentId}
                  onChange={(e) => {
                    const st = students.find((s) => s.user?._id === e.target.value);
                    setCreateFeeForm({
                      ...createFeeForm,
                      studentId: e.target.value,
                      classId: st?.class?._id || createFeeForm.classId,
                    });
                  }}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s.user?._id} value={s.user?._id}>
                      {s.user?.name} (#{s.rollNumber} - {s.user?.userId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Class *</label>
                <select
                  required
                  value={createFeeForm.classId}
                  onChange={(e) => setCreateFeeForm({ ...createFeeForm, classId: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                >
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Fee Amount (INR) *</label>
                <input
                  type="number"
                  required
                  value={createFeeForm.totalAmount}
                  onChange={(e) => setCreateFeeForm({ ...createFeeForm, totalAmount: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Term / Billing Period</label>
                <input
                  type="text"
                  value={createFeeForm.monthOrTerm}
                  onChange={(e) => setCreateFeeForm({ ...createFeeForm, monthOrTerm: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  placeholder="Term 2 (Oct 2026 - March 2027)"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewFeeModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        feeData={receiptData}
      />
    </DashboardShell>
  );
}
