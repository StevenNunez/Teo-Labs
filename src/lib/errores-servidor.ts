import 'server-only';

import { createHash } from 'node:crypto';
import { correoConfigurado, enviarCorreo, escapar, teoLabsDegradado } from '@/lib/correo';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * El registro de errores (migracion supabase/0002_errores_y_frenos.sql).
 *
 * Todo error que el sitio no supo resolver pasa por aca: queda en los registros
 * de Vercel (`console.error`), en la tabla `errores` agrupado por huella, y la
 * primera vez que aparece uno nuevo sale un aviso por correo.
 *
 * Nunca lanza: anotar un error no puede convertirse en un segundo error.
 */

export type ErrorAnotado = {
  origen: 'navegador' | 'servidor';
  /** Donde paso: la ruta o la funcion, p. ej. "ia/asesor". */
  donde: string;
  error: unknown;
  detalle?: Record<string, unknown>;
};

const AVISO_A = () => process.env.AVISO_ERRORES_A?.trim() || process.env.ADMIN_EMAIL?.trim() || 'hola@teolabs.app';

/** El texto del error, sin lo que cambia de una vez a otra. */
function normalizar(mensaje: string) {
  return mensaje
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '<id>')
    .replace(/\b\d+([.,]\d+)*\b/g, '<n>')
    .replace(/"[^"]{0,200}"/g, '"…"')
    .trim()
    .slice(0, 500);
}

export function mensajeDe(error: unknown): string {
  if (error instanceof Error) return error.message || error.name;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) return String((error as { message: unknown }).message);
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export async function anotarError(e: ErrorAnotado): Promise<void> {
  try {
    const mensaje = mensajeDe(e.error).slice(0, 2000);
    const pila = e.error instanceof Error ? e.error.stack?.split('\n').slice(0, 8).join('\n') : undefined;
    const entorno = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'desconocido';

    console.error(`[error ${e.origen}] ${e.donde}: ${mensaje}`, pila ?? '');

    if (!supabaseAdmin) return;

    const huella = createHash('sha256')
      .update(`${e.origen}|${e.donde}|${normalizar(mensaje)}`)
      .digest('hex')
      .slice(0, 32);
    const { data: esNuevo, error } = await supabaseAdmin.rpc('registrar_error', {
      p_huella: huella,
      p_origen: e.origen,
      p_donde: e.donde.slice(0, 300),
      p_mensaje: mensaje,
      p_detalle: { ...e.detalle, ...(pila ? { pila } : {}), entorno },
    });
    // Sin la migracion aplicada, el error igual quedo en los registros de Vercel.
    if (error) {
      console.error('[error] No se pudo anotar en la tabla errores:', error.message);
      return;
    }

    // Avisa solo desde produccion: probando en localhost no se llena la casilla.
    if (esNuevo === true && entorno === 'production' && correoConfigurado()) {
      await avisar(e, mensaje, huella).catch((x) => console.error('[error] No se pudo avisar por correo:', mensajeDe(x)));
    }
  } catch (x) {
    console.error('[error] Fallo el registro de errores:', mensajeDe(x));
  }
}

async function avisar(e: ErrorAnotado, mensaje: string, huella: string) {
  const filas: [string, string][] = [
    ['Dónde', e.donde],
    ['Origen', e.origen === 'navegador' ? 'Pantalla (navegador)' : 'Servidor'],
    ['Página', typeof e.detalle?.pagina === 'string' ? e.detalle.pagina : '—'],
    ['Huella', huella],
  ];
  const texto = [
    'Apareció un error nuevo en teolabs.app.',
    '',
    ...filas.map(([k, v]) => `${k}: ${v}`),
    '',
    mensaje,
    '',
    'El detalle está en Supabase → tabla errores. Si se repite, no vuelve a avisar hasta marcarlo resuelto.',
    '',
    'Teo Labs · TEO LABS SpA · La Serena, Chile · https://teolabs.app',
  ].join('\n');

  const html = `<!doctype html><html lang="es"><body style="margin:0;padding:24px 12px;background:#f3f5f8;font-family:Segoe UI,Arial,Helvetica,sans-serif;color:#0b1020">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapar(`${e.donde}: ${mensaje}`.slice(0, 140))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto">
<tr><td style="background:#0b1020;border-radius:14px 14px 0 0;padding:18px 24px">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="padding-right:12px;vertical-align:middle"><img src="https://teolabs.app/apple-icon.png" width="40" height="40" alt="Teo Labs" style="display:block;border-radius:10px"></td>
<td style="vertical-align:middle"><div style="font-size:20px;font-weight:800;color:#ffffff">Teo Labs</div>
<div style="font-size:13px;color:#aab3c5;margin-top:2px">teolabs.app · registro de errores</div></td></tr></table></td></tr>
<tr><td style="background:#2f4bff;height:4px;line-height:4px;font-size:0">&nbsp;</td></tr>
<tr><td style="background:#ffffff;padding:22px 24px">
<h1 style="margin:0 0 14px;font-size:18px">Apareció un error nuevo</h1>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5">
${filas.map(([k, v]) => `<tr><td style="padding:2px 16px 2px 0;color:#5b6475">${escapar(k)}</td><td style="padding:2px 0">${escapar(v)}</td></tr>`).join('')}
</table>
<pre style="margin:16px 0 0;padding:12px;background:#f3f5f8;border-radius:8px;font-size:13px;white-space:pre-wrap;word-break:break-word">${escapar(mensaje)}</pre>
<p style="margin:16px 0 0;font-size:13px;color:#5b6475">El detalle está en Supabase → tabla <b>errores</b>. Si se repite, no vuelve a avisar hasta marcarlo resuelto.</p>
</td></tr>
<tr><td style="background:#ffffff;border-top:1px solid #e3e6ec;border-radius:0 0 14px 14px;padding:14px 24px;font-size:12px;color:#5b6475;line-height:1.6">
TEO LABS SpA · RUT 78.518.165-4 · La Serena, Región de Coquimbo, Chile · <a href="https://teolabs.app" style="color:#2f4bff">teolabs.app</a><br>
Enviado desde teolabs.app · Desarrollado por <a href="https://www.teolabs.app" target="_blank" rel="noopener noreferrer" style="text-decoration:none">${teoLabsDegradado()}</a> ®
</td></tr>
</table></body></html>`;

  await enviarCorreo({
    para: AVISO_A(),
    asunto: `Error nuevo en teolabs.app · ${e.donde}`.slice(0, 180),
    texto,
    html,
  });
}
