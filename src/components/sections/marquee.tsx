const marqueeItems = [
  'Software a medida',
  'Optimización',
  'IA & automatización',
  'Startups',
  'Infraestructura',
  'Soluciones globales',
];

/**
 * Franja de capacidades.
 *
 * Historia de esta seccion, porque grito dos veces: primero fue `bg-primary` a
 * todo volumen con texto de 8xl en itálica y cajas de iconos azules; despues,
 * ya sobre fondo oscuro, siguio en 8xl (96px) y en MAYUSCULAS.
 *
 * El problema de fondo es que es contenido *decorativo*: nombra capacidades
 * que ya estan explicadas en Servicios. Algo decorativo no puede ser el texto
 * mas grande de la pagina — competia con los titulares reales, que miden lo
 * mismo pero si tienen algo que decir.
 *
 * Ahora es una tira discreta: minusculas, peso normal, un tercio del tamano y
 * en color secundario. Aporta ritmo al scroll sin pelearle a nada. La barra
 * separadora queda en azul de marca como unico acento.
 */
export default function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-border py-8 md:py-10">
      <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee items-center whitespace-nowrap">
          {marqueeItems.concat(marqueeItems).map((item, index) => (
            <div key={index} className="mr-6 flex items-center gap-6 md:mr-8 md:gap-8">
              <span className="font-headline text-lg font-medium tracking-tight text-muted-foreground md:text-2xl">
                {item}
              </span>
              <span aria-hidden="true" className="text-lg text-primary/50 md:text-2xl">
                /
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Los bordes se difuminan contra el fondo real de la pagina, no contra
          un color fijo: asi funciona igual en claro y en oscuro. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent md:w-40" />
    </section>
  );
}
