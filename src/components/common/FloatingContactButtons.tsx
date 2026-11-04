'use client';

import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

interface FloatingContactButtonsProps {
  phone?: string;
  whatsappNumber?: string;
}

export default function FloatingContactButtons({
  phone = '+918051217686',
  whatsappNumber = '918051217686',
}: FloatingContactButtonsProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<'whatsapp' | 'call' | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const cleanPhone = phone.startsWith('+') ? phone : `+${phone.replace(/[^0-9]/g, '')}`;

  const whatsappUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    'Hello Success Point School, I would like to inquire about admissions and school programs.'
  )}`;

  return (
    <div
      className="fixed bottom-6 right-5 sm:bottom-8 sm:right-7 z-50 flex flex-col items-center gap-3 select-none"
      aria-label="Direct Communication Actions"
    >
      {/* WHATSAPP ACTION BUTTON */}
      <div className="relative group">
        {/* Tooltip */}
        <div
          className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-[11px] font-bold rounded-lg whitespace-nowrap shadow-md pointer-events-none transition-all duration-200 ${
            hoveredBtn === 'whatsapp'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-2 pointer-events-none'
          }`}
        >
          Chat on WhatsApp
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-stone-900" />
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredBtn('whatsapp')}
          onMouseLeave={() => setHoveredBtn(null)}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-108 active:scale-95 transition-all duration-200 relative group overflow-hidden"
          title="Chat with Success Point School on WhatsApp"
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 group-hover:opacity-40" />

          {/* Official WhatsApp SVG Icon */}
          <svg
            className="w-7 h-7 fill-white relative z-10"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.204 8.204 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1 0 .09.49-.61 1.47-1.2 1.7-.6.23-.39.23-.73.23-.81.01-.08-.12-.21-.37-.34z" />
          </svg>
        </a>
      </div>

      {/* CALLING ACTION BUTTON */}
      <div className="relative group">
        {/* Tooltip */}
        <div
          className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white text-[11px] font-bold rounded-lg whitespace-nowrap shadow-md pointer-events-none transition-all duration-200 ${
            hoveredBtn === 'call'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-2 pointer-events-none'
          }`}
        >
          Call Admissions: {phone}
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-stone-900" />
        </div>

        <a
          href={`tel:${cleanPhone}`}
          onMouseEnter={() => setHoveredBtn('call')}
          onMouseLeave={() => setHoveredBtn(null)}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#FFF1ED] text-[#214F39] border-2 border-[#E8B4A8] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-108 active:scale-95 transition-all duration-200 relative group overflow-hidden"
          title={`Call Success Point School: ${phone}`}
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#E8B4A8] animate-ping opacity-20 group-hover:opacity-35" />

          {/* Telephone Icon */}
          <Phone className="w-6 h-6 stroke-[2.2] text-[#214F39] relative z-10 transition-transform group-hover:rotate-12" />
        </a>
      </div>
    </div>
  );
}
