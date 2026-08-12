
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Sparkles, Monitor, Rocket, Zap, Boxes, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROJECTS, type Project } from '@/lib/projects';
import ProjectThumb from '@/components/ui/project-thumb';

/**
 * Las demos son maquetas nuestras para mostrar formatos, no trabajos de
 * clientes. Van claramente separadas del trabajo real: mezclarlas bajo el mismo
 * badge las hacia pasar por proyectos entregados.
 */
const demos = [
  {
    title: 'Estudio Jurídico',
    description: 'Maqueta de experiencia premium para firmas de abogados, con gestión de citas.',
    tags: ['Legal', 'Premium', 'UI/UX'],
    url: '/demo/legal',
  },
  {
    title: 'Inmobiliaria',
    description: 'Maqueta de portal de propiedades con filtros dinámicos.',
    tags: ['Real Estate', 'Ventas', 'Maps'],
    url: '/demo/inmobiliaria',
  },
  {
    title: 'Clínica Dental',
    description: 'Maqueta de gestión médica: reservas, fichas y control de pacientes.',
    tags: ['Salud', 'Booking', 'SaaS'],
    url: '/demo/clinica',
  },
  {
    title: 'Logística',
    description: 'Maqueta de centro de mandos para flotas, con monitoreo de envíos.',
    tags: ['Dashboard', 'Tracking', 'Realtime'],
    url: '/demo/logistica',
  },
  {
    title: 'Boutique Online',
    description: 'Maqueta de tienda de moda enfocada en conversión.',
    tags: ['E-commerce', 'Moda', 'Pagos'],
    url: '/demo/boutique',
  },
  {
    title: 'FitPro Gym',
    description: 'Maqueta para centros deportivos: suscripciones, clases y comunidad.',
    tags: ['Fitness', 'Memberships', 'Dark Mode'],
    url: '/demo/fitness',
  },
];

const productos = PROJECTS.filter((p) => p.kind === 'producto');
const clientes = PROJECTS.filter((p) => p.kind === 'cliente');

export default function PortfolioWebPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header />
      <main className="flex-1 py-20 px-4 md:px-6 pt-32">
        <div className="container max-w-7xl mx-auto">
          
          {/* Hero Section of Portfolio */}
          <div className="mb-20 text-center md:text-left">
            <Button asChild variant="ghost" className="mb-8 -ml-4 rounded-full text-muted-foreground hover:text-primary transition-colors">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al centro de innovación
              </Link>
            </Button>
            
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                  <Monitor className="h-4 w-4" />
                  Vitrina Tecnológica
                </div>
                <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter leading-none">
                  Portafolio de <br />
                  <span className="text-primary">Resultados Reales</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl">
                  Nuestros propios ERP y plataformas SaaS, los sitios corporativos que entregamos a clientes, y demos navegables por rubro. Todo con su enlace real: puedes abrirlo y comprobarlo.
                </p>
              </div>
              
              {/* Cifra contada de PROJECTS, no inventada: cada una es un link
                  que el visitante puede abrir y comprobar. */}
              <div className="hidden lg:flex flex-col items-center p-8 rounded-panel bg-canvas border border-border/50 shadow-primary/5">
                <div className="text-4xl font-bold font-headline text-primary tracking-tighter">{PROJECTS.length}</div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest text-center">Plataformas en producción</div>
              </div>
            </div>
          </div>

          {/* Productos propios */}
          <SectionHeading
            icon={<Boxes className="h-4 w-4" />}
            eyebrow="Productos propios"
            title="Plataformas que desarrollamos y operamos"
            subtitle="ERP y SaaS construidos por Teo Labs, en producción y con clientes activos."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {productos.map((project) => (
              <RealProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Sitios de clientes */}
          <SectionHeading
            className="mt-32"
            icon={<Building2 className="h-4 w-4" />}
            eyebrow="Proyectos de clientes"
            title="Sitios corporativos entregados"
            subtitle="Empresas de ingeniería, construcción y servicios industriales en Chile."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {clientes.map((project) => (
              <RealProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Demos */}
          <SectionHeading
            className="mt-32"
            icon={<Sparkles className="h-4 w-4" />}
            eyebrow="Demos interactivas"
            title="Formatos que puedes probar"
            subtitle="Maquetas navegables hechas por nosotros para mostrar distintos rubros. No son proyectos de clientes."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {demos.map((demo) => (
              <div
                key={demo.url}
                className="group relative flex flex-col overflow-hidden rounded-panel border-2 border-dashed border-primary/20 bg-canvas p-8 transition-all duration-500 hover:border-primary/40 hover:-translate-y-1"
              >
                <div className="mb-4 flex flex-wrap gap-2">
                  {demo.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">
                      #{tag}
                    </span>
                  ))}
                </div>
                <h3 className="mb-3 font-headline text-2xl font-bold leading-none group-hover:text-primary transition-colors">
                  {demo.title}
                </h3>
                <p className="mb-8 flex-1 text-sm font-medium leading-relaxed text-muted-foreground">
                  {demo.description}
                </p>
                <Button asChild variant="outline" className="h-14 w-full rounded-2xl border-primary/20 font-bold text-primary transition-all hover:bg-primary hover:text-white group/btn">
                  <Link href={demo.url}>
                    Probar demo
                    <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Enhanced CTA Section */}
          <div className="mt-32 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 rounded-panel blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative p-12 md:p-20 rounded-panel bg-white border border-border/50 text-center overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Rocket className="h-64 w-64 text-primary" />
              </div>
              
              <div className="relative z-10 space-y-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <Zap className="h-8 w-8 fill-current" />
                </div>
                
                <h2 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter leading-none max-w-3xl mx-auto">
                  ¿Listo para convertir tu <br />
                  <span className="text-primary">Visión en Software?</span>
                </h2>
                
                <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
                  No construimos solo páginas, creamos herramientas de crecimiento masivo para empresas ambiciosas.
                </p>
                
                <div className="pt-6">
                  <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-primary text-white font-bold text-xl shadow-primary/30 transition-all group">
                    <Link href="/#contact" className="flex items-center gap-3">
                      Cotizar mi Proyecto Ahora
                      <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SectionHeading({
  icon,
  eyebrow,
  title,
  subtitle,
  className,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div className={cn('mb-12 max-w-3xl space-y-4', className)}>
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
        {icon}
        {eyebrow}
      </div>
      <h2 className="font-headline text-3xl md:text-5xl font-bold leading-tight tracking-tighter">
        {title}
      </h2>
      <p className="text-lg font-medium text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function RealProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-panel border border-border/40 bg-canvas transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2">
      <div className="relative h-64 w-full overflow-hidden">
        <ProjectThumb project={project} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-bold uppercase tracking-tighter text-primary/60">
              #{tag}
            </span>
          ))}
        </div>

        <h3 className="mb-3 font-headline text-2xl font-bold leading-none transition-colors group-hover:text-primary">
          {project.name}
        </h3>

        <p className="mb-8 flex-1 text-sm font-medium leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <Button asChild className="h-14 w-full rounded-2xl bg-primary font-bold text-white shadow-lg transition-all group/btn">
          <Link href={project.url} target="_blank" rel="noopener noreferrer">
            {project.kind === 'producto' ? 'Ver la plataforma' : 'Visitar el sitio'}
            <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
