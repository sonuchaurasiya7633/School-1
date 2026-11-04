import mongoose from 'mongoose';
import User from '@/models/User';
import TeacherProfile from '@/models/TeacherProfile';
import Faculty from '@/models/Faculty';
import SchoolClass from '@/models/SchoolClass';
import Subject from '@/models/Subject';
import { hashPassword } from '@/lib/auth';

function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function generateCleanEmail(name: string, index = 1): string {
  const sanitized = name
    .toLowerCase()
    .replace(/^(er\.|mr\.|mrs\.|ms\.|dr\.|prof\.)\s*/i, '')
    .trim()
    .replace(/[^a-z0-9]/g, '.')
    .replace(/\.+/g, '.')
    .replace(/^\.|\.$/g, '');

  const base = sanitized || 'teacher';
  return index === 1
    ? `${base}@successpoint.edu.in`
    : `${base}${index}@successpoint.edu.in`;
}

async function getNextTeacherUserId(): Promise<string> {
  const users = await User.find({ role: 'teacher' }, 'userId').lean();
  let maxNum = 0;
  for (const u of users) {
    if (u.userId && u.userId.startsWith('TCH')) {
      const parsed = parseInt(u.userId.replace('TCH', ''), 10);
      if (!isNaN(parsed) && parsed > maxNum) maxNum = parsed;
    }
  }

  let next = maxNum + 1;
  while (await User.findOne({ userId: `TCH${String(next).padStart(3, '0')}` })) {
    next++;
  }
  return `TCH${String(next).padStart(3, '0')}`;
}

/**
 * Normalizes assigned classes array ensuring only valid ObjectIds are saved to prevent CastErrors
 */
function normalizeAssignedClasses(assigned: any[] = []): any[] {
  return assigned
    .filter((ac: any) => {
      const cId = ac.class?._id || ac.class;
      const sId = ac.subject?._id || ac.subject;
      return (
        cId &&
        mongoose.isValidObjectId(String(cId)) &&
        sId &&
        mongoose.isValidObjectId(String(sId))
      );
    })
    .map((ac: any) => ({
      class: new mongoose.Types.ObjectId(String(ac.class?._id || ac.class)),
      section: (ac.section || 'A').toUpperCase().trim(),
      subject: new mongoose.Types.ObjectId(String(ac.subject?._id || ac.subject)),
    }));
}

/**
 * Ensures a Faculty Directory member has a corresponding User and TeacherProfile with matching assignedClasses
 */
export async function syncFacultyMemberToTeacherProfile(facultyDoc: any) {
  if (!facultyDoc || !facultyDoc.name) return null;

  try {
    let user = null;

    // 1. Try finding by linked user ID
    if (facultyDoc.user && mongoose.isValidObjectId(String(facultyDoc.user))) {
      user = await User.findById(facultyDoc.user);
    }

    // 2. Try finding by matching teacher name
    if (!user) {
      user = await User.findOne({
        role: 'teacher',
        name: { $regex: new RegExp(`^${escapeRegex(facultyDoc.name.trim())}$`, 'i') },
      });
    }

    // 3. If User doesn't exist, create one so teacher can log in & appear in Faculty & Teachers
    if (!user) {
      const userId = await getNextTeacherUserId();
      const hashedPassword = await hashPassword('password123');

      let email = generateCleanEmail(facultyDoc.name);
      let emailIndex = 1;
      while (await User.findOne({ email })) {
        emailIndex++;
        email = generateCleanEmail(facultyDoc.name, emailIndex);
      }

      user = await User.create({
        userId,
        name: facultyDoc.name.trim(),
        email,
        password: hashedPassword,
        role: 'teacher',
        avatar: facultyDoc.avatar || '',
        isActive: facultyDoc.isActive !== false,
      });
    }

    // Link user on faculty doc if not linked
    if (!facultyDoc.user || String(facultyDoc.user) !== String(user._id)) {
      facultyDoc.user = user._id;
      if (typeof facultyDoc.save === 'function') {
        await facultyDoc.save();
      } else if (facultyDoc._id) {
        await Faculty.findByIdAndUpdate(facultyDoc._id, { $set: { user: user._id } });
      }
    }

    // 4. Normalize and validate assignedClasses
    const validAssignedClasses = normalizeAssignedClasses(facultyDoc.assignedClasses);

    // 5. Upsert TeacherProfile
    const profile = await TeacherProfile.findOneAndUpdate(
      { user: user._id },
      {
        $set: {
          qualification: facultyDoc.qualification || 'Educator',
          specialization: facultyDoc.category || 'General',
          assignedClasses: validAssignedClasses,
        },
      },
      { upsert: true, new: true }
    );

    return { user, profile };
  } catch (err) {
    console.error('Error syncing faculty to teacher profile:', err);
    return null;
  }
}

/**
 * When teacher profile is updated in Admin/Teachers, sync assignedClasses back to Faculty Directory
 */
export async function syncTeacherProfileToFaculty(profileDoc: any, userDoc: any) {
  if (!profileDoc || !userDoc) return;

  try {
    const validAssignedClasses = normalizeAssignedClasses(profileDoc.assignedClasses);

    // Find matching Faculty by user ID or name
    let faculty = await Faculty.findOne({ user: userDoc._id });
    if (!faculty && userDoc.name) {
      faculty = await Faculty.findOne({
        name: { $regex: new RegExp(`^${escapeRegex(userDoc.name.trim())}$`, 'i') },
      });
    }

    if (faculty) {
      faculty.user = userDoc._id;
      faculty.assignedClasses = validAssignedClasses;
      if (userDoc.avatar && !faculty.avatar) {
        faculty.avatar = userDoc.avatar;
      }
      await faculty.save();
    }
  } catch (err) {
    console.error('Error syncing teacher profile to faculty:', err);
  }
}

/**
 * Reconciles all Faculty records with TeacherProfile so Faculty & Teachers (/admin/teachers) is 100% in sync
 */
export async function reconcileAllFacultyWithTeachers() {
  try {
    const allFaculty = await Faculty.find();
    for (const fac of allFaculty) {
      await syncFacultyMemberToTeacherProfile(fac);
    }

    // Clean up any TeacherProfiles with non-existent users
    const allProfiles = await TeacherProfile.find();
    for (const p of allProfiles) {
      const userExists = await User.findById(p.user);
      if (!userExists) {
        await TeacherProfile.findByIdAndDelete(p._id);
      }
    }
  } catch (err) {
    console.error('Error reconciling all faculty:', err);
  }
}
