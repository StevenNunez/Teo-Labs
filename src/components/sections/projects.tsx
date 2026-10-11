import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { PROJECTS, FEATURED_PROJECTS } from '@/lib/projects';
import ProjectLogo from '@/components/ui/project-logo';
import SectionHeading from '@/components/ui/section-heading';

/**
 * Proyectos: los seis destacados en grilla, el resto en /portafolio-web.
 *
 * Antes era un indice de las once filas, con logo de 48px y el nombre repetido
 * al lado: 2.700px de seccion, la mas larga de la home. Seis bastan para
 * probar el punto (cuatro productos propios y dos sitios de cliente), y el
 * logo a tamano de placa identifica cada proyecto de un vistazo, sin leer.
 *
 * En celular la grilla es de dos columnas y sin descripcion: logo, nombre y
 * rubro. La descripcion completa esta a un toque, en el sitio de cada uno.
 */
export default function ProjectsSection() {
  return (
    <section id="projects" className="relative overflow-hidden py-20 md:py-28">
      <div className="container relative z-10 px-4 md:px-6">
        <SectionHeading
          eyebrow="Proyectos"
          title="Software propio, en producción"
          lead="Desarrollamos y operamos nuestros propios ERP y plataformas SaaS. Todo lo que ves está en línea y funcionando: puedes abrirlo."
        />

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
          {FEATURED_PROJECTS.map((project) => (
            <Link
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-panel border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
            >
              <ProjectLogo
                project={project}
                sizes="(min-width: 1024px) 30vw, 45vw"
                className="h-auto w-full ring-0 border-b border-border"
              />
              <div className="flex flex-1 flex-col gap-2 p-4 md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-headline text-lg md:text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
                    {project.name}
                    {project.company && <span className="text-muted-foreground font-medium"> · {project.company}</span>}
                  </span>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <p className="hidden sm:block text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {project.description}
                </p>
                {project.fact && (
                  <p className="flex items-start gap-1.5 text-xs md:text-sm font-semibold text-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" aria-hidden="true" />
                    {project.fact}
                  </p>
                )}
                <p className="mt-auto pt-2 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {project.kind === 'producto' ? 'Producto propio' : 'Cliente'} · {project.tags[0]}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-14 rounded-xl border-border px-8 text-base font-semibold hover:border-primary/50 hover:bg-transparent group"
          >
            <Link href="/portafolio-web" className="flex items-center">
              Ver los {PROJECTS.length} proyectos y las demos
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
