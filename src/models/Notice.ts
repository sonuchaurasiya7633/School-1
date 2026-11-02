import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INoticeDocument extends Document {
  title: string;
  content: string;
  targetRole: 'all' | 'teacher' | 'student';
  class?: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  date: string;
  isPinned: boolean;
}

const NoticeSchema = new Schema<INoticeDocument>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    targetRole: { type: String, enum: ['all', 'teacher', 'student'], default: 'all' },
    class: { type: Schema.Types.ObjectId, ref: 'SchoolClass' },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, default: new Date().toISOString().split('T')[0] },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notice: Model<INoticeDocument> =
  mongoose.models.Notice || mongoose.model<INoticeDocument>('Notice', NoticeSchema);

export default Notice;
