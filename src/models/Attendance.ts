import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendanceRecordItem {
  student: mongoose.Types.ObjectId;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  remarks?: string;
}

export interface IAttendanceDocument extends Document {
  date: string; // YYYY-MM-DD
  class: mongoose.Types.ObjectId;
  section: string;
  subject?: mongoose.Types.ObjectId;
  records: IAttendanceRecordItem[];
  recordedBy: mongoose.Types.ObjectId;
}

const AttendanceSchema = new Schema<IAttendanceDocument>(
  {
    date: { type: String, required: true },
    class: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
    section: { type: String, required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    records: [
      {
        student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day'], default: 'Present' },
        remarks: { type: String, default: '' },
      },
    ],
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

AttendanceSchema.index({ date: 1, class: 1, section: 1 }, { unique: true });

const Attendance: Model<IAttendanceDocument> =
  mongoose.models.Attendance || mongoose.model<IAttendanceDocument>('Attendance', AttendanceSchema);

export default Attendance;
