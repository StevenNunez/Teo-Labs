'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import imageData from '@/app/lib/placeholder-images.json';
import InteractiveLogo from '@/components/ui/interactive-logo';

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
 * Tiempos. Historia: 5,3s (eterno) -> 1,6s (no daba tiempo a leer el nombre)
 * -> 2,3s tipeando (todavia apurado). Ahora el revelado es mas pausado y el
 * reparto queda: entra el globo, las letras se acercan de a una, y hay un
 * respiro con el nombre completo antes de que suba la cortina.
 *
 * Los delays por letra viven en globals.css (`.splash-letters`); aca solo se
 * replican las constantes para poder calcular cuando cerrar. Si cambias una,
 * cambia la otra.
 */
const REVEAL_START_MS = 300;
const REVEAL_STEP_MS = 170;
const REVEAL_DURATION_MS = 620;
const HOLD_AFTER_REVEAL_MS = 800;
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
      setTimeout(() => onComplete?.(), immediate ? 0 : 700);
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
                  transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
                }
          }
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white px-4"
        >
          {/* Fondo con brillo sutil */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#3b82f608,transparent_70%)]" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-8 md:mb-12 relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="relative z-10 w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden"
            >
              <Image
                src={imageData.splash.globe.url}
                alt={imageData.splash.globe.description}
                fill
                className="object-contain"
                priority // Prioridad máxima para evitar parpadeos
              />
            </motion.div>

            <div className="absolute inset-0 bg-primary/10 blur-[60px] md:blur-[100px] rounded-full scale-125 -z-10" />
          </motion.div>          {/*
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
              className="font-headline font-bold tracking-[0.02em]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="absolute bottom-12 md:bottom-16 flex flex-col items-center gap-4 w-full px-6"
          >
            <div className="h-[2px] w-24 md:w-32 bg-black/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-full bg-gradient-to-r from-blue-600 via-purple-600 to-green-500"
              />
            </div>
            <span className="text-[8px] md:text-[10px] font-semibold tracking-[0.4em] md:tracking-[0.5em] text-black/30 uppercase text-center">
              Innovación Global desde Chile
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
