import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ExternalLink, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

export type Project = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  deploymentUrl?: string;
  tags: string[];
};

const projects: Project[] = [
  {
    id: 'catering-app',
    name: 'Catering Pro',
    description: 'Plataforma de gestión de pedidos y logística para servicios de alimentación a gran escala.',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
    imageHint: 'catering app interface',
    deploymentUrl: 'https://catering-app-xi.vercel.app/',
    tags: ['Next.js', 'Logística', 'Cloud'],
  },
  {
    id: 'bodega-app',
    name: 'ERP FerroActiva',
    description: 'Sistema inteligente de control de inventario y optimización de stock para retail industrial.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    imageHint: 'inventory management dashboard',
    deploymentUrl: 'https://ferroactiva.teolabs.app/',
    tags: ['Firebase', 'Dashboard', 'Analytics'],
  },
  {
    id: 'weather-app',
    name: 'Weather Analytics',
    description: 'Dashboard meteorológico profesional con predicciones basadas en datos en tiempo real.',
    imageUrl: 'https://images.unsplash.com/photo-1592210633461-125032543419?auto=format&fit=crop&q=80&w=800',
    imageHint: 'weather dashboard',
    deploymentUrl: 'https://weather-app-steven.vercel.app/',
    tags: ['Real-time', 'API', 'Data Viz'],
  },
  {
    id: 'apps-hospedaje',
    name: 'Hospedaje Express',
    description: 'Solución de búsqueda y gestión de propiedades con filtros de alto rendimiento.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    imageHint: 'real estate platform',
    deploymentUrl: 'https://windbnd-react-steven.vercel.app/',
    tags: ['SaaS', 'Maps', 'Conversion'],
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="bg-white relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#3b82f605,transparent_50%)] pointer-events-none" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-black text-primary uppercase tracking-widest">
            <Layers className="mr-2 h-3 w-3" />
            Casos de Éxito Reales
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-headline leading-tight">
            Ingeniería que <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent italic">Transforma Negocios</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl font-medium">
            No solo hacemos webs, construimos las herramientas que permiten a las empresas escalar sin límites.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="group flex flex-col overflow-hidden border-border/40 bg-card/50 backdrop-blur-md transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] rounded-[2.5rem] border"
            >
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  data-ai-hint={project.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute top-6 left-6">
                   <div className="bg-emerald-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                     <CheckCircle2 className="h-3 w-3" />
                     IMPLEMENTADO
                   </div>
                </div>

                <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <CardHeader className="space-y-3 p-10">
                <CardTitle className="font-headline text-3xl font-black group-hover:text-primary transition-colors leading-none">
                  {project.name}
                </CardTitle>
                <CardDescription className="text-base font-medium leading-relaxed text-muted-foreground line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="p-10 pt-0 mt-auto">
                {project.deploymentUrl && (
                  <Button 
                    asChild 
                    className="w-full h-14 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300 group/btn"
                  >
                    <Link href={project.deploymentUrl} target="_blank" rel="noopener noreferrer">
                      Explorar Software Real
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-24 text-center">
          <Button asChild variant="outline" size="lg" className="h-16 px-12 rounded-2xl border-primary/20 hover:bg-primary/5 group text-lg font-bold">
            <Link href="/portafolio-web" className="flex items-center">
              Ver portafolio completo
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
