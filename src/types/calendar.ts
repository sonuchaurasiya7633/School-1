export type HolidayCategory =
  | 'general'
  | 'public'
  | 'optional'
  | 'school'
  | 'exam'
  | 'weekend';

export type SchoolDayStatus = 'open' | 'closed' | 'half_day';

export interface ISchoolCalendarEvent {
  _id?: string;
  id?: string;
  title: string;
  date: string; // YYYY-MM-DD
  endDate?: string; // For multi-day events/vacations (YYYY-MM-DD)
  dayOfWeek?: string;
  category: HolidayCategory;
  schoolStatus: SchoolDayStatus;
  isOptional?: boolean;
  isApproved?: boolean; // When true, this holiday applies to SPS school
  colorCode?: string;
  description?: string;
  instructions?: string;
  academicYear: string; // e.g. '2027'
  createdSource?: 'bihar_gazette' | 'school_admin';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DayScheduleInfo {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  dayName: string;
  isWeekend: boolean; // Sat or Sun
  isFridayHalfDay: boolean;
  baseStatus: SchoolDayStatus; // Mon-Thu: open, Fri: half_day, Sat-Sun: closed
  effectiveStatus: SchoolDayStatus; // After applying approved holidays/events
  events: ISchoolCalendarEvent[];
  holidayName?: string;
  holidayCategory?: HolidayCategory;
  colorType:
    | 'working_day'
    | 'friday_half'
    | 'weekend'
    | 'general_holiday'
    | 'public_holiday'
    | 'optional_holiday'
    | 'school_event'
    | 'examination';
}

export interface CalendarStats {
  totalCalendarDays: number;
  totalWorkingDays: number; // Monday-Thu = 1, Friday = 0.5, Weekends = 0, Holidays = 0
  totalFullWorkingDays: number;
  totalFridayHalfDays: number;
  totalWeekendDays: number;
  totalApprovedHolidays: number;
  totalSchoolEvents: number;
  totalExams: number;
  totalOptionalHolidays: number;
}
