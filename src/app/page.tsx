'use client';

import React from 'react';
import Header from '@/components/layout/header';
import HeroSection from '@/components/sections/hero';
import ClientsSection from '@/components/sections/clients';
import Marquee from '@/components/sections/marquee';
import AboutSection from '@/components/sections/about';
import ServicesSection from '@/components/sections/services';
import IdeaValidator from '@/components/sections/idea-validator';
import ProjectsSection from '@/components/sections/projects';
import ContactSection from '@/components/sections/contact';
import Footer from '@/components/layout/footer';
import SplashScreen from '@/components/layout/splash-screen';

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
        <IdeaValidator />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
