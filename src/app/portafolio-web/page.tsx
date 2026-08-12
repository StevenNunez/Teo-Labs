
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Globe, CheckCircle2, Sparkles, Monitor, Rocket, Zap } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const webProjects = [
  {
    title: 'PAGNOL',
    description: 'ERP de gestión de activos para minería y construcción: control de pañol con verificación facial, trazabilidad por QR y reportes ISO 55001. Funciona con o sin señal en faena.',
    image: '/proyectos/pagnol.png',
    tags: ['ERP', 'Minería', 'Biometría'],
    url: 'https://www.pagnol.cl/',
    isReal: true,
    category: 'Software'
  },
  {
    title: 'Grupo Valar',
    description: 'Sitio corporativo para una empresa de ingeniería, obras civiles y mantenimiento industrial en Antofagasta, con galería de proyectos filtrable y contacto directo por WhatsApp.',
    image: '/proyectos/grupovalar.png',
    tags: ['Corporativo', 'Industrial', 'SEO Pro'],
    url: 'https://www.grupovalar.cl/',
    isReal: true,
    category: 'Corporativo'
  },
  {
    title: 'Plumber Servicios',
    description: 'Plataforma para especialistas en ingeniería hidráulica, alcantarillado y gasfitería industrial en Los Ángeles, con portafolio de obras administrable y atención inmediata.',
    image: '/proyectos/plumber.webp',
    tags: ['Corporativo', 'Hidráulica', 'SEO Local'],
    url: 'https://www.plumberservicios.cl/',
    isReal: true,
    category: 'Ingeniería'
  },
  {
    title: 'Constructora Recarp',
    description: 'Sitio web corporativo de alto impacto con enfoque en conversión y SEO para el sector industrial.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    tags: ['Next.js', 'SEO Pro', 'Corporativo'],
    url: 'https://constructorarecarp.cl/',
    isReal: true,
    category: 'Ingeniería'
  },
  {
    title: 'FerroActiva App',
    description: 'Sistema ERP personalizado para la gestión de inventarios y logística en tiempo real.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    tags: ['Firebase', 'WebApp', 'React'],
    url: 'https://ferroactiva.teolabs.app/',
    isReal: true,
    category: 'Software'
  },
  {
    title: 'Irarrázaval Servicios',
    description: 'Plataforma digital optimizada para servicios de ingeniería y mantenimiento industrial en Chile.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
    tags: ['Web Design', 'Ingeniería', 'Performance'],
    url: 'https://irarrazavalservicios.cl/',
    isReal: true,
    category: 'Corporativo'
  },
  {
    title: 'Estudio Jurídico Silva',
    description: 'Experiencia premium para firmas de abogados, con gestión de citas y diseño de alta gama.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    tags: ['Legal', 'Premium', 'UI/UX'],
    url: '/demo/legal',
    isReal: false,
    category: 'Demo Premium'
  },
  {
    title: 'Inmobiliaria Serena',
    description: 'Portal de búsqueda de propiedades con filtros dinámicos y experiencia de usuario fluida.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
    tags: ['Real Estate', 'Ventas', 'Maps'],
    url: '/demo/inmobiliaria',
    isReal: false,
    category: 'Demo Premium'
  },
  {
    title: 'Clínica Dental Pro',
    description: 'Gestión médica simplificada: reservas, fichas y control de pacientes en una sola app.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    tags: ['Salud', 'Booking', 'SaaS'],
    url: '/demo/clinica',
    isReal: false,
    category: 'Demo SaaS'
  },
  {
    title: 'Logística Express',
    description: 'Centro de mandos para flotas de transporte con monitoreo de envíos y rutas optimizadas.',
    image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=800',
    tags: ['Dashboard', 'Tracking', 'Realtime'],
    url: '/demo/logistica',
    isReal: false,
    category: 'Demo Software'
  },
  {
    title: 'Boutique Online',
    description: 'Tienda de moda de lujo diseñada para maximizar la tasa de conversión y el valor de marca.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    tags: ['E-commerce', 'Moda', 'Pagos'],
    url: '/demo/boutique',
    isReal: false,
    category: 'Demo E-commerce'
  },
  {
    title: 'FitPro Gym',
    description: 'La solución definitiva para centros deportivos: suscripciones, clases y comunidad.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    tags: ['Fitness', 'Memberships', 'Dark Mode'],
    url: '/demo/fitness',
    isReal: false,
    category: 'Demo SaaS'
  }
];

export default function PortfolioWebPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
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
                <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter leading-none">
                  Portafolio de <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent">Resultados Reales</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl">
                  Cada proyecto es una solución diseñada para escalar. Explora nuestras implementaciones reales y prueba nuestras demos interactivas premium.
                </p>
              </div>
              
              <div className="hidden lg:flex flex-col items-center p-8 rounded-[2.5rem] bg-white border border-border/50 shadow-xl shadow-primary/5">
                <div className="text-4xl font-black font-headline text-primary tracking-tighter">+50</div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Clientes Satisfechos</div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {webProjects.map((project, index) => (
              <div 
                key={index}
                className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-border/40 bg-white transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image 
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {project.category}
                    </span>
                  </div>

                  {/* Project Status */}
                  {project.isReal && (
                    <div className="absolute top-6 right-6 bg-emerald-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in zoom-in">
                      <CheckCircle2 className="h-3 w-3" />
                      PROYECTO REAL
                    </div>
                  )}
                  {!project.isReal && (
                    <div className="absolute top-6 right-6 bg-blue-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      DEMO INTERACTIVA
                    </div>
                  )}
                </div>

                {/* Content Container */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-2xl font-black mb-3 font-headline leading-none group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed flex-1">
                    {project.description}
                  </p>
                  
                  <Button asChild variant={project.isReal ? "default" : "outline"} className={cn(
                    "w-full h-14 rounded-2xl font-bold transition-all shadow-lg group/btn",
                    project.isReal 
                      ? "bg-primary text-white shadow-primary/20" 
                      : "border-primary/20 text-primary hover:bg-primary hover:text-white"
                  )}>
                    <Link href={project.url} target={project.isReal ? "_blank" : "_self"}>
                      {project.isReal ? 'Visitar Sitio Web' : 'Probar Demo Premium'}
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced CTA Section */}
          <div className="mt-32 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative p-12 md:p-20 rounded-[3rem] bg-white border border-border/50 text-center overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Rocket className="h-64 w-64 text-primary" />
              </div>
              
              <div className="relative z-10 space-y-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <Zap className="h-8 w-8 fill-current" />
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter leading-none max-w-3xl mx-auto">
                  ¿Listo para convertir tu <br />
                  <span className="text-primary">Visión en Software?</span>
                </h2>
                
                <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
                  No construimos solo páginas, creamos herramientas de crecimiento masivo para empresas ambiciosas.
                </p>
                
                <div className="pt-6">
                  <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-primary text-white font-black text-xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all group">
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
