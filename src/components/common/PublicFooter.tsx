'use client';

import React from 'react';
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
} from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-[#214F39] text-white pt-16 pb-8 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* 1. School Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 overflow-hidden shrink-0 shadow-md">
                <Image
                  src="/images/logo.jpeg"
                  alt="Success Point School"
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <h3 className="font-black text-base tracking-tight text-white">
                  SUCCESS POINT SCHOOL
                </h3>
                <p className="text-[11px] font-bold text-[#E8B4A8] tracking-wider uppercase">
                  Best Education, Good Results.
                </p>
              </div>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Committed to imparting academic excellence, moral discipline, and holistic personality growth. Guided by expert faculty and modern digital smart learning infrastructure.
            </p>
            <div className="pt-1">
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                style={{ backgroundColor: '#E8B4A8', color: '#214F39' }}
              >
                <span>Apply for Admission 2026-27</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. Institutional Pages */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#E8B4A8] mb-4">
              Explore Institution
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li>
                <Link href="/" className="hover:text-white transition">
                  • Home Page
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  • About School & Vision
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-white transition">
                  • Curriculum & Programs
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="hover:text-white transition">
                  • Admissions & Fee Guide
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="hover:text-white transition">
                  • Director & Faculty Directory
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition">
                  • Campus & Smart Classrooms
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-white transition">
                  • Official Notice Board
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  • Contact & Campus Map
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Portals & Examination */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#E8B4A8] mb-4">
              Digital Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li>
                <Link href="/login?role=student" className="hover:text-white transition font-medium">
                  • Student E-Learning Portal
                </Link>
              </li>
              <li>
                <Link href="/login?role=teacher" className="hover:text-white transition font-medium">
                  • Teacher & Faculty Classroom
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-purple-300 hover:text-white transition font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Super Admin Console (/admin)</span>
                </Link>
              </li>
            </ul>

            <div className="mt-6 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-900/60 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5 font-bold text-white mb-1">
                <Award className="w-3.5 h-3.5 text-[#E8B4A8]" />
                Admissions Session 2026-27
              </span>
              <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                Admissions open for Nursery through Class 11th. Submit registration inquiry online.
              </p>
            </div>
          </div>

          {/* 4. Campus Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#E8B4A8] mb-4">
              Campus Information
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-emerald-100/80">
              <MapPin className="w-4 h-4 text-[#E8B4A8] shrink-0 mt-0.5" />
              <span>Success Point School Campus, Knowledge Zone, City Central, Pin - 800001</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-emerald-100/80">
              <Phone className="w-4 h-4 text-[#E8B4A8] shrink-0" />
              <span>+91 98765 43210 / +91 91234 56789</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-emerald-100/80">
              <Mail className="w-4 h-4 text-[#E8B4A8] shrink-0" />
              <span>info@successpointschool.edu</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-emerald-100/80">
              <Clock className="w-4 h-4 text-[#E8B4A8] shrink-0" />
              <span>Office Hours: 08:00 AM - 02:30 PM (Mon-Sat)</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-emerald-900/60 text-center text-xs text-emerald-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Success Point School (S.P.S.). All Rights Reserved.</p>
          <p className="text-[11px] text-emerald-300 font-medium">
            Best Education, Good Results.
          </p>
        </div>
      </div>
    </footer>
  );
}
