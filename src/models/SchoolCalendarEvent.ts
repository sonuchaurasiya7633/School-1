import mongoose, { Schema, Document, Model } from 'mongoose';
import { ISchoolCalendarEvent } from '@/types/calendar';

export interface ISchoolCalendarEventDocument
  extends Omit<ISchoolCalendarEvent, '_id' | 'id'>,
    Document {}

const SchoolCalendarEventSchema = new Schema<ISchoolCalendarEventDocument>(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    endDate: { type: String, default: '' }, // For date ranges
    dayOfWeek: { type: String, default: '' },
    category: {
      type: String,
      enum: ['general', 'public', 'optional', 'school', 'exam', 'weekend'],
      default: 'general',
      required: true,
      index: true,
    },
    schoolStatus: {
      type: String,
      enum: ['open', 'closed', 'half_day'],
      default: 'closed',
      required: true,
    },
    isOptional: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
    colorCode: { type: String, default: '' },
    description: { type: String, default: '' },
    instructions: { type: String, default: '' },
    academicYear: { type: String, default: '2027', index: true },
    createdSource: {
      type: String,
      enum: ['bihar_gazette', 'school_admin'],
      default: 'school_admin',
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

SchoolCalendarEventSchema.index({ academicYear: 1, date: 1 });

const SchoolCalendarEvent: Model<ISchoolCalendarEventDocument> =
  (mongoose.models && mongoose.models.SchoolCalendarEvent) ||
  mongoose.model<ISchoolCalendarEventDocument>(
    'SchoolCalendarEvent',
    SchoolCalendarEventSchema
  );

export default SchoolCalendarEvent;
