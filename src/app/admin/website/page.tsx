'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import {
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  GraduationCap,
  Bell,
  School,
  Sparkles,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Phone,
  MessageSquare,
  Award,
  Layers,
  MapPin,
  Clock,
  Star,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { authFetch } from '@/lib/api';
import { AvatarUploader } from '@/components/common/AvatarUploader';
import FooterCMSManager from '@/components/admin/FooterCMSManager';

export default function AdminWebsiteCMSPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'academics' | 'admissions' | 'contact' | 'testimonials' | 'footer'>('home');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['home', 'about', 'academics', 'admissions', 'contact', 'testimonials', 'footer'].includes(tab)) {
        setActiveTab(tab as any);
      }
    }
  }, []);

  const [formData, setFormData] = useState<any>({
    // Global & Header
    schoolName: 'Success Point School',
    tagline: 'Best Education, Good Results.',
    phone: '+91 8051217686',
    phoneAlt: '+91 98765 43210',
    email: 'contact@successpointschool.edu',
    address: 'Success Point Campus, Knowledge Zone, City Central, Pin - 800001',
    announcement: 'Admissions Open for Academic Session 2026-2027 • Apply Online Today',
    admissionsOpen: true,

    // Director
    directorName: 'Subodh Kumar Sharma',
    directorDesignation: 'Director',
    directorQualifications: 'M.A. | D.El.Ed | B.Ed | CTET | STET',
    directorMessage:
      'Dedicated to fostering an atmosphere of intellectual curiosity, moral discipline, and comprehensive educational development for every student at Success Point School.',
    directorImage: '/images/director.jpg',

    // Home - Hero
    heroBadge: 'Success Point School • Empowering Future Leaders',
    heroTitle: 'Building Knowledge, Character & Academic Brilliance',
    heroSubtitle:
      'Welcome to the digital learning campus of Success Point School (S.P.S.). We provide state-of-the-art classroom education, recorded video lectures, continuous evaluation, and dedicated student care.',
    heroCta1Text: 'Apply for Admission 2026-27',
    heroCta1Link: '/admissions',
    heroCta2Text: 'Explore Programs & Streams',
    heroCta2Link: '/academics',
    heroImage: '/images/hero-banner.jpg',

    // Home - Stats
    statsStudents: '1,400+',
    statsStudentsSub: 'Nursery to Class 12th',
    statsFaculty: '35+',
    statsFacultySub: 'B.Ed / D.El.Ed Certified',
    statsSmartClasses: '100%',
    statsSmartClassesSub: 'Audio/Video Enabled',
    statsDistinction: '99.4%',
    statsDistinctionSub: 'Consistent Top Ranks',

    // Home - About Spotlight
    aboutHomeBadge: 'About Our Institution',
    aboutHomeTitle: 'Empowering Students with Knowledge, Ethics & Modern Skills',
    aboutHomeDesc:
      'At Success Point School, education transcends routine textbooks. We blend rigorous academic instruction with interactive smart classroom technologies, moral values, debate, sports, and science exhibitions.',
    aboutHomeFeature1: 'Activity-Based Kindergarten',
    aboutHomeFeature2: 'Digital Video Lecture Portal',
    aboutHomeFeature3: 'Science, Arts & Commerce Streams',
    aboutHomeFeature4: 'CCTV Safe & Secure Campus',

    // Home - Admissions Callout
    admissionsBannerBadge: 'Enrollment Open 2026-2027',
    admissionsBannerTitle: 'Give Your Child the Advantage of Quality Education',
    admissionsBannerDesc:
      'Admissions are now open for Nursery through Class 11th. Seats are allotted on a first-come, first-served basis following our interaction assessment.',

    // About Page (/about)
    aboutPageBadge: 'Success Point School • Established with Purpose',
    aboutPageTitle: 'Nurturing Minds, Inspiring Character & Shaping Future Leaders',
    aboutPageSubtitle:
      'Founded on the ideals of quality education and inclusive growth, Success Point School provides students from Nursery to Senior Secondary with an empowering environment to excel academically and ethically.',
    aboutVisionTitle: 'Our Vision',
    aboutVisionDesc:
      'To be an exemplary center of academic brilliance, nurturing disciplined, innovative, and ethically grounded global citizens equipped to overcome challenges of the modern world.',
    aboutMissionTitle: 'Our Mission',
    aboutMissionDesc:
      'To provide a holistic education combining high academic rigor, physical well-being, scientific temper, moral clarity, and cultural pride through dedicated educators and modern learning tools.',
    aboutPhilosophy:
      'We believe that every child possesses unique potential. Our child-centric pedagogical approach fosters curiosity, emotional resilience, collaborative leadership, and independent thinking in a joyful and safe environment.',

    // Academics Page (/academics)
    academicsPageTitle: 'Structured Academic Pathways from Nursery to Senior Secondary',
    academicsPageSubtitle:
      'A comprehensive curriculum designed to blend deep conceptual learning, laboratory experimentation, competitive examination mastery, and digital revision lectures.',
    academicsScienceDesc:
      'Rigorous scientific pedagogy with state-of-the-art laboratory practicals. Prepares students for Engineering, Medicine, Research, and Technical fields.',
    academicsCommerceDesc:
      'Comprehensive financial, managerial, and economic acumen. Ideal for Chartered Accountancy (CA), Management (BBA/MBA), Banking, and Entrepreneurship.',
    academicsArtsDesc:
      'Deep understanding of societal structures, governance, global affairs, and literature. Ideal for Civil Services (UPSC), Law, Journalism, and Academia.',

    // Admissions Page (/admissions)
    admissionsPageTitle: 'Begin Your Child’s Transformative Educational Journey',
    admissionsPageSubtitle:
      'Admissions Open for Session 2026-2027 from Nursery to Class 11th. We invite parents and guardians to partner with us for exceptional student care.',
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
      '• Original Transfer Certificate (T.C.) from previous recognized school\n• Self-attested copy of Birth Certificate (Municipal/Gram Panchayat)\n• Previous Academic Year Report Card / Marksheet\n• 4 recent passport size photographs of the student\n• Photocopy of Parent Aadhaar Card / ID Proof',

    // Contact Page (/contact)
    contactPageTitle: 'Connect With Our School Administration & Admissions Desk',
    contactPageSubtitle:
      'Have questions regarding admissions, transport facilities, or curriculum? Reach out via phone, email, or send us a direct message below.',
    contactOfficeHours: 'Office Hours: 08:00 AM - 02:30 PM (Monday to Saturday)',

    // Testimonials
    testimonials: [
      {
        name: 'Rameshwar Roy',
        relation: 'Parent of Class 8th Student',
        text: 'The dedicated faculty and recorded video lecture portal have transformed my child’s learning discipline. The teachers explain tough concepts with immense patience.',
        rating: 5,
      },
      {
        name: 'Pooja Srivastava',
        relation: 'Parent of Class 4th Student',
        text: 'Success Point School balances moral character with academic rigor. The smart classroom visual lessons have made Mathematics and Science truly fun for my daughter.',
        rating: 5,
      },
      {
        name: 'Anand Jha',
        relation: 'Parent of Class 10th Student',
        text: 'Outstanding board exam guidance and personal mentoring by the teachers. The continuous diagnostic evaluations helped my son top his district board exams.',
        rating: 5,
      },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    authFetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setFormData((prev: any) => ({
            ...prev,
            ...data.settings,
          }));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Website content for all pages updated and published live!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(data.message || 'Failed to update website content.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setSaving(false);
    }
  };

  const updateTestimonial = (index: number, field: string, value: any) => {
    const list = [...(formData.testimonials || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, testimonials: list }));
  };

  const addTestimonial = () => {
    const list = [
      ...(formData.testimonials || []),
      {
        name: 'New Parent / Student',
        relation: 'Parent of Class 5th Student',
        text: 'Success Point School provides exceptional academic instruction and caring mentorship.',
        rating: 5,
      },
    ];
    setFormData((prev: any) => ({ ...prev, testimonials: list }));
  };

  const removeTestimonial = (index: number) => {
    const list = (formData.testimonials || []).filter((_: any, i: number) => i !== index);
    setFormData((prev: any) => ({ ...prev, testimonials: list }));
  };

  const tabs = [
    { id: 'home', label: 'Home Page CMS', icon: Globe },
    { id: 'about', label: 'About Us Page', icon: BookOpen },
    { id: 'academics', label: 'Academics Page', icon: GraduationCap },
    { id: 'admissions', label: 'Admissions Page', icon: Award },
    { id: 'contact', label: 'Contact & Campus', icon: MapPin },
    { id: 'testimonials', label: 'Reviews & Testimonials', icon: Star },
    { id: 'footer', label: 'Footer Management', icon: Layers },
  ];

  return (
    <DashboardShell title="Universal Website CMS & Content Manager">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Master CMS Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Public Website CMS
            </h1>
            <p className="text-xs text-slate-400">
              Manage every page, headline, description, Director profile, contact info, and testimonials across the entire public school website.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20 flex items-center gap-1.5"
            >
              <span>Preview Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status Alerts */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {activeTab === 'footer' ? (
          <FooterCMSManager />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
          {/* ========================================================= */}
          {/* TAB 1: HOME PAGE CMS */}
          {/* ========================================================= */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Director Profile Details */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Director Profile & Message</h2>
                    <p className="text-xs text-slate-400">
                      Configure the Director leadership card displayed on the Home Page and About Page.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Director Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.directorName}
                      onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Designation / Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.directorDesignation}
                      onChange={(e) =>
                        setFormData({ ...formData, directorDesignation: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Educational Qualifications (Displayed on Director Badge)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.directorQualifications}
                    onChange={(e) =>
                      setFormData({ ...formData, directorQualifications: e.target.value })
                    }
                    placeholder="M.A. | D.El.Ed | B.Ed | CTET | STET"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Director Leadership Statement / Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.directorMessage}
                    onChange={(e) => setFormData({ ...formData, directorMessage: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Director Official Portrait / Photo
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-800 mb-3">
                    <AvatarUploader
                      currentAvatar={formData.directorImage}
                      name={formData.directorName || 'Director'}
                      targetUserId="director"
                      size="lg"
                      onSuccess={(url) => {
                        setFormData((prev: any) => ({ ...prev, directorImage: url }));
                        setSuccessMsg('Director photo updated on Cloudinary & live website!');
                      }}
                    />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">Click Camera Icon to Upload Photo</p>
                      <p className="text-[11px] text-slate-400">
                        Upload directly to Cloudinary or specify an image URL below. This photo will appear in the Director's message section on the website.
                      </p>
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.directorImage}
                    onChange={(e) => setFormData({ ...formData, directorImage: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="Image URL or Cloudinary Link"
                  />
                </div>
              </div>

              {/* Hero Banner Section */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Homepage Hero Banner</h2>
                    <p className="text-xs text-slate-400">
                      Configure the main headline, subtitle, badge, and call-to-action buttons.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Hero Top Pill Badge Text
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.heroBadge}
                    onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Hero Main Headline Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Hero Subtitle Description
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.heroSubtitle}
                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Button 1 Text
                    </label>
                    <input
                      type="text"
                      value={formData.heroCta1Text}
                      onChange={(e) => setFormData({ ...formData, heroCta1Text: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Button 2 Text
                    </label>
                    <input
                      type="text"
                      value={formData.heroCta2Text}
                      onChange={(e) => setFormData({ ...formData, heroCta2Text: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Hero Banner Showcase Image */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <label className="block text-xs font-bold text-slate-300">
                    Hero Showcase Banner Image URL
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Official school banner image displayed prominently in the hero section below the CTA buttons.
                  </p>
                  <input
                    type="text"
                    value={formData.heroImage || ''}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="/images/hero-banner.jpg or https://..."
                  />
                  {formData.heroImage && (
                    <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 max-w-md">
                      <img
                        src={formData.heroImage}
                        alt="Hero Banner Preview"
                        className="w-full h-auto object-cover max-h-48"
                      />
                      <div className="p-2 bg-slate-900/90 text-[10px] text-slate-300 font-medium">
                        Live Preview: {formData.heroImage}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Stats Ribbon Numbers */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Homepage Stats Ribbon (4 Numbers)</h2>
                    <p className="text-xs text-slate-400">
                      The four statistical highlights displayed right below the hero section.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <label className="block text-[11px] font-bold text-purple-300 uppercase">Stat 1: Students</label>
                    <input
                      type="text"
                      value={formData.statsStudents}
                      onChange={(e) => setFormData({ ...formData, statsStudents: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                      placeholder="1,400+"
                    />
                    <input
                      type="text"
                      value={formData.statsStudentsSub}
                      onChange={(e) => setFormData({ ...formData, statsStudentsSub: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-[11px]"
                      placeholder="Nursery to Class 12th"
                    />
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <label className="block text-[11px] font-bold text-purple-300 uppercase">Stat 2: Faculty</label>
                    <input
                      type="text"
                      value={formData.statsFaculty}
                      onChange={(e) => setFormData({ ...formData, statsFaculty: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                      placeholder="35+"
                    />
                    <input
                      type="text"
                      value={formData.statsFacultySub}
                      onChange={(e) => setFormData({ ...formData, statsFacultySub: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-[11px]"
                      placeholder="B.Ed / D.El.Ed Certified"
                    />
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <label className="block text-[11px] font-bold text-purple-300 uppercase">Stat 3: Smart Classes</label>
                    <input
                      type="text"
                      value={formData.statsSmartClasses}
                      onChange={(e) => setFormData({ ...formData, statsSmartClasses: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                      placeholder="100%"
                    />
                    <input
                      type="text"
                      value={formData.statsSmartClassesSub}
                      onChange={(e) => setFormData({ ...formData, statsSmartClassesSub: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-[11px]"
                      placeholder="Audio/Video Enabled"
                    />
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                    <label className="block text-[11px] font-bold text-purple-300 uppercase">Stat 4: Distinction</label>
                    <input
                      type="text"
                      value={formData.statsDistinction}
                      onChange={(e) => setFormData({ ...formData, statsDistinction: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                      placeholder="99.4%"
                    />
                    <input
                      type="text"
                      value={formData.statsDistinctionSub}
                      onChange={(e) => setFormData({ ...formData, statsDistinctionSub: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-[11px]"
                      placeholder="Consistent Top Ranks"
                    />
                  </div>
                </div>
              </div>

              {/* Homepage About Spotlight & Admissions Callout */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Homepage About Spotlight & Admission Banner</h2>
                    <p className="text-xs text-slate-400">
                      Configure the "About Our Institution" section and admissions banner on the home page.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      About Spotlight Title
                    </label>
                    <input
                      type="text"
                      value={formData.aboutHomeTitle}
                      onChange={(e) => setFormData({ ...formData, aboutHomeTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      About Spotlight Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.aboutHomeDesc}
                      onChange={(e) => setFormData({ ...formData, aboutHomeDesc: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Feature 1</label>
                      <input
                        type="text"
                        value={formData.aboutHomeFeature1}
                        onChange={(e) => setFormData({ ...formData, aboutHomeFeature1: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Feature 2</label>
                      <input
                        type="text"
                        value={formData.aboutHomeFeature2}
                        onChange={(e) => setFormData({ ...formData, aboutHomeFeature2: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Feature 3</label>
                      <input
                        type="text"
                        value={formData.aboutHomeFeature3}
                        onChange={(e) => setFormData({ ...formData, aboutHomeFeature3: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Feature 4</label>
                      <input
                        type="text"
                        value={formData.aboutHomeFeature4}
                        onChange={(e) => setFormData({ ...formData, aboutHomeFeature4: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Admissions Callout Banner Title
                    </label>
                    <input
                      type="text"
                      value={formData.admissionsBannerTitle}
                      onChange={(e) => setFormData({ ...formData, admissionsBannerTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Admissions Callout Banner Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.admissionsBannerDesc}
                      onChange={(e) => setFormData({ ...formData, admissionsBannerDesc: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ABOUT US PAGE (/about) */}
          {/* ========================================================= */}
          {activeTab === 'about' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">About Us Page Content (/about)</h2>
                  <p className="text-xs text-slate-400">
                    Manage Vision, Mission, Educational Philosophy, and Institutional Background.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  About Page Hero Headline
                </label>
                <input
                  type="text"
                  value={formData.aboutPageTitle}
                  onChange={(e) => setFormData({ ...formData, aboutPageTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  About Page Hero Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formData.aboutPageSubtitle}
                  onChange={(e) => setFormData({ ...formData, aboutPageSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Our Vision Title
                  </label>
                  <input
                    type="text"
                    value={formData.aboutVisionTitle}
                    onChange={(e) => setFormData({ ...formData, aboutVisionTitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                  <label className="block text-[11px] font-bold text-slate-400 mt-2 mb-1">
                    Vision Statement
                  </label>
                  <textarea
                    rows={4}
                    value={formData.aboutVisionDesc}
                    onChange={(e) => setFormData({ ...formData, aboutVisionDesc: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Our Mission Title
                  </label>
                  <input
                    type="text"
                    value={formData.aboutMissionTitle}
                    onChange={(e) => setFormData({ ...formData, aboutMissionTitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                  <label className="block text-[11px] font-bold text-slate-400 mt-2 mb-1">
                    Mission Statement
                  </label>
                  <textarea
                    rows={4}
                    value={formData.aboutMissionDesc}
                    onChange={(e) => setFormData({ ...formData, aboutMissionDesc: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Educational Philosophy & Core Values Summary
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutPhilosophy}
                  onChange={(e) => setFormData({ ...formData, aboutPhilosophy: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: ACADEMICS PAGE (/academics) */}
          {/* ========================================================= */}
          {activeTab === 'academics' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Academics & Curriculum Page (/academics)</h2>
                  <p className="text-xs text-slate-400">
                    Manage Curriculum descriptions, stream specializations, and academic philosophy.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Academics Page Main Title
                </label>
                <input
                  type="text"
                  value={formData.academicsPageTitle}
                  onChange={(e) => setFormData({ ...formData, academicsPageTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Academics Page Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formData.academicsPageSubtitle}
                  onChange={(e) => setFormData({ ...formData, academicsPageSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Science Stream Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.academicsScienceDesc}
                    onChange={(e) => setFormData({ ...formData, academicsScienceDesc: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Commerce Stream Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.academicsCommerceDesc}
                    onChange={(e) => setFormData({ ...formData, academicsCommerceDesc: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Arts & Humanities Stream Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.academicsArtsDesc}
                    onChange={(e) => setFormData({ ...formData, academicsArtsDesc: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: ADMISSIONS PAGE (/admissions) */}
          {/* ========================================================= */}
          {activeTab === 'admissions' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Admissions & Registration Page (/admissions)</h2>
                  <p className="text-xs text-slate-400">
                    Configure the admission steps, required documents checklist, and headline.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Admissions Page Main Title
                </label>
                <input
                  type="text"
                  value={formData.admissionsPageTitle}
                  onChange={(e) => setFormData({ ...formData, admissionsPageTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Admissions Page Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formData.admissionsPageSubtitle}
                  onChange={(e) => setFormData({ ...formData, admissionsPageSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-purple-300">Step 1: Registration</label>
                  <input
                    type="text"
                    value={formData.admissionsProcessStep1Title}
                    onChange={(e) => setFormData({ ...formData, admissionsProcessStep1Title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  />
                  <textarea
                    rows={2}
                    value={formData.admissionsProcessStep1Desc}
                    onChange={(e) => setFormData({ ...formData, admissionsProcessStep1Desc: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                  />
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-purple-300">Step 2: Assessment</label>
                  <input
                    type="text"
                    value={formData.admissionsProcessStep2Title}
                    onChange={(e) => setFormData({ ...formData, admissionsProcessStep2Title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  />
                  <textarea
                    rows={2}
                    value={formData.admissionsProcessStep2Desc}
                    onChange={(e) => setFormData({ ...formData, admissionsProcessStep2Desc: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                  />
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-purple-300">Step 3: Verification</label>
                  <input
                    type="text"
                    value={formData.admissionsProcessStep3Title}
                    onChange={(e) => setFormData({ ...formData, admissionsProcessStep3Title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  />
                  <textarea
                    rows={2}
                    value={formData.admissionsProcessStep3Desc}
                    onChange={(e) => setFormData({ ...formData, admissionsProcessStep3Desc: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                  />
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-purple-300">Step 4: Confirmation</label>
                  <input
                    type="text"
                    value={formData.admissionsProcessStep4Title}
                    onChange={(e) => setFormData({ ...formData, admissionsProcessStep4Title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  />
                  <textarea
                    rows={2}
                    value={formData.admissionsProcessStep4Desc}
                    onChange={(e) => setFormData({ ...formData, admissionsProcessStep4Desc: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Required Documents Checklist (Shown to Parents)
                </label>
                <textarea
                  rows={4}
                  value={formData.admissionsRequiredDocsText}
                  onChange={(e) => setFormData({ ...formData, admissionsRequiredDocsText: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  placeholder="• Original Transfer Certificate (T.C.)&#10;• Self-attested copy of Birth Certificate..."
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: CONTACT & CAMPUS INFO (/contact) */}
          {/* ========================================================= */}
          {activeTab === 'contact' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Contact Page & Global Campus Info</h2>
                  <p className="text-xs text-slate-400">
                    Official phone helplines, address, office hours, and contact page text.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    School Primary Phone Helpline
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Secondary / Alternative Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phoneAlt}
                    onChange={(e) => setFormData({ ...formData, phoneAlt: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Office Visiting Hours
                  </label>
                  <input
                    type="text"
                    value={formData.contactOfficeHours}
                    onChange={(e) => setFormData({ ...formData, contactOfficeHours: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  School Physical Campus Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Contact Page Title
                </label>
                <input
                  type="text"
                  value={formData.contactPageTitle}
                  onChange={(e) => setFormData({ ...formData, contactPageTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Contact Page Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formData.contactPageSubtitle}
                  onChange={(e) => setFormData({ ...formData, contactPageSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: REVIEWS & TESTIMONIALS */}
          {/* ========================================================= */}
          {activeTab === 'testimonials' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Parent & Student Reviews</h2>
                    <p className="text-xs text-slate-400">
                      Manage the reviews and testimonials displayed on the homepage.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addTestimonial}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition"
                >
                  + Add Review
                </button>
              </div>

              <div className="space-y-4">
                {(formData.testimonials || []).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300">Review #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeTestimonial(idx)}
                        className="text-rose-400 hover:text-rose-300 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">
                          Parent / Student Name
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateTestimonial(idx, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">
                          Relation / Class
                        </label>
                        <input
                          type="text"
                          value={item.relation}
                          onChange={(e) => updateTestimonial(idx, 'relation', e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                          placeholder="e.g. Parent of Class 8th Student"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Review / Testimonial Statement
                      </label>
                      <textarea
                        rows={2}
                        value={item.text}
                        onChange={(e) => updateTestimonial(idx, 'text', e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Global Submit Floating Bar */}
          <div className="sticky bottom-4 z-20 flex items-center justify-between gap-3 p-4 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl">
            <div className="text-xs text-slate-400">
              <span className="text-white font-bold">Unsaved Changes?</span> Click "Save All Website Changes" to push live.
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-purple-600/30 flex items-center gap-2 disabled:opacity-50 shrink-0"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving & Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Website Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
      </div>
    </DashboardShell>
  );
}
