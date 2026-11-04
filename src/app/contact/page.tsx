'use client';

import React, { useState } from 'react';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  School,
  Bus,
} from 'lucide-react';

export default function ContactPage() {
  const [settings, setSettings] = useState<any>({
    contactPageTitle: 'Connect With Our School Administration & Academic Admissions Desk',
    contactPageSubtitle:
      'Have questions regarding admissions, transport facilities, or curriculum? Reach out via phone, email, or send us a direct message below.',
    address: 'Success Point School Campus, Knowledge City Zone, Main City Road, Pin - 800001',
    phone: '+91 8051217686',
    phoneAlt: '+91 98765 43210',
    email: 'info@successpointschool.edu',
    contactOfficeHours: 'Monday to Saturday: 08:00 AM – 02:30 PM',
    contactMapEmbedUrl: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
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
        body: JSON.stringify({
          studentName: formData.name,
          parentName: formData.name,
          phone: formData.phone,
          email: formData.email,
          applyingClass: formData.subject || 'General Inquiry',
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(
          'Your message has been received by the school administrative office. We will respond promptly!'
        );
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg(data.message || 'Error submitting message.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col font-sans selection:bg-[#214F39] selection:text-white transition-colors">
      <PublicHeader activePage="contact" />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#214F39] to-emerald-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#E8B4A8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
            style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Campus Location & Communication</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {settings.contactPageTitle || 'Connect With Our School Administration & Academic Admissions Desk'}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            {settings.contactPageSubtitle ||
              'Have questions regarding admissions, transport facilities, or curriculum? Reach out via phone, email, or send us a direct message below.'}
          </p>
        </div>
      </section>

      {/* Contact Information & Form Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Campus Details & Timings */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-sm space-y-5">
                <h2 className="text-xl font-black text-stone-900" style={{ color: '#214F39' }}>
                  Success Point School Campus
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#FAF8F5', color: '#214F39', border: '1px solid #E8B4A8' }}
                    >
                      <MapPin className="w-5 h-5 text-[#214F39]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        Campus Address
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-snug mt-0.5">
                        {settings.address || 'Success Point School Campus, Knowledge City Zone, Main City Road, Pin - 800001'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#FAF8F5', color: '#214F39', border: '1px solid #E8B4A8' }}
                    >
                      <Phone className="w-5 h-5 text-[#214F39]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        Phone Helpline
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-snug mt-0.5">
                        <a href={`tel:${settings.phone || '+918051217686'}`} className="hover:underline">
                          {settings.phone || '+91 8051217686'}
                        </a>
                        {settings.phoneAlt && (
                          <>
                            {' / '}
                            <a href={`tel:${settings.phoneAlt}`} className="hover:underline">
                              {settings.phoneAlt}
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#FAF8F5', color: '#214F39', border: '1px solid #E8B4A8' }}
                    >
                      <Mail className="w-5 h-5 text-[#214F39]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        Email Desk
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-snug mt-0.5">
                        <a href={`mailto:${settings.email || 'info@successpointschool.edu'}`} className="hover:underline">
                          {settings.email || 'info@successpointschool.edu'}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#FAF8F5', color: '#214F39', border: '1px solid #E8B4A8' }}
                    >
                      <Clock className="w-5 h-5 text-[#214F39]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        Visiting Hours
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-snug mt-0.5">
                        {settings.contactOfficeHours || 'Monday to Saturday: 08:00 AM – 02:30 PM'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transport & Safety Card */}
              <div
                className="p-6 rounded-3xl border shadow-sm text-white"
                style={{ backgroundColor: '#214F39', borderColor: '#E8B4A8' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bus className="w-5 h-5 text-[#E8B4A8]" />
                  <h3 className="font-bold text-sm text-white">Safe School Bus Transportation</h3>
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  Dedicated school buses and vans cover all major city and surrounding routes with verified drivers and GPS-assisted safety.
                </p>
              </div>
            </div>

            {/* Right Column: Direct Online Message Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-7 sm:p-9 rounded-3xl border border-stone-200/90 shadow-sm">
                <span
                  className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2"
                  style={{ backgroundColor: '#FAF8F5', color: '#214F39', border: '1px solid #E8B4A8' }}
                >
                  Send Inquiry
                </span>
                <h3 className="text-2xl font-black text-stone-900">
                  Send a Message to School Office
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Have a specific question? Submit your query and our team will get back to you.
                </p>

                {successMsg && (
                  <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Message Sent Successfully</p>
                      <p className="mt-0.5">{successMsg}</p>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Error</p>
                      <p className="mt-0.5">{errorMsg}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sunil Sharma"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#214F39] text-stone-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Mobile Phone Number *
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#214F39] text-stone-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Subject / Query Type
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Admission / Transport / Fee"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#214F39] text-stone-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your questions or message in detail..."
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
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
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
