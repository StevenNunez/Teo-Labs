'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProjectThumb from '@/components/ui/project-thumb';
import ProjectLogo from '@/components/ui/project-logo';
import type { Project } from '@/lib/projects';

/**
 * Indice de proyectos.
 *
 * Antes era una grilla de seis tarjetas con `rounded-panel`, `backdrop-blur`,
 * sombra de 80px, dos badges flotando y un boton azul de ancho completo por
 * tarjeta. Una grilla de tarjetas dice "tengo contenido que llenar"; un indice
 * tipografico dice "tengo obra".
 *
 * Ademas resuelve un problema real: de 11 proyectos solo 3 tienen captura. En
 * una grilla, ocho paneles de marca genericos se leen como huecos. Aca la
 * imagen es un premio del hover, no el cuerpo de la fila — la ausencia deja de
 * notarse y el formato se ajusta a lo que efectivamente tenemos.
 *
 * La previsualizacion sigue al cursor: es el mismo lenguaje que el wordmark
 * liquido y el humo del footer, donde el elemento reacciona a donde esta el
 * mouse.
 */
export default function ProjectIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const raf = useRef(0);

  const handleMove = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    // Un solo update por frame: sin esto el mousemove dispara decenas de
    // renders por segundo y la previsualizacion se arrastra.
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setPos({ x: clientX, y: clientY }));
  };

  return (
    <div onMouseMove={handleMove} onMouseLeave={() => setActive(null)}>
      {projects.map((project, index) => (
        <Link
          key={project.id}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setActive(project)}
          className={cn(
            'group relative flex items-center gap-5 border-t border-border py-7 md:gap-8 md:py-9',
            'transition-colors hover:border-primary/50',
            index === projects.length - 1 && 'border-b'
          )}
        >
          <span className="w-8 shrink-0 text-xs font-medium tabular-nums tracking-[0.1em] text-muted-foreground">
            {String(index + 1).padStart(2, '0')}
          </span>

          <span className="min-w-0 flex-1">
            {/* Caja de alto fijo: sin ella un isotipo cuadrado se ve la mitad
                de grande que un logo horizontal con el mismo alto nominal, y
                las filas quedan bailando entre si. */}
            {project.logo && (
              <span className="mb-2.5 inline-flex h-12 items-center rounded-xl bg-white px-3 ring-1 ring-black/5">
                <ProjectLogo project={project} height={32} fit className="mb-0 max-w-[170px]" />
              </span>
            )}
            <span className="block font-headline text-2xl font-bold tracking-tight transition-colors group-hover:text-primary md:text-4xl">
              {project.name}
            </span>
            <span className="mt-1 block truncate text-sm text-muted-foreground md:hidden">
              {project.tags.join(' · ')}
            </span>
          </span>

          <span className="hidden shrink-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground md:block">
            {project.kind === 'producto' ? 'Producto propio' : 'Cliente'}
          </span>

          <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      ))}

      {/* Solo en pantallas grandes con puntero real: en tactil no hay hover y
          la previsualizacion nunca se dispararia. */}
      {active && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-40 hidden aspect-[16/10] w-[26rem] overflow-hidden rounded-panel border border-border lg:block"
          style={{
            left: pos.x + 28,
            top: pos.y - 140,
            // Se sale de pantalla a la derecha: lo espejamos al otro lado.
            transform: pos.x > window.innerWidth - 500 ? 'translateX(calc(-100% - 56px))' : undefined,
          }}
        >
          <div className="relative h-full w-full">
            <ProjectThumb project={active} />
          </div>
        </div>
      )}
    </div>
  );
}
