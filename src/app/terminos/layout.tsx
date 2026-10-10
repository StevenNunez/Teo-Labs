import type { Metadata } from 'next';

// La pagina es 'use client' y no puede exportar metadata: va en su layout.
export const metadata: Metadata = {
  title: 'Términos de Servicio',
  description: 'Condiciones de uso del sitio y de los servicios de desarrollo de software de Teo Labs.',
  alternates: { canonical: '/terminos' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
