import { createClient } from '@supabase/supabase-js';

/**
 * Cliente de Supabase para el SERVIDOR.
 *
 * Distinto de src/lib/supabase.ts, que usa la anon key y corre en el navegador.
 * Este usa la service_role key, que se salta Row Level Security y por lo tanto
 * puede leer clientes, montos y estados de pago.
 *
 * Esa key es equivalente a la clave maestra de la base: si llega al bundle del
 * browser, cualquiera puede leer y borrar todo. Por eso:
 *
 *   - la variable NO lleva prefijo NEXT_PUBLIC_ (asi Next no la inyecta al cliente),
 *   - y ademas revienta a proposito si alguien importa este archivo desde un
 *     componente con 'use client'.
 *
 * Todo lo que lo use tiene que ser Server Component, Server Action o route handler.
 */

if (typeof window !== 'undefined') {
  throw new Error(
    'supabase-admin solo puede usarse en el servidor: expondria la service_role key.'
  );
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * `null` cuando falta configuracion, igual que el cliente publico.
 *
 * El sitio tiene que poder construirse y desplegarse sin base de datos: hoy
 * produccion corre sin ella y el resto de las paginas no la necesitan. Quien lo
 * use decide que mostrar en ese caso (ver isDatabaseConfigured).
 */
export const supabaseAdmin =
  url && serviceRoleKey
    ? createClient(url, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export const isDatabaseConfigured = supabaseAdmin !== null;
