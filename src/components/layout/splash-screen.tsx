'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveLogo from '@/components/ui/interactive-logo';
import BrandGlobe from '@/components/ui/brand-globe';

/**
 * El nombre se revela con el MISMO componente que el header
 * (`InteractiveLogo`), no con una copia. Antes el splash tenia su propia
 * version de las letras: mismo gradiente, pero otro componente — o sea, dos
 * lugares donde mantener la marca y dos formas de que se desincronicen.
 */
const FULL_TEXT = 'Teo Labs';

/** Una sola vez por pestaña: quien vuelve al sitio no vuelve a esperar. */
const SEEN_KEY = 'teolabs-splash-seen';

/**
 * Tiempos. Historia: 5,3s (eterno) -> 1,6s -> 2,3s -> 2,9s con el globo. Y
 * durante todo ese rato el scroll queda bloqueado: quien llega desde un
 * anuncio o un enlace de redes espera casi tres segundos sin poder bajar.
 *
 * Desde 2026-10-10 son ~1,6s. El globo de antes era una imagen de stock sacada
 * de internet; ahora es nuestro mundo en 3D (BrandGlobe): puntos con el
 * degradado de marca, los trazos de la Θ y la orbita del laboratorio. Teo
 * (theos, el mundo) + Labs. Si three tarda en llegar, el nombre sale igual y
 * el globo aparece con un fundido cuando esta listo.
 *
 * Los delays por letra viven en globals.css (`.splash-letters`); aca solo se
 * replican las constantes para poder calcular cuando cerrar. Si cambias una,
 * cambia la otra.
 */
const REVEAL_START_MS = 120;
const REVEAL_STEP_MS = 70;
const REVEAL_DURATION_MS = 460;
const HOLD_AFTER_REVEAL_MS = 550;
const DURATION_MS =
  REVEAL_START_MS +
  (FULL_TEXT.length - 1) * REVEAL_STEP_MS +
  REVEAL_DURATION_MS +
  HOLD_AFTER_REVEAL_MS;

export default function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [isAnimating, setIsAnimating] = useState(true);
  // Cuando ya se vio antes (o el visitante lo salta) no queremos la cortina de
  // salida: tiene que desaparecer sin costo perceptible.
  const [instant, setInstant] = useState(false);
  const finished = useRef(false);

  const dismiss = useCallback(
    (immediate = false) => {
      if (finished.current) return;
      finished.current = true;
      if (immediate) setInstant(true);
      setIsAnimating(false);
      setTimeout(() => onComplete?.(), immediate ? 0 : 500);
    },
    [onComplete]
  );

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // Modo incognito con storage bloqueado: mostramos el splash igual.
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (seen || reduceMotion) {
      // Se decide en el primer tick, antes de que el ojo alcance a registrarlo.
      dismiss(true);
      return;
    }

    // El revelado letra por letra lo maneja CSS (`.splash-letters`), no JS:
    // asi las letras no dependen de que React re-renderice a tiempo y la
    // animacion corre en el compositor.
    const timer = setTimeout(() => dismiss(), DURATION_MS);
    return () => clearTimeout(timer);
  }, [dismiss]);

  // Se puede saltar: cualquier intento de interactuar significa "ya quiero ver
  // la pagina". Antes no habia forma de salir de los 5,3 segundos.
  useEffect(() => {
    if (!isAnimating) return;

    const skip = () => dismiss();
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, skip, { passive: true }));

    return () => {
      events.forEach((event) => window.removeEventListener(event, skip));
    };
  }, [isAnimating, dismiss]);

  // El contenido de la página ya está detrás de esta capa, así que hay que
  // impedir que se pueda hacer scroll mientras el splash la está tapando.
  useEffect(() => {
    if (!isAnimating) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [isAnimating]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={
            instant
              ? { opacity: 0, transition: { duration: 0 } }
              : {
                  y: '-100%',
                  opacity: 0,
                  transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
                }
          }
          // `bg-background` y no `bg-white`: con tema oscuro elegido, el
          // visitante veia un fogonazo blanco antes de su pagina oscura.
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--brand-blue)/0.08),transparent_60%)]" />

          <BrandGlobe className="relative mb-4 h-48 w-48 sm:h-60 sm:w-60 md:h-72 md:w-72" />

          {/*
            El texto completo va en el DOM desde el primer frame: cada letra se
            revela en su posicion final, sin empujar a las siguientes. Eso es lo
            que diferencia el "acercamiento" del tipeo — en el tipeo el bloque
            crece y todo se corre; aca el nombre ya ocupa su lugar y las letras
            simplemente llegan.
          */}
          <div className="splash-letters flex items-center justify-center px-2 text-4xl sm:text-6xl md:text-7xl">
            <InteractiveLogo
              text={FULL_TEXT}
              variant="header"
              className="font-wordmark font-bold tracking-wordmark"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="absolute bottom-12 md:bottom-16 flex flex-col items-center gap-4 w-full px-6"
          >
            <div className="h-[2px] w-24 md:w-32 bg-foreground/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-full bg-brand-gradient"
              />
            </div>
            <span className="text-[10px] font-semibold tracking-[0.4em] md:tracking-[0.5em] text-muted-foreground uppercase text-center">
              Software a medida · La Serena, Chile
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
