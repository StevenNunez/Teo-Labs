'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Monitor, 
  Smartphone, 
  Tablet, 
  ExternalLink, 
  Settings, 
  LayoutDashboard, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const demoContent = {
  logistica: {
    title: 'Logística Express',
    type: 'Dashboard de Gestión',
    description: 'Visualiza la flota en tiempo real y gestiona rutas optimizadas.',
    icon: <LayoutDashboard className="h-6 w-6" />,
    color: 'from-blue-600 to-blue-400',
    frame: 'https://weather-app-steven.vercel.app/' // Usamos una de tus apps existentes como placeholder interactivo
  },
  clinica: {
    title: 'Clínica Dental Pro',
    type: 'SaaS de Gestión Médica',
    description: 'Reserva de horas y fichas clínicas digitales.',
    icon: <Sparkles className="h-6 w-6" />,
    color: 'from-emerald-600 to-emerald-400',
    frame: 'https://catering-app-xi.vercel.app/'
  },
  boutique: {
    title: 'Boutique Lujo',
    type: 'E-commerce Premium',
    description: 'Experiencia de compra fluida con pasarela de pagos.',
    icon: <Monitor className="h-6 w-6" />,
    color: 'from-purple-600 to-purple-400',
    frame: 'https://windbnd-react-steven.vercel.app/'
  },
  academia: {
    title: 'Academia Global',
    type: 'LMS / E-learning',
    description: 'Cursos interactivos y seguimiento de alumnos.',
    icon: <Settings className="h-6 w-6" />,
    color: 'from-orange-600 to-orange-400',
    frame: 'https://ferroactiva.teolabs.app/'
  },
  inmobiliaria: {
    title: 'Inmobiliaria Serena',
    type: 'Portal de Propiedades',
    description: 'Buscador de viviendas con filtros avanzados.',
    icon: <Monitor className="h-6 w-6" />,
    color: 'from-blue-800 to-blue-600',
    frame: 'https://windbnd-react-steven.vercel.app/'
  },
  restaurant: {
    title: 'El Faro Restaurant',
    type: 'Carta Digital & Reservas',
    description: 'Menú interactivo y gestión de mesas.',
    icon: <Sparkles className="h-6 w-6" />,
    color: 'from-red-600 to-red-400',
    frame: 'https://catering-app-xi.vercel.app/'
  },
  fitpro: {
    title: 'FitPro Gym',
    type: 'Gestión de Clientes',
    description: 'Horarios de clases y planes de suscripción.',
    icon: <LayoutDashboard className="h-6 w-6" />,
    color: 'from-yellow-600 to-yellow-400',
    frame: 'https://ferroactiva.teolabs.app/'
  }
};

export default function DemoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [view, setView] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  const demo = demoContent[id as keyof typeof demoContent];

  if (!demo) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Demo no encontrada</h1>
        <Button onClick={() => router.push('/portafolio-web')}>Volver al portafolio</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <div className="bg-background border-b border-border/50 sticky top-0 z-50">
        <div className="container h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/portafolio-web')} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="hidden md:block">
              <h1 className="font-bold font-headline text-lg">{demo.title}</h1>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{demo.type}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
            <Button 
              variant={view === 'desktop' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('desktop')}
              className="rounded-lg h-8 px-3"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button 
              variant={view === 'tablet' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('tablet')}
              className="rounded-lg h-8 px-3"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button 
              variant={view === 'mobile' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('mobile')}
              className="rounded-lg h-8 px-3"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="hidden md:flex rounded-xl bg-primary shadow-lg shadow-primary/20">
              <a href="/#contact">Cotizar Similar</a>
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col p-4 md:p-8">
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center gap-6">
          <div className="w-full text-center md:text-left mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-headline flex items-center justify-center md:justify-start gap-3">
                <div className={cn("p-2 rounded-lg bg-gradient-to-br text-white", demo.color)}>
                  {demo.icon}
                </div>
                Modo Demo Interactiva
              </h2>
              <p className="text-muted-foreground">{demo.description}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-500/10 px-4 py-2 rounded-full border border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              INTERFAZ FUNCIONAL
            </div>
          </div>

          <div className={cn(
            "relative bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-border/50 transition-all duration-700 overflow-hidden",
            view === 'desktop' ? "w-full aspect-video rounded-3xl" : 
            view === 'tablet' ? "w-[768px] aspect-[4/3] rounded-3xl" : 
            "w-[375px] aspect-[9/19] rounded-panel border-[12px] border-black"
          )}>
            <iframe 
              src={demo.frame} 
              className="w-full h-full border-none"
              title={demo.title}
            />
            {view === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl z-10" />
            )}
          </div>
          
          <div className="mt-8 p-6 bg-card border border-border/50 rounded-2xl w-full flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium">¿Quieres personalizar esta herramienta para tu negocio?</p>
            </div>
            <Button asChild variant="outline" className="rounded-xl border-primary/20 text-primary">
              <a href="/#contact">Solicitar Adaptación</a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
