import { Quote, ArrowUpRight, Star } from 'lucide-react';
import Link from 'next/link';
import { TESTIMONIALS } from '@/lib/testimonials';

/**
 * Testimonios.
 *
 * Se renderiza sola cuando `TESTIMONIALS` tiene contenido. Con el array vacio
 * devuelve null en vez de mostrar citas de ejemplo: una frase inventada en la
 * pagina de un proveedor de software es el tipo de detalle que un prospecto
 * tecnico detecta, y cuando lo detecta pone en duda todo lo demas.
 */
export default function TestimonialsSection() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section id="testimonios" className="relative bg-canvas py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2563EB08,transparent_55%)] pointer-events-none" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <Star className="h-3.5 w-3.5 fill-current" />
            Lo que dicen nuestros clientes
          </div>
          <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Resultados que <span className="text-primary">se notan en la operación</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={`${testimonial.author}-${testimonial.quote.slice(0, 24)}`}
              className="flex flex-col rounded-panel border border-border/50 bg-card p-8 shadow-sm transition-shadow hover:shadow-xl"
            >
              <Quote className="mb-6 h-8 w-8 shrink-0 text-primary/25" />

              <blockquote className="flex-1 text-lg font-medium leading-relaxed text-foreground">
                {testimonial.quote}
              </blockquote>

              <figcaption className="mt-8 border-t border-border/50 pt-6">
                <p className="font-bold leading-tight">{testimonial.author}</p>
                <p className="mt-1 text-sm text-muted-foreground">{testimonial.role}</p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {testimonial.project && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                      {testimonial.project}
                    </span>
                  )}
                  {testimonial.sourceUrl && (
                    <Link
                      href={testimonial.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                    >
                      Ver reseña
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
