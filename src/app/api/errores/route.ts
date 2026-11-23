import { anotarError } from '@/lib/errores-servidor';
import { tomarTurno } from '@/lib/freno';

/**
 * Los errores que ve una persona en pantalla llegan aca (src/lib/errores.ts) y
 * pasan al registro de errores. Es publica a proposito —una pantalla rota
 * tambien tiene que poder avisar—, asi que solo acepta texto corto y un numero
 * acotado de avisos por IP.
 */

const texto = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : undefined);

export async function POST(pedido: Request) {
  const ip = pedido.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'sin-ip';
  if (!(await tomarTurno(`errores:${ip}`, 30, 60))) return new Response(null, { status: 429 });

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = (await pedido.json()) as Record<string, unknown>;
  } catch {
    return new Response(null, { status: 400 });
  }

  const donde = texto(cuerpo.donde, 200);
  const mensaje = texto(cuerpo.mensaje, 2000);
  if (!donde || !mensaje) return new Response(null, { status: 400 });

  const error = new Error(mensaje);
  error.stack = texto(cuerpo.pila, 4000) ?? undefined;

  await anotarError({
    origen: 'navegador',
    donde,
    error,
    detalle: {
      pagina: texto(cuerpo.pagina, 300),
      navegador: pedido.headers.get('user-agent')?.slice(0, 300),
    },
  });

  return new Response(null, { status: 204 });
}
