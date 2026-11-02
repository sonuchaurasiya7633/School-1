import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISchoolClassDocument extends Document {
  name: string;
  grade: number;
  sections: string[];
  classTeacher?: mongoose.Types.ObjectId;
  tuitionFee: number;
}

const SchoolClassSchema = new Schema<ISchoolClassDocument>(
  {
    name: { type: String, required: true, trim: true },
    grade: { type: Number, required: true },
    sections: { type: [String], default: ['A'] },
    classTeacher: { type: Schema.Types.ObjectId, ref: 'User' },
    tuitionFee: { type: Number, default: 2500 },
  },
  { timestamps: true }
);

const SchoolClass: Model<ISchoolClassDocument> =
  mongoose.models.SchoolClass || mongoose.model<ISchoolClassDocument>('SchoolClass', SchoolClassSchema);

export default SchoolClass;
