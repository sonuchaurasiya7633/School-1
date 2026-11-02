// scripts/test-audit.mjs
// Comprehensive Automated Test Suite for SPS School Management System

const BASE_URL = 'http://localhost:3000';

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  details: [],
};

function record(name, passed, detail = '') {
  results.total++;
  if (passed) {
    results.passed++;
    results.details.push({ test: name, status: 'PASS', detail });
    console.log(`[PASS] ${name}`);
  } else {
    results.failed++;
    results.details.push({ test: name, status: 'FAIL', detail });
    console.error(`[FAIL] ${name} -> ${detail}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('STARTING COMPLETE AUTOMATED AUDIT & FUNCTIONAL TESTS');
  console.log('====================================================\n');

  // --- 1. PUBLIC PAGES AUDIT ---
  const publicRoutes = [
    { path: '/', label: 'Home Page' },
    { path: '/about', label: 'About Us Page' },
    { path: '/academics', label: 'Academics Page' },
    { path: '/admissions', label: 'Admissions Page' },
    { path: '/faculty', label: 'Faculty Directory Page' },
    { path: '/gallery', label: 'Campus & Facilities Gallery' },
    { path: '/notices', label: 'Public Notices Board' },
    { path: '/contact', label: 'Contact Us Page' },
    { path: '/login', label: 'Portal Login Page' },
    { path: '/admin/login', label: 'Admin Login Dedicated Route' },
  ];

  console.log('--- PHASE 1: PUBLIC PAGES ACCESSIBILITY ---');
  for (const r of publicRoutes) {
    try {
      const res = await fetch(`${BASE_URL}${r.path}`);
      const text = await res.text();
      const hasContent = text.length > 500 && !text.includes('Internal Server Error');
      record(`Public Route [${r.path}] (${r.label})`, res.status === 200 && hasContent, `Status: ${res.status}, Length: ${text.length}`);
    } catch (e) {
      record(`Public Route [${r.path}] (${r.label})`, false, e.message);
    }
  }

  // --- 2. PUBLIC APIS & DATA INTEGRITY ---
  console.log('\n--- PHASE 2: PUBLIC APIS & ATLAS DB INTEGRITY ---');
  try {
    const res = await fetch(`${BASE_URL}/api/public/settings`);
    const data = await res.json();
    const valid = data.success && data.settings?.schoolName && data.settings?.directorName === 'Subodh Kumar Sharma';
    record('Public Settings API (with Director Subodh Kumar Sharma)', valid, `Director: ${data.settings?.directorName}`);
  } catch (e) {
    record('Public Settings API', false, e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/public/notices`);
    const data = await res.json();
    const list = data.notices || data.data || [];
    const isValid = Boolean(data.success && Array.isArray(list) && list.length > 0);
    record('Public Notices API', isValid, `Total Notices: ${list.length}, success: ${data.success}, error: ${data.message || 'none'}`);
  } catch (e) {
    record('Public Notices API', false, e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/public/faculty`);
    const data = await res.json();
    record('Public Faculty API', data.success && Array.isArray(data.faculty), `Total Faculty: ${data.faculty?.length}`);
  } catch (e) {
    record('Public Faculty API', false, e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/public/stats`);
    const data = await res.json();
    record('Public Stats API', data.success && typeof data.stats?.students === 'number', `Stats: ${JSON.stringify(data.stats)}`);
  } catch (e) {
    record('Public Stats API', false, e.message);
  }

  // Admissions Inquiry Form Submission
  try {
    const inquiryPayload = {
      studentName: 'Audit Test Student',
      parentName: 'Audit Test Parent',
      email: 'test.parent@example.com',
      phone: '9876543210',
      gradeApplying: 'Class 9',
      message: 'Automated functional audit test admission inquiry.',
    };
    const res = await fetch(`${BASE_URL}/api/public/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryPayload),
    });
    const data = await res.json();
    record('Admissions Inquiry Form Submission API', data.success, data.message);
  } catch (e) {
    record('Admissions Inquiry Form Submission API', false, e.message);
  }

  // --- 3. RESULT PRIVACY CHECK ---
  console.log('\n--- PHASE 3: RESULT PRIVACY RESTRICTION CHECK ---');
  try {
    // /check-result should redirect to /login?role=student
    const res = await fetch(`${BASE_URL}/check-result`, { redirect: 'manual' });
    const isRedirect = res.status === 307 || res.status === 308 || res.status === 302 || res.headers.get('location')?.includes('/login');
    record('Result Route Redirection (Hidden from Public)', isRedirect, `Status: ${res.status}, Location: ${res.headers.get('location')}`);
  } catch (e) {
    record('Result Route Redirection', false, e.message);
  }

  try {
    // Unauthenticated call to /api/results/check should be blocked
    const res = await fetch(`${BASE_URL}/api/results/check?rollNumber=101`);
    const data = await res.json();
    record('Result API Blocked for Unauthenticated Users (401)', res.status === 401 && !data.success, data.message);
  } catch (e) {
    record('Result API Blocked for Unauthenticated Users', false, e.message);
  }

  // --- 4. AUTHENTICATION & ROLE-BASED ACCESS CONTROL ---
  console.log('\n--- PHASE 4: AUTHENTICATION & SESSIONS ---');
  let adminToken = '';
  let teacherToken = '';
  let studentToken = '';

  // 4a. Invalid Login Rejection
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'FAKE_USER', password: 'wrongpassword' }),
    });
    const data = await res.json();
    record('Auth: Invalid Credentials Rejection', res.status === 401 && !data.success, data.message);
  } catch (e) {
    record('Auth: Invalid Credentials Rejection', false, e.message);
  }

  // 4b. Admin Login
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'ADM001', password: 'password123' }),
    });
    const data = await res.json();
    adminToken = data.token;
    record('Auth: Admin Login (ADM001)', data.success && data.user?.role === 'admin', `Role: ${data.user?.role}`);
  } catch (e) {
    record('Auth: Admin Login (ADM001)', false, e.message);
  }

  // 4c. Teacher Login
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'TCH001', password: 'password123' }),
    });
    const data = await res.json();
    teacherToken = data.token;
    record('Auth: Teacher Login (TCH001)', data.success && data.user?.role === 'teacher', `Role: ${data.user?.role}`);
  } catch (e) {
    record('Auth: Teacher Login (TCH001)', false, e.message);
  }

  // 4d. Student Login
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'STU001', password: 'password123' }),
    });
    const data = await res.json();
    studentToken = data.token;
    record('Auth: Student Login (STU001)', data.success && data.user?.role === 'student', `Role: ${data.user?.role}`);
  } catch (e) {
    record('Auth: Student Login (STU001)', false, e.message);
  }

  // 4e. Auth verification endpoint /api/auth/me
  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        Cookie: `token=${adminToken}`,
      },
    });
    const data = await res.json();
    record('Auth Session Verification (/api/auth/me)', data.success && data.user?.userId === 'ADM001', `Active User: ${data.user?.name}`);
  } catch (e) {
    record('Auth Session Verification', false, e.message);
  }

  // --- 5. ADMIN WORKFLOWS & DATA ENDPOINTS ---
  console.log('\n--- PHASE 5: ADMIN ENDPOINTS & CRUD ---');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}`, Cookie: `token=${adminToken}` },
    });
    const data = await res.json();
    record('Admin Dashboard Stats API', data.success && typeof data.stats?.totalStudents === 'number', `Students: ${data.stats?.totalStudents}`);
  } catch (e) {
    record('Admin Dashboard Stats API', false, e.message);
  }

  let sampleClassId = '';
  let sampleSubjectId = '';

  try {
    const res = await fetch(`${BASE_URL}/api/admin/classes`, {
      headers: { Authorization: `Bearer ${adminToken}`, Cookie: `token=${adminToken}` },
    });
    const data = await res.json();
    if (data.classes?.[0]?._id) sampleClassId = data.classes[0]._id;
    record('Admin Classes API', data.success && Array.isArray(data.classes), `Classes: ${data.classes?.length}`);
  } catch (e) {
    record('Admin Classes API', false, e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/admin/subjects`, {
      headers: { Authorization: `Bearer ${adminToken}`, Cookie: `token=${adminToken}` },
    });
    const data = await res.json();
    if (data.subjects?.[0]?._id) sampleSubjectId = data.subjects[0]._id;
    record('Admin Subjects API', data.success && Array.isArray(data.subjects), `Subjects: ${data.subjects?.length}`);
  } catch (e) {
    record('Admin Subjects API', false, e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/admin/teachers`, {
      headers: { Authorization: `Bearer ${adminToken}`, Cookie: `token=${adminToken}` },
    });
    const data = await res.json();
    record('Admin Teachers API', data.success && Array.isArray(data.teachers), `Teachers: ${data.teachers?.length}`);
  } catch (e) {
    record('Admin Teachers API', false, e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/admin/students`, {
      headers: { Authorization: `Bearer ${adminToken}`, Cookie: `token=${adminToken}` },
    });
    const data = await res.json();
    record('Admin Students API', data.success && Array.isArray(data.students), `Students: ${data.students?.length}`);
  } catch (e) {
    record('Admin Students API', false, e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/admin/inquiries`, {
      headers: { Authorization: `Bearer ${adminToken}`, Cookie: `token=${adminToken}` },
    });
    const data = await res.json();
    record('Admin Inquiries API', data.success && Array.isArray(data.inquiries), `Inquiries count: ${data.inquiries?.length}`);
  } catch (e) {
    record('Admin Inquiries API', false, e.message);
  }

  // --- 6. TEACHER WORKFLOWS ---
  console.log('\n--- PHASE 6: TEACHER WORKFLOWS ---');
  let createdLectureId = null;
  try {
    const res = await fetch(`${BASE_URL}/api/lectures`, {
      headers: { Authorization: `Bearer ${teacherToken}`, Cookie: `token=${teacherToken}` },
    });
    const data = await res.json();
    record('Teacher Lectures API', data.success && Array.isArray(data.lectures), `Lectures: ${data.lectures?.length}`);
  } catch (e) {
    record('Teacher Lectures API', false, e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/lectures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`,
        Cookie: `token=${teacherToken}`,
      },
      body: JSON.stringify({
        title: 'Audit Test Lecture - Trigonometry Basics',
        description: 'Class 10 introductory lecture with chapter exercises',
        classId: sampleClassId,
        subjectId: sampleSubjectId,
        section: 'A',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        attachmentUrl: 'https://res.cloudinary.com/dqpbo1uho/sample.pdf',
        tags: ['Math', 'Class10'],
      }),
    });
    const data = await res.json();
    if (data.lecture?._id) createdLectureId = data.lecture._id;
    record('Teacher Lecture Upload API', data.success, data.message);
  } catch (e) {
    record('Teacher Lecture Upload API', false, e.message);
  }

  if (createdLectureId) {
    try {
      const res = await fetch(`${BASE_URL}/api/lectures?id=${createdLectureId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${teacherToken}`, Cookie: `token=${teacherToken}` },
      });
      const data = await res.json();
      record('Teacher Lecture Delete API', data.success, data.message);
    } catch (e) {
      record('Teacher Lecture Delete API', false, e.message);
    }
  }

  try {
    const res = await fetch(`${BASE_URL}/api/homework`, {
      headers: { Authorization: `Bearer ${teacherToken}`, Cookie: `token=${teacherToken}` },
    });
    const data = await res.json();
    const list = data.homework || data.homeworks || [];
    record('Teacher Homework API', data.success && Array.isArray(list), `Homeworks: ${list.length}`);
  } catch (e) {
    record('Teacher Homework API', false, e.message);
  }

  // --- 7. STUDENT WORKFLOWS ---
  console.log('\n--- PHASE 7: STUDENT WORKFLOWS ---');
  try {
    const pageRes = await fetch(`${BASE_URL}/student/dashboard`, {
      headers: { Authorization: `Bearer ${studentToken}`, Cookie: `token=${studentToken}` },
    });
    record('Student Dashboard Page Access', pageRes.status === 200, `Status: ${pageRes.status}`);
  } catch (e) {
    record('Student Dashboard Page Access', false, e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/homework`, {
      headers: { Authorization: `Bearer ${studentToken}`, Cookie: `token=${studentToken}` },
    });
    const data = await res.json();
    const list = data.homework || data.homeworks || [];
    record('Student Homework Fetch API', data.success && Array.isArray(list), `Assigned: ${list.length}`);
  } catch (e) {
    record('Student Homework Fetch API', false, e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/attendance`, {
      headers: { Authorization: `Bearer ${studentToken}`, Cookie: `token=${studentToken}` },
    });
    const data = await res.json();
    record('Student Attendance API', data.success, `Summary: ${JSON.stringify(data.summary || {})}`);
  } catch (e) {
    record('Student Attendance API', false, e.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/results/check?rollNumber=101`, {
      headers: { Authorization: `Bearer ${studentToken}`, Cookie: `token=${studentToken}` },
    });
    const data = await res.json();
    record('Authenticated Student Marksheet Access (/api/results/check)', data.success && data.reportCard?.percentage !== undefined, `Percentage: ${data.reportCard?.percentage}%`);
  } catch (e) {
    record('Authenticated Student Marksheet Access', false, e.message);
  }

  // --- 8. CLOUDINARY UPLOAD API ---
  console.log('\n--- PHASE 8: CLOUDINARY UPLOAD API ---');
  try {
    const res = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        folder: 'audit_test',
      }),
    });
    const data = await res.json();
    record('Cloudinary Upload API', data.success && data.secure_url?.startsWith('https://res.cloudinary.com'), data.secure_url);
  } catch (e) {
    record('Cloudinary Upload API', false, e.message);
  }

  // --- SUMMARY REPORT ---
  console.log('\n====================================================');
  console.log(`AUDIT COMPLETE: ${results.passed}/${results.total} TESTS PASSED`);
  console.log(`PASSED: ${results.passed} | FAILED: ${results.failed}`);
  console.log('====================================================');

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
