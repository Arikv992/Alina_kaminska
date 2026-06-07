import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const localeRoutes = [
    { url: SITE_URL, locale: 'es' },
    { url: `${SITE_URL}/en`, locale: 'en' },
    { url: `${SITE_URL}/pl`, locale: 'pl' },
    { url: `${SITE_URL}/it`, locale: 'it' },
  ];

  return localeRoutes.map(({ url }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }));
}
