import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserDocument extends Document {
  userId: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'teacher' | 'student';
  phone?: string;
  address?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    userId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    dateOfBirth: { type: String, default: '' },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;
