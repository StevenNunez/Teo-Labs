import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos de uso',
  description: 'Condiciones de uso de teolabs.app: precios de referencia, cotizaciones, agente de IA de demostración y propiedad intelectual.',
  alternates: { canonical: '/terminos' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
