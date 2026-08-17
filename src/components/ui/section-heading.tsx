import { cn } from '@/lib/utils';

/**
 * Encabezado de seccion, uno solo para todo el sitio.
 *
 * Antes cada seccion armaba el suyo a mano y las siete terminaron identicas:
 * `flex flex-col items-center text-center` dentro de un `max-w-3xl mx-auto`,
 * badge pill arriba, `h2` de 36→60px partido con `<br />` y la segunda mitad
 * pintada de azul. Siete veces la misma formula es *la* firma de plantilla: el
 * visitante no lee siete secciones, lee una repetida siete veces.
 *
 * Los tres cambios que hacen la diferencia:
 *
 * 1. El badge pill se va. En su lugar, un rotulo de 11px sobre una linea de
 *    1px a todo el ancho. Un rotulo, no una capsula.
 * 2. El `<br />` + `text-primary` se va. El color no jerarquiza un titular, lo
 *    hace la escala — y pintar media frase de azul en siete secciones seguidas
 *    mata el azul, que deberia significar "aca se hace clic".
 * 3. El titular se ancla a la izquierda y crece de 60px a 112px.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
  titleClassName,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
  /**
   * El tamano por defecto esta calculado para un titular a todo el ancho del
   * container. Cuando el encabezado vive dentro de una columna de la mitad
   * (contacto), 6.5vw se pasa del ancho disponible y una palabra larga se corta
   * contra el `overflow-hidden` de la seccion. Ahi se pasa un clamp mas chico.
   */
  titleClassName?: string;
}) {
  return (
    <div className={cn('mb-14 md:mb-20', className)}>
      {/* Tokens del tema, no `white/`. El rotulo y su hairline estaban escritos
          en `text-white/40` y `border-white/10`: sobre el fondo oscuro se leian
          bien, pero en tema claro son blanco sobre blanco — el "Nosotros",
          "Servicios", "Proyectos" de cada seccion desaparecia y el titular
          quedaba flotando sin su linea. `muted-foreground` y `border` estan
          definidos en los dos temas (globals.css) y contrastan en ambos. */}
      <div className="border-t border-border pt-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          {eyebrow}
        </span>
      </div>

      <h2
        className={cn(
          'mt-6 max-w-[18ch] font-headline font-bold leading-[0.92] tracking-[-0.035em] text-[clamp(2.5rem,6.5vw,7rem)]',
          titleClassName
        )}
      >
        {title}
      </h2>

      {lead && (
        <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-muted-foreground">
          {lead}
        </p>
      )}
    </div>
  );
}
