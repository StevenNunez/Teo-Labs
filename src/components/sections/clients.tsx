import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '@/lib/projects';

/**
 * Franja de clientes.
 *
 * Antes era un marquee infinito con ocho nombres, de los cuales varios eran de
 * relleno ("Pyme Digital", "Studio Creativo", "Innovacion CL", "Logistica
 * Sur"). Un cliente inventado no suma confianza: resta, porque el visitante
 * que detecta uno falso pone en duda tambien los verdaderos. Encima iban en
 * `text-slate-200` sobre blanco, ilegibles por diseno, lo que delata que eran
 * decoracion y no prueba.
 *
 * Ahora la lista sale de los proyectos de cliente reales y cada nombre enlaza
 * al sitio que efectivamente construimos. Cuatro comprobables valen mas que
 * ocho decorativos.
 */

const CLIENTS = PROJECTS.filter((p) => p.kind === 'cliente');

export default function ClientsSection() {
  return (
    <section className="py-16 border-y border-border/40">
      <div className="container px-4 md:px-6">
        <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-[0.4em]">
          Empresas que ya trabajan con nuestro software
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {CLIENTS.map((client) => (
            <Link
              key={client.id}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1.5 text-center"
            >
              <span className="font-headline text-xl md:text-2xl font-bold tracking-tight text-foreground/80 transition-colors group-hover:text-foreground">
                {client.name}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary">
                {client.tags[1] ?? client.tags[0]}
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
