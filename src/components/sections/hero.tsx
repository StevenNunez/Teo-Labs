import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
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

const PROOF = FEATURED_PROJECTS.filter((p) => p.kind === 'producto').slice(0, 4);

export default function HeroSection() {
  return (
    // Sin blobs propios: la iluminacion azul ahora viene del `body`, fija para
    // toda la pagina.
    <section id="hero" className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden">
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-10">

          {/* El badge lleva un dato contado, no un adjetivo. */}


          {/* Headline */}
          <div className="max-w-5xl space-y-6">
            {/*
              El gradiente iba sobre "ERP que corre tu operacion", que ocupa dos
              renglones. `bg-clip-text` estira el degradado sobre la caja
              completa del span, asi que el segundo renglon arrancaba ya en
              violeta y terminaba en verde claro: se leia como otro color, no
              como continuacion, y perdia contraste.

              Ahora el gradiente cubre solo "ERP", una palabra en una linea. Es
              ademas la palabra que queremos que salte.
            */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-headline leading-[1.02] tracking-[-0.035em] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Desde tu landing hasta el{' '}
              <span className="bg-gradient-to-r from-blue-500 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                ERP
              </span>{' '}
              que corre tu operación
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              No solo desarrollamos software: construimos y operamos nuestras propias
              plataformas —ERP de activos para minería, control de obras, e-commerce—
              y ponemos esa misma ingeniería al servicio de tu empresa.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <Button asChild size="lg" className="h-14 px-10 rounded-2xl bg-primary text-white text-lg font-bold transition-all group">
              <Link href="#contact">
                Iniciar Proyecto
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-2xl border-border bg-background/50 backdrop-blur-sm text-lg font-bold hover:bg-muted transition-all">
              <Link href="/portafolio-web">Ver Portafolio</Link>
            </Button>
          </div>

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
