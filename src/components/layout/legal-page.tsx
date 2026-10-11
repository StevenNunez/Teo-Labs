import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

/**
 * Esqueleto comun de Privacidad y Terminos.
 *
 * Las dos paginas eran una lista de parrafos genericos con "Ultima
 * actualizacion: 24 de mayo de 2024" y un correo de otro dominio. Un texto
 * legal que nadie entiende no protege a nadie: arriba va un resumen en
 * lenguaje simple, despues el indice y el detalle.
 *
 * Es Server Component: no hay nada interactivo, y asi el texto llega completo
 * en el HTML (lo leen Google, Meta y LinkedIn cuando revisan la politica de un
 * anunciante).
 */
export type LegalSection = { id: string; title: string; body: React.ReactNode };

export default function LegalPage({
  eyebrow,
  title,
  updated,
  summary,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  summary: React.ReactNode[];
  sections: LegalSection[];
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-5xl px-4 pb-20 pt-32 md:px-6 md:pt-40">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>

          <div className="mt-10 border-t border-border pt-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              {eyebrow}
            </span>
          </div>
          <h1 className="mt-6 font-headline text-4xl font-bold tracking-[-0.03em] leading-[1.02] md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">Última actualización: {updated}</p>

          <div className="mt-10 rounded-panel border border-primary/20 bg-primary/[0.04] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">En resumen</p>
            <ul className="mt-4 space-y-3">
              {summary.map((item, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
            <nav aria-label="Índice" className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Índice</p>
              <ol className="mt-4 space-y-2 text-sm">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-muted-foreground transition-colors hover:text-foreground">
                      <span className="tabular-nums text-primary">{String(i + 1).padStart(2, '0')}</span> {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="space-y-12">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-border pt-6 pb-0 md:pt-6 md:pb-0">
                  <h2 className="font-headline text-xl font-bold tracking-tight md:text-2xl">
                    <span className="mr-3 text-sm tabular-nums text-primary">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </h2>
                  <div className="legal-body mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/** Lista con viñetas para el cuerpo de una seccion. */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-primary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
