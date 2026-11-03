export interface IFooterLink {
  id: string;
  label: string;
  url: string;
  isExternal?: boolean;
  enabled: boolean;
}

export interface IFooterPortal {
  id: string;
  label: string;
  url: string;
  target?: '_self' | '_blank';
  badge?: string;
  enabled: boolean;
}

export interface IFooterSettings {
  logo?: string;
  schoolName: string;
  tagline: string;
  description: string;
  ctaButton: {
    enabled: boolean;
    text: string;
    url: string;
  };
  exploreLinks: IFooterLink[];
  portals: IFooterPortal[];
  admissionsCard: {
    enabled: boolean;
    title: string;
    description: string;
    ctaText: string;
    ctaUrl: string;
  };
  campusInfo: {
    address: string;
    showAddress: boolean;
    phonePrimary: string;
    phoneSecondary: string;
    showPhone: boolean;
    email: string;
    showEmail: boolean;
    officeHours: string;
    showOfficeHours: boolean;
    mapsUrl: string;
    showMaps: boolean;
  };
  bottomBar: {
    copyrightText: string;
    tagline: string;
    showCopyright: boolean;
    showTagline: boolean;
  };
}

export const DEFAULT_FOOTER_SETTINGS: IFooterSettings = {
  logo: '/images/logo.jpeg',
  schoolName: 'SUCCESS POINT SCHOOL',
  tagline: 'Best Education, Good Results.',
  description:
    'Committed to imparting academic excellence, moral discipline, and holistic personality growth. Guided by expert faculty and modern digital smart learning infrastructure.',
  ctaButton: {
    enabled: true,
    text: 'Apply for Admission 2026-27',
    url: '/admissions',
  },
  exploreLinks: [
    { id: 'link-1', label: 'Home Page', url: '/', isExternal: false, enabled: true },
    { id: 'link-2', label: 'About School & Vision', url: '/about', isExternal: false, enabled: true },
    { id: 'link-3', label: 'Curriculum & Programs', url: '/academics', isExternal: false, enabled: true },
    { id: 'link-4', label: 'Admissions & Fee Guide', url: '/admissions', isExternal: false, enabled: true },
    { id: 'link-5', label: 'Director & Faculty Directory', url: '/faculty', isExternal: false, enabled: true },
    { id: 'link-6', label: 'Campus & Smart Classrooms', url: '/gallery', isExternal: false, enabled: true },
    { id: 'link-7', label: 'Official Notice Board', url: '/notices', isExternal: false, enabled: true },
    { id: 'link-calendar', label: 'Academic Calendar 2027', url: '/calendar', isExternal: false, enabled: true },
    { id: 'link-8', label: 'Contact & Campus Map', url: '/contact', isExternal: false, enabled: true },
  ],
  portals: [
    {
      id: 'portal-1',
      label: 'Student E-Learning Portal',
      url: '/login?role=student',
      target: '_self',
      enabled: true,
    },
    {
      id: 'portal-2',
      label: 'Teacher & Faculty Classroom',
      url: '/login?role=teacher',
      target: '_self',
      enabled: true,
    },
    {
      id: 'portal-3',
      label: 'Super Admin Console (/admin)',
      url: '/admin',
      target: '_self',
      badge: 'Super Admin',
      enabled: true,
    },
  ],
  admissionsCard: {
    enabled: true,
    title: 'Admissions Session 2026-27',
    description:
      'Admissions open for Nursery through Class 11th. Submit registration inquiry online.',
    ctaText: 'Apply Online',
    ctaUrl: '/admissions',
  },
  campusInfo: {
    address: 'Success Point School Campus, Knowledge Zone, City Central, Pin - 800001',
    showAddress: true,
    phonePrimary: '+91 8051217686',
    phoneSecondary: '+91 98765 43210',
    showPhone: true,
    email: 'info@successpointschool.edu',
    showEmail: true,
    officeHours: 'Office Hours: 08:00 AM - 02:30 PM (Mon-Sat)',
    showOfficeHours: true,
    mapsUrl: 'https://maps.google.com',
    showMaps: true,
  },
  bottomBar: {
    copyrightText: '© {year} Success Point School (S.P.S.). All Rights Reserved.',
    tagline: 'Best Education, Good Results.',
    showCopyright: true,
    showTagline: true,
  },
};
