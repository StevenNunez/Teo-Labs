import 'server-only';

import { headers } from 'next/headers';
import { checkAdminAuthorization } from '@/lib/admin-auth';

/**
 * Segunda llave del panel: cada Server Action del panel la llama antes de
 * tocar la base. El navegador ya manda la clave de Basic Auth en cada pedido a
 * /admin (la misma que pidio el middleware), asi que para quien esta logueado
 * no cambia nada; para quien llama la accion desde afuera, no hay clave.
 */
export async function isAdminRequest(): Promise<boolean> {
  const h = await headers();
  return checkAdminAuthorization(h.get('authorization')) === 'ok';
}

export const NO_AUTORIZADO = 'No autorizado. Vuelve a entrar al panel.';
