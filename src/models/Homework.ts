import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmissionItem {
  student: mongoose.Types.ObjectId;
  submissionText?: string;
  fileUrl?: string;
  submittedAt: Date;
  status: 'Submitted' | 'Reviewed';
  marks?: number;
  feedback?: string;
}

export interface IHomeworkDocument extends Document {
  title: string;
  description: string;
  class: mongoose.Types.ObjectId;
  section: string;
  subject: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  dueDate: string;
  submissions: ISubmissionItem[];
}

const HomeworkSchema = new Schema<IHomeworkDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    class: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
    section: { type: String, required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: String, required: true },
    submissions: [
      {
        student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        submissionText: { type: String, default: '' },
        fileUrl: { type: String, default: '' },
        submittedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['Submitted', 'Reviewed'], default: 'Submitted' },
        marks: { type: Number },
        feedback: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

const Homework: Model<IHomeworkDocument> =
  mongoose.models.Homework || mongoose.model<IHomeworkDocument>('Homework', HomeworkSchema);

export default Homework;
