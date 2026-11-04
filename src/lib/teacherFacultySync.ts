import User from '@/models/User';
import TeacherProfile from '@/models/TeacherProfile';
import Faculty from '@/models/Faculty';
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

/**
 * Ensures a Faculty Directory member has a corresponding User and TeacherProfile with matching assignedClasses
 */
export async function syncFacultyMemberToTeacherProfile(facultyDoc: any) {
  if (!facultyDoc || !facultyDoc.name) return null;

  try {
    let user = null;

    // 1. Try finding by linked user ID
    if (facultyDoc.user) {
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
      const teacherCount = await User.countDocuments({ role: 'teacher' });
      const userId = `TCH${String(teacherCount + 1).padStart(3, '0')}`;
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

    // 4. Normalize assignedClasses
    const assignedClasses = (facultyDoc.assignedClasses || []).map((ac: any) => ({
      class: ac.class?._id || ac.class,
      section: ac.section || 'A',
      subject: ac.subject?._id || ac.subject,
    }));

    // 5. Upsert TeacherProfile
    const profile = await TeacherProfile.findOneAndUpdate(
      { user: user._id },
      {
        $set: {
          qualification: facultyDoc.qualification || 'Educator',
          specialization: facultyDoc.category || 'General',
          assignedClasses,
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
    const assignedClasses = (profileDoc.assignedClasses || []).map((ac: any) => ({
      class: ac.class?._id || ac.class,
      section: ac.section || 'A',
      subject: ac.subject?._id || ac.subject,
    }));

    // Find matching Faculty by user ID or name
    let faculty = await Faculty.findOne({ user: userDoc._id });
    if (!faculty && userDoc.name) {
      faculty = await Faculty.findOne({
        name: { $regex: new RegExp(`^${escapeRegex(userDoc.name.trim())}$`, 'i') },
      });
    }

    if (faculty) {
      faculty.user = userDoc._id;
      faculty.assignedClasses = assignedClasses;
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
  } catch (err) {
    console.error('Error reconciling all faculty:', err);
  }
}
