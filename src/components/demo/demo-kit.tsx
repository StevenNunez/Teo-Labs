'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import InteractiveLogo from '@/components/ui/interactive-logo';
import BrandMark from '@/components/ui/brand-mark';

/**
 * Piezas comunes de las demos del portafolio (/demo/*).
 *
 * Antes cada demo traia su propio boton flotante de salida ("Salir de Demo",
 * "Volver al Portafolio Teo Labs"...), puesto en lugares distintos y encima
 * del logo o del menu de la demo; en logistica tapaba el boton de WhatsApp.
 * Los botones de las demos no hacian nada y los enlaces eran `href="#"`: el
 * visitante que probaba una demo veia una pagina rota, justo cuando estaba
 * evaluando si contratarnos.
 *
 * Ahora:
 * - `DemoBar`: una franja arriba que dice lo que es (una demo, negocio
 *   ficticio), con la salida al portafolio y el llamado a cotizar uno igual.
 * - `demoAction`: cada accion de la demo responde con un aviso que explica
 *   que haria en el sitio real.
 * - `DemoCredit`: la firma de Teo Labs al pie, la misma de todos los sitios.
 */

/** `business` con su genero: "Clínica dental ficticia", "Gimnasio ficticio". */
export function DemoBar({ business }: { business: string }) {
  // Las demos son marcas ajenas, disenadas en claro. Si el visitante eligio el
  // tema oscuro de Teo Labs, los componentes compartidos (botones outline,
  // badges) tomaban los tokens oscuros sobre fondos blancos de la demo.
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains('dark');
    root.classList.remove('dark');
    return () => {
      if (hadDark) root.classList.add('dark');
    };
  }, []);

  return (
    <div className="relative z-[60] bg-[#0B1026] font-body text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2.5 text-xs md:px-6">
        <div className="flex items-center gap-2.5">
          <BrandMark title="" className="h-5 w-5 shrink-0" />
          <span>
            <strong className="font-semibold">Demo de Teo Labs</strong>
            <span className="text-white/60"> · {business}, hecho para mostrar el formato</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/portafolio-web" className="inline-flex items-center gap-1.5 text-white/75 transition-colors hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver al portafolio
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#2F4BFF] px-3.5 py-1.5 font-semibold transition-colors hover:bg-[#4D66FF]"
          >
            Quiero uno así <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Lo que haria la accion en el sitio real, en un aviso breve. */
export function demoAction(title: string, description?: string) {
  toast({
    title,
    description: description ?? 'Esto es una demo: en el sitio real, esta acción funciona de verdad.',
  });
}

/** Desplaza a una seccion de la demo por su id. */
export function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Firma al pie de cada demo, igual que en los sitios de clientes. */
export function DemoCredit({ className = '' }: { className?: string }) {
  return (
    <a
      href="https://www.teolabs.app"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      Desarrollado por{' '}
      <InteractiveLogo text="Teo Labs" variant="footer-small" className="font-wordmark text-[14px] font-bold tracking-wordmark" /> ®
    </a>
  );
}
