/**
 * La clave del panel interno (/admin), en un solo lugar.
 *
 * La usan dos capas que tienen que dar la misma respuesta:
 *   - src/middleware.ts, la puerta de /admin (pide la clave con Basic Auth);
 *   - las Server Actions del panel (admin/actions.ts y el generador de
 *     informes), que la vuelven a verificar ellas mismas. Next.js recomienda
 *     tratar cada Server Action como un endpoint público: si mañana cambia el
 *     matcher del middleware, las acciones no quedan abiertas.
 *
 * Sin imports de Node: el middleware corre en el runtime edge.
 */

/** Comparacion en tiempo constante: no filtra la clave por cuanto tarda. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export type AdminCheck = 'ok' | 'sin-clave-configurada' | 'denegado';

/** Revisa la cabecera Authorization contra ADMIN_PASSWORD. Falla cerrado. */
export function checkAdminAuthorization(header: string | null | undefined): AdminCheck {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return 'sin-clave-configurada';
  if (!header?.startsWith('Basic ')) return 'denegado';

  try {
    const decoded = atob(header.slice(6));
    const password = decoded.slice(decoded.indexOf(':') + 1);
    return safeEqual(password, expected) ? 'ok' : 'denegado';
  } catch {
    // Cabecera mal formada: se trata como clave incorrecta.
    return 'denegado';
  }
}
