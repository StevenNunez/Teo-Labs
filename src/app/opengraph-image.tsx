import { ImageResponse } from 'next/og';
import { loadLexend, loadSpaceGrotesk } from '@/lib/og-font';

/**
 * Imagen que se ve al compartir el sitio en WhatsApp, LinkedIn, X, etc.
 * Se genera en build, asi que no puede romperse por un archivo borrado.
 *
 * Desde el 10-10-2026 es el logo horizontal de la marca sobre la noche de
 * Elqui: la Θ (ver components/ui/brand-mark.tsx) y el nombre. Fondo oscuro a
 * proposito: WhatsApp y LinkedIn pintan sus tarjetas en blanco, y una vista
 * previa blanca se perdia entre ellas.
 *
 * El dominio y la descripcion no van adentro: las plataformas ya los imprimen
 * como texto debajo de la tarjeta.
 */
export const alt = 'Teo Labs — Software a medida, agentes de IA y CRM en Chile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const NOCHE = '#0B1026';

/** La Θ en SVG; Satori la dibuja como imagen. Mismo trazo que BrandMark. */
const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="2.16 4.71 93.13 93.13"><defs><linearGradient id="tlg" gradientUnits="userSpaceOnUse" x1="10" y1="16" x2="84" y2="90"><stop offset="0" stop-color="#2F4BFF"/><stop offset="1" stop-color="#8A5CFF"/></linearGradient></defs><g fill="none" stroke="url(#tlg)" stroke-width="6.5"><circle cx="46" cy="54" r="35"/><path d="M12.46 44 H79.54 M46 44 V89.00"/></g><g fill="none" stroke="#22C55E" stroke-width="3"><circle cx="81" cy="19" r="7.2"/><path d="M73.80 19 H88.20"/></g></svg>`;
const MARK_SRC = `data:image/svg+xml;base64,${Buffer.from(MARK_SVG).toString('base64')}`;

export default async function OpengraphImage() {
  const fonts = [...(await loadSpaceGrotesk()), ...(await loadLexend())];

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
          backgroundColor: NOCHE,
          position: 'relative',
          fontFamily: 'Space Grotesk',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 30% 30%, rgba(47,75,255,0.28), rgba(11,16,38,0) 55%), radial-gradient(circle at 80% 90%, rgba(138,92,255,0.18), rgba(11,16,38,0) 50%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 44, position: 'relative' }}>
          <img src={MARK_SRC} width={210} height={210} />
          <div
            style={{
              display: 'flex',
              // El nombre en Lexend Bold con su espaciado (-0.05em), como en todo
              // lugar donde "Teo Labs" es el logo.
              fontFamily: 'Lexend',
              fontSize: 150,
              fontWeight: 700,
              letterSpacing: -7.5,
              color: '#FFFFFF',
              lineHeight: 1,
              // Las dos palabras con su propio aire: el espacio de la fuente es
              // el doble del de la muestra elegida (~1/4 de la altura de la T).
              gap: 14,
            }}
          >
            <span>Teo</span>
            <span>Labs</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 70,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 8,
            color: 'rgba(255,255,255,0.62)',
            textTransform: 'uppercase',
          }}
        >
          Software a medida · Agentes de IA · CRM
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
