import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFacultyDocument extends Document {
  name: string;
  qualification: string;
  university?: string;
  additional?: string;
  category: string;
  order: number;
  isActive: boolean;
  avatar?: string;
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
  },
  { timestamps: true }
);

const Faculty: Model<IFacultyDocument> =
  mongoose.models.Faculty || mongoose.model<IFacultyDocument>('Faculty', FacultySchema);

export default Faculty;
