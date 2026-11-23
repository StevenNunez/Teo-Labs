import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

/**
 * "Pagina no encontrada" propia: antes salia la generica de Next.js, en ingles.
 * Tambien es lo que ve un cliente si abre un link de /seguimiento que ya no existe.
 */
export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-3xl px-4 pb-24 pt-32 md:px-6 md:pt-40">
          <div className="border-t border-border pt-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Error 404
            </span>
          </div>
          <h1 className="mt-6 font-headline text-4xl font-bold leading-[1.02] tracking-[-0.03em] md:text-6xl">
            Esta página no existe
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Puede que el enlace esté mal escrito o que la página se haya movido. Si buscabas el
            seguimiento de tu proyecto, revisa que el link sea el mismo que te enviamos, o escríbenos a{' '}
            <a href="mailto:hola@teolabs.app" className="text-primary underline-offset-4 hover:underline">
              hola@teolabs.app
            </a>
            .
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
