import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMarkAuditLog {
  action: string;
  changedBy: mongoose.Types.ObjectId;
  timestamp: Date;
  details?: string;
}

export interface IMarkDocument extends Document {
  exam: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  section: string;
  subject: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  marksObtained: number;
  maxMarks: number;
  passMarks: number;
  isAbsent: boolean;
  grade: string;
  remarks?: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Published';
  enteredBy: mongoose.Types.ObjectId;
  submittedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  reviewRemarks?: string;
  auditLogs?: IMarkAuditLog[];
}

const MarkSchema = new Schema<IMarkDocument>(
  {
    exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    class: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
    section: { type: String, required: true, default: 'A' },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    marksObtained: { type: Number, required: true, default: 0, min: 0 },
    maxMarks: { type: Number, default: 100, min: 1 },
    passMarks: { type: Number, default: 35, min: 0 },
    isAbsent: { type: Boolean, default: false },
    grade: { type: String, default: 'A' },
    remarks: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Approved', 'Published'],
      default: 'Draft',
    },
    enteredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    submittedAt: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    reviewRemarks: { type: String, default: '' },
    auditLogs: [
      {
        action: { type: String, required: true },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        timestamp: { type: Date, default: Date.now },
        details: { type: String },
      },
    ],
  },
  { timestamps: true }
);

MarkSchema.index({ exam: 1, student: 1, subject: 1 }, { unique: true });
MarkSchema.index({ exam: 1, class: 1, section: 1, subject: 1 });
MarkSchema.index({ status: 1 });

const Mark: Model<IMarkDocument> =
  mongoose.models.Mark || mongoose.model<IMarkDocument>('Mark', MarkSchema);

export default Mark;
