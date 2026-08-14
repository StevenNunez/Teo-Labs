import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/projects';

/**
 * Logo de la empresa sobre su nombre.
 *
 * Renderiza solo si el proyecto tiene `logo`: mientras no exista el archivo la
 * fila queda exactamente como estaba. El logo no reemplaza al nombre, lo
 * acompana — la marca del cliente identifica, pero el nombre es lo que se lee
 * y lo que necesita el lector de pantalla, asi que el logo va `aria-hidden`.
 *
 * `object-contain` con alto fijo y ancho automatico: los logos vienen en
 * proporciones muy distintas (horizontales, cuadrados, isotipos) y forzar una
 * caja los deformaria.
 */
export default function ProjectLogo({
  project,
  className,
  height = 28,
  fit = false,
}: {
  project: Project;
  className?: string;
  /** Alto en px del logo. El ancho se ajusta solo. */
  height?: number;
  /**
   * Para logos dentro de una caja de ancho fijo. En vez de imponer el alto,
   * `height` pasa a ser un tope y el logo crece hasta llenar la caja por el
   * lado que toque primero. Sin esto un logo muy horizontal (Irarrazaval, 4:1)
   * se ve diminuto al lado de uno cuadrado con el mismo alto.
   */
  fit?: boolean;
}) {
  if (!project.logo) return null;

  return (
    <Image
      src={project.logo}
      alt=""
      aria-hidden="true"
      width={height * 4}
      height={height}
      style={
        fit
          ? { maxHeight: height, maxWidth: '100%', height: 'auto', width: 'auto' }
          : { height, width: 'auto' }
      }
      className={cn('mb-3 max-w-[160px] object-contain object-left', className)}
    />
  );
}
