'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

/**
 * Barra fija abajo, solo en celular.
 *
 * En celular la home mide ~15 pantallas y el boton de cotizar quedaba arriba,
 * en el hero: quien se convencia en Proyectos o en Preguntas tenia que volver
 * a buscarlo. La barra aparece al pasar el hero y se esconde cuando el
 * formulario de contacto ya esta en pantalla (ahi sobra).
 *
 * Reemplaza en celular al boton flotante de WhatsApp (que se oculta bajo md):
 * la barra ya trae los dos caminos, cotizar y escribir.
 */
export default function MobileCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname !== '/') return;
    // Se calcula en cada scroll con getBoundingClientRect y no con un
    // IntersectionObserver: es una lectura barata y no depende de que el
    // navegador entregue el callback (en pestanas en segundo plano lo atrasa).
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.8;
      const contact = document.getElementById('contact');
      const r = contact?.getBoundingClientRect();
      const contactInView = !!r && r.top < window.innerHeight && r.bottom > 0;
      setVisible(pastHero && !contactInView);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  if (pathname !== '/') return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 pt-3 backdrop-blur-xl transition-transform duration-300 md:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      <div className="flex gap-3">
        <Link
          href="#contact"
          tabIndex={visible ? 0 : -1}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground"
        >
          Cotizar proyecto <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href="https://wa.me/56930938222?text=Hola%20Teo%20Labs!%20Quiero%20conversar%20sobre%20un%20proyecto."
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="flex h-12 items-center justify-center rounded-xl bg-[#25D366] px-5 font-bold text-white"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
