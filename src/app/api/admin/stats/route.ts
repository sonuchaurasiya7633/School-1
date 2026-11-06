import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { authorizeRoles } from '@/lib/auth';
import User from '@/models/User';
import SchoolClass from '@/models/SchoolClass';
import Subject from '@/models/Subject';
import Attendance from '@/models/Attendance';
import Fee from '@/models/Fee';
import Notice from '@/models/Notice';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const auth = authorizeRoles(req, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
    }

    const [totalStudents, totalTeachers, allClasses, totalSubjects] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'teacher', isActive: true }),
      SchoolClass.find().select('sections').lean(),
      Subject.countDocuments(),
    ]);

    const totalClasses = allClasses.length;
    const totalSections = allClasses.reduce((acc, c) => acc + (c.sections?.length || 1), 0);

    // Today's attendance summary
    const today = new Date().toISOString().split('T')[0];
    const attendanceRecords = await Attendance.find({ date: today });
    
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalMarked = 0;

    attendanceRecords.forEach((att) => {
      att.records?.forEach((r: any) => {
        totalMarked++;
        if (r.status === 'Present') totalPresent++;
        else if (r.status === 'Absent') totalAbsent++;
        else if (r.status === 'Late') totalLate++;
      });
    });

    const attendanceRate = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 0;

    // Fees summary
    const feeRecords = await Fee.find();
    let totalFees = 0;
    let collectedFees = 0;
    let pendingFees = 0;

    feeRecords.forEach((fee) => {
      totalFees += fee.totalAmount || 0;
      collectedFees += fee.paidAmount || 0;
      pendingFees += fee.dueAmount || 0;
    });

    // Recent Notices
    const recentNotices = await Notice.find()
      .populate('author', 'name role')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent Payments
    const recentPayments: any[] = [];
    feeRecords.forEach((fee) => {
      fee.payments.forEach((p: any) => {
        recentPayments.push({
          receiptNumber: p.receiptNumber,
          amount: p.amount,
          date: p.date,
          paymentMethod: p.paymentMethod,
          remarks: p.remarks,
        });
      });
    });
    recentPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalSections,
        totalSubjects,
        attendance: {
          marked: totalMarked,
          present: totalPresent,
          absent: totalAbsent,
          late: totalLate,
          rate: attendanceRate,
        },
        fees: {
          total: totalFees,
          collected: collectedFees,
          pending: pendingFees,
        },
        recentNotices,
        recentPayments: recentPayments.slice(0, 5),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
