import type { Instrumentation } from 'next';

/**
 * Los errores del servidor que nadie atrapo (una pagina o una accion que
 * revienta) van al registro de errores. Los que el codigo si atrapa los anota
 * el mismo con `anotarError`.
 */
export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  // Con el import adentro del `if` (y no con un `return` antes), Next deja
  // fuera del bundle del middleware (runtime edge) todo lo que usa Node.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { anotarError } = await import('./lib/errores-servidor');
    await anotarError({
      origen: 'servidor',
      donde: `${context.routeType} ${context.routePath}`,
      error: err,
      detalle: {
        metodo: request.method,
        ruta: request.path,
        digest:
          typeof err === 'object' && err !== null && 'digest' in err
            ? String((err as { digest: unknown }).digest)
            : undefined,
      },
    });
  }
};
