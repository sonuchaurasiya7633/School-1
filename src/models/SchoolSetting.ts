import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  IFooterSettings,
  IFooterLink,
  IFooterPortal,
  DEFAULT_FOOTER_SETTINGS,
} from '@/types/footer';

export type { IFooterSettings, IFooterLink, IFooterPortal };
export { DEFAULT_FOOTER_SETTINGS };

export interface ISchoolSettingDocument extends Document {
  schoolName: string;
  tagline: string;
  code: string;
  logo: string;
  email: string;
  phone: string;
  phoneAlt?: string;
  address: string;
  academicYear: string;
  principalName: string;

  // Director details
  directorName: string;
  directorDesignation: string;
  directorQualifications: string;
  directorMessage: string;
  directorImage: string;

  // Home Page - Hero
  announcement: string;
  admissionsOpen: boolean;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta1Text: string;
  heroCta1Link: string;
  heroCta2Text: string;
  heroCta2Link: string;

  // Home Page - Stats Ribbon
  statsStudents: string;
  statsStudentsSub: string;
  statsFaculty: string;
  statsFacultySub: string;
  statsSmartClasses: string;
  statsSmartClassesSub: string;
  statsDistinction: string;
  statsDistinctionSub: string;

  // Home Page - About Spotlight
  aboutHomeBadge: string;
  aboutHomeTitle: string;
  aboutHomeDesc: string;
  aboutHomeFeature1: string;
  aboutHomeFeature2: string;
  aboutHomeFeature3: string;
  aboutHomeFeature4: string;

  // Home Page - Admissions Callout
  admissionsBannerBadge: string;
  admissionsBannerTitle: string;
  admissionsBannerDesc: string;

  // About Page (/about)
  aboutPageBadge: string;
  aboutPageTitle: string;
  aboutPageSubtitle: string;
  aboutVisionTitle: string;
  aboutVisionDesc: string;
  aboutMissionTitle: string;
  aboutMissionDesc: string;
  aboutPhilosophy: string;

  // Academics Page (/academics)
  academicsPageTitle: string;
  academicsPageSubtitle: string;
  academicsScienceDesc: string;
  academicsCommerceDesc: string;
  academicsArtsDesc: string;

  // Admissions Page (/admissions)
  admissionsPageTitle: string;
  admissionsPageSubtitle: string;
  admissionsProcessStep1Title: string;
  admissionsProcessStep1Desc: string;
  admissionsProcessStep2Title: string;
  admissionsProcessStep2Desc: string;
  admissionsProcessStep3Title: string;
  admissionsProcessStep3Desc: string;
  admissionsProcessStep4Title: string;
  admissionsProcessStep4Desc: string;
  admissionsRequiredDocsText: string;

  // Gallery & Campus Page (/gallery)
  galleryPageTitle: string;
  galleryPageSubtitle: string;

  // Contact Page (/contact)
  contactPageTitle: string;
  contactPageSubtitle: string;
  contactOfficeHours: string;
  contactMapEmbedUrl?: string;

  // Testimonials Array
  testimonials?: Array<{
    name: string;
    relation: string;
    text: string;
    rating: number;
  }>;

  // Footer CMS Settings
  footer?: IFooterSettings;
}

const SchoolSettingSchema = new Schema<ISchoolSettingDocument>(
  {
    schoolName: { type: String, default: 'Success Point School' },
    tagline: { type: String, default: 'Best Education, Good Results.' },
    code: { type: String, default: 'SPS' },
    logo: { type: String, default: '/images/logo.jpeg' },
    email: { type: String, default: 'contact@successpointschool.edu' },
    phone: { type: String, default: '+91 8051217686' },
    phoneAlt: { type: String, default: '+91 98765 43210' },
    address: { type: String, default: 'Success Point Campus, Knowledge Zone, City Central, Pin - 800001' },
    academicYear: { type: String, default: '2026-2027' },
    principalName: { type: String, default: 'Dr. Ramesh Sharma' },

    // Director
    directorName: { type: String, default: 'Subodh Kumar Sharma' },
    directorDesignation: { type: String, default: 'Director' },
    directorQualifications: { type: String, default: 'M.A. | D.El.Ed | B.Ed | CTET | STET' },
    directorMessage: {
      type: String,
      default:
        'Dedicated to fostering an atmosphere of intellectual curiosity, moral discipline, and comprehensive educational development for every student at Success Point School.',
    },
    directorImage: { type: String, default: '/images/director.jpg' },

    // Hero Section
    announcement: {
      type: String,
      default: 'Admissions Open for Academic Session 2026-2027 • Apply Online Today',
    },
    admissionsOpen: { type: Boolean, default: true },
    heroBadge: { type: String, default: 'Success Point School • Empowering Future Leaders' },
    heroTitle: { type: String, default: 'Building Knowledge, Character & Academic Brilliance' },
    heroSubtitle: {
      type: String,
      default:
        'Welcome to the digital learning campus of Success Point School (S.P.S.). We provide state-of-the-art classroom education, recorded video lectures, continuous evaluation, and dedicated student care.',
    },
    heroCta1Text: { type: String, default: 'Apply for Admission 2026-27' },
    heroCta1Link: { type: String, default: '/admissions' },
    heroCta2Text: { type: String, default: 'Explore Programs & Streams' },
    heroCta2Link: { type: String, default: '/academics' },

    // Stats Ribbon
    statsStudents: { type: String, default: '1,400+' },
    statsStudentsSub: { type: String, default: 'Nursery to Class 12th' },
    statsFaculty: { type: String, default: '35+' },
    statsFacultySub: { type: String, default: 'B.Ed / D.El.Ed Certified' },
    statsSmartClasses: { type: String, default: '100%' },
    statsSmartClassesSub: { type: String, default: 'Audio/Video Enabled' },
    statsDistinction: { type: String, default: '99.4%' },
    statsDistinctionSub: { type: String, default: 'Consistent Top Ranks' },

    // Home - About Spotlight
    aboutHomeBadge: { type: String, default: 'About Our Institution' },
    aboutHomeTitle: {
      type: String,
      default: 'Empowering Students with Knowledge, Ethics & Modern Skills',
    },
    aboutHomeDesc: {
      type: String,
      default:
        'At Success Point School, education transcends routine textbooks. We blend rigorous academic instruction with interactive smart classroom technologies, moral values, debate, sports, and science exhibitions.',
    },
    aboutHomeFeature1: { type: String, default: 'Activity-Based Kindergarten' },
    aboutHomeFeature2: { type: String, default: 'Digital Video Lecture Portal' },
    aboutHomeFeature3: { type: String, default: 'Science, Arts & Commerce Streams' },
    aboutHomeFeature4: { type: String, default: 'CCTV Safe & Secure Campus' },

    // Home - Admissions Callout
    admissionsBannerBadge: { type: String, default: 'Enrollment Open 2026-2027' },
    admissionsBannerTitle: {
      type: String,
      default: 'Give Your Child the Advantage of Quality Education',
    },
    admissionsBannerDesc: {
      type: String,
      default:
        'Admissions are now open for Nursery through Class 11th. Seats are allotted on a first-come, first-served basis following our interaction assessment.',
    },

    // About Page (/about)
    aboutPageBadge: { type: String, default: 'Success Point School • Established with Purpose' },
    aboutPageTitle: {
      type: String,
      default: 'Nurturing Minds, Inspiring Character & Shaping Future Leaders',
    },
    aboutPageSubtitle: {
      type: String,
      default:
        'Founded on the ideals of quality education and inclusive growth, Success Point School provides students from Nursery to Senior Secondary with an empowering environment to excel academically and ethically.',
    },
    aboutVisionTitle: { type: String, default: 'Our Vision' },
    aboutVisionDesc: {
      type: String,
      default:
        'To be an exemplary center of academic brilliance, nurturing disciplined, innovative, and ethically grounded global citizens equipped to overcome challenges of the modern world.',
    },
    aboutMissionTitle: { type: String, default: 'Our Mission' },
    aboutMissionDesc: {
      type: String,
      default:
        'To provide a holistic education combining high academic rigor, physical well-being, scientific temper, moral clarity, and cultural pride through dedicated educators and modern learning tools.',
    },
    aboutPhilosophy: {
      type: String,
      default:
        'We believe that every child possesses unique potential. Our child-centric pedagogical approach fosters curiosity, emotional resilience, collaborative leadership, and independent thinking in a joyful and safe environment.',
    },

    // Academics Page (/academics)
    academicsPageTitle: {
      type: String,
      default: 'Structured Academic Pathways from Nursery to Senior Secondary',
    },
    academicsPageSubtitle: {
      type: String,
      default:
        'A comprehensive curriculum designed to blend deep conceptual learning, laboratory experimentation, competitive examination mastery, and digital revision lectures.',
    },
    academicsScienceDesc: {
      type: String,
      default:
        'Rigorous scientific pedagogy with state-of-the-art laboratory practicals. Prepares students for Engineering, Medicine, Research, and Technical fields.',
    },
    academicsCommerceDesc: {
      type: String,
      default:
        'Comprehensive financial, managerial, and economic acumen. Ideal for Chartered Accountancy (CA), Management (BBA/MBA), Banking, and Entrepreneurship.',
    },
    academicsArtsDesc: {
      type: String,
      default:
        'Deep understanding of societal structures, governance, global affairs, and literature. Ideal for Civil Services (UPSC), Law, Journalism, and Academia.',
    },

    // Admissions Page (/admissions)
    admissionsPageTitle: {
      type: String,
      default: 'Begin Your Child’s Transformative Educational Journey',
    },
    admissionsPageSubtitle: {
      type: String,
      default:
        'Admissions Open for Session 2026-2027 from Nursery to Class 11th. We invite parents and guardians to partner with us for exceptional student care.',
    },
    admissionsProcessStep1Title: { type: String, default: 'Submit Inquiry / Registration' },
    admissionsProcessStep1Desc: {
      type: String,
      default:
        'Fill out the online admission registration form on this page or visit the school admission cell in person.',
    },
    admissionsProcessStep2Title: { type: String, default: 'Interaction & Assessment' },
    admissionsProcessStep2Desc: {
      type: String,
      default:
        'A friendly, age-appropriate interactive dialogue or basic diagnostic assessment to understand the child’s learning readiness.',
    },
    admissionsProcessStep3Title: { type: String, default: 'Document Verification' },
    admissionsProcessStep3Desc: {
      type: String,
      default:
        'Verification of birth certificate, previous school records, transfer certificate (TC), and parent identification.',
    },
    admissionsProcessStep4Title: { type: String, default: 'Confirmation & Welcome Kit' },
    admissionsProcessStep4Desc: {
      type: String,
      default:
        'Fee clearance, generation of student enrollment number, uniform sizing, and issuance of student portal access credentials.',
    },
    admissionsRequiredDocsText: {
      type: String,
      default:
        '• Original Transfer Certificate (T.C.) from previous recognized school\n• Self-attested copy of Birth Certificate (Municipal/Gram Panchayat)\n• Previous Academic Year Report Card / Marksheet\n• 4 recent passport size photographs of the student\n• Photocopy of Parent Aadhaar Card / ID Proof',
    },

    // Gallery Page (/gallery)
    galleryPageTitle: {
      type: String,
      default: 'Explore Our Modern Campus, Smart Labs & Infrastructure',
    },
    galleryPageSubtitle: {
      type: String,
      default:
        'Step inside our world-class educational ecosystem designed for creative exploration, scientific experimentation, sports excellence, and safe student living.',
    },

    // Contact Page (/contact)
    contactPageTitle: {
      type: String,
      default: 'Connect With Our School Administration & Admissions Desk',
    },
    contactPageSubtitle: {
      type: String,
      default:
        'Have questions regarding admissions, transport facilities, or curriculum? Reach out via phone, email, or send us a direct message below.',
    },
    contactOfficeHours: {
      type: String,
      default: 'Office Hours: 08:00 AM - 02:30 PM (Monday to Saturday)',
    },
    contactMapEmbedUrl: { type: String, default: '' },

    // Testimonials
    testimonials: {
      type: [
        {
          name: { type: String, default: '' },
          relation: { type: String, default: '' },
          text: { type: String, default: '' },
          rating: { type: Number, default: 5 },
        },
      ],
      default: [
        {
          name: 'Rameshwar Roy',
          relation: 'Parent of Class 8th Student',
          text: 'The dedicated faculty and recorded video lecture portal have transformed my child’s learning discipline. The teachers explain tough concepts with immense patience.',
          rating: 5,
        },
        {
          name: 'Pooja Srivastava',
          relation: 'Parent of Class 4th Student',
          text: 'Success Point School balances moral character with academic rigor. The smart classroom visual lessons have made Mathematics and Science truly fun for my daughter.',
          rating: 5,
        },
        {
          name: 'Anand Jha',
          relation: 'Parent of Class 10th Student',
          text: 'Outstanding board exam guidance and personal mentoring by the teachers. The continuous diagnostic evaluations helped my son top his district board exams.',
          rating: 5,
        },
      ],
    },

    // Footer Settings
    footer: {
      type: Schema.Types.Mixed,
      default: () => DEFAULT_FOOTER_SETTINGS,
    },
  },
  { timestamps: true, strict: false }
);

const SchoolSetting: Model<ISchoolSettingDocument> =
  (mongoose.models && mongoose.models.SchoolSetting) ||
  mongoose.model<ISchoolSettingDocument>('SchoolSetting', SchoolSettingSchema);

export default SchoolSetting;
