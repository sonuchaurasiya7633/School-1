import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISectionClassTeacher {
  section: string;
  teacher: mongoose.Types.ObjectId;
}

export interface ISchoolClassDocument extends Document {
  name: string;
  grade: number;
  sections: string[];
  classTeacher?: mongoose.Types.ObjectId;
  sectionClassTeachers?: ISectionClassTeacher[];
  tuitionFee: number;
}

const SchoolClassSchema = new Schema<ISchoolClassDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    grade: { type: Number, required: true },
    sections: { type: [String], default: ['A'] },
    classTeacher: { type: Schema.Types.ObjectId, ref: 'User' },
    sectionClassTeachers: [
      {
        section: { type: String, required: true },
        teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
    tuitionFee: { type: Number, default: 2500 },
  },
  { timestamps: true }
);

SchoolClassSchema.index({ grade: 1 });

const SchoolClass: Model<ISchoolClassDocument> =
  mongoose.models.SchoolClass || mongoose.model<ISchoolClassDocument>('SchoolClass', SchoolClassSchema);

export default SchoolClass;
