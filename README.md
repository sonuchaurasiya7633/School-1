# 🎓 Success Point School (S.P.S.) — School Management System

> **"Best Education, Good Results."**  
> A complete, responsive web-based School Management System built strictly according to project specifications for Super Admin, Teachers, and Students.

---

## 📌 1. Project Overview & Architecture

The system provides a **single common login entry point** (`/login`) with server-side Role-Based Access Control (RBAC) and dedicated dashboards and permissions for:
- 👑 **Super Admin**: Complete institution control (users, classes, subjects, fees, exams, notices, timetable, school settings).
- 🧑‍🏫 **Teacher**: Academic work for assigned classes/subjects (attendance roll-call, homework assignments & grading, marks entry, teaching schedules).
- 🎒 **Student**: Personal academic records (attendance percentage, homework solution submission, printable report cards, fee receipts, timetables).

---

## 🔑 2. Quick Demo Credentials

| Role | User ID / Email | Password | Direct Portal Route |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@school.com` *(or `ADM001`)* | `password123` | [`/admin/dashboard`](/admin/dashboard) |
| **Teacher** | `teacher@school.com` *(or `TCH001`)* | `password123` | [`/teacher/dashboard`](/teacher/dashboard) |
| **Student** | `student@school.com` *(or `STD001`)* | `password123` | [`/student/dashboard`](/student/dashboard) |

*The login page also provides 1-click preset buttons to instantly fill credentials for all 3 roles.*

---

## 🛠️ 3. Technology Stack

- **Frontend**: Next.js 14 App Router (React 18) with TypeScript
- **Styling**: Tailwind CSS + Lucide Icons + Responsive drawer & layouts
- **Charts**: Recharts (Attendance pie chart, Fees collection horizontal bar chart)
- **Backend**: Next.js App Router REST API endpoints
- **Database**: MongoDB with Mongoose (with seamless embedded fallback if local MongoDB service is not started)
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies and Authorization Bearer header support
- **Authorization**: Strict Server-Side RBAC
- **API Documentation**: OpenAPI / Swagger 3.0 specification interactive viewer (`/docs` & `/api/docs`)
- **Print Utilities**: One-click printable **Official Fee Receipts** and **Term Examination Mark Sheets / Report Cards** with school branding.

---

## 🚀 4. How to Run

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 3: Production Build & Start
```bash
npm run build
npm run start
```

---

## 📋 5. Implemented Features Directory

### 👑 Super Admin Features
1. **Dashboard** ([`/admin/dashboard`](/admin/dashboard)): Total counts for students, faculty, and classes; today's attendance summary and rate; fees collected vs. pending dues; latest notices; recent fee collections.
2. **Student Management** ([`/admin/students`](/admin/students)): Enroll new students, edit profiles, toggle active/inactive status, remove records, search by name/roll, and filter by class & section.
3. **Teacher Management** ([`/admin/teachers`](/admin/teachers)): Register faculty, assign classes and subjects, edit specializations and contact numbers.
4. **Class & Subject Management** ([`/admin/classes`](/admin/classes)): Create classes, grade standards, sections, monthly tuition fees, assign class teachers, and configure subjects.
5. **Attendance Management** ([`/admin/attendance`](/admin/attendance)): Date-wise and class-wise roll call registers; instant status updating (Present / Absent / Late); manual corrections.
6. **Fees Management** ([`/admin/fees`](/admin/fees)): Class-wise tuition fee ledgers, record offline/manual payments (Cash, Cheque, Bank Transfer, UPI), and print official vouchers.
7. **Exam & Result Management** ([`/admin/exams`](/admin/exams)): Schedule examination terms, publish/unpublish results, review marks entered by teachers, and print report cards.
8. **Timetable Management** ([`/admin/timetable`](/admin/timetable)): Create and edit class schedules with period numbers, timings, subjects, faculty, and room numbers.
9. **Notice Management** ([`/admin/notices`](/admin/notices)): Publish announcements targeting all users, teachers, or students; pin critical circulars.
10. **School Settings** ([`/admin/settings`](/admin/settings)): Configure school name, logo (`/images/logo.jpeg`), tagline ("Best Education, Good Results."), contact info, principal name, password change, and demo reseed.

### 🧑‍🏫 Teacher Features
1. **Dashboard** ([`/teacher/dashboard`](/teacher/dashboard)): Assigned classes and subjects, quick access to attendance, pending homework submissions, and faculty notices.
2. **Student Access** ([`/teacher/students`](/teacher/students)): Search and inspect students in assigned classrooms with guardian details.
3. **Attendance Register** ([`/teacher/attendance`](/teacher/attendance)): Daily roll call for assigned class sections with instant submission.
4. **Homework Hub** ([`/teacher/homework`](/teacher/homework)): Create homework tasks with due dates, inspect student written answers/attachments, and grade with marks and feedback.
5. **Exams & Marks** ([`/teacher/marks`](/teacher/marks)): Enter marks for students in assigned subjects; automatic grade calculation (`A+`, `A`, `B`, `C`, `Pass`, `Fail`).
6. **My Timetable** ([`/teacher/timetable`](/teacher/timetable)): View daily teaching timetable, periods, and room assignments.
7. **Notices** ([`/teacher/notices`](/teacher/notices)): View staff circulars and broadcast class notices to assigned classes.
8. **Profile** ([`/teacher/profile`](/teacher/profile)): View credentials, qualifications, allocations, and change password.

### 🎒 Student Features
1. **Dashboard** ([`/student/dashboard`](/student/dashboard)): Roll number, class & section, attendance percentage, pending homework counter, latest notices, and recent results summary.
2. **My Profile** ([`/student/profile`](/student/profile)): Academic profile, guardian details, blood group, and change password.
3. **Attendance** ([`/student/attendance`](/student/attendance)): Full attendance history log, present/absent/late counts, and cumulative attendance percentage.
4. **Homework** ([`/student/homework`](/student/homework)): Subject-wise assignments, due dates, submit text/link solutions, and review teacher grading and feedback.
5. **Exams & Results** ([`/student/results`](/student/results)): Subject marks breakdown, grades, total percentage, and **Print Official Report Card**.
6. **Fees & Invoices** ([`/student/fees`](/student/fees)): Total fees, paid amount, pending balance, payment history, and **Print Official Fee Receipt Voucher**.
7. **Class Timetable** ([`/student/timetable`](/student/timetable)): Day-wise classroom period schedules and teacher details.

---

## 📖 6. Swagger / OpenAPI Documentation

Explore the complete API endpoints specification at:
- **Interactive UI**: [`/docs`](http://localhost:3000/docs)
- **JSON Specification**: [`/api/docs`](http://localhost:3000/api/docs)

---

## 🛡️ 7. Database & Auto-Seeding

The system connects to `MONGODB_URI` specified in `.env`. If no local MongoDB server is active, it seamlessly spins up an in-memory database with preloaded realistic Success Point School data so you can immediately explore and test all features without setup friction.
