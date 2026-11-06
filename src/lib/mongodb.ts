import mongoose from 'mongoose';

// Pre-register all models to ensure Mongoose population never throws MissingSchemaError
import '@/models/User';
import '@/models/SchoolClass';
import '@/models/Subject';
import '@/models/StudentProfile';
import '@/models/TeacherProfile';
import '@/models/Attendance';
import '@/models/Exam';
import '@/models/Fee';
import '@/models/Homework';
import '@/models/Inquiry';
import '@/models/Lecture';
import '@/models/Mark';
import '@/models/Notice';
import '@/models/SchoolSetting';
import '@/models/Timetable';
import '@/models/Faculty';
import '@/models/SchoolCalendarEvent';
import '@/models/AcademicSession';

const ATLAS_FALLBACK_URI =
  'mongodb+srv://sonukumar763303_db_user:JRrnDHofZ3IhKq4B@cluster0.pvcryae.mongodb.net/Success-Point-school';
const MONGODB_URI = process.env.MONGODB_URI || ATLAS_FALLBACK_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    };

    cached.promise = (async () => {
      try {
        const maskedUri = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
        console.log(`Connecting to MongoDB at: ${maskedUri}`);
        const m = await mongoose.connect(MONGODB_URI, opts);
        console.log('MongoDB successfully connected!');
        return m;
      } catch (err: any) {
        console.error(`MongoDB connection error: ${err.message}`);
        throw new Error(
          `Database connection error: ${err.message}. If deploying on Vercel, ensure MongoDB Atlas Network Access has IP whitelist set to 0.0.0.0/0 (Allow access from anywhere).`
        );
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
