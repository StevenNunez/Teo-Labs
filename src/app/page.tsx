import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import HeroSection from '@/components/sections/hero';
import ClientsSection from '@/components/sections/clients';
import Marquee from '@/components/sections/marquee';
import AboutSection from '@/components/sections/about';
import ServicesSection from '@/components/sections/services';
import AgentsSection from '@/components/sections/agents';
import ProjectsSection from '@/components/sections/projects';
import TestimonialsSection from '@/components/sections/testimonials';
import FaqSection from '@/components/sections/faq';
import ContactSection from '@/components/sections/contact';
import Footer from '@/components/layout/footer';
import SplashScreen from '@/components/layout/splash-screen';

/**
 * Sin 'use client': la pagina solo compone secciones, y cada una que necesita
 * el navegador ya lo declara. Asi puede exportar su propia metadata, y el
 * canonical "/" vive aca y no en el layout raiz, desde donde se heredaba a
 * TODAS las rutas: portafolio, demos y legales le decian a Google que eran una
 * copia de la home, y Google las dejaba fuera del indice.
 */
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/*
        El contenido se renderiza SIEMPRE, tambien en el HTML del servidor.
        El splash va encima como capa (fixed inset-0 z-[100]) y al terminar se
        desliza hacia arriba dejandolo a la vista.

        Antes el contenido estaba detras de un `!showSplash &&`, asi que el HTML
        que recibian Google y los rastreadores de IA solo traia el splash: ni el
        titular, ni los servicios, ni el footer.
      */}
      <SplashScreen />

      <Header />
      <main className="flex-1">
        <HeroSection />
        <ClientsSection />
        <Marquee />
        <AboutSection />
        <ServicesSection />
        <AgentsSection />
        <ProjectsSection />
        {/* Se auto-oculta mientras no haya testimonios reales cargados. */}
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
