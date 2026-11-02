import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMarkDocument extends Document {
  exam: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  section: string;
  subject: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks?: string;
  enteredBy: mongoose.Types.ObjectId;
}

const MarkSchema = new Schema<IMarkDocument>(
  {
    exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    class: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
    section: { type: String, required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, default: 100 },
    grade: { type: String, default: 'A' },
    remarks: { type: String, default: '' },
    enteredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

MarkSchema.index({ exam: 1, student: 1, subject: 1 }, { unique: true });

const Mark: Model<IMarkDocument> =
  mongoose.models.Mark || mongoose.model<IMarkDocument>('Mark', MarkSchema);

export default Mark;
