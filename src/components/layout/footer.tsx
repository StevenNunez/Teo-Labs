'use client';

import { useRef } from 'react';
import { ExternalLink, Heart } from 'lucide-react';
import LiquidText from '@/components/ui/liquid-text';

const footerLinks = {
  services: {
    title: 'NUESTROS SERVICIOS',
    links: [
      { label: 'SOFTWARE A MEDIDA', href: '#services' },
      { label: 'CONSULTORÍA DIGITAL', href: '#services' },
      { label: 'INTELIGENCIA ARTIFICIAL', href: '#services' },
      { label: 'AUTOMATIZACIÓN', href: '#services' },
    ],
  },
  social: {
    title: 'REDES SOCIALES',
    links: [
      { label: 'LINKEDIN', href: 'https://cl.linkedin.com/company/teo-labs' },
      { label: 'TWITTER / X', href: 'https://twitter.com/teolabs' },
      { label: 'GITHUB', href: 'https://github.com/teolabs' },
    ],
  },
  company: {
    title: 'TEO LABS',
    links: [
      { label: 'NOSOTROS', href: '#about' },
      { label: 'PROYECTOS', href: '#projects' },
      { label: 'CONTACTO', href: '#contact' },
      { label: 'WHATSAPP', href: 'https://wa.me/56930938222' },
    ],
  },
};

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Background with animated wave lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100"
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="1"
            style={{ animation: 'waveMove 12s linear infinite' }}
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20 pt-16 md:pt-24">
        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 mb-16">
          <div>
            <h3 className="font-headline text-sm text-white/90 mb-6 tracking-[0.2em] font-black">
              {footerLinks.services.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-xs text-white/40 hover:text-white transition-all tracking-wider"
                  >
                    {link.label}
                    <ExternalLink
                      size={10}
                      className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-headline text-sm text-white/90 mb-6 tracking-[0.2em] font-black">
              {footerLinks.social.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.social.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-xs text-white/40 hover:text-white transition-all tracking-wider"
                  >
                    {link.label}
                    <ExternalLink
                      size={10}
                      className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-headline text-sm text-white/90 mb-6 tracking-[0.2em] font-black">
              {footerLinks.company.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-xs text-white/40 hover:text-white transition-all tracking-wider"
                  >
                    {link.label}
                    <ExternalLink
                      size={10}
                      className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Giant TEO LABS Text */}
        <div ref={containerRef} className="relative mb-0 select-none pb-4">
          <LiquidText text="TEO LABS" className="w-full" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-10 border-t border-white/5">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-[10px] text-white/30 tracking-[0.4em] flex items-center gap-1.5 uppercase font-black">
              <span>© {currentYear}</span>
              <span className="text-white/60">TEO LABS</span>
              <span>· GLOBAL SOFTWARE HOUSE</span>
            </div>
            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-2">
              Made with <Heart size={8} className="text-red-500 fill-red-500 animate-pulse" /> in La Serena, Chile
            </p>
          </div>
          
          <div className="flex items-center gap-6 md:gap-10">
            <a
              href="/terminos"
              className="text-[10px] text-white/30 hover:text-white/80 transition-colors tracking-[0.2em] font-black uppercase"
            >
              Términos
            </a>
            <a
              href="/privacidad"
              className="text-[10px] text-white/30 hover:text-white/80 transition-colors tracking-[0.2em] font-black uppercase"
            >
              Privacidad
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes waveMove {
          0% { transform: translateX(-20%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(-20%); }
        }
      `}</style>
    </footer>
  );
}
