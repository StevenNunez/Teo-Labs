import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import CookieBanner from '@/components/layout/cookie-banner';
import WhatsAppButton from '@/components/layout/whatsapp-button';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site-url';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    // El sitio responde igual en teolabs.app y www.teolabs.app; esto le dice a
    // Google cual de las dos es la buena, para no repartir el credito entre ambas.
    canonical: '/',
  },
  title: 'Teo Labs | Desarrollo de Software a Medida para Pymes y Startups en Chile',
  description: 'Expertos en desarrollo de aplicaciones web, móviles y automatización de procesos en La Serena y todo Chile. Impulsamos el crecimiento de tu empresa con tecnología de vanguardia.',
  keywords: [
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
    title: 'Teo Labs | Desarrollo de Software a Medida en Chile',
    description: 'Soluciones tecnológicas que transforman tu negocio. Especialistas en Pymes y Startups.',
    url: 'https://teolabs.app',
    siteName: 'Teo Labs',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teo Labs | Soluciones Digitales de Alto Impacto',
    description: 'Desarrollamos el software que tu empresa necesita para escalar en el mercado actual.',
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
  sameAs: [
    'https://cl.linkedin.com/company/teo-labs',
    'https://github.com/teolabs',
  ],
  knowsAbout: [
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
    <html lang="es" className="!scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
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
      </body>
    </html>
  );
}