'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type PublicTheme = 'light' | 'dark';
type PublicLanguage = 'en' | 'hi';

interface PublicThemeLanguageContextType {
  theme: PublicTheme;
  toggleTheme: () => void;
  language: PublicLanguage;
  setLanguage: (lang: PublicLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const PublicThemeLanguageContext = createContext<PublicThemeLanguageContextType>({
  theme: 'light',
  toggleTheme: () => {},
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (_key, fallback) => fallback || _key,
});

// Comprehensive English-Hindi dictionary for the public school website
const TRANSLATIONS: Record<string, { en: string; hi: string }> = {
  // Navigation Links
  'nav.home': { en: 'Home', hi: 'मुख्य पृष्ठ' },
  'nav.about': { en: 'About Us', hi: 'हमारे बारे में' },
  'nav.academics': { en: 'Academics', hi: 'शैक्षणिक' },
  'nav.admissions': { en: 'Admissions', hi: 'नामांकन / प्रवेश' },
  'nav.faculty': { en: 'Faculty & Team', hi: 'शिक्षक एवं संकाय' },
  'nav.campus': { en: 'Campus & Facilities', hi: 'परिसर एवं सुविधाएं' },
  'nav.notices': { en: 'Notice Board', hi: 'सूचना पट्ट' },
  'nav.calendar': { en: 'Calendar', hi: 'वार्षिक कैलेंडर' },
  'nav.contact': { en: 'Contact', hi: 'संपर्क करें' },

  // Header Actions
  'header.portal': { en: 'E-Learning Portal', hi: 'ई-लर्निंग पोर्टल' },
  'header.apply': { en: 'Apply 2026-27', hi: 'प्रवेश 2026-27' },
  'header.login': { en: 'Portal Login', hi: 'पोर्टल लॉगिन' },
  'header.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'header.call': { en: 'Call Helpline', hi: 'हेल्पलाइन' },

  // Hero Section
  'hero.badge': { en: 'Empowering Future Leaders', hi: 'भविष्य के कर्णधारों का निर्माण' },
  'hero.title': {
    en: 'Building Knowledge, Character & Academic Brilliance',
    hi: 'ज्ञान, संस्कार एवं शैक्षणिक उत्कृष्टता का संगम',
  },
  'hero.subtitle': {
    en: 'Welcome to the digital learning campus of Success Point School (S.P.S.). State-of-the-art classroom education, continuous evaluation, and dedicated student care.',
    hi: 'सक्सेस पॉइंट स्कूल (S.P.S.) के डिजिटल परिसर में आपका स्वागत है। आधुनिक स्मार्ट शिक्षा, सतत मूल्यांकन और उत्कृष्ट संस्कार।',
  },
  'hero.cta_apply': { en: 'Apply for Admission 2026-27', hi: 'प्रवेश हेतु आवेदन करें' },
  'hero.cta_programs': { en: 'Explore Programs & Streams', hi: 'पाठ्यक्रम एवं कक्षाएं देखें' },
  'hero.cta_portal': { en: 'Student & Faculty Portal', hi: 'छात्र एवं शिक्षक पोर्टल' },

  // Stats Ribbon
  'stats.students': { en: 'Enrolled Students', hi: 'नामांकित छात्र' },
  'stats.faculty': { en: 'Qualified Faculty', hi: 'योग्य एवं अनुभवी शिक्षक' },
  'stats.smart': { en: 'Digital Smart Classrooms', hi: 'डिजिटल स्मार्ट कक्षाएं' },
  'stats.pass': { en: 'First Division Board Pass', hi: 'बोर्ड परीक्षा प्रथम श्रेणी' },

  // Section Headers
  'section.about_title': { en: 'Committed to Imparting Character & Wisdom', hi: 'उत्कृष्ट शिक्षा और संस्कारों के प्रति समर्पित' },
  'section.features_title': { en: 'Why Choose Success Point School', hi: 'सक्सेस पॉइंट स्कूल क्यों चुनें' },
  'section.faculty_title': { en: 'Meet Our Dedicated Educators', hi: 'हमारे समर्पित शिक्षकों से मिलें' },
  'section.admissions_title': { en: 'Admissions Open For Session 2026-27', hi: 'सत्र 2026-27 हेतु नामांकन प्रारंभ' },
  'section.notices_title': { en: 'Latest Campus Announcements', hi: 'नवीनतम सूचनाएं एवं घोषणाएं' },
  'section.contact_title': { en: 'Get In Touch With Admissions Desk', hi: 'प्रवेश कार्यालय से संपर्क करें' },

  // Common UI
  'common.view_all': { en: 'View All', hi: 'सभी देखें' },
  'common.read_more': { en: 'Read More', hi: 'और पढ़ें' },
  'common.office_hours': { en: 'Office Hours: Mon–Sat 8:00 AM – 3:30 PM', hi: 'कार्यालय समय: सोम-शनि प्रात: 8:00 से दोपहर 3:30' },
  'common.call_us': { en: 'Call SPS Helpdesk', hi: 'फोन पर संपर्क करें' },
  'common.whatsapp_us': { en: 'WhatsApp Inquiry', hi: 'व्हाट्सएप पूछताछ' },
};

function triggerGoogleTranslate(lang: 'en' | 'hi') {
  if (typeof window === 'undefined') return;

  const cookieVal = lang === 'hi' ? '/en/hi' : '/en/en';
  const domain = window.location.hostname;

  document.cookie = `googtrans=${cookieVal}; path=/;`;
  if (domain && domain !== 'localhost') {
    document.cookie = `googtrans=${cookieVal}; path=/; domain=.${domain};`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${domain};`;
  }

  // Attempt to select within google translate iframe or combo
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  }
}

export function PublicThemeLanguageProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<PublicTheme>('light');
  const [language, setLanguageState] = useState<PublicLanguage>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load persisted theme
    const savedTheme = localStorage.getItem('sps_public_theme') as PublicTheme;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      applyTheme('dark');
    }

    // Load persisted language
    const savedLang = localStorage.getItem('sps_public_lang') as PublicLanguage;
    if (savedLang === 'hi' || savedLang === 'en') {
      setLanguageState(savedLang);
    }

    // Inject hidden google translate element container
    if (typeof document !== 'undefined') {
      let div = document.getElementById('google_translate_element');
      if (!div) {
        div = document.createElement('div');
        div.id = 'google_translate_element';
        div.style.display = 'none';
        document.body.appendChild(div);
      }

      (window as any).googleTranslateElementInit = () => {
        try {
          if ((window as any).google?.translate?.TranslateElement) {
            new (window as any).google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'hi,en',
                autoDisplay: false,
              },
              'google_translate_element'
            );

            // If initialized and language is hindi, trigger it
            const currentLang = localStorage.getItem('sps_public_lang');
            if (currentLang === 'hi') {
              setTimeout(() => {
                triggerGoogleTranslate('hi');
              }, 600);
            }
          }
        } catch {
          // ignore
        }
      };

      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  const applyTheme = (targetTheme: PublicTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (targetTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const nextTheme: PublicTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('sps_public_theme', nextTheme);
    applyTheme(nextTheme);
  };

  const setLanguage = (lang: PublicLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('sps_public_lang', lang);
    triggerGoogleTranslate(lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
  };

  const t = (key: string, fallback?: string): string => {
    if (TRANSLATIONS[key]) {
      return TRANSLATIONS[key][language] || fallback || TRANSLATIONS[key].en;
    }
    return fallback || key;
  };

  return (
    <PublicThemeLanguageContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      <div className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </PublicThemeLanguageContext.Provider>
  );
}

export function usePublicThemeLanguage() {
  return useContext(PublicThemeLanguageContext);
}
