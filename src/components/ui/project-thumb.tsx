import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/projects';

/**
 * Miniatura de un proyecto.
 *
 * Si hay captura real la muestra. Si no, dibuja un panel de marca con el
 * nombre y el dominio en vez de una foto de stock. Una foto de Unsplash bajo
 * un badge que dice "caso de exito real" es lo primero que un cliente tecnico
 * detecta, y cuando la detecta pone en duda tambien los proyectos que si son
 * reales.
 */
export default function ProjectThumb({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={`Captura del proyecto ${project.name}`}
        fill
        className={cn(
          'object-cover transition-transform duration-1000 group-hover:scale-110',
          className
        )}
      />
    );
  }

  const domain = project.url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink px-6 text-center',
        className
      )}
    >
      {/* Resplandor con el gradiente de marca */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#2563EB40,transparent_55%),radial-gradient(circle_at_75%_80%,#22C55E30,transparent_55%)]" />

      <span className="relative bg-gradient-to-r from-blue-500 via-purple-400 to-green-400 bg-clip-text font-headline text-4xl font-bold leading-none tracking-tighter text-transparent md:text-5xl">
        {project.name}
      </span>
      <span className="relative text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
        {domain}
      </span>
    </div>
  );
}
