import { ImageResponse } from 'next/og';
import { loadSpaceGrotesk } from '@/lib/og-font';

// Favicon generado en build: el monograma de TEO LABS sobre el gradiente de marca.
// Reemplaza al favicon.ico anterior, que pesaba casi 1 MB.
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default async function Icon() {
  const fonts = await loadSpaceGrotesk();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // blue-600 -> purple-500 -> green-500, el gradiente de InteractiveLogo.
          backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #a855f7 50%, #22c55e 100%)',
          borderRadius: 7,
          color: 'white',
          fontFamily: 'Space Grotesk',
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        TL
      </div>
    ),
    { ...size, fonts },
  );
}
