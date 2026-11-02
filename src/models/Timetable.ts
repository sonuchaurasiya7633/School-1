import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITimetablePeriodSchema {
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  room?: string;
}

export interface ITimetableDocument extends Document {
  class: mongoose.Types.ObjectId;
  section: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: ITimetablePeriodSchema[];
}

const TimetableSchema = new Schema<ITimetableDocument>(
  {
    class: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
    section: { type: String, required: true },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    periods: [
      {
        periodNumber: { type: Number, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
        teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        room: { type: String, default: 'Room 101' },
      },
    ],
  },
  { timestamps: true }
);

TimetableSchema.index({ class: 1, section: 1, day: 1 }, { unique: true });

const Timetable: Model<ITimetableDocument> =
  mongoose.models.Timetable || mongoose.model<ITimetableDocument>('Timetable', TimetableSchema);

export default Timetable;
