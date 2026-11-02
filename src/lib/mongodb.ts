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

const ATLAS_FALLBACK_URI = 'mongodb+srv://sonukumar763303_db_user:JRrnDHofZ3IhKq4B@cluster0.pvcryae.mongodb.net/Success-Point-school';
const MONGODB_URI = process.env.MONGODB_URI || ATLAS_FALLBACK_URI;

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
        console.warn(`Primary MongoDB connection failed: ${err.message}`);

        // Never attempt in-memory MongoDB in Vercel or production serverless environments
        const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production';
        if (!isServerless) {
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
            console.log(`Connected to local In-Memory MongoDB at ${memoryUri}`);
            const m = await mongoose.connect(memoryUri, {
              bufferCommands: false,
            });
            return m;
          } catch (memErr: any) {
            console.error('Failed to initialize in-memory MongoDB server:', memErr);
          }
        }

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
