'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Send,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function AdmissionsPage() {
  const [settings, setSettings] = useState<any>({
    admissionsPageTitle: 'Begin Your Child’s Journey to Academic Distinction & Character',
    admissionsPageSubtitle:
      'Welcome to Success Point School. Registrations are invited for Nursery through Class 11th for the 2026-27 academic session. Submit an inquiry online or visit our campus.',
    admissionsProcessStep1Title: 'Submit Inquiry / Registration',
    admissionsProcessStep1Desc:
      'Fill out the online admission registration form on this page or visit the school admission cell in person.',
    admissionsProcessStep2Title: 'Interaction & Assessment',
    admissionsProcessStep2Desc:
      'A friendly, age-appropriate interactive dialogue or basic diagnostic assessment to understand the child’s learning readiness.',
    admissionsProcessStep3Title: 'Document Verification',
    admissionsProcessStep3Desc:
      'Verification of birth certificate, previous school records, transfer certificate (TC), and parent identification.',
    admissionsProcessStep4Title: 'Confirmation & Welcome Kit',
    admissionsProcessStep4Desc:
      'Fee clearance, generation of student enrollment number, uniform sizing, and issuance of student portal access credentials.',
    admissionsRequiredDocsText:
      'Original Transfer Certificate (T.C.) from previous recognized school\nSelf-attested copy of Birth Certificate (issued by Municipal / Gram Panchayat)\nPrevious Academic Year Report Card / Marksheet\n4 recent passport size photographs of the student\n2 passport size photographs of Father and Mother / Guardian\nCopy of Aadhar Card of Student and Parents',
    phone: '+91 8051217686',
    phoneAlt: '+91 98765 43210',
  });

  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    applyingClass: 'Nursery',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev: any) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(
          data.message ||
            'Your admission inquiry has been received! Our admissions counselor will contact you within 24 hours.'
        );
        setFormData({
          studentName: '',
          parentName: '',
          phone: '',
          email: '',
          applyingClass: 'Nursery',
          message: '',
        });
      } else {
        setErrorMsg(data.message || 'Error submitting inquiry. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error submitting inquiry.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      num: '01',
      title: settings.admissionsProcessStep1Title || 'Submit Inquiry / Registration',
      desc: settings.admissionsProcessStep1Desc || 'Fill out the online admission registration form on this page or visit the school admission cell in person.',
    },
    {
      num: '02',
      title: settings.admissionsProcessStep2Title || 'Interaction & Assessment',
      desc: settings.admissionsProcessStep2Desc || 'A friendly, age-appropriate interactive dialogue or basic diagnostic assessment to understand the child’s learning readiness.',
    },
    {
      num: '03',
      title: settings.admissionsProcessStep3Title || 'Document Verification',
      desc: settings.admissionsProcessStep3Desc || 'Verification of birth certificate, previous school records, transfer certificate (TC), and parent identification.',
    },
    {
      num: '04',
      title: settings.admissionsProcessStep4Title || 'Confirmation & Welcome Kit',
      desc: settings.admissionsProcessStep4Desc || 'Fee clearance, generation of student enrollment number, uniform sizing, and issuance of student portal access credentials.',
    },
  ];

  const requiredDocs = settings.admissionsRequiredDocsText
    ? settings.admissionsRequiredDocsText
        .split('\n')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
    : [
        'Original Transfer Certificate (T.C.) from previous recognized school',
        'Self-attested copy of Birth Certificate (issued by Municipal / Gram Panchayat)',
        'Previous Academic Year Report Card / Marksheet',
        '4 recent passport size photographs of the student',
        '2 passport size photographs of Father and Mother / Guardian',
        'Copy of Aadhar Card of Student and Parents',
      ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col font-sans selection:bg-[#214F39] selection:text-white">
      <PublicHeader activePage="admissions" />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#214F39] to-emerald-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#E8B4A8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
            style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admissions Open • Session 2026-2027</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {settings.admissionsPageTitle || 'Begin Your Child’s Journey to Academic Distinction & Character'}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            {settings.admissionsPageSubtitle ||
              'Welcome to Success Point School. Registrations are invited for Nursery through Class 11th for the 2026-27 academic session. Submit an inquiry online or visit our campus.'}
          </p>
        </div>
      </section>

      {/* Main Content & Registration Form Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Admission Procedure & Information */}
            <div className="lg:col-span-7 space-y-10">
              {/* Step by Step Process */}
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#214F39',
                    borderColor: '#E8B4A8',
                  }}
                >
                  Step-by-Step Guide
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2" style={{ color: '#214F39' }}>
                  Admission Procedure
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  We maintain a transparent, merit-focused, and parent-friendly enrollment process.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {steps.map((st) => (
                    <div
                      key={st.num}
                      className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2"
                    >
                      <span
                        className="inline-block text-xs font-black px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: '#FAF8F5', color: '#214F39', border: '1px solid #E8B4A8' }}
                      >
                        STEP {st.num}
                      </span>
                      <h3 className="font-bold text-sm text-stone-900">{st.title}</h3>
                      <p className="text-xs text-stone-600 leading-relaxed">{st.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Checklist */}
              <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-[#214F39]" />
                  <h3 className="text-lg font-black text-stone-900">
                    Required Documents for Admission
                  </h3>
                </div>
                <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                  Parents are requested to bring original copies along with self-attested photocopies during document verification:
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {requiredDocs.map((doc: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-[#214F39] shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admission Helpline Card */}
              <div
                className="p-6 rounded-3xl border text-white flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{ backgroundColor: '#214F39', borderColor: '#E8B4A8' }}
              >
                <div>
                  <h4 className="font-black text-base text-white">Need Assistance with Admission?</h4>
                  <p className="text-xs text-emerald-200 mt-1">
                    Our admissions office is open Monday to Saturday from 08:00 AM to 02:30 PM.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={`tel:${settings.phone || '+918051217686'}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                    style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call {settings.phone || '+91 8051217686'}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Online Registration / Inquiry Form */}
            <div className="lg:col-span-5">
              <div
                className="bg-white rounded-3xl border p-6 sm:p-8 shadow-xl sticky top-28"
                style={{
                  borderColor: 'rgba(232, 180, 168, 0.9)',
                }}
              >
                <div className="text-center pb-4 border-b border-stone-100">
                  <span
                    className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2"
                    style={{ backgroundColor: '#FAF8F5', color: '#214F39', border: '1px solid #E8B4A8' }}
                  >
                    Session 2026-2027
                  </span>
                  <h3 className="text-xl font-black text-stone-900">
                    Online Admission Inquiry Form
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Fill the form below to register your interest. Our academic counselor will reach out to schedule an interaction.
                  </p>
                </div>

                {successMsg && (
                  <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Inquiry Submitted!</p>
                      <p className="mt-0.5">{successMsg}</p>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Submission Failed</p>
                      <p className="mt-0.5">{errorMsg}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      placeholder="e.g. Aryan Kumar"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#214F39] text-stone-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#214F39] text-stone-900 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Contact Mobile *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#214F39] text-stone-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Class Applying For *
                      </label>
                      <select
                        required
                        value={formData.applyingClass}
                        onChange={(e) => setFormData({ ...formData, applyingClass: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#214F39] text-stone-900 bg-white"
                      >
                        <option value="Nursery">Nursery</option>
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                        <option value="Class 1">Class 1st</option>
                        <option value="Class 2">Class 2nd</option>
                        <option value="Class 3">Class 3rd</option>
                        <option value="Class 4">Class 4th</option>
                        <option value="Class 5">Class 5th</option>
                        <option value="Class 6">Class 6th</option>
                        <option value="Class 7">Class 7th</option>
                        <option value="Class 8">Class 8th</option>
                        <option value="Class 9">Class 9th</option>
                        <option value="Class 10">Class 10th</option>
                        <option value="Class 11 Science">Class 11th - Science</option>
                        <option value="Class 11 Commerce">Class 11th - Commerce</option>
                        <option value="Class 11 Arts">Class 11th - Arts</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="parent@example.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#214F39] text-stone-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Any Questions / Remarks
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about previous school, special interests, or any queries..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#214F39] text-stone-900 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50"
                    style={{ backgroundColor: '#214F39' }}
                  >
                    {loading ? (
                      <span>Submitting Registration...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Admission Inquiry</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-stone-400 text-center pt-2">
                    🔒 Your details are securely encrypted and forwarded directly to the admission desk.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
