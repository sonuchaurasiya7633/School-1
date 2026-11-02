export type UserRole = 'admin' | 'teacher' | 'student';

export interface IUser {
  _id: string;
  id?: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IClass {
  _id: string;
  name: string; // e.g. "Class 10"
  grade: number; // e.g. 10
  sections: string[]; // e.g. ["A", "B"]
  classTeacher?: {
    _id: string;
    name: string;
    email: string;
  };
  tuitionFee: number;
}

export interface ISubject {
  _id: string;
  name: string;
  code: string;
  classes: string[]; // class IDs
}

export interface IStudentProfile {
  _id: string;
  user: IUser;
  rollNumber: string;
  class: IClass;
  section: string;
  admissionDate: string;
  parentName: string;
  parentPhone: string;
  emergencyContact?: string;
  bloodGroup?: string;
}

export interface ITeacherProfile {
  _id: string;
  user: IUser;
  qualification: string;
  specialization: string;
  joiningDate: string;
  assignedClasses: Array<{
    class: IClass;
    section: string;
    subject: ISubject;
  }>;
}

export interface IAttendanceRecord {
  student: {
    _id: string;
    name: string;
    userId: string;
  };
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  remarks?: string;
}

export interface IAttendance {
  _id: string;
  date: string;
  class: IClass;
  section: string;
  records: IAttendanceRecord[];
  recordedBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export interface IHomeworkSubmission {
  student: {
    _id: string;
    name: string;
    userId: string;
  };
  submissionText?: string;
  fileUrl?: string;
  submittedAt: string;
  status: 'Submitted' | 'Reviewed';
  marks?: number;
  feedback?: string;
}

export interface IHomework {
  _id: string;
  title: string;
  description: string;
  class: IClass;
  section: string;
  subject: ISubject;
  teacher: {
    _id: string;
    name: string;
  };
  dueDate: string;
  submissions: IHomeworkSubmission[];
  createdAt: string;
}

export interface IExamScheduleItem {
  subject: ISubject;
  date: string;
  time: string;
  maxMarks: number;
  passMarks: number;
}

export interface IExam {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  class: IClass;
  isPublished: boolean;
  schedule: IExamScheduleItem[];
  createdAt: string;
}

export interface IMark {
  _id: string;
  exam: IExam;
  class: IClass;
  section: string;
  subject: ISubject;
  student: {
    _id: string;
    name: string;
    userId: string;
    rollNumber?: string;
  };
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks?: string;
  enteredBy: {
    _id: string;
    name: string;
  };
}

export interface IFeePayment {
  amount: number;
  date: string;
  paymentMethod: 'Cash' | 'Cheque' | 'Bank Transfer' | 'Online/UPI';
  receiptNumber: string;
  collectedBy: {
    _id: string;
    name: string;
  };
  remarks?: string;
}

export interface IFee {
  _id: string;
  student: {
    _id: string;
    name: string;
    userId: string;
    rollNumber?: string;
  };
  class: IClass;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  monthOrTerm: string;
  status: 'Paid' | 'Partial' | 'Pending';
  payments: IFeePayment[];
}

export interface ITimetablePeriod {
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: ISubject;
  teacher: {
    _id: string;
    name: string;
  };
  room?: string;
}

export interface ITimetable {
  _id: string;
  class: IClass;
  section: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: ITimetablePeriod[];
}

export interface INotice {
  _id: string;
  title: string;
  content: string;
  targetRole: 'all' | 'teacher' | 'student';
  class?: IClass;
  author: {
    _id: string;
    name: string;
    role: string;
  };
  date: string;
  isPinned: boolean;
  createdAt: string;
}

export interface ISchoolSetting {
  schoolName: string;
  tagline: string;
  code: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  academicYear: string;
  principalName: string;
}
