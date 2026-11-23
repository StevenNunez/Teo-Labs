import { NextResponse, type NextRequest } from 'next/server';
import { checkAdminAuthorization } from '@/lib/admin-auth';

/**
 * Proteccion del panel interno.
 *
 * /admin quedaba accesible para cualquiera que escribiera la URL, mostrando
 * nombres de clientes, montos y estado de pagos. Estaba en robots.txt como
 * `disallow`, pero eso es una sugerencia a los buscadores, no un control de
 * acceso: no impide que una persona entre.
 *
 * Se resuelve con autenticacion HTTP basica, que no necesita base de datos ni
 * sesiones. La clave sale de ADMIN_PASSWORD.
 *
 * Falla cerrado a proposito: si la variable no esta configurada el panel no se
 * sirve. Para datos de clientes es preferible quedarse afuera por error de
 * configuracion que quedar expuesto por olvido.
 *
 * La comparacion de la clave vive en src/lib/admin-auth.ts porque las Server
 * Actions del panel la repiten por su cuenta.
 */

export function middleware(request: NextRequest) {
  const check = checkAdminAuthorization(request.headers.get('authorization'));

  if (check === 'sin-clave-configurada') {
    return new NextResponse(
      'Panel deshabilitado: falta configurar la variable de entorno ADMIN_PASSWORD.',
      { status: 503, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
    );
  }

  if (check === 'ok') {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return new NextResponse('Autenticación requerida.', {
    status: 401,
    headers: {
      // Solo ASCII: las cabeceras HTTP son ByteString (latin-1). Un guion
      // largo aca hacia reventar la respuesta con un 500 en vez de pedir la
      // clave, dejando el panel inaccesible incluso con credenciales validas
      // a mano.
      'WWW-Authenticate': 'Basic realm="Teo Labs Panel Interno", charset="UTF-8"',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
