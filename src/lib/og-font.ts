import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Space Grotesk (la tipografia de los titulares del sitio) para las imagenes
 * generadas con next/og.
 *
 * Los archivos viven en el repositorio, no se bajan de la red: asi el build no
 * depende de que Google Fonts responda. Son las instancias estaticas 400 y 700
 * en formato woff, que es lo que entiende Satori — la version variable del
 * archivo no le sirve, revienta al leer los ejes.
 *
 * Origen: paquete @fontsource/space-grotesk. Licencia SIL Open Font License 1.1.
 */
export async function loadSpaceGrotesk() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), 'src/assets/SpaceGrotesk-Regular.woff')),
    readFile(join(process.cwd(), 'src/assets/SpaceGrotesk-Bold.woff')),
  ]);

  return [
    { name: 'Space Grotesk', data: regular, style: 'normal' as const, weight: 400 as const },
    { name: 'Space Grotesk', data: bold, style: 'normal' as const, weight: 700 as const },
  ];
}
