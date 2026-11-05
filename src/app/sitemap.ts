import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.successpointschool.online';
  const currentDate = new Date().toISOString();

  const publicRoutes = [
    '',
    '/about',
    '/academics',
    '/admissions',
    '/faculty',
    '/gallery',
    '/calendar',
    '/notices',
    '/contact',
    '/login',
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/admissions' ? 0.9 : 0.8,
  }));
}
