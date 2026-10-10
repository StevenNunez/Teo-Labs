import type { Metadata } from 'next';

/**
 * Las demos son maquetas de negocios ficticios (una clinica, un estudio
 * juridico...). Indexadas bajo teolabs.app, Google leia "Sonrisas que
 * transforman vidas" como contenido de Teo Labs y se confundia sobre que
 * vendemos. Se siguen pudiendo abrir y compartir; solo quedan fuera del
 * buscador (`follow` deja que los enlaces hacia el sitio sigan contando).
 */
export const metadata: Metadata = {
  title: 'Demo de sitio web',
  description: 'Maqueta de ejemplo de un sitio desarrollado por Teo Labs.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
