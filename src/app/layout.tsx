import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import CookieBanner from '@/components/layout/cookie-banner';
import WhatsAppButton from '@/components/layout/whatsapp-button';
import Analytics from '@/components/layout/analytics';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site-url';

/**
 * Tipografia auto-alojada.
 *
 * Antes las fuentes venian por <link> a fonts.googleapis.com pidiendo
 * `wght@400;500;700`, pero el sitio usa `font-bold` (900) en 107 lugares: el
 * navegador tenia que falsificar ese peso (faux bold), que engorda los trazos
 * artificialmente y deja los titulos pastosos. Space Grotesk ademas no existe
 * sobre 700.
 *
 * next/font sirve las fuentes desde nuestro dominio (dos conexiones externas
 * menos en el arranque) y calcula metricas de respaldo, asi el texto no salta
 * cuando termina de cargar.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  // Rango real de la familia: 300 a 700. No hay 800 ni 900.
  weight: ['400', '500', '600', '700'],
  variable: '--font-headline',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // El canonical NO va aca: lo que se pone en el layout raiz se hereda a todas
  // las rutas, y un canonical "/" en todas le decia a Google que portafolio,
  // demos y legales eran copias de la home. Cada pagina declara el suyo.
  title: {
    default: 'Teo Labs | Software a medida, agentes de IA y CRM en Chile',
    // Las paginas internas ponen solo su nombre y esto agrega la marca.
    template: '%s | Teo Labs',
  },
  description: 'Software a medida, agentes de IA, CRM, ERP, tiendas online y webs para pymes de La Serena y todo Chile. Ya corre en faenas, obras y comercios. Respuesta en menos de 48 horas.',
  keywords: [
    'Agentes de IA para empresas',
    'CRM a medida Chile',
    'Chatbot WhatsApp para empresas',
    'Desarrollo de Software Chile',
    'Desarrollo de Aplicaciones La Serena',
    'Software a medida para Pymes',
    'Soluciones digitales para Startups',
    'Optimización de procesos empresariales',
    'Teo Labs La Serena',
    'Desarrollo web profesional Chile'
  ],
  authors: [{ name: 'Teo Labs' }],
  creator: 'Teo Labs',
  publisher: 'Teo Labs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Teo Labs | Software a medida, agentes de IA y CRM en Chile',
    description: 'Software que ya corre en faenas, obras y comercios reales. Agentes de IA, CRM, ERP, tiendas online y webs para pymes chilenas.',
    siteName: 'Teo Labs',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teo Labs | Software a medida, agentes de IA y CRM en Chile',
    description: 'Software que ya corre en faenas, obras y comercios reales. Agentes de IA, CRM, ERP, tiendas online y webs para pymes chilenas.',
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
  // Los iconos los genera src/app/icon.tsx a partir del gradiente de marca.
  // Antes esto apuntaba a /logo.png, un archivo que no existe y devolvia 404.
};

/**
 * Datos estructurados (JSON-LD). Es lo que leen Google para los resultados
 * enriquecidos y los asistentes de IA para citar bien de que se trata la empresa.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  email: 'steven@teolabs.app',
  telephone: '+56930938222',
  priceRange: '$$',
  slogan: 'Ingenieria de software premium para pymes y startups',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'La Serena',
    addressRegion: 'Coquimbo',
    addressCountry: 'CL',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Chile',
  },
  // Lo que vendemos, con los mismos precios que la seccion Servicios. Sin
  // precio donde el sitio dice "cotizacion": inventar uno aca seria peor.
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de Teo Labs',
    itemListElement: [
      { name: 'Web corporativa', price: 80000 },
      { name: 'E-commerce', price: 180000 },
      { name: 'Agentes de IA a medida' },
      { name: 'CRM a medida' },
      { name: 'ERP y sistemas de gestión' },
      { name: 'Aplicaciones web y móviles a medida' },
    ].map(({ name, price }) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name },
      ...(price && {
        priceSpecification: {
          '@type': 'PriceSpecification',
          price,
          priceCurrency: 'CLP',
          ...(name === 'E-commerce' && { minPrice: price }),
        },
      }),
    })),
  },
  sameAs: [
    'https://cl.linkedin.com/company/teo-labs',
    'https://github.com/teolabs',
  ],
  knowsAbout: [
    'Agentes de inteligencia artificial',
    'CRM a medida',
    'Desarrollo de software a medida',
    'Aplicaciones web',
    'E-commerce',
    'Aplicaciones moviles',
    'Automatizacion de procesos',
    'Inteligencia artificial aplicada',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      // Sin clase de tema: el HTML del servidor sale en claro, que es el
      // predeterminado, y el script de arriba agrega `dark` solo si el
      // visitante lo eligio antes.
      className={cn('!scroll-smooth', inter.variable, spaceGrotesk.variable)}
      suppressHydrationWarning
    >
      <head>
        {/*
          Aplica el tema ANTES del primer pintado. Sin esto el navegador pinta
          el tema por defecto y recien despues corre React: el visitante que
          eligio oscuro veria un fogonazo blanco en cada carga.
          El default es CLARO; solo `dark` guardado explicitamente lo cambia.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.classList.toggle('dark',localStorage.getItem('teolabs-theme')==='dark')}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}>
        {children}
        <Toaster />
        <CookieBanner />
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  );
}