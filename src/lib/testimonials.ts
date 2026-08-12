/**
 * Testimonios de clientes.
 *
 * IMPORTANTE: aca solo van frases que un cliente dijo de verdad.
 *
 * Todo el trabajo de esta revision fue sacar de la pagina lo que no se podia
 * comprobar (metricas que se re-sorteaban solas, fotos de banco presentadas
 * como proyectos, clientes inventados en el marquee). Un testimonio de relleno
 * seria exactamente lo mismo, y ademas el mas caro: si un prospecto descubre
 * una cita falsa, deja de creerle tambien a PAGNOL y a Grupo Valar.
 *
 * Por eso el array arranca vacio y la seccion no se renderiza hasta que haya
 * al menos uno. No hace falta esperar a Google Maps: sirve cualquier mensaje
 * real que ya tengas por WhatsApp o correo, pidiendole permiso al cliente para
 * publicarlo.
 *
 * Para publicar uno, copia el bloque de ejemplo de abajo, descomentalo y
 * rellenalo. La seccion aparece sola.
 */

export type Testimonial = {
  /** La cita, tal cual la dijo. Sin retocar para que suene mejor. */
  quote: string;
  /** Quien lo dijo. */
  author: string;
  /** Cargo y empresa, ej. "Gerente de Operaciones, Valar SpA". */
  role: string;
  /** Que le construimos. Debe coincidir con un `name` de PROJECTS. */
  project?: string;
  /** Enlace a la resena publica (Google Maps, LinkedIn) si existe. */
  sourceUrl?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  // {
  //   quote:
  //     'Antes llevabamos el pañol en cuaderno y siempre faltaban herramientas. ' +
  //     'Con PAGNOL sabemos quien tiene cada equipo y desde cuando.',
  //   author: 'Nombre Apellido',
  //   role: 'Jefe de Faena, Empresa SpA',
  //   project: 'PAGNOL',
  //   sourceUrl: 'https://maps.google.com/...',
  // },
];
