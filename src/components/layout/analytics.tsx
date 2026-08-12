'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

/**
 * Google Analytics 4, con consentimiento.
 *
 * El sitio no tenia ninguna medicion: no habia forma de saber cuanta gente
 * llega al formulario ni en que paso lo abandona, asi que cualquier mejora de
 * conversion era a ciegas.
 *
 * Dos decisiones deliberadas:
 *
 * 1. Se activa solo si existe NEXT_PUBLIC_GA_ID. Sin la variable no se carga
 *    absolutamente nada, ni un byte: el sitio funciona igual.
 * 2. Se carga solo despues de que el visitante acepta las cookies. Ya hay un
 *    banner pidiendo permiso; cargar GA antes de la respuesta haria que ese
 *    banner fuera decorativo.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const CONSENT_KEY = 'cookie-consent';
export const CONSENT_EVENT = 'teolabs:cookie-consent';

/** Evento de negocio. No hace nada si GA no esta cargado. */
export function track(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.('event', name, params ?? {});
}

export default function Analytics() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setGranted(localStorage.getItem(CONSENT_KEY) === 'true');
      } catch {
        setGranted(false);
      }
    };

    read();
    window.addEventListener(CONSENT_EVENT, read);
    return () => window.removeEventListener(CONSENT_EVENT, read);
  }, []);

  if (!GA_ID || !granted) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
