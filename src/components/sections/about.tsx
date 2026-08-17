// Sin estado ni efectos: puede renderizar entero en el servidor.
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import StackVisual from '@/components/ui/stack-visual';
import SectionHeading from '@/components/ui/section-heading';
import { PROJECTS, CLIENT_COMPANIES } from '@/lib/projects';

/**
 * Cifras contadas, no escritas a mano.
 *
 * Historia de este bloque, porque se equivoco dos veces seguidas: primero las
 * tres metricas se re-sorteaban con Math.random() cada 1,5s (un visitante veia
 * "+47%" y dos segundos despues "+33%"). Al arreglarlo quedaron fijas pero
 * inventadas: "+50 Proyectos" contradecia el "11 plataformas en produccion"
 * que el hero calcula de PROJECTS, en la misma pagina y a 400px de distancia.
 *
 * Ahora las dos primeras salen de PROJECTS, asi que no pueden desincronizarse
 * de lo que el visitante ve mas abajo. Cada una es comprobable abriendo los
 * enlaces del portafolio.
 */
const STATS = [
  {
    value: String(PROJECTS.length),
    label: 'Plataformas en producción',
  },
  {
    value: String(CLIENT_COMPANIES.length),
    label: 'Empresas cliente',
  },
  // Compromiso de servicio, no una estadistica: es una promesa que podemos
  // cumplir, a diferencia de "8 años de experiencia" que nadie puede verificar.
  { value: '<48h', label: 'Tiempo de respuesta' },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 md:py-28 overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        {/* items-start, no items-center: desde que el panel de la derecha
            calcula su alto por contenido (537px) y la columna de texto mide
            909px, centrarlo lo empujaba 186px hacia abajo y su borde superior
            quedaba flotando por debajo del titulo. Alineados por arriba, el
            panel y el "Nosotros" arrancan en la misma linea. */}
        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
          
          <div className="space-y-10">
            <SectionHeading
              className="mb-0"
              eyebrow="Nosotros"
              title="Impulsamos tu visión de negocio"
              lead="En Teo Labs no solo escribimos código: diseñamos el motor que escalará tu empresa. Entendemos los desafíos locales y los enfrentamos con soluciones de clase mundial."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-4xl font-bold font-headline text-foreground tabular-nums tracking-tighter">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-10 rounded-2xl bg-primary text-white font-bold group">
                <Link href="#contact">
                  Hablemos de tu Proyecto
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            {/* Sin aspect ratio fijo: el alto lo manda el contenido.
                Antes era `aspect-[4/3] lg:aspect-[4/5]`, que calculaba el alto
                desde el ancho ignorando lo que hay adentro. En escritorio daba
                ~768px para ~500px de contenido (215px muertos arriba y abajo),
                y en movil al reves: 257px de caja para 330px de contenido, que
                el overflow-hidden recortaba. */}
            <div className="relative rounded-panel overflow-hidden border border-border/50">
              <StackVisual />

              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                  <Zap className="h-6 w-6 fill-current" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-white text-base font-headline leading-none">Resultados Reales</p>
                  <p className="text-white/50 text-[11px] font-medium uppercase tracking-widest">Impacto en el balance final</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}