import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubjectDocument extends Document {
  name: string;
  code: string;
  classes: mongoose.Types.ObjectId[];
}

const SubjectSchema = new Schema<ISubjectDocument>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    classes: [{ type: Schema.Types.ObjectId, ref: 'SchoolClass' }],
  },
  { timestamps: true }
);

const Subject: Model<ISubjectDocument> =
  mongoose.models.Subject || mongoose.model<ISubjectDocument>('Subject', SubjectSchema);

export default Subject;
