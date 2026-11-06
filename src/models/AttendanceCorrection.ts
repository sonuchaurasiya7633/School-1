import mongoose, { Schema, Document, Model } from 'mongoose';
import './User';
import './SchoolClass';

export interface IAttendanceCorrectionDocument extends Document {
  student: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  section: string;
  date: string; // YYYY-MM-DD
  currentStatus: 'Present' | 'Absent' | 'Late' | 'Half Day';
  requestedStatus: 'Present' | 'Absent' | 'Late' | 'Half Day';
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewRemarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceCorrectionSchema = new Schema<IAttendanceCorrectionDocument>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    class: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
    section: { type: String, required: true, default: 'A' },
    date: { type: String, required: true },
    currentStatus: { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day'], required: true },
    requestedStatus: { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day'], default: 'Present' },
    reason: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewRemarks: { type: String, default: '' },
  },
  { timestamps: true }
);

const AttendanceCorrection: Model<IAttendanceCorrectionDocument> =
  mongoose.models.AttendanceCorrection ||
  mongoose.model<IAttendanceCorrectionDocument>('AttendanceCorrection', AttendanceCorrectionSchema);

export default AttendanceCorrection;
