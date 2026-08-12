'use client';

import { Cpu, Brain, Server, Globe, Rocket, LineChart } from 'lucide-react';

const marqueeItems = [
  { label: 'SOFTWARE A MEDIDA', icon: Cpu },
  { label: 'OPTIMIZACIÓN', icon: LineChart },
  { label: 'IA & AUTOMATIZACIÓN', icon: Brain },
  { label: 'STARTUPS', icon: Rocket },
  { label: 'INFRAESTRUCTURA', icon: Server },
  { label: 'SOLUCIONES GLOBALES', icon: Globe },
];

export default function Marquee() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-primary">
      <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {marqueeItems.concat(marqueeItems).map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-8 mx-12 md:mx-16"
            >
              <span className="font-headline text-5xl md:text-8xl font-black text-white leading-none tracking-tighter italic">
                {item.label}
              </span>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                <item.icon className="text-white w-8 h-8 md:w-10 md:h-10" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-primary to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-primary to-transparent z-10" />
    </section>
  );
}
