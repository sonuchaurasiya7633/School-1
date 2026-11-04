import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAcademicSessionDocument extends Document {
  sessionName: string; // e.g. '2026-2027' or '2027-2028'
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
  isAdmissionOpen: boolean;
  status: 'upcoming' | 'active' | 'completed' | 'archived';
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AcademicSessionSchema = new Schema<IAcademicSessionDocument>(
  {
    sessionName: { type: String, required: true, unique: true, trim: true },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    isCurrent: { type: Boolean, default: false },
    isAdmissionOpen: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed', 'archived'],
      default: 'active',
    },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

AcademicSessionSchema.index({ isCurrent: 1 });

const AcademicSession: Model<IAcademicSessionDocument> =
  (mongoose.models && mongoose.models.AcademicSession) ||
  mongoose.model<IAcademicSessionDocument>('AcademicSession', AcademicSessionSchema);

export default AcademicSession;
