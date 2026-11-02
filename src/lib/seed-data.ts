import { hashPassword } from './auth';
import User from '@/models/User';
import SchoolClass from '@/models/SchoolClass';
import Subject from '@/models/Subject';
import StudentProfile from '@/models/StudentProfile';
import TeacherProfile from '@/models/TeacherProfile';
import Attendance from '@/models/Attendance';
import Homework from '@/models/Homework';
import Exam from '@/models/Exam';
import Mark from '@/models/Mark';
import Fee from '@/models/Fee';
import Timetable from '@/models/Timetable';
import Notice from '@/models/Notice';
import SchoolSetting from '@/models/SchoolSetting';

export async function seedDatabase(force: boolean = false) {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0 && !force) {
    return { success: true, message: 'Database already has records.' };
  }

  console.log('Seeding Success Point School data...');

  // Clear existing
  await Promise.all([
    User.deleteMany({}),
    SchoolClass.deleteMany({}),
    Subject.deleteMany({}),
    StudentProfile.deleteMany({}),
    TeacherProfile.deleteMany({}),
    Attendance.deleteMany({}),
    Homework.deleteMany({}),
    Exam.deleteMany({}),
    Mark.deleteMany({}),
    Fee.deleteMany({}),
    Timetable.deleteMany({}),
    Notice.deleteMany({}),
    SchoolSetting.deleteMany({}),
  ]);

  const defaultPassword = await hashPassword('password123');

  // 1. School Settings
  await SchoolSetting.create({
    schoolName: 'Success Point School',
    tagline: 'Best Education, Good Results.',
    code: 'SPS',
    logo: '/images/logo.jpeg',
    email: 'contact@successpointschool.edu',
    phone: '+91 98765 43210',
    address: 'Sector 14, Education Zone, SPS Campus',
    academicYear: '2026-2027',
    principalName: 'Dr. A. K. Sharma',
  });

  // 2. Users (Admin, Teachers, Students)
  const admin = await User.create({
    userId: 'ADM001',
    name: 'Suresh Kumar (Admin)',
    email: 'admin@school.com',
    password: defaultPassword,
    role: 'admin',
    phone: '+91 98111 22334',
    address: 'School Administrative Wing, SPS',
    gender: 'Male',
    dateOfBirth: '1982-05-14',
    isActive: true,
  });

  const teacher1 = await User.create({
    userId: 'TCH001',
    name: 'Mrs. Sunita Sharma',
    email: 'teacher@school.com',
    password: defaultPassword,
    role: 'teacher',
    phone: '+91 98222 33445',
    address: 'Green Park Avenue, City',
    gender: 'Female',
    dateOfBirth: '1988-08-20',
    isActive: true,
  });

  const teacher2 = await User.create({
    userId: 'TCH002',
    name: 'Mr. Vikram Singh',
    email: 'teacher2@school.com',
    password: defaultPassword,
    role: 'teacher',
    phone: '+91 98333 44556',
    address: 'Civil Lines, City',
    gender: 'Male',
    dateOfBirth: '1985-02-11',
    isActive: true,
  });

  const student1 = await User.create({
    userId: 'STD001',
    name: 'Rahul Verma',
    email: 'student@school.com',
    password: defaultPassword,
    role: 'student',
    phone: '+91 98444 55667',
    address: 'Model Town, House 42',
    gender: 'Male',
    dateOfBirth: '2010-04-15',
    isActive: true,
  });

  const student2 = await User.create({
    userId: 'STD002',
    name: 'Priya Patel',
    email: 'student2@school.com',
    password: defaultPassword,
    role: 'student',
    phone: '+91 98555 66778',
    address: 'Shanti Nagar, Flat 204',
    gender: 'Female',
    dateOfBirth: '2010-09-22',
    isActive: true,
  });

  const student3 = await User.create({
    userId: 'STD003',
    name: 'Amit Roy',
    email: 'student3@school.com',
    password: defaultPassword,
    role: 'student',
    phone: '+91 98666 77889',
    address: 'Lake View Residency, 12B',
    gender: 'Male',
    dateOfBirth: '2010-11-05',
    isActive: true,
  });

  // 3. Classes
  const class10 = await SchoolClass.create({
    name: 'Class 10',
    grade: 10,
    sections: ['A', 'B'],
    classTeacher: teacher1._id,
    tuitionFee: 3200,
  });

  const class9 = await SchoolClass.create({
    name: 'Class 9',
    grade: 9,
    sections: ['A', 'B'],
    classTeacher: teacher2._id,
    tuitionFee: 2800,
  });

  const class8 = await SchoolClass.create({
    name: 'Class 8',
    grade: 8,
    sections: ['A'],
    tuitionFee: 2500,
  });

  // 4. Subjects
  const subMath = await Subject.create({
    name: 'Mathematics',
    code: 'MATH101',
    classes: [class10._id, class9._id, class8._id],
  });

  const subScience = await Subject.create({
    name: 'Science & Technology',
    code: 'SCI101',
    classes: [class10._id, class9._id],
  });

  const subEnglish = await Subject.create({
    name: 'English Language',
    code: 'ENG101',
    classes: [class10._id, class9._id, class8._id],
  });

  const subSocial = await Subject.create({
    name: 'Social Studies',
    code: 'SOC101',
    classes: [class10._id, class9._id],
  });

  const subCS = await Subject.create({
    name: 'Computer Applications',
    code: 'CS101',
    classes: [class10._id, class9._id],
  });

  // 5. Teacher Profiles
  await TeacherProfile.create({
    user: teacher1._id,
    qualification: 'M.Sc. Mathematics, B.Ed',
    specialization: 'Advanced Mathematics & Statistics',
    joiningDate: '2021-06-15',
    assignedClasses: [
      { class: class10._id, section: 'A', subject: subMath._id },
      { class: class9._id, section: 'A', subject: subMath._id },
      { class: class10._id, section: 'B', subject: subMath._id },
    ],
  });

  await TeacherProfile.create({
    user: teacher2._id,
    qualification: 'M.Sc. Physics, B.Ed',
    specialization: 'Physical Sciences & Robotics',
    joiningDate: '2022-04-10',
    assignedClasses: [
      { class: class10._id, section: 'A', subject: subScience._id },
      { class: class9._id, section: 'A', subject: subScience._id },
      { class: class10._id, section: 'A', subject: subCS._id },
    ],
  });

  // 6. Student Profiles
  await StudentProfile.create({
    user: student1._id,
    rollNumber: '101',
    class: class10._id,
    section: 'A',
    admissionDate: '2023-04-01',
    parentName: 'Ramesh Verma',
    parentPhone: '+91 98444 55660',
    bloodGroup: 'O+',
  });

  await StudentProfile.create({
    user: student2._id,
    rollNumber: '102',
    class: class10._id,
    section: 'A',
    admissionDate: '2023-04-01',
    parentName: 'Deepak Patel',
    parentPhone: '+91 98555 66770',
    bloodGroup: 'B+',
  });

  await StudentProfile.create({
    user: student3._id,
    rollNumber: '103',
    class: class10._id,
    section: 'A',
    admissionDate: '2023-04-05',
    parentName: 'Subir Roy',
    parentPhone: '+91 98666 77880',
    bloodGroup: 'A+',
  });

  // 7. Attendance (Today and yesterday)
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  await Attendance.create({
    date: today,
    class: class10._id,
    section: 'A',
    recordedBy: teacher1._id,
    records: [
      { student: student1._id, status: 'Present', remarks: 'On time' },
      { student: student2._id, status: 'Present', remarks: 'On time' },
      { student: student3._id, status: 'Absent', remarks: 'Medical leave' },
    ],
  });

  await Attendance.create({
    date: yesterday,
    class: class10._id,
    section: 'A',
    recordedBy: teacher1._id,
    records: [
      { student: student1._id, status: 'Present', remarks: 'On time' },
      { student: student2._id, status: 'Late', remarks: 'Bus delay' },
      { student: student3._id, status: 'Present', remarks: 'On time' },
    ],
  });

  // 8. Homework
  await Homework.create({
    title: 'Quadratic Equations Exercise 4.2',
    description: 'Solve questions 1 through 10 from NCERT Chapter 4 and upload your handwritten solutions.',
    class: class10._id,
    section: 'A',
    subject: subMath._id,
    teacher: teacher1._id,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    submissions: [
      {
        student: student1._id,
        submissionText: 'Completed questions 1-10 on notebook. Verified solutions for quadratic formulas.',
        submittedAt: new Date(),
        status: 'Submitted',
      },
    ],
  });

  await Homework.create({
    title: 'Light Reflection and Refraction Ray Diagrams',
    description: 'Draw concave and convex mirror ray diagrams in the science lab notebook with neat labeling.',
    class: class10._id,
    section: 'A',
    subject: subScience._id,
    teacher: teacher2._id,
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    submissions: [],
  });

  // 9. Exams & Marks
  const exam = await Exam.create({
    name: 'Mid-Term Examination 2026',
    startDate: '2026-11-10',
    endDate: '2026-11-20',
    class: class10._id,
    isPublished: true,
    schedule: [
      { subject: subMath._id, date: '2026-11-10', time: '09:00 AM - 12:00 PM', maxMarks: 100, passMarks: 35 },
      { subject: subScience._id, date: '2026-11-12', time: '09:00 AM - 12:00 PM', maxMarks: 100, passMarks: 35 },
      { subject: subEnglish._id, date: '2026-11-15', time: '09:00 AM - 12:00 PM', maxMarks: 100, passMarks: 35 },
      { subject: subSocial._id, date: '2026-11-17', time: '09:00 AM - 12:00 PM', maxMarks: 100, passMarks: 35 },
      { subject: subCS._id, date: '2026-11-19', time: '09:00 AM - 12:00 PM', maxMarks: 100, passMarks: 35 },
    ],
  });

  // Marks for Rahul Verma
  await Mark.create({
    exam: exam._id,
    class: class10._id,
    section: 'A',
    subject: subMath._id,
    student: student1._id,
    marksObtained: 92,
    maxMarks: 100,
    grade: 'A+',
    remarks: 'Outstanding conceptual clarity',
    enteredBy: teacher1._id,
  });

  await Mark.create({
    exam: exam._id,
    class: class10._id,
    section: 'A',
    subject: subScience._id,
    student: student1._id,
    marksObtained: 88,
    maxMarks: 100,
    grade: 'A',
    remarks: 'Very good in physics & chemistry',
    enteredBy: teacher2._id,
  });

  await Mark.create({
    exam: exam._id,
    class: class10._id,
    section: 'A',
    subject: subEnglish._id,
    student: student1._id,
    marksObtained: 85,
    maxMarks: 100,
    grade: 'A',
    remarks: 'Good grammar and expression',
    enteredBy: teacher1._id,
  });

  // Marks for Priya Patel
  await Mark.create({
    exam: exam._id,
    class: class10._id,
    section: 'A',
    subject: subMath._id,
    student: student2._id,
    marksObtained: 95,
    maxMarks: 100,
    grade: 'A+',
    remarks: 'Topper in mathematics',
    enteredBy: teacher1._id,
  });

  // 10. Fees Management
  await Fee.create({
    student: student1._id,
    class: class10._id,
    totalAmount: 16000,
    paidAmount: 11000,
    dueAmount: 5000,
    monthOrTerm: 'Term 1 (April - Sep 2026)',
    status: 'Partial',
    payments: [
      {
        amount: 8000,
        date: '2026-04-10',
        paymentMethod: 'Bank Transfer',
        receiptNumber: 'REC-2026-001',
        collectedBy: admin._id,
        remarks: 'First installment received',
      },
      {
        amount: 3000,
        date: '2026-07-05',
        paymentMethod: 'Cash',
        receiptNumber: 'REC-2026-045',
        collectedBy: admin._id,
        remarks: 'Second installment',
      },
    ],
  });

  await Fee.create({
    student: student2._id,
    class: class10._id,
    totalAmount: 16000,
    paidAmount: 16000,
    dueAmount: 0,
    monthOrTerm: 'Term 1 (April - Sep 2026)',
    status: 'Paid',
    payments: [
      {
        amount: 16000,
        date: '2026-04-05',
        paymentMethod: 'Online/UPI',
        receiptNumber: 'REC-2026-003',
        collectedBy: admin._id,
        remarks: 'Full term fee paid in single payment',
      },
    ],
  });

  await Fee.create({
    student: student3._id,
    class: class10._id,
    totalAmount: 16000,
    paidAmount: 0,
    dueAmount: 16000,
    monthOrTerm: 'Term 1 (April - Sep 2026)',
    status: 'Pending',
    payments: [],
  });

  // 11. Timetable for Class 10 - Section A
  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  for (const day of days) {
    await Timetable.create({
      class: class10._id,
      section: 'A',
      day,
      periods: [
        {
          periodNumber: 1,
          startTime: '08:30 AM',
          endTime: '09:15 AM',
          subject: subMath._id,
          teacher: teacher1._id,
          room: 'Room 201',
        },
        {
          periodNumber: 2,
          startTime: '09:15 AM',
          endTime: '10:00 AM',
          subject: subScience._id,
          teacher: teacher2._id,
          room: 'Physics Lab',
        },
        {
          periodNumber: 3,
          startTime: '10:00 AM',
          endTime: '10:45 AM',
          subject: subEnglish._id,
          teacher: teacher1._id,
          room: 'Room 201',
        },
        {
          periodNumber: 4,
          startTime: '11:00 AM',
          endTime: '11:45 AM',
          subject: subCS._id,
          teacher: teacher2._id,
          room: 'Computer Lab 1',
        },
        {
          periodNumber: 5,
          startTime: '11:45 AM',
          endTime: '12:30 PM',
          subject: subSocial._id,
          teacher: teacher1._id,
          room: 'Room 201',
        },
      ],
    });
  }

  // 12. Notices
  await Notice.create({
    title: 'Success Point School Annual Athletic Meet 2026',
    content:
      'The Annual Sports & Athletic Meet will be held on November 25-26. Interested students must submit their event entries to the Physical Education department by Nov 5th.',
    targetRole: 'all',
    author: admin._id,
    date: today,
    isPinned: true,
  });

  await Notice.create({
    title: 'Quarterly Faculty Review & Curriculum Planning',
    content:
      'All teachers are requested to attend the quarterly review session in the Conference Hall on Friday at 3:30 PM. Please bring the updated syllabus progress reports.',
    targetRole: 'teacher',
    author: admin._id,
    date: today,
    isPinned: false,
  });

  await Notice.create({
    title: 'Science Exhibition: Innovations 2026',
    content:
      'Class 9 & 10 students are invited to present working models for the Inter-School Science Fair. Group registrations are open in the science lab.',
    targetRole: 'student',
    class: class10._id,
    author: teacher2._id,
    date: yesterday,
    isPinned: true,
  });

  console.log('Database seeded successfully with rich initial data!');
  return { success: true, message: 'Database initialized successfully!' };
}
