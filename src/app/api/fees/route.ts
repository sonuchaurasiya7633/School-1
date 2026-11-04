import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import Fee from '@/models/Fee';
import StudentProfile from '@/models/StudentProfile';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin', 'student']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const studentId = searchParams.get('studentId');

    let filter: any = {};
    if (auth.user.role === 'student') {
      filter.student = auth.user.id;
    } else {
      if (studentId) filter.student = studentId;
      if (classId) filter.class = classId;
    }

    const fees = await Fee.find(filter)
      .populate('student', 'name userId email phone')
      .populate('class', 'name grade tuitionFee')
      .populate('payments.collectedBy', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, fees });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const body = await req.json();

    // Action 1: Create fee invoice/ledger for student
    if (body.action === 'create_fee') {
      const { studentId, classId, totalAmount, monthOrTerm, initialPaidAmount, paymentMethod, remarks } = body;
      if (!studentId || !classId || !totalAmount) {
        return NextResponse.json({ success: false, message: 'Student, class, and amount are required.' }, { status: 400 });
      }

      const total = Number(totalAmount);
      const initialPaid = Math.max(0, Number(initialPaidAmount || 0));
      const due = Math.max(0, total - initialPaid);
      let status: 'Paid' | 'Partial' | 'Pending' = 'Pending';
      if (initialPaid >= total && total > 0) status = 'Paid';
      else if (initialPaid > 0) status = 'Partial';

      const initialPayments = [];
      if (initialPaid > 0) {
        initialPayments.push({
          amount: initialPaid,
          date: body.paymentDate || new Date().toISOString().split('T')[0],
          paymentMethod: paymentMethod || 'Cash',
          receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          collectedBy: auth.user.id as any,
          remarks: remarks || 'Initial Payment / Advance Deposit',
        });
      }

      const newFee = await Fee.create({
        student: studentId,
        class: classId,
        totalAmount: total,
        paidAmount: initialPaid,
        dueAmount: due,
        monthOrTerm: monthOrTerm || 'Term 1',
        status,
        payments: initialPayments,
      });

      const populated = await Fee.findById(newFee._id)
        .populate('student', 'name userId')
        .populate('class', 'name grade');

      return NextResponse.json({ success: true, message: 'Fee invoice created.', fee: populated });
    }

    // Action 2: Record offline/manual payment (Full or Partial installment)
    const { feeId, amount, paymentMethod, remarks, paymentDate } = body;

    if (!feeId || !amount) {
      return NextResponse.json({ success: false, message: 'Fee ID and payment amount are required.' }, { status: 400 });
    }

    const fee = await Fee.findById(feeId);
    if (!fee) {
      return NextResponse.json({ success: false, message: 'Fee record not found.' }, { status: 404 });
    }

    const paymentAmount = Number(amount);
    if (paymentAmount <= 0) {
      return NextResponse.json({ success: false, message: 'Payment amount must be greater than zero.' }, { status: 400 });
    }

    const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    fee.paidAmount += paymentAmount;
    fee.dueAmount = Math.max(0, fee.totalAmount - fee.paidAmount);

    if (fee.dueAmount === 0) {
      fee.status = 'Paid';
    } else {
      fee.status = 'Partial';
    }

    fee.payments.push({
      amount: paymentAmount,
      date: paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod || 'Cash',
      receiptNumber,
      collectedBy: auth.user.id as any,
      remarks: remarks || 'Manual Payment Received',
    });

    await fee.save();

    const populated = await Fee.findById(fee._id)
      .populate('student', 'name userId email phone')
      .populate('class', 'name grade')
      .populate('payments.collectedBy', 'name');

    return NextResponse.json({
      success: true,
      message: 'Payment recorded successfully.',
      receiptNumber,
      fee: populated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const body = await req.json();
    const { feeId, totalAmount, paidAmount, dueAmount, monthOrTerm, status } = body;

    if (!feeId) {
      return NextResponse.json({ success: false, message: 'Fee ID is required.' }, { status: 400 });
    }

    const fee = await Fee.findById(feeId);
    if (!fee) {
      return NextResponse.json({ success: false, message: 'Fee record not found.' }, { status: 404 });
    }

    if (totalAmount !== undefined && !isNaN(Number(totalAmount))) {
      fee.totalAmount = Number(totalAmount);
    }
    if (paidAmount !== undefined && !isNaN(Number(paidAmount))) {
      fee.paidAmount = Number(paidAmount);
    }

    if (dueAmount !== undefined && !isNaN(Number(dueAmount))) {
      fee.dueAmount = Number(dueAmount);
    } else {
      fee.dueAmount = Math.max(0, fee.totalAmount - fee.paidAmount);
    }

    if (monthOrTerm) fee.monthOrTerm = monthOrTerm;

    if (status) {
      fee.status = status;
    } else {
      if (fee.dueAmount === 0 && fee.totalAmount > 0) {
        fee.status = 'Paid';
      } else if (fee.paidAmount > 0) {
        fee.status = 'Partial';
      } else {
        fee.status = 'Pending';
      }
    }

    await fee.save();

    const populated = await Fee.findById(fee._id)
      .populate('student', 'name userId email phone')
      .populate('class', 'name grade')
      .populate('payments.collectedBy', 'name');

    return NextResponse.json({
      success: true,
      message: 'Fee record updated successfully.',
      fee: populated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Fee ID is required.' }, { status: 400 });
    }

    await Fee.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Fee record deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
