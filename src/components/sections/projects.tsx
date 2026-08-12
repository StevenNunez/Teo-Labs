import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PROJECTS } from '@/lib/projects';
import ProjectIndex from '@/components/ui/project-index';
import SectionHeading from '@/components/ui/section-heading';

/**
 * Con el formato de indice ya no hay motivo para mostrar solo seis: una fila
 * cuesta ~90px, asi que entran los once sin inflar la seccion. Antes se
 * recortaba a `FEATURED_PROJECTS` porque seis tarjetas de 600px ya eran
 * demasiado scroll.
 */
export default function ProjectsSection() {
  return (
    <section id="projects" className="relative overflow-hidden py-20 md:py-28">
      <div className="container relative z-10 px-4 md:px-6">
        <SectionHeading
          eyebrow="Proyectos"
          title="Software propio, en producción"
          lead="No somos solo una agencia: desarrollamos y operamos nuestros propios ERP y plataformas SaaS. Todo lo que ves está en línea, funcionando y con clientes reales."
        />

        <ProjectIndex projects={PROJECTS} />

        <div className="mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-14 rounded-xl border-border px-8 text-base font-semibold hover:border-primary/50 hover:bg-transparent group"
          >
            <Link href="/portafolio-web" className="flex items-center">
              Ver portafolio completo, con demos
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
