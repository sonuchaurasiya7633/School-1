import mongoose, { Schema, Document, Model } from 'mongoose';
import './SchoolClass';
import './Subject';

export interface IAssignedClass {
  class: mongoose.Types.ObjectId;
  section: string;
  subject: mongoose.Types.ObjectId;
}

export interface ITeacherProfileDocument extends Document {
  user: mongoose.Types.ObjectId;
  qualification: string;
  specialization: string;
  joiningDate: string;
  assignedClasses: IAssignedClass[];
}

const TeacherProfileSchema = new Schema<ITeacherProfileDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    qualification: { type: String, default: 'B.Ed, M.Sc' },
    specialization: { type: String, default: 'General' },
    joiningDate: { type: String, default: new Date().toISOString().split('T')[0] },
    assignedClasses: [
      {
        class: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
        section: { type: String, required: true },
        subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
      },
    ],
  },
  { timestamps: true }
);

const TeacherProfile: Model<ITeacherProfileDocument> =
  mongoose.models.TeacherProfile || mongoose.model<ITeacherProfileDocument>('TeacherProfile', TeacherProfileSchema);

export default TeacherProfile;
