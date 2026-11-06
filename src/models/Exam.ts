import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExamScheduleItemSchema {
  subject: mongoose.Types.ObjectId;
  date: string;
  time: string;
  maxMarks: number;
  passMarks: number;
  teacher?: mongoose.Types.ObjectId;
}

export interface IExamDocument extends Document {
  name: string;
  session: string;
  startDate: string;
  endDate: string;
  class: mongoose.Types.ObjectId;
  isPublished: boolean;
  schedule: IExamScheduleItemSchema[];
}

const ExamSchema = new Schema<IExamDocument>(
  {
    name: { type: String, required: true, trim: true },
    session: { type: String, default: '2026-2027', trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    class: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
    isPublished: { type: Boolean, default: false },
    schedule: [
      {
        subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
        date: { type: String, required: true },
        time: { type: String, default: '09:00 AM - 12:00 PM' },
        maxMarks: { type: Number, default: 100 },
        passMarks: { type: Number, default: 35 },
        teacher: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  { timestamps: true }
);

const Exam: Model<IExamDocument> =
  mongoose.models.Exam || mongoose.model<IExamDocument>('Exam', ExamSchema);

export default Exam;
