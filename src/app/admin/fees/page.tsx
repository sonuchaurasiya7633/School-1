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
  Edit,
  Trash2,
  History,
  ArrowRight,
  Receipt,
  Calendar,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { authFetch } from '@/lib/api';

export default function AdminFeesPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showNewFeeModal, setShowNewFeeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);

  // Receipt Modal
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Collect Payment Form State
  const [collectForm, setCollectForm] = useState({
    amount: '',
    paymentMethod: 'Cash',
    paymentDate: new Date().toISOString().split('T')[0],
    remarks: 'Fee installment payment',
  });

  // Edit Fee Form State
  const [editForm, setEditForm] = useState({
    feeId: '',
    totalAmount: '',
    paidAmount: '',
    dueAmount: '',
    monthOrTerm: '',
    status: 'Pending',
  });

  // Create Fee Form State
  const [createFeeForm, setCreateFeeForm] = useState({
    studentId: '',
    classId: '',
    totalAmount: '16000',
    initialPaidAmount: '0',
    paymentMethod: 'Cash',
    monthOrTerm: 'Term 1 (2026-2027)',
    remarks: 'Initial fee invoice',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resF, resS, resC] = await Promise.all([
        authFetch('/api/fees'),
        authFetch('/api/admin/students'),
        authFetch('/api/admin/classes'),
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

  // Open Collect Installment Modal
  const openCollect = (fee: any) => {
    setSelectedFee(fee);
    setCollectForm({
      amount: String(fee.dueAmount),
      paymentMethod: 'Cash',
      paymentDate: new Date().toISOString().split('T')[0],
      remarks: fee.paidAmount > 0 ? 'Partial fee installment' : 'Fee payment',
    });
    setShowCollectModal(true);
  };

  // Open Edit Modal
  const openEdit = (fee: any) => {
    setSelectedFee(fee);
    setEditForm({
      feeId: fee._id,
      totalAmount: String(fee.totalAmount || 0),
      paidAmount: String(fee.paidAmount || 0),
      dueAmount: String(fee.dueAmount || 0),
      monthOrTerm: fee.monthOrTerm || 'Term 1',
      status: fee.status || 'Pending',
    });
    setShowEditModal(true);
  };

  // Open History Modal
  const openHistory = (fee: any) => {
    setSelectedFee(fee);
    setShowHistoryModal(true);
  };

  // Open Past Receipt
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

  // Submit Collect Installment (Partial / Full payment)
  const handleCollectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee) return;

    const amountNum = Number(collectForm.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid payment amount greater than zero.');
      return;
    }

    if (amountNum > selectedFee.dueAmount) {
      const confirmOverpay = window.confirm(
        `Amount entered (₹${amountNum}) is greater than current due (₹${selectedFee.dueAmount}). Proceed anyway?`
      );
      if (!confirmOverpay) return;
    }

    try {
      const res = await authFetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeId: selectedFee._id,
          amount: amountNum,
          paymentMethod: collectForm.paymentMethod,
          paymentDate: collectForm.paymentDate,
          remarks: collectForm.remarks,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCollectModal(false);
        await fetchData();

        // Trigger Receipt Modal Preview
        setReceiptData({
          studentName: selectedFee.student?.name,
          studentUserId: selectedFee.student?.userId,
          className: selectedFee.class?.name,
          receiptNumber: data.receiptNumber,
          date: collectForm.paymentDate || new Date().toISOString(),
          paymentMethod: collectForm.paymentMethod,
          amount: amountNum,
          remarks: collectForm.remarks,
          totalFee: selectedFee.totalAmount,
          paidAmount: (selectedFee.paidAmount || 0) + amountNum,
          dueAmount: Math.max(0, (selectedFee.dueAmount || 0) - amountNum),
        });
        setShowReceipt(true);
      } else {
        alert(data.message || 'Error recording payment.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while processing payment.');
    }
  };

  // Submit Edit Fee
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.feeId) return;

    const total = Number(editForm.totalAmount);
    const paid = Number(editForm.paidAmount);
    const due = Number(editForm.dueAmount);

    try {
      const res = await authFetch('/api/fees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeId: editForm.feeId,
          totalAmount: total,
          paidAmount: paid,
          dueAmount: due,
          monthOrTerm: editForm.monthOrTerm,
          status: editForm.status,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        await fetchData();
      } else {
        alert(data.message || 'Failed to update fee record.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating fee record.');
    }
  };

  // Handle Delete Fee
  const handleDeleteFee = async (fee: any) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the fee record for "${fee.student?.name}" (${fee.class?.name})?`
    );
    if (!confirmDelete) return;

    try {
      const res = await authFetch(`/api/fees?id=${fee._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
      } else {
        alert(data.message || 'Failed to delete fee record.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting fee record.');
    }
  };

  // Submit Create Fee Invoice
  const handleCreateFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_fee',
          studentId: createFeeForm.studentId,
          classId: createFeeForm.classId,
          totalAmount: Number(createFeeForm.totalAmount),
          initialPaidAmount: Number(createFeeForm.initialPaidAmount || 0),
          paymentMethod: createFeeForm.paymentMethod,
          monthOrTerm: createFeeForm.monthOrTerm,
          remarks: createFeeForm.remarks,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowNewFeeModal(false);
        await fetchData();
      } else {
        alert(data.message || 'Error creating fee ledger.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while creating fee invoice.');
    }
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

  // Live calculation helpers for Collect Modal
  const payingNow = Number(collectForm.amount) || 0;
  const currentPaid = selectedFee ? Number(selectedFee.paidAmount || 0) : 0;
  const currentDue = selectedFee ? Number(selectedFee.dueAmount || 0) : 0;
  const currentTotal = selectedFee ? Number(selectedFee.totalAmount || 0) : 0;
  const projectNewPaid = currentPaid + payingNow;
  const projectNewDue = Math.max(0, currentTotal - projectNewPaid);
  const projectNewStatus =
    projectNewDue === 0 ? 'Paid' : projectNewPaid > 0 ? 'Partial' : 'Pending';

  return (
    <DashboardShell
      title="Fees & Revenue Management"
      subtitle="Define class-wise fees, record offline/manual collections, manage partial installments, and issue payment vouchers"
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
                <th className="py-3 px-4">Class & Term</th>
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
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-700">{fee.class?.name || 'Class 10'}</p>
                      <span className="text-[10px] text-slate-400 font-medium">{fee.monthOrTerm || 'Term 1'}</span>
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
                      <div className="flex items-center justify-end gap-1.5">
                        {fee.dueAmount > 0 && (
                          <button
                            onClick={() => openCollect(fee)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded shadow-xs transition"
                            title="Collect Next Installment"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Collect Installment</span>
                          </button>
                        )}

                        {fee.payments?.length > 0 && (
                          <button
                            onClick={() => openHistory(fee)}
                            title="View Installments & Receipts History"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {fee.payments?.length > 0 && (
                          <button
                            onClick={() => openPastReceipt(fee, fee.payments[fee.payments.length - 1])}
                            title="Print Latest Receipt"
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded border border-slate-200 transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => openEdit(fee)}
                          title="Edit Fee Ledger"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded border border-slate-200 transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteFee(fee)}
                          title="Delete Fee Record"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded border border-slate-200 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= 1. COLLECT PAYMENT / PARTIAL INSTALLMENT MODAL ================= */}
      {showCollectModal && selectedFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Record Fee Payment / Installment</h3>
                <p className="text-xs text-slate-500">
                  {selectedFee.student?.name} ({selectedFee.student?.userId}) • {selectedFee.class?.name}
                </p>
              </div>
              <button
                onClick={() => setShowCollectModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Ledger Summary Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl my-4 text-xs space-y-1.5 border border-slate-200/80">
              <div className="flex justify-between text-slate-600">
                <span>Total Class Fee:</span>
                <span className="font-bold text-slate-800">{formatCurrency(selectedFee.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Already Paid:</span>
                <span className="font-bold">{formatCurrency(selectedFee.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-rose-600 font-bold border-t border-slate-200 pt-1.5">
                <span>Current Outstanding Due:</span>
                <span>{formatCurrency(selectedFee.dueAmount)}</span>
              </div>
            </div>

            <form onSubmit={handleCollectSubmit} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">
                    Installment Amount to Pay Now (INR) *
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Max Due: {formatCurrency(selectedFee.dueAmount)}
                  </span>
                </div>
                <input
                  type="number"
                  required
                  min={1}
                  value={collectForm.amount}
                  onChange={(e) => setCollectForm({ ...collectForm, amount: e.target.value })}
                  placeholder="e.g. 600"
                  className="w-full p-2.5 border-2 border-emerald-500 rounded-lg text-base font-black text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />

                {/* Quick Helper Buttons for Installment */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-500 font-medium">Quick Amount:</span>
                  <button
                    type="button"
                    onClick={() => setCollectForm({ ...collectForm, amount: String(selectedFee.dueAmount) })}
                    className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px]"
                  >
                    Full Due ({formatCurrency(selectedFee.dueAmount)})
                  </button>
                  {selectedFee.dueAmount >= 200 && (
                    <button
                      type="button"
                      onClick={() =>
                        setCollectForm({ ...collectForm, amount: String(Math.round(selectedFee.dueAmount / 2)) })
                      }
                      className="px-2 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-[11px]"
                    >
                      50% ({formatCurrency(Math.round(selectedFee.dueAmount / 2))})
                    </button>
                  )}
                  {selectedFee.dueAmount >= 500 && (
                    <button
                      type="button"
                      onClick={() => setCollectForm({ ...collectForm, amount: '500' })}
                      className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-[11px]"
                    >
                      ₹500
                    </button>
                  )}
                  {selectedFee.dueAmount >= 600 && selectedFee.dueAmount !== 600 && (
                    <button
                      type="button"
                      onClick={() => setCollectForm({ ...collectForm, amount: '600' })}
                      className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-[11px]"
                    >
                      ₹600
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic Live Calculation Card */}
              {payingNow > 0 && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-emerald-900 font-bold text-[11px]">
                    <span>Calculation After This Payment:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        projectNewStatus === 'Paid'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {projectNewStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200/80">
                    <div>
                      <span className="text-slate-500 text-[11px]">New Paid Total:</span>
                      <p className="font-bold text-emerald-800 text-sm">{formatCurrency(projectNewPaid)}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px]">Remaining Balance Due:</span>
                      <p
                        className={`font-bold text-sm ${
                          projectNewDue === 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {formatCurrency(projectNewDue)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Payment Method *</label>
                  <select
                    value={collectForm.paymentMethod}
                    onChange={(e) => setCollectForm({ ...collectForm, paymentMethod: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Cash">Cash (Manual Desk)</option>
                    <option value="Online/UPI">UPI / QR Code / PhonePe / GPay</option>
                    <option value="Bank Transfer">NEFT / RTGS Transfer</option>
                    <option value="Cheque">Bank Cheque / DD</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={collectForm.paymentDate}
                    onChange={(e) => setCollectForm({ ...collectForm, paymentDate: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Payment Remarks / Reference</label>
                <input
                  type="text"
                  value={collectForm.remarks}
                  onChange={(e) => setCollectForm({ ...collectForm, remarks: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                  placeholder="e.g. 2nd Installment paid via UPI / Cash"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    Confirm &amp; Issue Receipt ({formatCurrency(payingNow > 0 ? payingNow : currentDue)})
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 2. INSTALLMENT HISTORY MODAL ================= */}
      {showHistoryModal && selectedFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Payment Installment History</h3>
                <p className="text-xs text-slate-500">
                  {selectedFee.student?.name} ({selectedFee.student?.userId}) • {selectedFee.class?.name}
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Ledger Overview */}
            <div className="grid grid-cols-3 gap-2 my-4 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] text-slate-500 font-medium">Total Invoiced</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">
                  {formatCurrency(selectedFee.totalAmount)}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[11px] text-emerald-700 font-medium">Total Paid</span>
                <p className="font-bold text-emerald-800 text-sm mt-0.5">
                  {formatCurrency(selectedFee.paidAmount)}
                </p>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <span className="text-[11px] text-rose-700 font-medium">Remaining Due</span>
                <p className="font-bold text-rose-700 text-sm mt-0.5">
                  {formatCurrency(selectedFee.dueAmount)}
                </p>
              </div>
            </div>

            {/* Installments Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mt-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Receipt No</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3">Remarks</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedFee.payments && selectedFee.payments.length > 0 ? (
                    selectedFee.payments.map((p: any, idx: number) => (
                      <tr key={p._id || idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-500">#{idx + 1}</td>
                        <td className="py-2.5 px-3 text-slate-700">{formatDate(p.date)}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{p.receiptNumber}</td>
                        <td className="py-2.5 px-3 text-slate-600">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold">
                            {p.paymentMethod}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 truncate max-w-[140px]" title={p.remarks}>
                          {p.remarks || '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-800">
                          {formatCurrency(p.amount)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => openPastReceipt(selectedFee, p)}
                            className="p-1 text-emerald-700 hover:bg-emerald-100 rounded transition inline-flex items-center gap-1 text-[11px] font-bold"
                            title="Print Voucher"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-400">
                        No payments recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
              {selectedFee.dueAmount > 0 ? (
                <button
                  onClick={() => {
                    setShowHistoryModal(false);
                    openCollect(selectedFee);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Collect Next Installment ({formatCurrency(selectedFee.dueAmount)})</span>
                </button>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Fully Paid! No Dues Pending.</span>
                </span>
              )}
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. DIRECT EDIT / UPDATE FEE MODAL ================= */}
      {showEditModal && selectedFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Direct Update Fee Ledger</h3>
                <p className="text-xs text-slate-500">
                  {selectedFee.student?.name} ({selectedFee.student?.userId})
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Total Fee Amount (INR) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={editForm.totalAmount}
                  onChange={(e) => {
                    const total = Number(e.target.value) || 0;
                    const paid = Number(editForm.paidAmount) || 0;
                    const due = Math.max(0, total - paid);
                    setEditForm({
                      ...editForm,
                      totalAmount: e.target.value,
                      dueAmount: String(due),
                      status: due === 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending',
                    });
                  }}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Already Paid Amount (INR) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={editForm.paidAmount}
                  onChange={(e) => {
                    const paid = Number(e.target.value) || 0;
                    const total = Number(editForm.totalAmount) || 0;
                    const due = Math.max(0, total - paid);
                    setEditForm({
                      ...editForm,
                      paidAmount: e.target.value,
                      dueAmount: String(due),
                      status: due === 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending',
                    });
                  }}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Remaining Due Amount (INR)</label>
                <input
                  type="number"
                  min={0}
                  value={editForm.dueAmount}
                  onChange={(e) => setEditForm({ ...editForm, dueAmount: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-bold text-rose-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Term / Billing Period</label>
                <input
                  type="text"
                  value={editForm.monthOrTerm}
                  onChange={(e) => setEditForm({ ...editForm, monthOrTerm: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Ledger Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-bold"
                >
                  <option value="Pending">Pending (Unpaid)</option>
                  <option value="Partial">Partial (Partially Paid)</option>
                  <option value="Paid">Paid (Fully Cleared)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 4. GENERATE FEE INVOICE MODAL ================= */}
      {showNewFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">Generate Student Fee Ledger</h3>
              <button
                onClick={() => setShowNewFeeModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
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
                <label className="font-semibold text-slate-700">Total Fee Amount (INR) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={createFeeForm.totalAmount}
                  onChange={(e) => setCreateFeeForm({ ...createFeeForm, totalAmount: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">
                  Initial Advance / Paid Amount (Optional)
                </label>
                <input
                  type="number"
                  min={0}
                  value={createFeeForm.initialPaidAmount}
                  onChange={(e) => setCreateFeeForm({ ...createFeeForm, initialPaidAmount: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-bold text-emerald-700"
                  placeholder="e.g. 500 if paid upfront"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Agar student ne pehle se kuch advance diya hai (jaise ₹500), toh yahan enter karein.
                </span>
              </div>

              {Number(createFeeForm.initialPaidAmount) > 0 && (
                <div>
                  <label className="font-semibold text-slate-700">Initial Payment Mode</label>
                  <select
                    value={createFeeForm.paymentMethod}
                    onChange={(e) => setCreateFeeForm({ ...createFeeForm, paymentMethod: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Online/UPI">UPI / QR Code</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              )}

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
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
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
