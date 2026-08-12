import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Rocket, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const STATS = [
  { value: '+50', label: 'Proyectos entregados' },
  { value: '100%', label: 'Satisfacción' },
  { value: '<48h', label: 'Respuesta rápida' },
];

export default function HeroSection() {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-700">
            <Star className="h-4 w-4 fill-primary" />
            Software de Élite en La Serena & Todo Chile
          </div>

          {/* Headline */}
          <div className="max-w-5xl space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-headline leading-[1.1] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Escalamos tu Negocio con <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
                Código de Alto Impacto
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              Expertos en desarrollo de software a medida para Pymes y Startups. Transformamos procesos complejos en experiencias digitales fluidas y rentables.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <Button asChild size="lg" className="h-14 px-10 rounded-2xl bg-primary text-white text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all group">
              <Link href="#contact">
                Iniciar Proyecto
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-2xl border-border bg-background/50 backdrop-blur-sm text-lg font-bold hover:bg-muted transition-all">
              <Link href="/portafolio-web">Ver Portafolio</Link>
            </Button>
          </div>

          {/* Trust & Stats */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl animate-in fade-in duration-1000 delay-500">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center p-6 rounded-3xl bg-card border border-border/50 shadow-sm">
                <span className="text-4xl font-black font-headline text-foreground">{stat.value}</span>
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground animate-in fade-in duration-1000 delay-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Tu éxito es nuestra métrica principal
          </div>
        </div>
      </div>
    </section>
  );
}