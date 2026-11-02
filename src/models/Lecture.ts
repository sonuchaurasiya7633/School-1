import mongoose, { Schema, Document } from 'mongoose';

export interface ILecture extends Document {
  title: string;
  description: string;
  subject: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  section: string;
  teacher: mongoose.Types.ObjectId;
  videoUrl?: string; // YouTube, Google Drive, or MP4 link
  attachmentUrl?: string; // PDF notes or presentation
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const LectureSchema = new Schema<ILecture>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    class: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
    section: { type: String, default: 'A' },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    videoUrl: { type: String },
    attachmentUrl: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Lecture || mongoose.model<ILecture>('Lecture', LectureSchema);
