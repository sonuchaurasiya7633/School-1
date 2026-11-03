import {
  ISchoolCalendarEvent,
  CalendarStats,
  DayScheduleInfo,
  HolidayCategory,
} from '@/types/calendar';

export const INITIAL_2027_EVENTS: ISchoolCalendarEvent[] = [
  // ==========================================
  // Category 1: GENERAL HOLIDAYS (Executive Order - 12 Holidays)
  // ==========================================
  {
    title: 'Guru Govind Singh Jayanti',
    date: '2027-01-15',
    category: 'general',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: '360th Prakash Parv celebrating Guru Gobind Singh Ji.',
    instructions: 'School offices and classes remain closed.',
  },
  {
    title: 'Republic Day',
    date: '2027-01-26',
    category: 'general',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'National Flag hoisting ceremony at 8:30 AM at SPS Main Campus.',
    instructions: 'All faculty and student house leaders to report in ceremonial uniform.',
  },
  {
    title: 'Sant Ravidas Jayanti',
    date: '2027-02-21',
    category: 'general',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Birth anniversary of mystic poet-saint Guru Ravidas Ji.',
  },
  {
    title: 'Mahashivratri',
    date: '2027-03-06',
    category: 'general',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Celebration of Mahashivratri.',
  },
  {
    title: 'Bihar Diwas',
    date: '2027-03-22',
    category: 'general',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Formation day of Bihar State. SPS cultural program in auditorium.',
    instructions: 'Cultural exhibition from 9:00 AM to 12:00 PM.',
  },
  {
    title: 'Dr. B.R. Ambedkar Jayanti',
    date: '2027-04-14',
    category: 'general',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Commemoration of the architect of the Indian Constitution.',
  },
  {
    title: 'Veer Kunwar Singh Jayanti',
    date: '2027-04-23',
    category: 'general',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Commemorating 1857 freedom warrior Babu Veer Kunwar Singh.',
  },
  {
    title: 'Janki Navami',
    date: '2027-05-15',
    category: 'general',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Mata Sita Prakatya Diwas.',
  },
  {
    title: 'Buddha Purnima',
    date: '2027-05-20',
    category: 'general',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Lord Buddha birth and enlightenment anniversary.',
  },
  {
    title: 'Kabir Jayanti',
    date: '2027-06-19',
    category: 'general',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Sant Kabir Das Jayanti celebration.',
  },
  {
    title: 'Mahatma Gandhi Jayanti',
    date: '2027-10-02',
    category: 'general',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'National holiday in honor of Father of the Nation.',
  },
  {
    title: 'Christmas Day',
    date: '2027-12-25',
    category: 'general',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Christmas celebration and winter festive recess.',
  },

  // ==========================================
  // Category 2: PUBLIC HOLIDAYS (N.I. Act 1881 - 24 Holidays)
  // ==========================================
  {
    title: 'Holi (Dhulandi)',
    date: '2027-03-23',
    endDate: '2027-03-24',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Festival of colors, unity and joy.',
    instructions: 'School reopens after Holi festival on March 25, 2027.',
  },
  {
    title: 'Good Friday',
    date: '2027-03-26',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Christian holy day commemorating the Crucifixion.',
  },
  {
    title: 'Bank Annual Accounts Closing',
    date: '2027-04-01',
    category: 'public',
    schoolStatus: 'open', // Bank only holiday - school remains OPEN
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Commercial bank closure under N.I. Act. School academic classes operate normally.',
    instructions: 'School office and digital fee counters will remain operational.',
  },
  {
    title: 'Eid-ul-Fitr',
    date: '2027-03-10',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Islamic festival marking the culmination of Ramadan (Subject to moon sighting).',
  },
  {
    title: 'Ram Navami',
    date: '2027-04-15',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Auspicious birth celebration of Lord Shri Ram.',
  },
  {
    title: 'Mahavir Jayanti',
    date: '2027-04-20',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Birth celebration of Lord Mahavira, the 24th Tirthankara.',
  },
  {
    title: 'May Day (International Labour Day)',
    date: '2027-05-01',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'International Workers Day honoring dignity of labor.',
  },
  {
    title: 'Eid-ul-Zoha (Bakrid)',
    date: '2027-05-17',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Feast of the Sacrifice (Subject to moon sighting).',
  },
  {
    title: 'Muharram (Youm-e-Ashura)',
    date: '2027-06-16',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Commemoration of the martyrdom of Hazrat Imam Hussain.',
  },
  {
    title: 'Independence Day',
    date: '2027-08-15',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: '81st Independence Day of India. SPS Flag hoisting & parade at 8:00 AM.',
    instructions: 'Attendance mandatory for student council and faculty.',
  },
  {
    title: 'Raksha Bandhan',
    date: '2027-08-17',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Celebration of brotherly and sisterly bonding.',
  },
  {
    title: 'Krishna Janmashtami',
    date: '2027-08-25',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Lord Krishna Janmotsav.',
  },
  {
    title: 'Milad-un-Nabi (Eid-e-Milad)',
    date: '2027-08-16',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Birth anniversary of Prophet Muhammad (SAW).',
  },
  {
    title: 'Durga Puja (Maha Saptami)',
    date: '2027-10-07',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Durga Puja Saptami invocation.',
  },
  {
    title: 'Durga Puja (Maha Ashtami & Navami)',
    date: '2027-10-08',
    endDate: '2027-10-09',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Maha Ashtami Sandhi Puja & Mahanavami celebrations.',
  },
  {
    title: 'Vijaya Dashami (Dussehra)',
    date: '2027-10-10',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Triumph of righteousness over evil.',
  },
  {
    title: 'Deepawali (Lakshmi Puja)',
    date: '2027-10-29',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Festival of lights and wisdom.',
  },
  {
    title: 'Chhath Puja (Pehla Arghya / Sandhya)',
    date: '2027-11-04',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Sacred Mahaparv of Bihar - Evening Arghya to Surya Dev.',
  },
  {
    title: 'Chhath Puja (Doosra Arghya / Usha)',
    date: '2027-11-05',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Morning Arghya and culmination of Chhath Vrata.',
  },
  {
    title: 'Guru Nanak Jayanti & Kartik Purnima',
    date: '2027-11-14',
    category: 'public',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Prakash Utsav of Guru Nanak Dev Ji & Dev Deepawali.',
  },

  // ==========================================
  // Category 3: OPTIONAL / RESTRICTED HOLIDAYS (22 Holidays)
  // Default: School OPEN, isOptional: true, isApproved: false unless admin confirms
  // ==========================================
  {
    title: 'New Year Day',
    date: '2027-01-01',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Restricted holiday for New Year greeting exchange.',
  },
  {
    title: 'Makar Sankranti',
    date: '2027-01-14',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Sun entering Capricorn zodiac.',
  },
  {
    title: 'Karpoori Thakur Jayanti',
    date: '2027-01-24',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Jan Nayak Karpoori Thakur birth anniversary.',
  },
  {
    title: 'Basant Panchami / Saraswati Puja',
    date: '2027-02-12',
    category: 'optional',
    schoolStatus: 'half_day', // School holds Saraswati Vandana in morning
    isApproved: true,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Worship of Goddess Saraswati, patron of knowledge and arts.',
    instructions: 'Special morning prayer and prasad distribution for all students.',
  },
  {
    title: 'Shab-e-Barat',
    date: '2027-02-24',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Night of records and forgiveness in Islam.',
  },
  {
    title: 'Holika Dahan',
    date: '2027-03-22',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Eve of Holi festive bonfire.',
  },
  {
    title: 'Easter Saturday',
    date: '2027-03-27',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Holy Saturday preceding Easter.',
  },
  {
    title: 'Easter Monday',
    date: '2027-03-29',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Day following Easter Sunday.',
  },
  {
    title: 'Shab-e-Qadr',
    date: '2027-04-06',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Night of Power in Holy Ramadan.',
  },
  {
    title: 'Juma-tul-Wida',
    date: '2027-04-09',
    category: 'optional',
    schoolStatus: 'half_day',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Last Friday of Ramadan prayers.',
  },
  {
    title: 'Anugrah Narayan Sinha Jayanti',
    date: '2027-06-18',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Birth commemoration of Bihar Vibhuti Dr. A.N. Sinha.',
  },
  {
    title: 'Rath Yatra',
    date: '2027-07-05',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Chariot festival of Lord Jagannath.',
  },
  {
    title: 'Chehlum',
    date: '2027-07-25',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: '40th day observance following Ashura.',
  },
  {
    title: 'Nag Panchami',
    date: '2027-08-07',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Traditional worship of serpent deities.',
  },
  {
    title: 'Vishwakarma Puja',
    date: '2027-09-17',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Divine engineer and creator deity homage. SPS Labs perform equipment blessings.',
  },
  {
    title: 'Karva Chauth',
    date: '2027-10-18',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Traditional Hindu fasting day.',
  },
  {
    title: 'Govardhan Puja',
    date: '2027-10-30',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Annakut and Govardhan festival.',
  },
  {
    title: 'Bhai Dooj / Chitragupta Puja',
    date: '2027-10-31',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'Bhaiya Dooj and कलम-दवात पूजन (Kalam Dawaat Puja).',
  },
  {
    title: 'Dr. Rajendra Prasad Jayanti',
    date: '2027-12-03',
    category: 'optional',
    schoolStatus: 'open',
    isApproved: false,
    isOptional: true,
    academicYear: '2027',
    createdSource: 'bihar_gazette',
    description: 'First President of the Republic of India Deshratna Dr. Rajendra Prasad Jayanti.',
  },

  // ==========================================
  // Category 4: SCHOOL SPECIFIC (Vacations, Events, Exams)
  // ==========================================
  {
    title: 'Summer Vacation',
    date: '2027-05-24',
    endDate: '2027-06-19',
    category: 'school',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'school_admin',
    description: 'Annual Summer Vacation for students and faculty.',
    instructions: 'Summer vacation holiday homework and online doubt clearance camps active.',
  },
  {
    title: 'Winter Vacation',
    date: '2027-12-27',
    endDate: '2027-12-31',
    category: 'school',
    schoolStatus: 'closed',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'school_admin',
    description: 'Winter Vacation for severe cold wave respite.',
    instructions: 'Administrative office open from 10:00 AM to 2:00 PM for admissions.',
  },
  {
    title: 'Annual Sports & Athletic Meet',
    date: '2027-02-18',
    endDate: '2027-02-20',
    category: 'school',
    schoolStatus: 'open',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'school_admin',
    description: 'Inter-house athletic tournament, track events, and march past.',
    instructions: 'House jerseys required. Attendance mandatory for all classes.',
  },
  {
    title: 'SPS Annual Science & Arts Exhibition',
    date: '2027-11-20',
    category: 'school',
    schoolStatus: 'open',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'school_admin',
    description: 'Parent-teacher showcase with 100+ working STEM models and robotic displays.',
    instructions: 'Open for parents from 10:00 AM to 4:00 PM.',
  },
  {
    title: 'Mid-Term Board Preparatory Examination',
    date: '2027-09-15',
    endDate: '2027-09-25',
    category: 'exam',
    schoolStatus: 'half_day',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'school_admin',
    description: 'First Semester Summative Assessments for Classes 1 to 12.',
    instructions: 'Exam shifts: 8:30 AM to 11:30 AM. Reporting time 8:00 AM.',
  },
  {
    title: 'Annual Final Examinations 2027',
    date: '2027-12-10',
    endDate: '2027-12-22',
    category: 'exam',
    schoolStatus: 'half_day',
    isApproved: true,
    isOptional: false,
    academicYear: '2027',
    createdSource: 'school_admin',
    description: 'Final Term Promotion Exams for all academic standards.',
    instructions: 'Admit cards required. No entry permitted without school ID and uniform.',
  },
];

/**
 * Expands any multi-day range (e.g. Summer Vacation date..endDate) into a map of date -> event list
 */
export function buildDateEventMap(
  events: ISchoolCalendarEvent[]
): Map<string, ISchoolCalendarEvent[]> {
  const map = new Map<string, ISchoolCalendarEvent[]>();

  for (const ev of events) {
    if (ev.isActive === false) continue;

    if (ev.endDate && ev.endDate > ev.date) {
      const cur = new Date(ev.date + 'T00:00:00');
      const end = new Date(ev.endDate + 'T00:00:00');
      while (cur <= end) {
        const y = cur.getFullYear();
        const m = String(cur.getMonth() + 1).padStart(2, '0');
        const d = String(cur.getDate()).padStart(2, '0');
        const ds = `${y}-${m}-${d}`;
        const existing = map.get(ds) || [];
        existing.push(ev);
        map.set(ds, existing);
        cur.setDate(cur.getDate() + 1);
      }
    } else {
      const existing = map.get(ev.date) || [];
      existing.push(ev);
      map.set(ev.date, existing);
    }
  }

  return map;
}

/**
 * Calculates comprehensive 2027 working-day statistics based on the strict school rules:
 * - Total Days in 2027 = 365 (not a leap year)
 * - Mon-Thu = 1 working day eq
 * - Friday = 0.5 working day eq (half day)
 * - Saturday & Sunday = 0 working day eq (weekend off)
 * - Approved School Holiday = 0 (overrides Friday half day or working day)
 * - Approved Holiday on Weekend = 0 (does NOT double count non-working days)
 */
export function calculate2027CalendarStats(
  events: ISchoolCalendarEvent[]
): { stats: CalendarStats; dayDetails: Map<string, DayScheduleInfo> } {
  const dateEventMap = buildDateEventMap(events);
  const dayDetails = new Map<string, DayScheduleInfo>();

  let totalWorkingDays = 0;
  let totalFullWorkingDays = 0;
  let totalFridayHalfDays = 0;
  let totalWeekendDays = 0;
  let totalApprovedHolidays = 0;
  let totalSchoolEvents = 0;
  let totalExams = 0;
  let totalOptionalHolidays = 0;

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Iterate all 365 days of 2027
  const cur = new Date('2027-01-01T00:00:00');
  const end = new Date('2027-12-31T00:00:00');

  while (cur <= end) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    const dayOfWeek = cur.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat

    const dayEvents = dateEventMap.get(dateStr) || [];
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isFriday = dayOfWeek === 5;

    // Base status according to weekly rule
    let baseStatus: 'open' | 'closed' | 'half_day' = 'open';
    if (isWeekend) {
      baseStatus = 'closed';
    } else if (isFriday) {
      baseStatus = 'half_day';
    }

    // Determine effective status
    let effectiveStatus = baseStatus;
    let holidayName = '';
    let holidayCategory: HolidayCategory | undefined = undefined;
    let colorType: DayScheduleInfo['colorType'] = isWeekend
      ? 'weekend'
      : isFriday
      ? 'friday_half'
      : 'working_day';

    // Find if any event affects this day
    const approvedHoliday = dayEvents.find(
      (e) => e.isApproved && e.schoolStatus === 'closed'
    );
    const halfDayEvent = dayEvents.find(
      (e) => e.isApproved && e.schoolStatus === 'half_day'
    );
    const examEvent = dayEvents.find((e) => e.category === 'exam');
    const schoolEvent = dayEvents.find((e) => e.category === 'school');
    const optionalEvent = dayEvents.find((e) => e.category === 'optional');

    if (approvedHoliday) {
      effectiveStatus = 'closed';
      holidayName = approvedHoliday.title;
      holidayCategory = approvedHoliday.category;
      if (approvedHoliday.category === 'general') colorType = 'general_holiday';
      else if (approvedHoliday.category === 'public')
        colorType = 'public_holiday';
      else colorType = 'school_event';
    } else if (halfDayEvent && !isWeekend) {
      effectiveStatus = 'half_day';
      holidayName = halfDayEvent.title;
      holidayCategory = halfDayEvent.category;
      if (halfDayEvent.category === 'exam') colorType = 'examination';
      else colorType = 'friday_half';
    } else if (examEvent && !isWeekend) {
      colorType = 'examination';
      holidayName = examEvent.title;
      holidayCategory = 'exam';
    } else if (schoolEvent && !isWeekend) {
      colorType = 'school_event';
      holidayName = schoolEvent.title;
      holidayCategory = 'school';
    } else if (optionalEvent) {
      // Optional holiday: shows indicator, but doesn't close school unless approved
      holidayName = optionalEvent.title;
      holidayCategory = 'optional';
      if (!isWeekend && !isFriday) {
        colorType = 'optional_holiday';
      }
    }

    // Day counting rules
    if (isWeekend) {
      totalWeekendDays++;
      // Even if holiday falls on weekend, working day contribution is 0
    } else {
      if (effectiveStatus === 'closed') {
        totalApprovedHolidays++;
        // 0 working days
      } else if (effectiveStatus === 'half_day') {
        totalFridayHalfDays++;
        totalWorkingDays += 0.5;
      } else {
        totalFullWorkingDays++;
        totalWorkingDays += 1.0;
      }
    }

    if (schoolEvent) totalSchoolEvents++;
    if (examEvent) totalExams++;
    if (optionalEvent) totalOptionalHolidays++;

    dayDetails.set(dateStr, {
      date: dateStr,
      dayOfWeek,
      dayName: dayNames[dayOfWeek],
      isWeekend,
      isFridayHalfDay: isFriday,
      baseStatus,
      effectiveStatus,
      events: dayEvents,
      holidayName,
      holidayCategory,
      colorType,
    });

    cur.setDate(cur.getDate() + 1);
  }

  return {
    stats: {
      totalCalendarDays: 365,
      totalWorkingDays,
      totalFullWorkingDays,
      totalFridayHalfDays,
      totalWeekendDays,
      totalApprovedHolidays,
      totalSchoolEvents,
      totalExams,
      totalOptionalHolidays,
    },
    dayDetails,
  };
}
