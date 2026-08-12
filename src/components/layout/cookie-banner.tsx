'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CONSENT_EVENT, CONSENT_KEY } from '@/components/layout/analytics';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 3000); // Show after 3 seconds, more elegant
      return () => clearTimeout(timer);
    }
  }, []);

  // Analytics escucha este evento: sin el, la decision recien tendria efecto
  // en la siguiente carga de pagina.
  const saveConsent = (value: 'true' | 'dismissed') => {
    localStorage.setItem(CONSENT_KEY, value);
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
      <div className="relative bg-card/95 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-2xl p-5 overflow-hidden">
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
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Usamos cookies para mejorar tu experiencia en <strong>Teo Labs</strong>. ¿Nos permites optimizar tu navegación?
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" onClick={handleAccept} className="h-8 bg-primary text-primary-foreground font-bold px-4 text-[10px] rounded-lg">
                Aceptar
              </Button>
              <Button size="sm" variant="ghost" asChild className="h-8 text-[10px] px-2 hover:bg-transparent hover:underline">
                <a href="/privacidad">Más info</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
