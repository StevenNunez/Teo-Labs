'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { reportarError } from '@/lib/errores';

/**
 * Pantalla de error del sitio (antes salia la generica de Next.js, en ingles).
 *
 * El caso mas comun no es un fallo del codigo sino un deploy nuevo: quien tenia
 * la pestaña abierta sigue con archivos de la version anterior, que ya no
 * existen, y la pagina no carga. Recargar lo arregla, asi que en ese caso se
 * recarga sola una unica vez y no se avisa. Lo demas se anota en el registro
 * de errores.
 */
const CLAVE = 'teolabs:recarga-por-error';

function esVersionVieja(error: unknown): boolean {
  const texto = `${(error as Error | null)?.name ?? ''} ${(error as Error | null)?.message ?? ''}`;
  return /ChunkLoadError|Loading chunk|Failed to load chunk|dynamically imported module|Importing a module script failed/i.test(
    texto
  );
}

export default function ErrorDePagina({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const vieja = esVersionVieja(error);

  useEffect(() => {
    console.error(error);
    if (!vieja) {
      reportarError(`pantalla rota ${window.location.pathname}`, error);
      return;
    }
    try {
      const ultima = Number(window.sessionStorage.getItem(CLAVE) ?? 0);
      if (Date.now() - ultima < 60_000) return; // Ya se intento hace poco: no repetir.
      window.sessionStorage.setItem(CLAVE, String(Date.now()));
    } catch {
      return; // Sin almacenamiento: mejor no recargar a ciegas.
    }
    window.location.reload();
  }, [error, vieja]);

  return (
    <main className="grid min-h-[70svh] place-items-center px-4 py-24">
      <div className="w-full max-w-md text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Teo Labs</p>
        <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight md:text-4xl">
          {vieja ? 'Hay una versión nueva' : 'No pudimos cargar esta página'}
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          {vieja
            ? 'El sitio se actualizó mientras lo tenías abierto. Recarga para seguir.'
            : 'Puede ser algo pasajero. Ya quedó registrado y lo vamos a revisar. Prueba de nuevo en unos segundos.'}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => (vieja ? window.location.reload() : reset())}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            {vieja ? 'Recargar' : 'Reintentar'}
          </button>
          <Link
            href="/"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-foreground"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
