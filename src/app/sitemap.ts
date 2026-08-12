import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-url';

/**
 * Paginas publicas del sitio. Quedan fuera a proposito /admin y /seguimiento/[id],
 * que son internas (ver robots.ts).
 */
const rutas = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/portafolio-web', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/demo/boutique', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/demo/clinica', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/demo/fitness', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/demo/inmobiliaria', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/demo/legal', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/demo/logistica', changeFrequency: 'monthly', priority: 0.7 },
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
