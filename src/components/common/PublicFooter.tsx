'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronDown,
  ExternalLink,
  Sparkles,
  GraduationCap,
  Users,
} from 'lucide-react';
import { IFooterSettings, DEFAULT_FOOTER_SETTINGS } from '@/types/footer';
import FloatingContactButtons from '@/components/common/FloatingContactButtons';

interface PublicFooterProps {
  initialData?: IFooterSettings;
  previewMode?: boolean;
}

export default function PublicFooter({ initialData, previewMode = false }: PublicFooterProps) {
  const [footerData, setFooterData] = useState<IFooterSettings>(initialData || DEFAULT_FOOTER_SETTINGS);
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    explore: false,
    portals: false,
    campus: false,
  });

  // If initialData updates (e.g. live preview in CMS), sync state
  useEffect(() => {
    if (initialData) {
      setFooterData(initialData);
    }
  }, [initialData]);

  // If not in preview mode and no initialData provided, fetch fresh footer from API
  useEffect(() => {
    if (previewMode || initialData) return;

    let isMounted = true;
    fetch('/api/public/footer')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.footer) {
          setFooterData(data.footer);
        }
      })
      .catch((err) => {
        console.error('Error fetching public footer data:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [previewMode, initialData]);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const currentYear = new Date().getFullYear();
  const rawCopyright = footerData.bottomBar?.copyrightText || '© {year} Success Point School. All Rights Reserved.';
  const formattedCopyright = rawCopyright.replace(/\{year\}/g, String(currentYear));

  const cleanPhoneLink = (phone: string) => {
    const cleaned = phone.replace(/[^0-9+]/g, '');
    return `tel:${cleaned}`;
  };

  return (
    <footer className="w-full bg-gradient-to-b from-[#214F39] via-[#1b4331] to-[#143426] text-white pt-14 pb-8 border-t border-emerald-950/80 shadow-2xl relative overflow-hidden select-none">
      {/* Decorative ambient subtle light in background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-300/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* ================= COLUMN 1: BRANDING & ADMISSION CTA ================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 overflow-hidden shrink-0 shadow-md border border-white/20">
                <Image
                  src={footerData.logo || '/images/logo.jpeg'}
                  alt={footerData.schoolName || 'Success Point School'}
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                  onError={(e) => {
                    // Fallback to default logo if custom URL fails
                    (e.target as any).src = '/images/logo.jpeg';
                  }}
                />
              </div>
              <div>
                <h3 className="font-black text-base tracking-tight text-white uppercase leading-snug">
                  {footerData.schoolName || 'SUCCESS POINT SCHOOL'}
                </h3>
                <p className="text-[11px] font-bold text-[#E8B4A8] tracking-wider uppercase">
                  {footerData.tagline || 'Best Education, Good Results.'}
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-100/80 leading-relaxed font-normal">
              {footerData.description ||
                'Committed to imparting academic excellence, moral discipline, and holistic personality growth. Guided by expert faculty and modern digital smart learning infrastructure.'}
            </p>

            {footerData.ctaButton?.enabled && (
              <div className="pt-2">
                <Link
                  href={footerData.ctaButton.url || '/admissions'}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm hover:scale-[1.02] active:scale-[0.98] group"
                  style={{ backgroundColor: '#E8B4A8', color: '#1b4331' }}
                >
                  <span>{footerData.ctaButton.text || 'Apply for Admission 2026-27'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* ================= COLUMN 2: EXPLORE INSTITUTION ================= */}
          <div className="border-t border-emerald-800/40 pt-4 md:border-none md:pt-0">
            {/* Mobile Accordion Header */}
            <button
              type="button"
              onClick={() => toggleAccordion('explore')}
              className="md:hidden w-full flex items-center justify-between text-left py-2 group focus:outline-hidden"
              aria-expanded={openAccordions.explore}
            >
              <h4 className="text-xs font-black uppercase tracking-wider text-[#E8B4A8]">
                Explore Institution
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#E8B4A8] transition-transform duration-200 ${
                  openAccordions.explore ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Desktop Header */}
            <h4 className="hidden md:block text-xs font-black uppercase tracking-wider text-[#E8B4A8] mb-4">
              Explore Institution
            </h4>

            {/* Links List */}
            <div className={`${openAccordions.explore ? 'block pt-2' : 'hidden'} md:block`}>
              <ul className="space-y-2.5 text-xs text-emerald-100/80">
                {footerData.exploreLinks?.filter((l) => l.enabled)?.map((link) => {
                  const isExt = Boolean(link.isExternal || link.url?.startsWith('http'));
                  return (
                    <li key={link.id || link.label}>
                      {isExt ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-white transition flex items-center gap-1.5 group"
                        >
                          <span className="text-[#E8B4A8] text-[10px] group-hover:translate-x-0.5 transition-transform">•</span>
                          <span>{link.label}</span>
                          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                        </a>
                      ) : (
                        <Link
                          href={link.url}
                          className="hover:text-white transition flex items-center gap-1.5 group"
                        >
                          <span className="text-[#E8B4A8] text-[10px] group-hover:translate-x-0.5 transition-transform">•</span>
                          <span>{link.label}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ================= COLUMN 3: DIGITAL PORTALS & ADMISSIONS ================= */}
          <div className="border-t border-emerald-800/40 pt-4 md:border-none md:pt-0">
            {/* Mobile Accordion Header */}
            <button
              type="button"
              onClick={() => toggleAccordion('portals')}
              className="md:hidden w-full flex items-center justify-between text-left py-2 group focus:outline-hidden"
              aria-expanded={openAccordions.portals}
            >
              <h4 className="text-xs font-black uppercase tracking-wider text-[#E8B4A8]">
                Digital Portals & Admissions
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#E8B4A8] transition-transform duration-200 ${
                  openAccordions.portals ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Desktop Header */}
            <h4 className="hidden md:block text-xs font-black uppercase tracking-wider text-[#E8B4A8] mb-4">
              Digital Portals
            </h4>

            {/* Content Container */}
            <div className={`${openAccordions.portals ? 'block pt-2' : 'hidden'} md:block`}>
              <ul className="space-y-2.5 text-xs text-emerald-100/80">
                {footerData.portals?.filter((p) => p.enabled)?.map((portal) => {
                  const isAdmin = portal.url?.includes('/admin') || portal.badge?.toLowerCase().includes('admin');
                  const isTeacher = portal.url?.includes('teacher');
                  const isStudent = portal.url?.includes('student');

                  return (
                    <li key={portal.id || portal.label}>
                      <Link
                        href={portal.url}
                        target={portal.target || '_self'}
                        rel={portal.target === '_blank' ? 'noopener noreferrer' : undefined}
                        className={`transition flex items-center gap-1.5 group ${
                          isAdmin
                            ? 'text-purple-300 hover:text-white font-semibold'
                            : 'hover:text-white font-medium'
                        }`}
                      >
                        {isAdmin ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                        ) : isTeacher ? (
                          <Users className="w-3.5 h-3.5 text-emerald-300" />
                        ) : isStudent ? (
                          <GraduationCap className="w-3.5 h-3.5 text-teal-300" />
                        ) : (
                          <span className="text-[#E8B4A8] text-[10px]">•</span>
                        )}
                        <span>{portal.label}</span>
                        {portal.target === '_blank' && (
                          <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Admissions Information Card */}
              {footerData.admissionsCard?.enabled && (
                <div className="mt-5 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-900/70 text-xs text-emerald-200 shadow-inner">
                  <span className="flex items-center gap-1.5 font-bold text-white mb-1">
                    <Award className="w-3.5 h-3.5 text-[#E8B4A8] shrink-0" />
                    <span>{footerData.admissionsCard.title || 'Admissions Session 2026-27'}</span>
                  </span>
                  <p className="text-[11px] text-emerald-300/80 leading-relaxed font-normal">
                    {footerData.admissionsCard.description ||
                      'Admissions open for Nursery through Class 11th. Submit registration inquiry online.'}
                  </p>
                  {footerData.admissionsCard.ctaUrl && (
                    <div className="mt-2.5 pt-2 border-t border-emerald-900/60">
                      <Link
                        href={footerData.admissionsCard.ctaUrl}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E8B4A8] hover:underline"
                      >
                        <span>{footerData.admissionsCard.ctaText || 'Apply Online'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ================= COLUMN 4: CAMPUS INFORMATION ================= */}
          <div className="border-t border-emerald-800/40 pt-4 md:border-none md:pt-0">
            {/* Mobile Accordion Header */}
            <button
              type="button"
              onClick={() => toggleAccordion('campus')}
              className="md:hidden w-full flex items-center justify-between text-left py-2 group focus:outline-hidden"
              aria-expanded={openAccordions.campus}
            >
              <h4 className="text-xs font-black uppercase tracking-wider text-[#E8B4A8]">
                Campus Information
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#E8B4A8] transition-transform duration-200 ${
                  openAccordions.campus ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Desktop Header */}
            <h4 className="hidden md:block text-xs font-black uppercase tracking-wider text-[#E8B4A8] mb-4">
              Campus Information
            </h4>

            {/* Content Container */}
            <div className={`${openAccordions.campus ? 'block pt-2' : 'hidden'} md:block space-y-3`}>
              {/* Address */}
              {footerData.campusInfo?.showAddress && footerData.campusInfo?.address && (
                <div className="flex items-start gap-2.5 text-xs text-emerald-100/80">
                  <MapPin className="w-4 h-4 text-[#E8B4A8] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{footerData.campusInfo.address}</span>
                </div>
              )}

              {/* Phone Numbers */}
              {footerData.campusInfo?.showPhone && (footerData.campusInfo?.phonePrimary || footerData.campusInfo?.phoneSecondary) && (
                <div className="flex items-center gap-2.5 text-xs text-emerald-100/80">
                  <Phone className="w-4 h-4 text-[#E8B4A8] shrink-0" />
                  <div className="flex flex-wrap items-center gap-x-2">
                    {footerData.campusInfo.phonePrimary && (
                      <a
                        href={cleanPhoneLink(footerData.campusInfo.phonePrimary)}
                        className="hover:text-white transition font-medium underline-offset-2 hover:underline"
                      >
                        {footerData.campusInfo.phonePrimary}
                      </a>
                    )}
                    {footerData.campusInfo.phonePrimary && footerData.campusInfo.phoneSecondary && (
                      <span className="text-emerald-400/60">/</span>
                    )}
                    {footerData.campusInfo.phoneSecondary && (
                      <a
                        href={cleanPhoneLink(footerData.campusInfo.phoneSecondary)}
                        className="hover:text-white transition font-medium underline-offset-2 hover:underline"
                      >
                        {footerData.campusInfo.phoneSecondary}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Email Address */}
              {footerData.campusInfo?.showEmail && footerData.campusInfo?.email && (
                <div className="flex items-center gap-2.5 text-xs text-emerald-100/80">
                  <Mail className="w-4 h-4 text-[#E8B4A8] shrink-0" />
                  <a
                    href={`mailto:${footerData.campusInfo.email}`}
                    className="hover:text-white transition font-medium underline-offset-2 hover:underline truncate"
                  >
                    {footerData.campusInfo.email}
                  </a>
                </div>
              )}

              {/* Office Hours */}
              {footerData.campusInfo?.showOfficeHours && footerData.campusInfo?.officeHours && (
                <div className="flex items-center gap-2.5 text-xs text-emerald-100/80">
                  <Clock className="w-4 h-4 text-[#E8B4A8] shrink-0" />
                  <span>{footerData.campusInfo.officeHours}</span>
                </div>
              )}

              {/* Maps Link */}
              {footerData.campusInfo?.showMaps && footerData.campusInfo?.mapsUrl && (
                <div className="pt-1">
                  <a
                    href={footerData.campusInfo.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E8B4A8] hover:text-white transition group"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="mt-12 pt-6 border-t border-emerald-900/70 text-center text-xs text-emerald-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          {footerData.bottomBar?.showCopyright ? (
            <p className="font-normal">{formattedCopyright}</p>
          ) : (
            <div />
          )}

          {footerData.bottomBar?.showTagline && (
            <p className="text-[11px] text-emerald-300 font-medium">
              {footerData.bottomBar.tagline || 'Best Education, Good Results.'}
            </p>
          )}
        </div>
      </div>

      {!previewMode && (
        <FloatingContactButtons
          phone={footerData.campusInfo?.phonePrimary || '+918051217686'}
          whatsappNumber={footerData.campusInfo?.phonePrimary || '918051217686'}
        />
      )}
    </footer>
  );
}
