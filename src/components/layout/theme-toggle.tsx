'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * Interruptor de tema.
 *
 * El sitio arranca en oscuro (`layout.tsx` aplica la clase `dark` antes de
 * pintar, ver el script anti-parpadeo de ahi). Esto solo permite cambiarlo y
 * recuerda la eleccion.
 *
 * No usa `next-themes` a proposito: para dos temas y un `<html class>` la
 * dependencia no se justifica.
 */

export const THEME_KEY = 'teolabs-theme';

export default function ThemeToggle() {
  // Arranca en null para no renderizar un icono que contradiga la clase que el
  // script del <head> ya aplico: en el servidor no sabemos cual eligio.
  const [theme, setTheme] = useState<'dark' | 'light' | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage bloqueado: el cambio vale para esta sesion igual.
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
    >
      {/* Mientras no sepamos el tema, el boton ocupa su lugar sin icono para
          que el header no salte cuando hidrata. */}
      {theme === 'dark' && <Moon className="h-4 w-4" />}
      {theme === 'light' && <Sun className="h-4 w-4" />}
    </button>
  );
}
