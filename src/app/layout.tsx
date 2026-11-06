import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { PublicThemeLanguageProvider } from '@/context/PublicThemeLanguageContext';
import { SchoolJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.successpointschool.online'),
  title: {
    default: 'Success Point School | Best Education, Good Results',
    template: '%s | Success Point School',
  },
  description:
    'Official website of Success Point School (S.P.S.). Admissions open for 2026-27 session. Providing academic excellence, smart digital classrooms, disciplined environment, and holistic student growth.',
  keywords: [
    'Success Point School',
    'SPS School',
    'Success Point School Online',
    'Best School in Bihar',
    'School Admission 2026-27',
    'CBSE School',
    'Smart Class School',
    'Quality Education',
    'Nursery to 12th School Admission',
  ],
  authors: [{ name: 'Success Point School' }],
  creator: 'Success Point School',
  publisher: 'Success Point School',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://www.successpointschool.online',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.successpointschool.online',
    title: 'Success Point School | Best Education, Good Results',
    description:
      'Official website of Success Point School (S.P.S.). Admissions open for 2026-27 session. Smart digital classrooms, expert faculty, and holistic learning.',
    siteName: 'Success Point School',
    images: [
      {
        url: '/images/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'Success Point School Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Success Point School | Best Education, Good Results',
    description:
      'Official website of Success Point School. Admissions open for Nursery through Class 11th.',
    images: ['/images/logo.jpeg'],
  },
  verification: {
    google: 'Xlskr_Er9mhiqAUvN2TvAnGqbAzEvUTmBe_1trT-zN0',
  },
  icons: {
    icon: '/images/logo.jpeg',
    apple: '/images/logo.jpeg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#214F39',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <SchoolJsonLd />
      </head>
      <body>
        <AuthProvider>
          <PublicThemeLanguageProvider>{children}</PublicThemeLanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
