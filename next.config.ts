import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // El proyecto compila con 0 errores de tipos: si aparece uno nuevo,
    // queremos que el build (y el deploy) falle en vez de publicarlo en silencio.
    ignoreBuildErrors: false,
  },
  eslint: {
    // Se mantiene desactivado mientras el proyecto no tenga configuracion de ESLint.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
