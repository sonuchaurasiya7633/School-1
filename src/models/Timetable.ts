import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITimetablePeriodSchema {
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject?: mongoose.Types.ObjectId;
  teacher?: mongoose.Types.ObjectId;
  room?: string;
  isBreak?: boolean;
  title?: string;
}

export interface ITimetableDocument extends Document {
  class: mongoose.Types.ObjectId;
  section: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  periods: ITimetablePeriodSchema[];
}

const TimetableSchema = new Schema<ITimetableDocument>(
  {
    class: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
    section: { type: String, required: true, default: 'A' },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    periods: [
      {
        periodNumber: { type: Number, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
        teacher: { type: Schema.Types.ObjectId, ref: 'User' },
        room: { type: String, default: 'Room 101' },
        isBreak: { type: Boolean, default: false },
        title: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

TimetableSchema.index({ class: 1, section: 1, day: 1 }, { unique: true });
TimetableSchema.index({ 'periods.teacher': 1, day: 1 });

const Timetable: Model<ITimetableDocument> =
  mongoose.models.Timetable || mongoose.model<ITimetableDocument>('Timetable', TimetableSchema);

export default Timetable;
