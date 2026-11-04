import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFacultyAssignedClass {
  class: mongoose.Types.ObjectId;
  section: string;
  subject: mongoose.Types.ObjectId;
}

export interface IFacultyDocument extends Document {
  name: string;
  qualification: string;
  university?: string;
  additional?: string;
  category: string;
  order: number;
  isActive: boolean;
  avatar?: string;
  user?: mongoose.Types.ObjectId;
  assignedClasses?: IFacultyAssignedClass[];
}

const FacultySchema = new Schema<IFacultyDocument>(
  {
    name: { type: String, required: true },
    qualification: { type: String, required: true },
    university: { type: String, default: '' },
    additional: { type: String, default: '' },
    category: { type: String, default: 'General' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    avatar: { type: String, default: '' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedClasses: [
      {
        class: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
        section: { type: String, default: 'A' },
        subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
      },
    ],
  },
  { timestamps: true }
);

const Faculty: Model<IFacultyDocument> =
  mongoose.models.Faculty || mongoose.model<IFacultyDocument>('Faculty', FacultySchema);

export default Faculty;
