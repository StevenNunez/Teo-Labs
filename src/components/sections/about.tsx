'use client';

import Image from 'next/image';
import { TrendingUp, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function AboutSection() {
  const aboutImage = {
    description: "Equipo de Teo Labs trabajando en soluciones digitales.",
    imageUrl: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", 
    imageHint: "equipo oficina"
  };

  const initialStats = [
    { label: "Crecimiento", base: 40, range: 10, prefix: '+', suffix: '%' },
    { label: "Proyectos", base: 15, range: 5, prefix: '+', suffix: '' },
    { label: "Retención", base: 100, range: 1, prefix: '', suffix: '%' },
  ];
  
  const [animatedStats, setAnimatedStats] = useState(initialStats.map(s => `${s.prefix}${s.base}${s.suffix}`));

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats(
        initialStats.map(stat => {
          let newValue;
          if (stat.label === "Retención") {
              newValue = getRandomNumber(98, 100);
          } else {
              newValue = getRandomNumber(stat.base - stat.range, stat.base + stat.range);
          }
          return `${stat.prefix}${newValue}${stat.suffix}`;
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="relative py-24 md:py-40 bg-white overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-bold">
                <ShieldCheck className="h-4 w-4" />
                Partner Tecnológico de Confianza
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black font-headline leading-tight">
                Impulsamos tu <br />
                <span className="text-primary">Visión de Negocio</span>
              </h2>
              
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                En <strong>Teo Labs</strong>, no solo escribimos código; diseñamos el motor que escalará tu empresa. Entendemos los desafíos locales y los enfrentamos con soluciones de clase mundial.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {initialStats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-4xl font-black font-headline text-foreground tabular-nums tracking-tighter">
                    {animatedStats[index]}
                  </div>
                  <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-10 rounded-2xl bg-primary text-white font-bold group">
                <Link href="#contact">
                  Hablemos de tu Proyecto
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-50" />
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-border/50">
              <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                fill
                className="object-cover"
                data-ai-hint={aboutImage.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 p-6 glass-card rounded-[2rem] flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg">
                  <Zap className="h-8 w-8 fill-current" />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-white text-lg font-headline leading-none">Resultados Reales</p>
                  <p className="text-white/80 text-xs font-medium uppercase tracking-widest">Impacto en el balance final</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}