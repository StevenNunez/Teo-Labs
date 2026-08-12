'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 3000); // Show after 3 seconds, more elegant
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-sm z-[60]",
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
