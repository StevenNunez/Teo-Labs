import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Qué datos recoge teolabs.app, para qué, con quién se comparten y cómo pedir verlos, corregirlos o borrarlos.',
  alternates: { canonical: '/privacidad' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
