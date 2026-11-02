'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Video,
  PlayCircle,
  FileText,
  Search,
  ExternalLink,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function StudentLecturesPage() {
  const [lectures, setLectures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/lectures');
      const data = await res.json();
      if (data.success) {
        setLectures(data.lectures || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  const subjects = Array.from(new Set(lectures.map((l) => l.subject?.name).filter(Boolean)));

  const filteredLectures = lectures.filter((lec) => {
    const matchesSearch =
      lec.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || lec.subject?.name === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <DashboardShell
      title="Recorded Lectures & Study Notes"
      subtitle="Watch classroom video recordings uploaded by your teachers and download chapter notes"
      allowedRoles={['student']}
      onRefresh={fetchLectures}
    >
      {/* Search & Subject Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lectures by topic, chapter, or keyword..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              selectedSubject === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Subjects
          </button>
          {subjects.map((subj: any) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                selectedSubject === subj
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Lectures Grid */}
      {filteredLectures.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
            <Video className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-slate-800">No Video Lectures Available</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Your teachers haven't uploaded lectures for this subject yet. When they upload, they will appear right here for instant playback.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLectures.map((lec) => (
            <div
              key={lec._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {lec.subject?.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(lec.createdAt)}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">{lec.title}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {lec.description}
                </p>

                {lec.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {lec.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                {lec.videoUrl && (
                  <a
                    href={lec.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-white" />
                      <span>Watch Video Class</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {lec.attachmentUrl && (
                  <a
                    href={lec.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Download Study Notes (PDF)</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <div className="text-[11px] text-slate-400 pt-1 text-right">
                  Faculty: <strong className="text-slate-600">{lec.teacher?.name}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
