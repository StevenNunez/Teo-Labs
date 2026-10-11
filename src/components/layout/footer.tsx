'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Heart } from 'lucide-react';
import LiquidText from '@/components/ui/liquid-text';
import SmokeCursor from '@/components/ui/smoke-cursor';
import InteractiveLogo from '@/components/ui/interactive-logo';
import BrandMark from '@/components/ui/brand-mark';

// El degradado del mundo de la Θ (cobalto -> nebulosa), paleta Cielo de
// Elqui. A nivel de modulo para que la referencia sea estable.
const BRAND_GRADIENT = ['#2F4BFF', '#8A5CFF'];

/**
 * Enlaces del footer.
 *
 * - Rutas con `/#`, no `#`: el footer tambien se muestra en /portafolio-web y
 *   en las paginas legales, donde un `#services` suelto no lleva a ninguna
 *   parte.
 * - Servicios = lo que el sitio vende hoy. Antes ofrecia "Consultoria
 *   digital", que no aparece en ninguna otra parte, y no nombraba ni agentes
 *   ni CRM.
 * - Redes: solo las que son nuestras. `github.com/teolabs` es una cuenta de
 *   2017 de otra persona y la de X no estaba confirmada; un enlace a una
 *   cuenta ajena resta confianza. Las nuevas (Instagram, TikTok, Facebook) se
 *   suman aca cuando existan.
 * - Texto en mayuscula inicial: las mayusculas quedan solo para los rotulos
 *   chicos de cada columna, que ya las ponen por CSS.
 */
const footerLinks = {
  services: {
    title: 'Servicios',
    links: [
      { label: 'Agentes de IA', href: '/#agentes' },
      { label: 'CRM a medida', href: '/#agentes' },
      { label: 'ERP y software a medida', href: '/#services' },
      { label: 'Webs y e-commerce', href: '/#services' },
    ],
  },
  social: {
    title: 'Redes',
    links: [
      { label: 'LinkedIn', href: 'https://cl.linkedin.com/company/teo-labs' },
      { label: 'WhatsApp', href: 'https://wa.me/56930938222' },
    ],
  },
  company: {
    title: 'Teo Labs',
    links: [
      { label: 'Nosotros', href: '/#about' },
      { label: 'Proyectos', href: '/#projects' },
      { label: 'Portafolio', href: '/portafolio-web' },
      { label: 'Contacto', href: '/#contact' },
    ],
  },
};

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  // El wordmark gigante se dibuja en un canvas, que necesita el nombre real de
  // la familia. next/font registra Lexend con un nombre interno ("__Lexend_…"),
  // asi que se lee de la variable CSS. Antes el canvas pedia 'Space Grotesk'
  // literal, que con next/font no existe por ese nombre: caia en la fuente de
  // reserva del sistema.
  const [wordmarkFont, setWordmarkFont] = useState<string | undefined>(undefined);
  useEffect(() => {
    const family = getComputedStyle(document.documentElement).getPropertyValue('--font-wordmark').trim();
    if (family) setWordmarkFont(family);
  }, []);
  const currentYear = new Date().getFullYear();

  return (
    // `isolate` acota el mix-blend-mode del humo a este stacking context.
    <footer className="relative isolate overflow-hidden">
      {/* Background with animated wave lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink-muted to-ink">
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
      <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 xl:px-20 pt-14 md:pt-20">
        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-3 lg:gap-12 mb-14">
          <div>
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
              {footerLinks.services.title}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.services.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
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
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
              {footerLinks.social.title}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.social.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
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
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
              {footerLinks.company.title}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
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
          <LiquidText
            text="TEO LABS"
            className="w-full"
            gradient={BRAND_GRADIENT}
            fontFamily={wordmarkFont}
            fontWeight={700}
            letterSpacing={-0.05}
          />
        </div>

        {/* Bottom Bar */}
        {/* `pb-24` en celular y `md:pr-20` en escritorio: el boton flotante de
            WhatsApp (bottom-6 right-6) quedaba encima de "Privacidad". */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 pb-24 md:pb-8 md:pr-20 border-t border-white/10">
          <div className="flex flex-col items-center md:items-start gap-2">
            {/*
              El nombre va con el InteractiveLogo, no como texto plano: es la
              firma de la marca y reacciona al mouse igual que en el header y
              que en el credito de todos los sitios que hacemos.

              Nota de maquetado: el resto de la linea lleva `tracking-[0.4em]`,
              que sobre el logo separaria las letras y romperia el efecto. Por
              eso el tracking se aplica a los tramos de texto y no al
              contenedor.
            */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] uppercase text-white/60">
              <BrandMark title="" className="h-5 w-5" />
              <span className="tracking-[0.35em]">© {currentYear}</span>
              <InteractiveLogo
                text="Teo Labs"
                variant="footer-small"
                className="font-wordmark text-[14px] font-bold normal-case tracking-wordmark"
              />
              <span className="tracking-[0.35em]">· La Serena, Chile</span>
            </div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/50">
              TEO LABS SpA · RUT 78.518.165-4
            </p>
            
          </div>
          
          <div className="flex items-center gap-6 md:gap-10">
            <a
              href="/terminos"
              className="text-[11px] text-white/60 hover:text-white transition-colors tracking-[0.2em] font-semibold uppercase"
            >
              Términos
            </a>
            <a
              href="/privacidad"
              className="text-[11px] text-white/60 hover:text-white transition-colors tracking-[0.2em] font-semibold uppercase"
            >
              Privacidad
            </a>
          </div>
        </div>
      </div>

      {/* Rastro de humo del cursor sobre todo el footer. Va encima del
          contenido para que tambien pase por las letras, con `screen` para
          aclarar sin tapar y `pointer-events-none` para no robar clicks.
          El humo es blanco: contra el wordmark se lee porque el wordmark
          lleva el gradiente de marca, no blanco. */}
      <SmokeCursor className="pointer-events-none absolute inset-0 z-20 h-full w-full mix-blend-screen" />

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
