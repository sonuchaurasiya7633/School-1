import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFeePaymentItem {
  amount: number;
  date: string;
  paymentMethod: 'Cash' | 'Cheque' | 'Bank Transfer' | 'Online/UPI';
  receiptNumber: string;
  collectedBy: mongoose.Types.ObjectId;
  remarks?: string;
}

export interface IFeeDocument extends Document {
  student: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  monthOrTerm: string;
  status: 'Paid' | 'Partial' | 'Pending';
  payments: IFeePaymentItem[];
}

const FeeSchema = new Schema<IFeeDocument>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    class: { type: Schema.Types.ObjectId, ref: 'SchoolClass', required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, required: true },
    monthOrTerm: { type: String, required: true },
    status: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' },
    payments: [
      {
        amount: { type: Number, required: true },
        date: { type: String, default: new Date().toISOString().split('T')[0] },
        paymentMethod: { type: String, enum: ['Cash', 'Cheque', 'Bank Transfer', 'Online/UPI'], default: 'Cash' },
        receiptNumber: { type: String, required: true },
        collectedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        remarks: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

const Fee: Model<IFeeDocument> = mongoose.models.Fee || mongoose.model<IFeeDocument>('Fee', FeeSchema);

export default Fee;
