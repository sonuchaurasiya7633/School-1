import { NextResponse } from 'next/server';

export async function GET() {
  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Success Point School Management System API',
      version: '1.0.0',
      description:
        'RESTful API specification for Success Point School (S.P.S.) supporting Super Admin, Teacher, and Student roles with JWT RBAC authentication.',
      contact: {
        name: 'Success Point School Administration',
        email: 'contact@successpointschool.edu',
      },
    },
    servers: [
      {
        url: '/',
        description: 'Current Environment Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {
      '/api/auth/login': {
        post: {
          summary: 'User Login',
          description: 'Authenticate with User ID or Email and password. Returns JWT token and sets HTTP-only cookie.',
          tags: ['Authentication'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    identifier: { type: 'string', example: 'admin@school.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/auth/me': {
        get: {
          summary: 'Get Current Authenticated User',
          security: [{ bearerAuth: [] }],
          tags: ['Authentication'],
          responses: {
            200: { description: 'Authenticated user profile' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/admin/stats': {
        get: {
          summary: 'Get Super Admin Dashboard Statistics',
          tags: ['Super Admin'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Aggregated totals, attendance rate, fees summary' },
          },
        },
      },
      '/api/admin/students': {
        get: {
          summary: 'List and Search Students',
          tags: ['Students'],
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'classId', in: 'query', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'List of students' } },
        },
        post: {
          summary: 'Create New Student',
          tags: ['Students'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Student created' } },
        },
      },
      '/api/admin/teachers': {
        get: {
          summary: 'List Teachers',
          tags: ['Teachers'],
          responses: { 200: { description: 'List of teachers' } },
        },
        post: {
          summary: 'Create New Teacher',
          tags: ['Teachers'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Teacher created' } },
        },
      },
      '/api/admin/classes': {
        get: { summary: 'List Classes', tags: ['Classes'] },
        post: { summary: 'Create Class', tags: ['Classes'] },
      },
      '/api/attendance': {
        get: { summary: 'Get Attendance', tags: ['Attendance'] },
        post: { summary: 'Mark Attendance', tags: ['Attendance'] },
      },
      '/api/homework': {
        get: { summary: 'Get Homework', tags: ['Homework'] },
        post: { summary: 'Create or Submit Homework', tags: ['Homework'] },
      },
      '/api/exams': {
        get: { summary: 'Get Exams', tags: ['Exams'] },
        post: { summary: 'Create Exam', tags: ['Exams'] },
      },
      '/api/marks': {
        get: { summary: 'Get Marks & Results', tags: ['Marks'] },
        post: { summary: 'Enter Marks', tags: ['Marks'] },
      },
      '/api/fees': {
        get: { summary: 'Get Fee Ledgers', tags: ['Fees'] },
        post: { summary: 'Record Fee Payment', tags: ['Fees'] },
      },
      '/api/timetable': {
        get: { summary: 'Get Timetables', tags: ['Timetable'] },
        post: { summary: 'Update Timetable', tags: ['Timetable'] },
      },
      '/api/notices': {
        get: { summary: 'Get Notices', tags: ['Notices'] },
        post: { summary: 'Publish Notice', tags: ['Notices'] },
      },
    },
  };

  return NextResponse.json(openApiSpec);
}
