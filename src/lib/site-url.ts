/**
 * Fuente unica de verdad para la URL publica del sitio.
 *
 * La usan el metadata del layout, la imagen social (OG), robots.txt y sitemap.xml,
 * para que nunca queden apuntando a dominios distintos entre si.
 */
// Dominio canonico. El sitio tambien responde en www.teolabs.app sin redirigir,
// asi que este valor es el que le dice a Google cual de los dos cuenta.
export const SITE_URL = 'https://teolabs.app';

export const SITE_NAME = 'Teo Labs';

export const SITE_DESCRIPTION =
  'Desarrollo de software a medida para pymes y startups. Aplicaciones web, ' +
  'e-commerce, apps móviles y automatización de procesos con inteligencia artificial. ' +
  'La Serena, Chile.';
