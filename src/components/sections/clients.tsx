import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CLIENT_COMPANIES } from '@/lib/projects';
import ProjectLogo from '@/components/ui/project-logo';

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
 *
 * Entran dos casos: los sitios corporativos (`kind: 'cliente'`) y los productos
 * nuestros que corren dentro de una empresa concreta (`company`). FerroActiva
 * es del segundo tipo — es una constructora operando Control de Obra — y en una
 * franja que promete "empresas que ya trabajan con nuestro software" cuenta
 * igual o mas que un sitio corporativo.
 */

const CLIENTS = CLIENT_COMPANIES;

export default function ClientsSection() {
  return (
    <section className="py-16 border-y border-border/40">
      <div className="container px-4 md:px-6">
        <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-[0.4em]">
          Empresas que ya trabajan con nuestro software
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-5">
          {CLIENTS.map((client) => (
            <Link
              key={client.id}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1.5 text-center"
            >
              {/* Caja blanca fija para todos: los logos vienen unos sobre fondo
                  claro (Plumber, Recarp) y otros sobre oscuro (Valar,
                  Irarrazaval), asi que sin un fondo comun la mitad desaparece
                  al cambiar de tema. */}
              <span className="mb-3 flex h-24 w-full items-center justify-center rounded-2xl bg-white px-5 ring-1 ring-black/5 transition-transform group-hover:-translate-y-0.5">
                <ProjectLogo
                  project={client}
                  height={56}
                  fit
                  className="mb-0 max-w-full object-center"
                />
              </span>

              <span className="font-headline text-lg md:text-xl font-bold tracking-tight text-foreground/80 transition-colors group-hover:text-foreground">
                {client.company ?? client.name}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary">
                {/* Para una empresa que opera un software nuestro, lo que
                    importa es cual: "Control de Obra" dice mas que "IA". */}
                {client.company ? client.name : client.tags[1] ?? client.tags[0]}
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
