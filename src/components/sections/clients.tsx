'use client';

import React from 'react';

const clients = [
  { name: 'FerroActiva', logo: 'FERROACTIVA' },
  { name: 'Catering Express', logo: 'CATERING' },
  { name: 'Hospedaje Serena', logo: 'HOSPEDAJE' },
  { name: 'Constructora Recarp', logo: 'RECARP' },
  { name: 'Logística Sur', logo: 'LOGISTICA' },
  { name: 'Innovación CL', logo: 'INNOVACIÓN' },
  { name: 'Pyme Digital', logo: 'PYME DIGITAL' },
  { name: 'Studio Creativo', logo: 'STUDIO' },
];

export default function ClientsSection() {
  return (
    <section className="py-16 bg-white border-y border-border/40 overflow-hidden">
      <div className="container px-4 md:px-6 mb-10">
        <p className="text-center text-xs font-black text-muted-foreground uppercase tracking-[0.4em]">
          Empresas que confían en nuestro código
        </p>
      </div>
      
      <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-4">
          {[...clients, ...clients, ...clients].map((client, index) => (
            <div 
              key={index}
              className="mx-16 text-3xl md:text-5xl font-black font-headline tracking-tighter text-slate-200 hover:text-primary transition-colors cursor-default select-none duration-500"
            >
              {client.logo}
            </div>
          ))}
        </div>

        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white to-transparent z-10" />
      </div>
    </section>
  );
}
