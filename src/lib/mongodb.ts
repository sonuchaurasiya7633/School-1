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

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_management';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  memServer?: any;
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
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    };

    cached.promise = (async () => {
      try {
        const maskedUri = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
        console.log(`Connecting to MongoDB at: ${maskedUri}`);
        const m = await mongoose.connect(MONGODB_URI, opts);
        console.log('MongoDB successfully connected!');
        return m;
      } catch (err: any) {
        console.warn(`Standard MongoDB connection failed (${err.message}). Initializing fallback in-memory MongoDB...`);
        try {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          if (!cached.memServer) {
            cached.memServer = await MongoMemoryServer.create({
              instance: {
                dbName: 'school_management',
              },
            });
          }
          const memoryUri = cached.memServer.getUri();
          console.log(`Connected to In-Memory MongoDB at ${memoryUri}`);
          const m = await mongoose.connect(memoryUri, {
            bufferCommands: false,
          });
          return m;
        } catch (memErr: any) {
          console.error('Failed to initialize in-memory MongoDB server:', memErr);
          throw memErr;
        }
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
