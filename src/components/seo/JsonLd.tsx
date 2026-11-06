import React from 'react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function SchoolJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['School', 'EducationalOrganization', 'LocalBusiness'],
        '@id': 'https://www.successpointschool.online/#school',
        name: 'Success Point School',
        alternateName: ['S.P.S.', 'Success Point School Online'],
        url: 'https://www.successpointschool.online',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://www.successpointschool.online/#logo',
          url: 'https://www.successpointschool.online/images/logo.jpeg',
          caption: 'Success Point School Official Logo',
        },
        image: 'https://www.successpointschool.online/images/logo.jpeg',
        description:
          'Success Point School (S.P.S.) is a premier educational institution providing quality schooling, audio-visual smart classrooms, experienced faculty, and disciplined holistic character development from Nursery to Class 12th.',
        telephone: '+91-8051217686',
        email: 'info@successpointschool.online',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Success Point School Campus, Knowledge City Zone, Main City Road',
          addressLocality: 'Knowledge City Zone',
          addressRegion: 'Bihar',
          postalCode: '800001',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '25.5941',
          longitude: '85.1376',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '14:30',
          },
        ],
        priceRange: '₹₹',
        currenciesAccepted: 'INR',
        paymentAccepted: 'Cash, UPI, Net Banking, Card',
        sameAs: [
          'https://www.facebook.com/successpointschool',
          'https://www.youtube.com/@successpointschool',
          'https://www.instagram.com/successpointschool',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Academic Programs Offered',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Course',
                name: 'Pre-Primary Education (Nursery, LKG, UKG)',
                description: 'Activity-based foundational literacy and numeracy with smart audio-visual aids.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Course',
                name: 'Primary & Middle School (Class 1st to 8th)',
                description: 'Comprehensive curriculum focused on conceptual clarity, science experiments, and languages.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Course',
                name: 'Secondary & Senior Secondary (Class 9th to 12th)',
                description: 'Board-aligned rigorous curriculum, specialized laboratory training, and career guidance.',
              },
            },
          ],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.successpointschool.online/#website',
        url: 'https://www.successpointschool.online',
        name: 'Success Point School',
        description: 'Official digital portal of Success Point School (S.P.S.) - Best Education, Good Results.',
        publisher: {
          '@id': 'https://www.successpointschool.online/#school',
        },
        inLanguage: ['en-IN', 'hi-IN'],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQJsonLd({ items }: { items: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
