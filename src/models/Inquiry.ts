import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInquiryDocument extends Document {
  studentName: string;
  parentName: string;
  phone: string;
  email?: string;
  applyingClass: string;
  message?: string;
  status: 'Pending' | 'Contacted' | 'Admitted' | 'Cancelled';
  notes?: string;
}

const InquirySchema = new Schema<IInquiryDocument>(
  {
    studentName: { type: String, required: true },
    parentName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    applyingClass: { type: String, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Admitted', 'Cancelled'],
      default: 'Pending',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const Inquiry: Model<IInquiryDocument> =
  mongoose.models.Inquiry || mongoose.model<IInquiryDocument>('Inquiry', InquirySchema);

export default Inquiry;
