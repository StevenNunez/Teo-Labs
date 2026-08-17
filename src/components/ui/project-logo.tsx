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
 * Todos los archivos de /public/logos estan normalizados a 640x320 (2:1) con
 * el margen y el fondo de cada marca ya incorporados (ver el comentario de
 * `logo` en lib/projects.ts). Eso es lo que permite que aca no haya ni caja
 * blanca ni padding ni `object-contain`: la imagen *es* la placa. Antes cada
 * archivo traia su propio margen — la marca ocupaba entre el 26% y el 86% del
 * lienzo segun el archivo — y como se escalaban por alto con `object-contain`,
 * ese margen se traducia directo en tamano en pantalla: Valar se veia a un
 * tercio de Pagnol dentro de la misma caja. Ademas la caja blanca fija dejaba
 * un rectangulo oscuro flotando adentro en las marcas de fondo oscuro (Valar,
 * Irarrazaval, Monty).
 */
export default function ProjectLogo({
  project,
  className,
  sizes,
}: {
  project: Project;
  /** Define la caja: alto y ancho en proporcion 2:1 (ej. `h-12 w-24`). */
  className?: string;
  sizes?: string;
}) {
  if (!project.logo) return null;

  return (
    <Image
      src={project.logo}
      alt=""
      aria-hidden="true"
      width={640}
      height={320}
      sizes={sizes}
      className={cn('object-cover ring-1 ring-black/5', className)}
    />
  );
}
