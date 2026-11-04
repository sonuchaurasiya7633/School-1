'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import { formatDate } from '@/lib/utils';
import {
  Bell,
  Calendar,
  Search,
  X,
  FileText,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetch('/api/public/notices')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.notices) {
          setNotices(data.notices);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const defaultNotices = [
    {
      _id: 'default-1',
      title: 'Admissions Open for Academic Session 2026-2027',
      content:
        'Success Point School invites online and offline admission applications for Nursery to Class 11th. Visit the admissions cell or submit inquiry online through the website portal.',
      date: new Date().toISOString(),
      isPinned: true,
      category: 'Admission',
      author: { name: 'Principal Office' },
    },
    {
      _id: 'default-2',
      title: 'Annual Science, Robotics & Art Exhibition',
      content:
        'All students are requested to prepare their working science models and charts. Parents are cordially invited on Saturday from 09:30 AM to 01:30 PM.',
      date: new Date().toISOString(),
      isPinned: true,
      category: 'Events',
      author: { name: 'Academic Committee' },
    },
    {
      _id: 'default-3',
      title: 'Subject Teachers Uploaded Recorded Video Lectures',
      content:
        'Fresh video lecture modules and PDF problem sets have been released on the Student E-Learning Portal. Students are advised to log in and revise current chapters.',
      date: new Date().toISOString(),
      isPinned: false,
      category: 'Academic',
      author: { name: 'Academic Desk' },
    },
    {
      _id: 'default-4',
      title: 'Parent-Teacher Meeting (PTM) Schedule',
      content:
        'The upcoming PTM for reviewing student quarterly performance, attendance, and homework will be held next weekend. Report cards will be reviewed.',
      date: new Date().toISOString(),
      isPinned: false,
      category: 'Meeting',
      author: { name: 'Examination Cell' },
    },
  ];

  const displayList = notices.length > 0 ? notices : defaultNotices;

  const filteredNotices = displayList.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col font-sans selection:bg-[#214F39] selection:text-white transition-colors">
      <PublicHeader activePage="notices" />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#214F39] to-emerald-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#E8B4A8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
            style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Official Institutional Circulars</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            School Notice Board & <br className="hidden sm:block" />
            <span className="text-[#E8B4A8]">Important Announcements</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Stay updated with real-time circulars, examination timetables, holiday declarations, academic guidelines, and school events.
          </p>
        </div>
      </section>

      {/* Main Notice Board Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Controls */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-sm mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#214F39] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search circulars by keyword, exam, holiday, or event..."
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#214F39] text-stone-900 bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold"
                style={{ backgroundColor: '#FAF8F5', color: '#214F39', border: '1px solid #E8B4A8' }}
              >
                Showing {filteredNotices.length} Circulars
              </span>
            </div>
          </div>

          {/* Notices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotices.map((notice, idx) => (
              <div
                key={notice._id || idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm hover:shadow-lg transition flex flex-col justify-between relative overflow-hidden"
              >
                {notice.isPinned && (
                  <div
                    className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-extrabold uppercase tracking-wider shadow-2xs"
                    style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
                  >
                    IMPORTANT PINNED
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-[#214F39]" />
                    <span>{notice.date ? formatDate(notice.date) : 'Recently Published'}</span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                    {notice.content}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                  <span>Issued: {notice.author?.name || 'School Office'}</span>
                  <span className="flex items-center gap-1 text-[#214F39]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Notice
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredNotices.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-stone-200">
              <AlertCircle className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <h4 className="font-bold text-base text-stone-800">No Circulars Found</h4>
              <p className="text-xs text-stone-500 mt-1">
                No school circulars matched &quot;{searchQuery}&quot;. Please adjust your search query.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white transition"
                style={{ backgroundColor: '#214F39' }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
