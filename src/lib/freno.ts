import 'server-only';

import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Frenos de uso: cuantas veces alguien puede hacer algo en una ventana de
 * tiempo (p. ej. preguntas al asesor de IA por hora).
 *
 * La cuenta vive en Supabase (tabla `frenos`, migracion 0002) porque en Vercel
 * cada pedido puede caer en una instancia distinta y un contador en memoria se
 * reparte entre todas. Si la base no responde o la migracion aun no esta
 * aplicada, cae a un contador en memoria: peor que nada no es.
 */

const enMemoria = new Map<string, { desde: number; usos: number }>();

function tomarTurnoEnMemoria(clave: string, maximo: number, ventanaSegundos: number) {
  const ahora = Date.now();
  const v = enMemoria.get(clave);
  if (!v || ahora - v.desde > ventanaSegundos * 1000) {
    if (enMemoria.size > 5000) enMemoria.clear();
    enMemoria.set(clave, { desde: ahora, usos: 1 });
    return true;
  }
  v.usos += 1;
  return v.usos <= maximo;
}

/** `true` si todavia esta dentro del limite (y cuenta este uso). */
export async function tomarTurno(clave: string, maximo: number, ventanaSegundos: number): Promise<boolean> {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin.rpc('tomar_turno', {
      p_clave: clave,
      p_maximo: maximo,
      p_ventana_segundos: ventanaSegundos,
    });
    if (!error && typeof data === 'boolean') return data;
    if (error) console.error('[freno] Supabase no respondio, uso el contador en memoria:', error.message);
  }
  return tomarTurnoEnMemoria(clave, maximo, ventanaSegundos);
}

/** La IP de quien pide, segun la cabecera que pone Vercel. */
export async function ipDelPedido(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'sin-ip';
}
