import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.successpointschool.online';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/academics',
          '/admissions',
          '/faculty',
          '/gallery',
          '/calendar',
          '/notices',
          '/contact',
          '/_next/static/',
          '/images/',
        ],
        disallow: [
          '/admin/',
          '/teacher/',
          '/student/',
          '/api/',
          '/login',
          '/check-result',
          '/docs',
          '/*.json$',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/teacher/',
          '/student/',
          '/api/',
          '/login',
          '/check-result',
          '/docs',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
