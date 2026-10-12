import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { PROJECTS, FEATURED_PROJECTS } from '@/lib/projects';

/**
 * Hero.
 *
 * Antes remataba con tres tarjetas: "+50 Proyectos entregados", "100%
 * Satisfaccion" y "<48h". Dos de las tres no se pueden comprobar, y una
 * afirmacion de 100% en la primera pantalla se lee como relleno, no como
 * merito: nadie tiene 100% de nada.
 *
 * En su lugar va la prueba que si es verificable y que ademas es el
 * diferenciador real: las plataformas propias que estan corriendo ahora mismo,
 * cada una con su enlace. El visitante puede abrirlas antes de escribirnos.
 */

const TRUST = [
  'Respuesta en menos de 48 horas',
  'Alcance y precio por escrito antes de empezar',
  'Webs desde $80.000',
];

const PROOF = FEATURED_PROJECTS.filter((p) => p.kind === 'producto').slice(0, 4);

export default function HeroSection() {
  return (
    // Sin blobs propios: la iluminacion azul ahora viene del `body`, fija para
    // toda la pagina.
    <section id="hero" className="relative pt-28 pb-16 md:pt-44 md:pb-24 overflow-hidden">
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-10">

          {/* El badge lleva un dato contado, no un adjetivo. */}


          {/* Headline */}
          <div className="max-w-5xl space-y-6">
            {/*
              Titular definido el 10-10-2026 con el usuario. Antes: "Desde tu
              landing hasta el ERP que corre tu operacion": mostraba el rango,
              pero "landing" y "ERP" son palabras nuestras, no del dueno de una
              pyme. "Ordena" es lo que de verdad hace un ERP o un CRM, y "tu
              pagina web" le habla tambien a quien ya tiene una y quiere otra.

              El degradado va sobre una sola palabra en una sola linea (sobre
              dos renglones, bg-clip-text estiraba el degradado y el segundo
              arrancaba en otro color).

              En celular el titular baja a text-4xl y la bajada es corta: antes
              el titulo y el parrafo llenaban la primera pantalla y los botones
              quedaban abajo.
            */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-headline leading-[1.02] tracking-[-0.035em] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Desde tu página web hasta el sistema que{' '}
              <span className="text-brand-gradient">ordena</span>{' '}
              tu empresa
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              Creamos y optimizamos páginas web. Desarrollamos software a medida:
              CRM, ERP y agentes de IA. Para pymes chilenas.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <Button asChild size="lg" className="h-14 px-10 rounded-2xl bg-primary text-white text-lg font-bold transition-all group">
              <Link href="#contact">
                Cotizar proyecto
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-2xl border-border bg-background/50 backdrop-blur-sm text-lg font-bold hover:bg-muted transition-all">
              <Link href="/portafolio-web">Ver proyectos</Link>
            </Button>
          </div>

          {/* Lo que el visitante quiere saber antes de escribir, al lado del
              boton. Son las mismas promesas que el sitio ya hace en Servicios y
              en Contacto, no promesas nuevas. */}
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground animate-in fade-in duration-700 delay-500">
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-brand-green" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          {/* Prueba abrible: cada chip es un producto nuestro que esta en linea. */}
          <div className="w-full max-w-4xl pt-8 space-y-5 animate-in fade-in duration-1000 delay-500">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Nuestro software, funcionando ahora
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {PROOF.map((project) => (
                <Link
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-5 py-3 shadow-sm transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="font-headline text-base font-bold tracking-tight">
                    {project.name}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {project.tags[0]}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
