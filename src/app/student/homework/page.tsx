'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useAuth } from '@/context/AuthContext';
import { BookCheck, Clock, CheckCircle2, Upload, FileText, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function StudentHomeworkPage() {
  const { user } = useAuth();
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit Modal
  const [selectedHw, setSelectedHw] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchHomework = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/homework');
      const data = await res.json();
      if (data.success) {
        setHomeworkList(data.homework);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework();
  }, []);

  const openSubmitModal = (hw: any) => {
    setSelectedHw(hw);
    const existing = hw.submissions?.find((s: any) => s.student?._id === user?._id || s.student === user?._id);
    setSubmissionText(existing?.submissionText || '');
    setFileUrl(existing?.fileUrl || '');
  };

  const handleHomeworkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHw) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          homeworkId: selectedHw._id,
          submissionText,
          fileUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Your homework has been successfully submitted!');
        setSelectedHw(null);
        fetchHomework();
      } else {
        alert(data.message || 'Error submitting homework.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell
      title="Homework & Class Tasks"
      subtitle="View subject tasks, due dates, submit written solutions, and review teacher feedback"
      allowedRoles={['student']}
      onRefresh={fetchHomework}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {homeworkList.map((hw) => {
          const submission = hw.submissions?.find((s: any) => s.student?._id === user?._id || s.student === user?._id);
          const isSubmitted = !!submission;
          const isReviewed = submission?.status === 'Reviewed';

          return (
            <div
              key={hw._id}
              className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition ${
                isReviewed
                  ? 'border-emerald-300 ring-1 ring-emerald-100'
                  : isSubmitted
                  ? 'border-blue-200'
                  : 'border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                      {hw.subject?.name} ({hw.subject?.code})
                    </span>
                    <h3 className="font-bold text-base text-slate-800 mt-0.5">{hw.title}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isReviewed
                        ? 'bg-emerald-100 text-emerald-800'
                        : isSubmitted
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isReviewed ? 'Graded & Reviewed' : isSubmitted ? 'Submitted' : 'Pending Submission'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed whitespace-pre-wrap">{hw.description}</p>

                <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Due Date: <strong>{formatDate(hw.dueDate)}</strong></span>
                  <span>•</span>
                  <span>Assigned by {hw.teacher?.name}</span>
                </div>

                {/* If reviewed, show grade & teacher comment */}
                {isReviewed && (
                  <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs">
                    <div className="flex justify-between items-center font-bold text-emerald-800">
                      <span>Teacher Score: {submission.marks} / 10</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    {submission.feedback && (
                      <p className="text-slate-600 mt-1 italic">"{submission.feedback}"</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => openSubmitModal(hw)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs ${
                    isSubmitted
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{isSubmitted ? 'Edit / View Submission' : 'Submit Homework'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Homework Submission Modal */}
      {selectedHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Submit Solution</h3>
                <p className="text-xs text-slate-500">{selectedHw.title} ({selectedHw.subject?.name})</p>
              </div>
              <button onClick={() => setSelectedHw(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleHomeworkSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Written Response / Notebook Solution *</label>
                <textarea
                  required
                  rows={5}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Type your response, answers to questions, or summary of completed assignment..."
                  className="w-full mt-1 p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Attachment File URL (Optional)</label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or cloudinary file URL"
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedHw(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Upload & Submit Solution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
