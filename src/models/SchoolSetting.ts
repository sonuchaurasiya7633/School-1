import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISchoolSettingDocument extends Document {
  schoolName: string;
  tagline: string;
  code: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  academicYear: string;
  principalName: string;
  // Director & Website CMS fields
  directorName: string;
  directorDesignation: string;
  directorQualifications: string;
  directorMessage: string;
  directorImage: string;
  announcement: string;
  admissionsOpen: boolean;
  heroTitle: string;
  heroSubtitle: string;
}

const SchoolSettingSchema = new Schema<ISchoolSettingDocument>(
  {
    schoolName: { type: String, default: 'Success Point School' },
    tagline: { type: String, default: 'Best Education, Good Results.' },
    code: { type: String, default: 'SPS' },
    logo: { type: String, default: '/images/logo.jpeg' },
    email: { type: String, default: 'info@successpointschool.edu' },
    phone: { type: String, default: '+91 98765 43210' },
    address: { type: String, default: 'Success Point Campus, Knowledge City' },
    academicYear: { type: String, default: '2026-2027' },
    principalName: { type: String, default: 'Dr. Ramesh Sharma' },
    // Director fields
    directorName: { type: String, default: 'Subodh Kumar Sharma' },
    directorDesignation: { type: String, default: 'Director' },
    directorQualifications: { type: String, default: 'M.A. | D.El.Ed | B.Ed | CTET | STET' },
    directorMessage: {
      type: String,
      default:
        'Dedicated to fostering an atmosphere of intellectual curiosity, moral discipline, and comprehensive educational development for every student at Success Point School.',
    },
    directorImage: { type: String, default: '/images/director.jpg' },
    // Website hero & banner
    announcement: {
      type: String,
      default:
        'Welcome to Success Point School — Admissions & Digital E-Learning Hub Session 2026-2027',
    },
    admissionsOpen: { type: Boolean, default: true },
    heroTitle: {
      type: String,
      default: 'Building Knowledge, Character & Academic Brilliance',
    },
    heroSubtitle: {
      type: String,
      default:
        'Welcome to the digital learning campus of Success Point School (S.P.S.). We provide state-of-the-art classroom education, recorded video lectures, continuous evaluation, and dedicated student care.',
    },
  },
  { timestamps: true }
);

const SchoolSetting: Model<ISchoolSettingDocument> =
  mongoose.models.SchoolSetting ||
  mongoose.model<ISchoolSettingDocument>('SchoolSetting', SchoolSettingSchema);

export default SchoolSetting;
