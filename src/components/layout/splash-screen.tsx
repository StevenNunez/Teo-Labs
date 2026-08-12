'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import imageData from '@/app/lib/placeholder-images.json';

const letters = "TEO LABS".split("");

export default function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Reducimos el tiempo total a 4.5 segundos para que sea más ágil
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => onComplete?.(), 800);
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

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
          exit={{ 
            y: '-100%',
            opacity: 0,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white px-4"
        >
          {/* Fondo con brillo sutil */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#3b82f608,transparent_70%)]" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
            }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut"
            }}
            className="mb-8 md:mb-12 relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="relative z-10 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden"
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
          </motion.div>

          <div className="flex justify-center items-center overflow-hidden px-2 max-w-full">
            {letters.map((char, index) => (
              <motion.span
                key={index}
                initial={{ y: 60, opacity: 0, filter: 'blur(10px)' }}
                animate={{ 
                  y: 0, 
                  opacity: 1, 
                  filter: 'blur(0px)',
                  transition: { 
                    duration: 0.8, 
                    delay: 1.0 + (index * 0.1), // Delay más corto y escalonado rápido
                    ease: [0.215, 0.61, 0.355, 1] 
                  } 
                }}
                className={cn(
                  "text-4xl sm:text-6xl md:text-8xl font-black font-headline tracking-tighter inline-block",
                  char === " " ? "w-[0.25em]" : "bg-gradient-to-br from-blue-600 via-purple-500 to-green-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                )}
              >
                {char}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-12 md:bottom-16 flex flex-col items-center gap-4 w-full px-6"
          >
            <div className="h-[2px] w-24 md:w-32 bg-black/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-full bg-gradient-to-r from-blue-600 via-purple-600 to-green-500"
              />
            </div>
            <span className="text-[8px] md:text-[11px] font-bold tracking-[0.4em] md:tracking-[0.6em] text-black/30 uppercase text-center">
              Innovación Global desde Chile
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
