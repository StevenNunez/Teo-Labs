import type { Metadata } from 'next';

// La pagina es 'use client' y no puede exportar metadata: va en su layout.
export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Cómo Teo Labs recopila, usa y protege los datos que nos entregas en el sitio y en el formulario de contacto.',
  alternates: { canonical: '/privacidad' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
