import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudentProfileDocument extends Document {
  user: mongoose.Types.ObjectId;
  rollNumber: string;
  class: mongoose.Types.ObjectId;
  section: string;
  admissionDate: string;
  parentName: string;
  parentPhone: string;
  emergencyContact?: string;
  bloodGroup?: string;
}

const StudentProfileSchema = new Schema<IStudentProfileDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rollNumber: { type: String, required: true },
    class: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
    section: { type: String, required: true, default: 'A' },
    admissionDate: { type: String, default: new Date().toISOString().split('T')[0] },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    emergencyContact: { type: String, default: '' },
    bloodGroup: { type: String, default: 'O+' },
  },
  { timestamps: true }
);

const StudentProfile: Model<IStudentProfileDocument> =
  mongoose.models.StudentProfile || mongoose.model<IStudentProfileDocument>('StudentProfile', StudentProfileSchema);

export default StudentProfile;
