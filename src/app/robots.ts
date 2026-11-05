import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.successpointschool.online';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/teacher/', '/student/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
