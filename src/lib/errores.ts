'use client';

/**
 * Reporta al registro de errores (/api/errores) lo que se rompe en la
 * pantalla. Sin esperar respuesta y sin lanzar nunca. El mismo error de la
 * misma pantalla se reporta una sola vez por visita.
 */

const yaReportados = new Set<string>();

function textoDeError(e: unknown): string {
  if (e instanceof Error) return e.message || e.name;
  if (typeof e === 'string') return e;
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message: unknown }).message);
  return String(e);
}

export function reportarError(donde: string, e: unknown) {
  if (typeof window === 'undefined') return;
  try {
    const mensaje = textoDeError(e).slice(0, 2000);
    const clave = `${donde}|${mensaje}`;
    if (yaReportados.has(clave) || yaReportados.size > 200) return;
    yaReportados.add(clave);

    void fetch('/api/errores', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        donde,
        mensaje,
        pila: e instanceof Error ? e.stack?.slice(0, 4000) : undefined,
        pagina: window.location.pathname,
      }),
    }).catch(() => {
      // Sin conexion no hay como avisar; no vale la pena reintentar.
    });
  } catch {
    // Nunca lanza.
  }
}
