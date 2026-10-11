import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CLIENT_COMPANIES } from '@/lib/projects';
import Image from 'next/image';

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
              {/* En reposo, logos en un solo color: la fila se lee como un muro
                  parejo. Al pasar el cursor (o enfocar con teclado) aparece el
                  logo original con sus colores y su placa de marca: el cliente
                  se reconoce como es. Las dos imagenes van apiladas en la misma
                  caja 2:1 y se cruzan con un fundido, sin saltos de tamano. En
                  pantallas tactiles queda el monocromo (no hay hover). */}
              {client.logoMono && (
                <span className="relative mb-1 block w-full">
                  <Image
                    src={client.logoMono}
                    alt=""
                    aria-hidden="true"
                    width={640}
                    height={320}
                    sizes="(min-width: 1024px) 20vw, 45vw"
                    className="h-auto w-full opacity-70 transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0 dark:invert"
                  />
                  {client.logo && (
                    <Image
                      src={client.logo}
                      alt=""
                      aria-hidden="true"
                      width={640}
                      height={320}
                      sizes="(min-width: 1024px) 20vw, 45vw"
                      className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-0 shadow-lg ring-1 ring-black/5 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-focus-visible:opacity-100"
                    />
                  )}
                </span>
              )}

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
