import type { Metadata } from 'next';
import { Inter, Lexend, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import CookieBanner from '@/components/layout/cookie-banner';
import WhatsAppButton from '@/components/layout/whatsapp-button';
import MobileCta from '@/components/layout/mobile-cta';
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

/**
 * La tipografia del nombre "Teo Labs", y solo del nombre: Lexend Bold con el
 * espaciado apretado (-0.05em). La eligio el usuario el 10-10-2026 a partir de
 * una muestra; se identifico comparando la muestra contra 40 fuentes (Lexend
 * calzo letra por letra). Los titulares siguen en Space Grotesk y el texto en
 * Inter: Lexend es la firma, no la voz.
 */
const lexend = Lexend({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-wordmark',
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
  // Iconos por convencion de archivos: src/app/icon.svg (favicon, la Θ con
  // trazo mas grueso para 16 px) y src/app/apple-icon.png (iPhone, 180 px).
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
  // Datos del certificado de constitucion (22-09-2026, Ley 20.659).
  legalName: 'TEO LABS SpA',
  taxID: '78.518.165-4',
  foundingDate: '2026-09-22',
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  // La Θ sobre blanco, 512 px: es la que Google muestra junto al nombre.
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  email: 'hola@teolabs.app',
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
  // Solo perfiles confirmados como nuestros: github.com/teolabs es de otra
  // persona y no puede figurar como "la misma entidad" ante Google.
  sameAs: ['https://cl.linkedin.com/company/teo-labs'],
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
      className={cn('!scroll-smooth', inter.variable, spaceGrotesk.variable, lexend.variable)}
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
        <MobileCta />
        <Analytics />
      </body>
    </html>
  );
}