'use client';

import React, { useState } from 'react';
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
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      {!showSplash && (
        <div className="animate-in fade-in duration-1000">
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
      )}
    </div>
  );
}
