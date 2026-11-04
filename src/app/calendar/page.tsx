'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Info,
  Clock,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  CalendarDays,
  ListFilter,
  Grid3X3,
  Search,
  Sun,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import {
  ISchoolCalendarEvent,
  CalendarStats,
  HolidayCategory,
  DayScheduleInfo,
} from '@/types/calendar';
import {
  INITIAL_2027_EVENTS,
  calculate2027CalendarStats,
} from '@/data/calendarData2027';

type ViewMode = 'month' | 'year' | 'list';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarPage() {
  const [events, setEvents] = useState<ISchoolCalendarEvent[]>(INITIAL_2027_EVENTS);
  const [loading, setLoading] = useState(true);
  const [currentYear] = useState('2027');
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // 0 = Jan
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDateModal, setActiveDateModal] = useState<DayScheduleInfo | null>(null);

  useEffect(() => {
    async function fetchCalendar() {
      try {
        setLoading(true);
        const res = await fetch(`/api/public/calendar?year=${currentYear}`);
        const data = await res.json();
        if (data.success && data.events && data.events.length > 0) {
          setEvents(data.events);
        }
      } catch (err) {
        console.error('Failed to load online calendar events, using defaults:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCalendar();
  }, [currentYear]);

  // Compute full 2027 schedule and stats
  const { stats, dayDetails } = useMemo(() => {
    return calculate2027CalendarStats(events);
  }, [events]);

  // Filtered events for list view
  const filteredEventsList = useMemo(() => {
    return events.filter((ev) => {
      const matchCat =
        selectedCategory === 'all' || ev.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.date.includes(searchQuery);
      return matchCat && matchSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  // Upcoming holidays from today (or start of 2027)
  const upcomingHolidays = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const refDate = today.startsWith('2027') ? today : '2027-01-01';
    return events
      .filter((ev) => ev.date >= refDate && ev.isApproved && ev.schoolStatus === 'closed')
      .slice(0, 5);
  }, [events]);

  // Group events by month (0 = Jan ... 11 = Dec) for printable PDF
  const eventsByMonth = useMemo(() => {
    const map: Record<number, ISchoolCalendarEvent[]> = {};
    for (let m = 0; m < 12; m++) map[m] = [];
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
    sorted.forEach((ev) => {
      const parts = ev.date.split('-');
      if (parts.length === 3) {
        const m = parseInt(parts[1], 10) - 1;
        if (m >= 0 && m < 12) {
          map[m].push(ev);
        }
      }
    });
    return map;
  }, [events]);

  const formatPrintDate = (dStr: string) => {
    const parts = dStr.split('-');
    if (parts.length !== 3) return dStr;
    const year = parts[0];
    const m = parseInt(parts[1], 10) - 1;
    const day = parts[2];
    const d = new Date(parseInt(year, 10), m, parseInt(day, 10));
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[d.getDay()] || '';
    const monthName = MONTH_NAMES[m]?.slice(0, 3) || parts[1];
    return `${day} ${monthName} ${year} (${dayName})`;
  };

  const getCategoryPrintBadge = (cat: string) => {
    switch (cat) {
      case 'general':
        return 'General Holiday';
      case 'public':
        return 'Public Holiday';
      case 'optional':
        return 'Optional Holiday';
      case 'school':
        return 'School Vacation / Event';
      case 'exam':
        return 'Examination';
      default:
        return 'Academic Event';
    }
  };

  const getStatusPrintLabel = (status: string, isOptional?: boolean) => {
    if (status === 'closed') return 'School Closed';
    if (status === 'half_day') return 'Half Working Day';
    if (isOptional) return 'Optional (School Open)';
    return 'School Open';
  };

  // Month navigation helpers
  const handlePrevMonth = () => {
    setSelectedMonth((prev) => (prev > 0 ? prev - 1 : 11));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => (prev < 11 ? prev + 1 : 0));
  };

  // Build grid days for selectedMonth in 2027 (Monday first: 1=Mon, ..., 0=Sun)
  const monthGridDays = useMemo(() => {
    const year = 2027;
    const firstDay = new Date(year, selectedMonth, 1);
    const lastDay = new Date(year, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    // In JS: 0 = Sun, 1 = Mon. Shift so Monday is index 0
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6; // Sunday becomes 6

    const days: (DayScheduleInfo | null)[] = [];

    // Empty slots before month start
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Actual month days
    for (let day = 1; day <= daysInMonth; day++) {
      const mStr = String(selectedMonth + 1).padStart(2, '0');
      const dStr = String(day).padStart(2, '0');
      const dateKey = `${year}-${mStr}-${dStr}`;
      const dayInfo = dayDetails.get(dateKey);
      if (dayInfo) {
        days.push(dayInfo);
      }
    }

    return days;
  }, [selectedMonth, dayDetails]);

  // Styling helper based on colorType
  const getColorClasses = (type: DayScheduleInfo['colorType']) => {
    switch (type) {
      case 'general_holiday':
        return 'bg-orange-50 border-orange-200 text-orange-950 hover:bg-orange-100';
      case 'public_holiday':
        return 'bg-pink-50 border-pink-200 text-pink-950 hover:bg-pink-100';
      case 'optional_holiday':
        return 'bg-sky-50 border-sky-200 text-sky-950 hover:bg-sky-100';
      case 'school_event':
        return 'bg-purple-50 border-purple-200 text-purple-950 hover:bg-purple-100';
      case 'examination':
        return 'bg-teal-50 border-teal-200 text-teal-950 hover:bg-teal-100';
      case 'friday_half':
        return 'bg-amber-50 border-amber-200 text-amber-950 hover:bg-amber-100';
      case 'weekend':
        return 'bg-rose-50/70 border-rose-200 text-rose-900 hover:bg-rose-100';
      case 'working_day':
      default:
        return 'bg-emerald-50/40 border-emerald-100 text-emerald-950 hover:bg-emerald-100/60';
    }
  };

  const getStatusBadge = (status: DayScheduleInfo['effectiveStatus']) => {
    if (status === 'closed') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
          School Closed
        </span>
      );
    }
    if (status === 'half_day') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900">
          Half Day
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
        School Open
      </span>
    );
  };

  const getCategoryBadge = (category?: HolidayCategory) => {
    switch (category) {
      case 'general':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> General Holiday
          </span>
        );
      case 'public':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-800">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Public Holiday (N.I. Act)
          </span>
        );
      case 'optional':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Optional / Restricted
          </span>
        );
      case 'school':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> School Event / Vacation
          </span>
        );
      case 'exam':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Examination
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] dark:bg-stone-950 text-stone-800 dark:text-stone-100 antialiased font-sans transition-colors">
      {/* SCREEN UI (Hidden during Print / PDF Export) */}
      <div className="print:hidden flex-1 flex flex-col">
        <PublicHeader />

      <main className="flex-1 pb-16">
        {/* HERO BANNER SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#214F39] to-[#183B2B] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8B4A8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8B4A8]/20 border border-[#E8B4A8]/30 text-[#E8B4A8] text-xs font-semibold tracking-wide uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Academic Calendar • Year 2027
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                  School Calendar & Holidays
                </h1>
                <p className="mt-2 text-base sm:text-lg text-emerald-100/90 max-w-2xl">
                  Success Point School complete academic schedule, gazetted Bihar Government holidays, vacations, examinations, and weekly working timetable.
                </p>
              </div>

              {/* ACTION PILLS */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#214F39] text-sm font-bold shadow-md hover:bg-stone-100 active:scale-95 transition-all"
                  title="Print or save as PDF"
                >
                  <Printer className="w-4 h-4 text-[#214F39]" />
                  Download / Print PDF
                </button>
              </div>
            </div>

            {/* WORKING DAYS SUMMARY STATS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-center">
                <span className="block text-2xl lg:text-3xl font-extrabold text-[#E8B4A8]">
                  {stats.totalCalendarDays}
                </span>
                <span className="text-[11px] font-medium text-emerald-100/80 uppercase tracking-wider">
                  Total Days (2027)
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-center">
                <span className="block text-2xl lg:text-3xl font-extrabold text-emerald-300">
                  {stats.totalWorkingDays}
                </span>
                <span className="text-[11px] font-medium text-emerald-100/80 uppercase tracking-wider">
                  Working Day Eq.
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-center">
                <span className="block text-2xl lg:text-3xl font-extrabold text-white">
                  {stats.totalFullWorkingDays}
                </span>
                <span className="text-[11px] font-medium text-emerald-100/80 uppercase tracking-wider">
                  Full Days (Sun–Thu)
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-center">
                <span className="block text-2xl lg:text-3xl font-extrabold text-amber-300">
                  {stats.totalFridayHalfDays}
                </span>
                <span className="text-[11px] font-medium text-emerald-100/80 uppercase tracking-wider">
                  Friday Half Days
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-center">
                <span className="block text-2xl lg:text-3xl font-extrabold text-rose-300">
                  {stats.totalApprovedHolidays}
                </span>
                <span className="text-[11px] font-medium text-emerald-100/80 uppercase tracking-wider">
                  Approved Holidays
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-center">
                <span className="block text-2xl lg:text-3xl font-extrabold text-rose-200">
                  {stats.totalWeekendDays}
                </span>
                <span className="text-[11px] font-medium text-emerald-100/80 uppercase tracking-wider">
                  Saturday Offs
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* WEEKLY TIMETABLE RULES BANNER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-rose-50 border border-stone-200/80 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-bold text-stone-800">
                <Clock className="w-4 h-4 text-[#214F39]" />
                <span>2027 Standard Weekly Schedule:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-medium">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Sun – Thu: Full Working Day (1.0 eq)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  Friday: Half Day (0.5 eq)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  Saturday: Weekly Off (School Closed)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS & FILTER SECTION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm">
            {/* View Mode Switcher */}
            <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 self-start">
              <button
                onClick={() => setViewMode('month')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'month'
                    ? 'bg-[#214F39] text-white shadow'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                Monthly View
              </button>
              <button
                onClick={() => setViewMode('year')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'year'
                    ? 'bg-[#214F39] text-white shadow'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                Yearly View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#214F39] text-white shadow'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                Holidays List
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'general', label: 'General (12)' },
                { id: 'public', label: 'Public N.I. (24)' },
                { id: 'optional', label: 'Optional (22)' },
                { id: 'school', label: 'School Events' },
                { id: 'exam', label: 'Exams' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#214F39] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CALENDAR DISPLAY */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* MONTHLY VIEW */}
          {viewMode === 'month' && (
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
              {/* Month Navigation Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-stone-100 gap-4 bg-gradient-to-r from-stone-50/50 to-white">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-100/60 text-[#214F39]">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-stone-900">
                      {MONTH_NAMES[selectedMonth]} {currentYear}
                    </h2>
                    <p className="text-xs text-stone-500 font-medium">
                      Select any date to view detailed status and school guidelines
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#214F39]"
                  >
                    {MONTH_NAMES.map((name, idx) => (
                      <option key={name} value={idx}>
                        {name} 2027
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 active:scale-95 transition-all"
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 active:scale-95 transition-all"
                    title="Next Month"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Color Legend Bar */}
              <div className="px-4 sm:px-6 py-2.5 bg-stone-50/80 border-b border-stone-100 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-stone-600">
                <span className="text-stone-400">Legend:</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-200 border border-emerald-400" />
                  Full Working Day (Sun–Thu)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-200 border border-amber-400" />
                  Friday Half Day
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-rose-200 border border-rose-400" />
                  Saturday Weekly Off
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-orange-200 border border-orange-400" />
                  General Holiday
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-pink-200 border border-pink-400" />
                  Public Holiday
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-sky-200 border border-sky-400" />
                  Optional Holiday
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-purple-200 border border-purple-400" />
                  School Event / Vacation
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-teal-200 border border-teal-400" />
                  Examination
                </span>
              </div>

              {/* 7-COLUMN CALENDAR GRID */}
              <div className="p-3 sm:p-6">
                {/* Weekday Labels Header */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {WEEKDAYS.map((wd, i) => (
                    <div
                      key={wd}
                      className={`text-center py-2 text-xs font-black uppercase tracking-wider rounded-xl ${
                        i === 4
                          ? 'bg-amber-50 text-amber-900 border border-amber-200/60'
                          : i === 5
                          ? 'bg-rose-50 text-rose-900 border border-rose-200/60'
                          : i === 6
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60'
                          : 'bg-stone-50 text-stone-700'
                      }`}
                    >
                      {wd}
                    </div>
                  ))}
                </div>

                {/* Day Cells Grid */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
                  {monthGridDays.map((dayInfo, idx) => {
                    if (!dayInfo) {
                      return (
                        <div
                          key={`empty-${idx}`}
                          className="h-20 sm:h-28 rounded-2xl bg-stone-50/40 border border-dashed border-stone-200/50"
                        />
                      );
                    }

                    const dayNum = parseInt(dayInfo.date.split('-')[2], 10);
                    const colorStyle = getColorClasses(dayInfo.colorType);

                    return (
                      <button
                        key={dayInfo.date}
                        onClick={() => setActiveDateModal(dayInfo)}
                        className={`h-20 sm:h-28 p-1.5 sm:p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between group cursor-pointer active:scale-[0.98] ${colorStyle}`}
                      >
                        {/* Day Number and status dot */}
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs sm:text-base font-black">
                            {dayNum}
                          </span>
                          {dayInfo.isWeekend && (
                            <span className="text-[9px] font-bold text-rose-700 hidden sm:inline">
                              Weekend
                            </span>
                          )}
                          {dayInfo.isFridayHalfDay && !dayInfo.holidayName && (
                            <span className="text-[9px] font-bold text-amber-800 hidden sm:inline">
                              Half Day
                            </span>
                          )}
                        </div>

                        {/* Holiday / Event Title */}
                        {dayInfo.holidayName ? (
                          <div className="w-full mt-1">
                            <p className="text-[10px] sm:text-xs font-bold truncate leading-tight">
                              {dayInfo.holidayName}
                            </p>
                            <span className="text-[8px] sm:text-[9px] font-medium opacity-80 uppercase block truncate">
                              {dayInfo.effectiveStatus === 'closed'
                                ? 'School Closed'
                                : dayInfo.effectiveStatus === 'half_day'
                                ? 'Half Day'
                                : 'School Open'}
                            </span>
                          </div>
                        ) : (
                          <div className="w-full hidden sm:block">
                            <span className="text-[9px] font-medium opacity-60">
                              {dayInfo.isWeekend
                                ? 'School Closed'
                                : dayInfo.isFridayHalfDay
                                ? 'Classes till 12:30'
                                : 'Regular Classes'}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* YEARLY VIEW */}
          {viewMode === 'year' && (
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-8">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-stone-900">
                    Full Year Overview • 2027
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Click any month to inspect its schedule and calendar grid
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {MONTH_NAMES.map((mName, mIdx) => {
                  const mEvents = events.filter((e) => {
                    const monthPart = parseInt(e.date.split('-')[1], 10) - 1;
                    return monthPart === mIdx && e.isApproved;
                  });

                  return (
                    <div
                      key={mName}
                      onClick={() => {
                        setSelectedMonth(mIdx);
                        setViewMode('month');
                      }}
                      className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 hover:bg-emerald-50/40 hover:border-emerald-300 transition-all cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-extrabold text-stone-900 group-hover:text-[#214F39] text-base">
                          {mName}
                        </h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700">
                          {mEvents.length} Holidays
                        </span>
                      </div>

                      <div className="space-y-1 mt-2">
                        {mEvents.slice(0, 3).map((me, i) => (
                          <div
                            key={i}
                            className="text-xs text-stone-600 truncate flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                            <span className="font-semibold text-stone-800">
                              {me.date.split('-')[2]}:
                            </span>
                            <span className="truncate">{me.title}</span>
                          </div>
                        ))}
                        {mEvents.length > 3 && (
                          <span className="text-[11px] text-[#214F39] font-bold block pt-1">
                            +{mEvents.length - 3} more holidays...
                          </span>
                        )}
                        {mEvents.length === 0 && (
                          <span className="text-xs text-stone-400 italic block py-2">
                            Regular academic session
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-stone-900">
                    2027 Holiday & Event Register
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Showing {filteredEventsList.length} gazetted and school events
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search holiday name, date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#214F39]"
                  />
                </div>
              </div>

              <div className="divide-y divide-stone-100">
                {filteredEventsList.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 hover:bg-stone-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className="w-14 h-14 rounded-2xl bg-[#214F39] text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                        <span className="text-xs uppercase font-extrabold tracking-wider text-[#E8B4A8]">
                          {MONTH_NAMES[parseInt(ev.date.split('-')[1], 10) - 1].slice(
                            0,
                            3
                          )}
                        </span>
                        <span className="text-lg font-black leading-none">
                          {ev.date.split('-')[2]}
                        </span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-extrabold text-stone-900 text-base sm:text-lg">
                            {ev.title}
                          </h3>
                          {getCategoryBadge(ev.category)}
                          {ev.endDate && (
                            <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                              Until {ev.endDate}
                            </span>
                          )}
                        </div>

                        {ev.description && (
                          <p className="text-xs text-stone-600 line-clamp-2 max-w-2xl">
                            {ev.description}
                          </p>
                        )}

                        {ev.instructions && (
                          <p className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg mt-1.5 inline-block">
                            📌 {ev.instructions}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {ev.schoolStatus === 'closed' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          School Closed
                        </span>
                      ) : ev.schoolStatus === 'half_day' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          Half Working Day
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          School Open
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {filteredEventsList.length === 0 && (
                  <div className="p-12 text-center text-stone-500">
                    <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="font-bold text-stone-700">No events matched</p>
                    <p className="text-xs text-stone-500">
                      Try searching with different keywords or reset category filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* UPCOMING HOLIDAYS & ACADEMIC INFO WIDGET */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming approved closures */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <Sun className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-stone-900 text-lg">
                  Upcoming Approved Holidays
                </h3>
              </div>
              <div className="space-y-3">
                {upcomingHolidays.map((uh, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100"
                  >
                    <div>
                      <h4 className="font-bold text-stone-800 text-sm">{uh.title}</h4>
                      <span className="text-xs text-stone-500">{uh.date}</span>
                    </div>
                    {getCategoryBadge(uh.category)}
                  </div>
                ))}
              </div>
            </div>

            {/* General School Guidelines */}
            <div className="bg-[#214F39] text-white rounded-3xl shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3 text-[#E8B4A8]">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-black text-lg">Academic Governance & Rules</h3>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Success Point School strictly adheres to the approved Bihar State Academic Calendar. Friday afternoons are reserved for co-curricular clubs, remedial sessions, and moral education lectures.
                </p>
                <div className="mt-4 space-y-2 text-xs text-emerald-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Bank-only holidays do not affect school classroom sessions.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Emergency weather closures are notified via SMS & Portal Noticeboard.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>School admin preserves right to adjust examination shifts.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200">
                <span>Success Point School • S.P.S. Academic Council</span>
                <span className="font-bold text-[#E8B4A8]">Year 2027</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* INTERACTIVE DATE DETAILS POPUP MODAL */}
      {activeDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden transform transition-all scale-100">
            {/* Modal Header */}
            <div className="bg-[#214F39] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#E8B4A8]">
                  {activeDateModal.dayName}
                </span>
                <h3 className="text-xl font-black">{activeDateModal.date}</h3>
              </div>
              <button
                onClick={() => setActiveDateModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Status Pill */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase">
                  School Status
                </span>
                {getStatusBadge(activeDateModal.effectiveStatus)}
              </div>

              {/* Day Type Details */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-500">Day Schedule:</span>
                  <span className="font-bold text-stone-800">
                    {activeDateModal.isWeekend
                      ? 'Weekly Off (Saturday)'
                      : activeDateModal.isFridayHalfDay
                      ? 'Friday Half Working Day'
                      : activeDateModal.dayOfWeek === 0
                      ? 'Sunday Full Working Day (School Open)'
                      : 'Full Working Day (Mon–Thu)'}
                  </span>
                </div>

                {activeDateModal.holidayName && (
                  <div className="pt-2 border-t border-stone-200/60">
                    <span className="text-[11px] font-semibold text-stone-500 block mb-1">
                      Event / Holiday:
                    </span>
                    <span className="text-sm font-black text-stone-900 block">
                      {activeDateModal.holidayName}
                    </span>
                    {activeDateModal.holidayCategory && (
                      <div className="mt-1.5">
                        {getCategoryBadge(activeDateModal.holidayCategory)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Descriptions & Instructions from associated events */}
              {activeDateModal.events.map((ev, i) => (
                <div key={i} className="text-xs text-stone-600 space-y-2">
                  {ev.description && (
                    <div>
                      <span className="font-bold text-stone-800 block mb-0.5">
                        Description:
                      </span>
                      <p className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                        {ev.description}
                      </p>
                    </div>
                  )}
                  {ev.instructions && (
                    <div>
                      <span className="font-bold text-amber-900 block mb-0.5">
                        Special Instructions:
                      </span>
                      <p className="bg-amber-50 text-amber-900 p-3 rounded-xl border border-amber-200/60 font-medium">
                        {ev.instructions}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {!activeDateModal.holidayName && (
                <p className="text-xs text-stone-500 italic text-center py-2">
                  {activeDateModal.isWeekend
                    ? 'School remains closed on Saturdays (Weekly Off).'
                    : activeDateModal.isFridayHalfDay
                    ? 'Regular academic classes in morning. Half-day dismissal at 12:30 PM.'
                    : activeDateModal.dayOfWeek === 0
                    ? 'Sunday school is open with regular full academic timetable.'
                    : 'Normal full school working day with regular timetable.'}
                </p>
              )}

              <button
                onClick={() => setActiveDateModal(null)}
                className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 active:scale-95 transition-all mt-4"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      <PublicFooter />
      </div>

      {/* =========================================================================
          DEDICATED OFFICIAL PRINTABLE CALENDAR (Visible in Print / PDF Only)
          ========================================================================= */}
      <div id="printable-calendar" className="hidden print:block text-slate-900 bg-white">
        {/* 1. Official School Header / Letterhead */}
        <div className="border-b-2 border-[#214F39] pb-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 relative shrink-0">
                <Image
                  src="/images/logo.jpeg"
                  alt="Success Point School Logo"
                  width={64}
                  height={64}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#214F39] tracking-tight uppercase">
                  SUCCESS POINT SCHOOL (S.P.S.)
                </h1>
                <p className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                  Academic Calendar &amp; Official Holiday Schedule — Year 2027
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Affiliated to CBSE / Bihar State Secondary Education Guidelines • Best Education, Good Results
                </p>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-600 space-y-0.5 shrink-0">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                OFFICIAL NOTIFICATION
              </span>
              <p className="font-bold text-slate-800">Academic Session: 2026-2027</p>
              <p>Helpline: +91 80512 17686</p>
              <p>Email: info@successpointschool.edu</p>
            </div>
          </div>
        </div>

        {/* 2. Schedule Rules & Working Days Statistics Box */}
        <div className="border border-slate-300 rounded-xl p-3.5 mb-4 bg-slate-50 print-avoid-break">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
            <div>
              <span className="text-xs font-black text-[#214F39] uppercase tracking-wider">
                Weekly School Schedule Rules (2027):
              </span>
              <span className="text-xs text-slate-700 ml-2 font-medium">
                • <strong>Sunday to Thursday:</strong> Full Working Day (8:00 AM – 2:00 PM)
                &nbsp;|&nbsp;
                • <strong>Friday:</strong> Half Working Day (Dismissal at 12:30 PM)
                &nbsp;|&nbsp;
                • <strong>Saturday:</strong> Weekly Off (School Closed)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="block font-black text-slate-800 text-base">{stats.totalCalendarDays}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Total Days</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-emerald-200">
              <span className="block font-black text-emerald-800 text-base">{stats.totalWorkingDays}</span>
              <span className="text-[10px] text-emerald-700 font-bold uppercase">Working Days</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="block font-black text-slate-800 text-base">{stats.totalFullWorkingDays}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Full Days (Sun–Thu)</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-amber-200">
              <span className="block font-black text-amber-800 text-base">{stats.totalFridayHalfDays}</span>
              <span className="text-[10px] text-amber-700 font-bold uppercase">Friday Half Days</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-rose-200">
              <span className="block font-black text-rose-800 text-base">{stats.totalApprovedHolidays}</span>
              <span className="text-[10px] text-rose-700 font-bold uppercase">Approved Holidays</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-rose-200">
              <span className="block font-black text-rose-700 text-base">{stats.totalWeekendDays}</span>
              <span className="text-[10px] text-rose-600 font-bold uppercase">Saturday Offs</span>
            </div>
          </div>
        </div>

        {/* 3. Selected Month Calendar Grid */}
        <div className="mb-5 print-avoid-break">
          <div className="flex items-center justify-between pb-1 mb-2 border-b border-slate-200">
            <h2 className="text-sm font-black text-[#214F39] uppercase tracking-wide">
              {MONTH_NAMES[selectedMonth].toUpperCase()} 2027 — MONTHLY CALENDAR GRID
            </h2>
            <span className="text-[11px] font-semibold text-slate-500">
              Weekly Timetable: Sunday Open • Friday Half Day • Saturday Closed
            </span>
          </div>

          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-[#214F39] text-white">
                {WEEKDAYS.map((wd, wIdx) => (
                  <th key={wIdx} className="border border-slate-300 py-1.5 px-2 text-center font-bold">
                    {wd}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(monthGridDays.length / 7) }).map((_, rIdx) => (
                <tr key={rIdx} className="h-14">
                  {Array.from({ length: 7 }).map((_, cIdx) => {
                    const day = monthGridDays[rIdx * 7 + cIdx];
                    if (!day) {
                      return <td key={cIdx} className="border border-slate-200 bg-slate-50/50" />;
                    }
                    const isSaturday = day.dayOfWeek === 6;
                    const isFriday = day.dayOfWeek === 5;
                    const isHoliday = day.holidayName && day.effectiveStatus === 'closed';

                    return (
                      <td
                        key={cIdx}
                        className={`border border-slate-200 p-1.5 align-top ${
                          isHoliday
                            ? 'bg-rose-50 text-rose-950'
                            : isSaturday
                            ? 'bg-rose-50/50 text-rose-900 font-semibold'
                            : isFriday
                            ? 'bg-amber-50/60 text-amber-950 font-semibold'
                            : 'bg-white text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs">
                            {parseInt(day.date.split('-')[2], 10)}
                          </span>
                          {isSaturday && (
                            <span className="text-[8px] px-1 py-0.2 bg-rose-200 text-rose-900 rounded font-bold">
                              OFF
                            </span>
                          )}
                          {isFriday && !isHoliday && (
                            <span className="text-[8px] px-1 py-0.2 bg-amber-200 text-amber-900 rounded font-bold">
                              HALF
                            </span>
                          )}
                          {isHoliday && (
                            <span className="text-[8px] px-1 py-0.2 bg-rose-600 text-white rounded font-bold">
                              HOLIDAY
                            </span>
                          )}
                        </div>
                        {day.holidayName && (
                          <p className="text-[9px] font-bold mt-1 line-clamp-2 leading-tight">
                            {day.holidayName}
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Complete 12-Month Official Holiday & Event List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b-2 border-slate-300">
            <h2 className="text-sm font-black text-[#214F39] uppercase tracking-wide">
              COMPLETE 2027 OFFICIAL SCHOOL HOLIDAYS &amp; VACATIONS LIST (JANUARY – DECEMBER 2027)
            </h2>
            <span className="text-[11px] font-bold text-slate-600">
              Gazetted Holidays &amp; School Approved Closures
            </span>
          </div>

          <div className="space-y-3">
            {MONTH_NAMES.map((mName, mIdx) => {
              const mEvents = eventsByMonth[mIdx] || [];
              if (mEvents.length === 0) return null;

              return (
                <div key={mIdx} className="border border-slate-200 rounded-lg overflow-hidden print-avoid-break">
                  <div className="bg-slate-100 px-3 py-1.5 flex items-center justify-between border-b border-slate-200">
                    <span className="font-black text-xs text-[#214F39] uppercase">
                      {mName} 2027
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {mEvents.length} {mEvents.length === 1 ? 'Event / Holiday' : 'Events / Holidays'}
                    </span>
                  </div>

                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                        <th className="py-1 px-2 text-left w-36">Date &amp; Day</th>
                        <th className="py-1 px-2 text-left">Holiday / Event Name</th>
                        <th className="py-1 px-2 text-left w-36">Category</th>
                        <th className="py-1 px-2 text-center w-28">School Status</th>
                        <th className="py-1 px-2 text-left">Remarks / Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mEvents.map((ev, eIdx) => (
                        <tr key={eIdx} className={eIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                          <td className="py-1.5 px-2 font-bold text-slate-800 whitespace-nowrap">
                            {formatPrintDate(ev.date)}
                          </td>
                          <td className="py-1.5 px-2 font-bold text-[#214F39]">
                            {ev.title}
                          </td>
                          <td className="py-1.5 px-2 text-slate-600">
                            {getCategoryPrintBadge(ev.category)}
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                                ev.schoolStatus === 'closed'
                                  ? 'bg-rose-100 text-rose-800'
                                  : ev.schoolStatus === 'half_day'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {getStatusPrintLabel(ev.schoolStatus, ev.isOptional)}
                            </span>
                          </td>
                          <td className="py-1.5 px-2 text-slate-600 text-[10px]">
                            {ev.description || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Official Verification & Stamp Section */}
        <div className="mt-8 pt-6 border-t-2 border-slate-300 print-avoid-break">
          <p className="text-[10px] text-slate-500 italic text-center mb-6">
            Certified that the above calendar for the Academic Year 2027 has been reviewed, approved, and officially
            promulgated for Success Point School by order of the Principal and Academic Council.
          </p>

          <div className="flex items-end justify-between px-8 text-center text-xs">
            <div>
              <div className="w-36 border-b border-slate-400 mb-1 mx-auto" />
              <p className="font-bold text-slate-800">Academic Coordinator</p>
              <p className="text-[10px] text-slate-500">Success Point School</p>
            </div>
            <div>
              <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center mx-auto mb-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                Official Seal
              </div>
              <p className="text-[10px] text-slate-500">Verified Stamp</p>
            </div>
            <div>
              <div className="w-36 border-b border-slate-400 mb-1 mx-auto" />
              <p className="font-bold text-slate-800">Principal / Director</p>
              <p className="text-[10px] text-slate-500">Success Point School</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
