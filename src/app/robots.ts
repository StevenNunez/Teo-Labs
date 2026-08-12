import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // El panel interno y el seguimiento de proyectos no son contenido publico:
        // no aportan nada en buscadores y no queremos que se indexen.
        disallow: ['/admin', '/seguimiento/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
