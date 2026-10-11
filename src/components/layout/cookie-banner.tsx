'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CONSENT_EVENT, CONSENT_KEY } from '@/components/layout/analytics';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Aparece cuando el visitante empieza a bajar, no a los 3 segundos.
   *
   * Con el temporizador, en celular el banner caia justo encima de los dos
   * botones del hero: lo primero que veia alguien nuevo era el
   * boton que mas vende tapado por un aviso. Al bajar un tercio de pantalla
   * los botones del hero ya quedaron atras, y el permiso igual se pide antes
   * de cualquier medicion (Analytics no carga sin el).
   */
  useEffect(() => {
    let consent: string | null = null;
    try {
      consent = localStorage.getItem(CONSENT_KEY);
    } catch {
      return;
    }
    if (consent) return;

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.35) {
        setIsVisible(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Analytics escucha este evento: sin el, la decision recien tendria efecto
  // en la siguiente carga de pagina.
  const saveConsent = (value: 'true' | 'dismissed') => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {}
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setIsVisible(false);
  };

  const handleAccept = () => saveConsent('true');

  // Cerrar con la X tambien es una decision: si no la guardamos, el banner
  // vuelve a aparecer en cada visita y termina siendo mas molesto que util.
  // Se guarda como "dismissed", que NO habilita analytics.
  const handleDismiss = () => saveConsent('dismissed');

  if (!isVisible) return null;

  return (
    <div className={cn(
      // El boton de WhatsApp vive en bottom-6 right-6: sin este margen extra
      // el banner se le montaba encima y tapaba el canal de contacto principal.
      "fixed bottom-28 left-6 right-6 md:bottom-6 md:left-auto md:right-28 md:max-w-sm z-[60]",
      "animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out"
    )}>
      {/* Fondo solido: con `bg-card/95` + blur, el boton azul que quedaba
          debajo se transparentaba y parecia parte del aviso. */}
      <div className="relative bg-card border border-border shadow-2xl rounded-2xl p-5 overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-primary/5 blur-2xl rounded-full pointer-events-none" />
        
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        <div className="flex gap-4">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Cookie className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-foreground/80">Privacidad</h4>
            {/* Dice exactamente que se activa: "mejorar tu experiencia" no
                explicaba nada, y es la medicion lo que se esta autorizando. */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              ¿Nos dejas usar Google Analytics para saber cómo se usa el sitio? Sin tu permiso no se carga.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" onClick={handleAccept} className="h-9 bg-primary text-primary-foreground font-bold px-4 text-xs rounded-lg">
                Aceptar
              </Button>
              {/* Rechazar al mismo nivel que aceptar: antes la unica forma de
                  decir que no era una X chica en la esquina. */}
              <Button size="sm" variant="outline" onClick={handleDismiss} className="h-9 font-bold px-4 text-xs rounded-lg">
                Rechazar
              </Button>
              <Button size="sm" variant="ghost" asChild className="h-9 text-xs px-2 hover:bg-transparent hover:underline">
                <a href="/privacidad">Más info</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
