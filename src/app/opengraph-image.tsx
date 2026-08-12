import { ImageResponse } from 'next/og';
import { SITE_DESCRIPTION } from '@/lib/site-url';
import { loadSpaceGrotesk } from '@/lib/og-font';

// Imagen que se ve al compartir el sitio en WhatsApp, LinkedIn, X, etc.
// Se genera en build, asi que no puede romperse por un archivo borrado en public/.
export const alt = 'Teo Labs — Desarrollo de software a medida en Chile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const fonts = await loadSpaceGrotesk();

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
          backgroundColor: '#020617',
          position: 'relative',
          fontFamily: 'Space Grotesk',
        }}
      >
        {/* Barra superior con el gradiente de marca */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 12,
            backgroundImage:
              'linear-gradient(90deg, #2563eb 0%, #a855f7 50%, #22c55e 100%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            fontSize: 132,
            fontWeight: 800,
            color: 'white',
            letterSpacing: -6,
            lineHeight: 1,
          }}
        >
          TEO LABS
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 36,
            maxWidth: 880,
            textAlign: 'center',
            fontSize: 30,
            color: '#94a3b8',
            lineHeight: 1.4,
          }}
        >
          {SITE_DESCRIPTION}
        </div>

        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 48,
            fontSize: 22,
            letterSpacing: 8,
            color: '#64748b',
            textTransform: 'uppercase',
          }}
        >
          teolabs.app
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
