import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { loadSpaceGrotesk } from '@/lib/og-font';

/**
 * Imagen que se ve al compartir el sitio en WhatsApp, LinkedIn, X, etc.
 * Se genera en build, asi que no puede romperse por un archivo borrado en public/.
 *
 * ES LA MISMA PANTALLA A LA QUE SE ENTRA.
 *
 * Antes era un panel casi negro (#020617) con "TEO LABS" en versalitas blancas
 * planas. El problema no era que se viera mal, era que no se parecia a nada:
 * quien recibia el link por WhatsApp veia una placa oscura, hacia clic y
 * aterrizaba en el splash — fondo blanco, globo girando y el nombre en el
 * gradiente de marca. Dos marcas distintas separadas por un toque.
 *
 * Asi que esta imagen es una foto del splash (ver layout/splash-screen.tsx):
 * mismo blanco, mismo globo, mismo wordmark con el gradiente de InteractiveLogo
 * y el mismo rotulo abajo. La vista previa deja de ser una portada y pasa a ser
 * el primer frame de la visita.
 *
 * Por lo mismo no lleva ni el dominio ni la descripcion: WhatsApp ya los
 * imprime como texto debajo de la tarjeta, y meterlos adentro romperia el
 * parecido con el splash sin agregar informacion.
 */
export const alt = 'Teo Labs — Desarrollo de software a medida en Chile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * El gradiente del wordmark, letra por letra igual que en el header:
 * blue-600 -> purple-500 -> green-500. Es marca compartida entre los sitios de
 * Teo Labs, no se ajusta por pieza.
 */
const BRAND_GRADIENT = 'linear-gradient(90deg, #2563EB 0%, #A855F7 50%, #22C55E 100%)';

/** Igual que el header y el splash: "Teo Labs", no "TEO LABS" en versalitas. */
const WORDMARK = 'Teo Labs';
/**
 * Mas grande que en el splash respecto del globo, a proposito. El splash se ve
 * a pantalla completa; esta imagen se ve en una tarjeta de chat de ~300px de
 * ancho, donde el wordmark queda a ~40px de alto. Copiar la proporcion exacta
 * del splash (globo 208 / nombre 72) dejaria el nombre ilegible justo en el
 * unico tamano en que esta imagen existe.
 */
const WORDMARK_SIZE = 158;

export default async function OpengraphImage() {
  const [fonts, globe] = await Promise.all([
    loadSpaceGrotesk(),
    // El globo del splash, en PNG y no el .webp de public/: Satori no decodifica
    // WebP y revienta con "u2 is not iterable", que no dice nada sobre el
    // formato. Vive en src/assets junto a las fuentes por la misma razon que
    // ellas — es un insumo del build, no un archivo que sirva el sitio— y va
    // embebido en base64 porque Satori resuelve `src` contra la red y en build
    // no hay servidor al que pedirle.
    readFile(join(process.cwd(), 'src/assets/splash-globe-og.png')),
  ]);

  const globeSrc = `data:image/png;base64,${globe.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          position: 'relative',
          fontFamily: 'Space Grotesk',
        }}
      >
        {/* El mismo resplandor tenue del splash. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 50% 42%, rgba(59,130,246,0.10), rgba(255,255,255,0) 62%)',
          }}
        />

        <img
          src={globeSrc}
          width={184}
          height={184}
          style={{ position: 'relative', marginBottom: 26 }}
        />

        {/* Letra por letra, no una sola palabra con el gradiente estirado por
            encima. InteractiveLogo pone `bg-gradient-to-r bg-clip-text` en CADA
            span, asi que en CSS la caja del gradiente es la letra: cada una
            recorre el azul→morado→verde completo dentro de su propio ancho. Eso
            se ve distinto de una rampa continua de izquierda a derecha, y lo que
            se busca aca es que la vista previa y el sitio sean la misma cosa. */}
        <div style={{ display: 'flex', position: 'relative' }}>
          {[...WORDMARK].map((char, index) =>
            char === ' ' ? (
              // El espacio de InteractiveLogo no es el de la fuente: es un span
              // fijo de 0.2em (variante `header`).
              <div key={index} style={{ width: WORDMARK_SIZE * 0.2 }} />
            ) : (
              <div
                key={index}
                style={{
                  display: 'flex',
                  fontSize: WORDMARK_SIZE,
                  fontWeight: 700,
                  lineHeight: 1,
                  backgroundImage: BRAND_GRADIENT,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {char}
              </div>
            )
          )}
        </div>

        {/* Barra y rotulo del pie del splash. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'absolute',
            bottom: 62,
            gap: 18,
          }}
        >
          <div
            style={{
              width: 128,
              height: 3,
              borderRadius: 999,
              backgroundImage: BRAND_GRADIENT,
            }}
          />
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 9,
              // Un punto mas oscuro que el `text-black/30` del splash: ahi el
              // rotulo se lee a pantalla completa, aca tiene que sobrevivir la
              // reduccion a un tercio del tamano.
              color: 'rgba(0,0,0,0.38)',
              textTransform: 'uppercase',
            }}
          >
            Innovación Global desde Chile
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
