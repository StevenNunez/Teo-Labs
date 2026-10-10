import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-url';

/**
 * Paginas publicas del sitio. Quedan fuera a proposito /admin y /seguimiento/[id],
 * que son internas (ver robots.ts), y las /demo, que llevan noindex (ver
 * src/app/demo/layout.tsx): un sitemap no lista lo que pide no indexar.
 */
const rutas = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/portafolio-web', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/terminos', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/privacidad', changeFrequency: 'yearly', priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return rutas.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
