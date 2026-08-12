'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Check,
  ArrowRight,
  Globe,
  ShoppingCart,
  Zap,
  Package,
  CreditCard,
  ShieldCheck,
  ChevronDown,
  Boxes,
  Brain,
  Smartphone,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import SectionHeading from '@/components/ui/section-heading';
import { PROJECTS } from '@/lib/projects';

/**
 * Servicios, en dos carriles.
 *
 * El problema no era de diseno sino de posicionamiento: la seccion mostraba
 * tres planes web y el primer precio que veia el visitante era $60.000. Ese
 * numero define la percepcion de toda la empresa, sin importar que el titular
 * diga "ingenieria de elite". Un gerente que necesita un ERP ve $60.000 y
 * concluye que no somos su proveedor; una pyme que quiere una web ve
 * "ingenieria de elite" y se asusta. El tier de software encima era una sola
 * tarjeta que decia "A medida" y nada mas.
 *
 * Ahora son dos bloques rotulados. El precio de lista vive dentro de "Presencia
 * digital", donde tiene sentido, y deja de anclar la lectura del carril de
 * software, que se vende por conversacion y se respalda con producto propio en
 * produccion.
 */

const ecommerceSubPlans = [
  {
    title: 'E-commerce Básico',
    price: '$180.000.- CLP',
    features: ['Dominio .cl Incluido', '5 Correos Corporativos', 'Hosting Anual', 'Carrito & Pagos Online', 'Gestión de Productos'],
    icon: <Package className="h-4 w-4" />,
  },
  {
    title: 'E-commerce Intermedio',
    price: '$230.000.- CLP',
    features: ['Todo lo del Plan Básico', 'Gestión de Stock Pro', 'SEO Optimizado', 'Reportes de Ventas', 'WhatsApp Integrado'],
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    title: 'E-commerce Full',
    price: '$280.000.- CLP',
    features: ['Todo lo del Plan Intermedio', 'Multivendedor / Categorías', 'Chat en Vivo', 'Soporte 24/7', 'App Web (PWA)'],
    icon: <ShieldCheck className="h-4 w-4" />,
  },
];

const webPlans = [
  {
    id: 'static',
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Webs Corporativas',
    price: '$80.000.- CLP',
    description: 'La presencia digital profesional que tu negocio necesita para destacar.',
    features: [
      'Dominio .cl incluido (primer año)',
      '2 correos corporativos',
      'Hosting de alta velocidad incluido',
      'Optimización SEO avanzada',
      'Diseño responsive premium',
    ],
    highlight: false,
  },
  {
    id: 'ecommerce',
    icon: <ShoppingCart className="h-8 w-8 text-primary" />,
    title: 'E-commerce Pro',
    price: 'Desde $180.000.- CLP',
    description: 'Vende sin límites con una tienda online optimizada para conversión.',
    features: [
      'Pasarelas de Pago Integradas',
      'Gestión de Stock Inteligente',
      'Panel de Administración Pro',
      'Certificado SSL de Seguridad',
      'Soporte Técnico Continuo',
    ],
    highlight: true,
  },
];

const softwareLanes = [
  {
    icon: Smartphone,
    title: 'Apps web a medida',
    description: 'Plataformas propias para operaciones que ninguna herramienta de estantería resuelve.',
  },
  {
    icon: Boxes,
    title: 'ERP y sistemas de gestión',
    description: 'Inventario, activos, obras, compras y estados de pago, con trazabilidad real.',
  },
  {
    icon: Brain,
    title: 'Automatización & IA',
    description: 'Procesos repetitivos que dejan de consumir horas de tu equipo.',
  },
];

/** Producto propio que respalda el carril de software. */
const SOFTWARE_PROOF = PROJECTS.filter((p) => p.kind === 'producto').slice(0, 3);

export default function ServicesSection() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  // En touch no hay hover: los sub-planes de e-commerce eran invisibles para
  // todo el trafico movil, que es la mayoria.
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const showsSubPlans = hoveredService === 'ecommerce' || expandedService === 'ecommerce';

  return (
    <section id="services" className="relative py-20 md:py-28 bg-white/[0.02] overflow-hidden">
      <div className="container relative z-10 px-4 md:px-6">
        <SectionHeading
          eyebrow="Servicios"
          title="Dos formas de trabajar con nosotros"
          lead="Presencia digital con precio cerrado, o ingeniería a medida para operaciones que necesitan su propio sistema."
        />

        {/* ---------------- Carril 1: presencia digital ---------------- */}
        <div className="mb-8 border-t border-white/10 pt-6">
          <h3 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">Presencia digital</h3>
          <p className="text-muted-foreground">
            Precio de lista, sin reuniones previas. Entregamos y quedas andando.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {webPlans.map((service) => (
            <div
              key={service.id}
              className="relative h-full"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              {/*
                Antes cada plan era la tarjeta de precios generica: un cuadrado
                redondeado de 80px con un icono de Lucide adentro, titulo,
                precio en letra chica y una lista con circulitos de check. El
                precio —que es lo unico que la gente viene a buscar— quedaba
                mas chico que el nombre del plan.

                Ahora el precio es el elemento mas grande de la tarjeta, el
                icono desaparece, y la lista se separa con hairlines en vez de
                globitos de color.
              */}
              <Card
                className={cn(
                  'group relative flex flex-col h-full overflow-hidden bg-card transition-colors duration-300 rounded-panel border',
                  service.highlight
                    ? 'border-primary/40'
                    : 'border-border hover:border-primary/30'
                )}
              >
                {service.highlight && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-semibold px-4 py-1.5 z-20 flex items-center gap-2 rounded-bl-panel">
                    <Zap className="h-3 w-3 fill-current" />
                    MÁS SOLICITADO
                  </div>
                )}

                <CardHeader className="p-8 pb-6">
                  <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {service.title}
                  </CardTitle>

                  {/* El precio, del tamano que merece. */}
                  <p className="pt-4 font-headline text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-none">
                    {service.price.replace('.- CLP', '')}
                    <span className="ml-2 align-middle text-sm font-medium tracking-normal text-muted-foreground">
                      CLP
                    </span>
                  </p>

                  <CardDescription className="mt-4 text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-8 pt-0 flex-1">
                  <AnimatePresence mode="wait">
                    {showsSubPlans && service.id === 'ecommerce' ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="space-y-4 pt-2"
                      >
                        {ecommerceSubPlans.map((sub, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold">{sub.title}</span>
                              <span className="text-xs font-bold text-primary">{sub.price}</span>
                            </div>
                            <div className="flex flex-col gap-1.5 text-[11px] text-muted-foreground font-medium">
                              {sub.features.slice(0, 2).map((f, i) => (
                                <span key={i} className="flex items-center gap-2">
                                  <Check className="h-3 w-3 text-emerald-500" /> {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {service.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-3 border-t border-border py-3.5 text-[15px] text-muted-foreground transition-colors group-hover:text-foreground"
                          >
                            <Check className="h-4 w-4 shrink-0 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </CardContent>

                <div className="p-8 pt-0 mt-auto space-y-3">
                  {service.id === 'ecommerce' && (
                    <button
                      type="button"
                      onClick={() => setExpandedService((c) => (c === 'ecommerce' ? null : 'ecommerce'))}
                      aria-expanded={showsSubPlans}
                      className="lg:hidden w-full flex items-center justify-center gap-2 h-12 rounded-2xl border-2 border-primary/20 text-primary text-sm font-bold transition-colors hover:bg-primary/5"
                    >
                      {expandedService === 'ecommerce' ? 'Ocultar los 3 planes' : 'Ver los 3 planes'}
                      <ChevronDown className={cn('h-4 w-4 transition-transform', expandedService === 'ecommerce' && 'rotate-180')} />
                    </button>
                  )}
                  <Button asChild className={cn(
                    'w-full h-14 rounded-2xl text-lg font-bold transition-all group/btn',
                    service.highlight ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-primary hover:text-white'
                  )}>
                    <Link href="#contact">
                      Cotizar ahora
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* ---------------- Carril 2: software a medida ---------------- */}
        <div className="mt-16 rounded-panel bg-ink p-8 md:p-14 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,#2563EB25,transparent_55%)]" />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white text-xs font-semibold uppercase tracking-widest">
                <Boxes className="h-3.5 w-3.5" />
                Software a medida
              </div>
              <h3 className="font-headline text-3xl md:text-5xl font-bold leading-tight">
                Cuando ninguna herramienta de estantería te sirve
              </h3>
              <p className="text-white/60 text-lg leading-relaxed">
                Sin precio de lista, porque no hay dos operaciones iguales. Partimos con un
                diagnóstico y te entregamos alcance y cifra antes de escribir una línea de código.
              </p>

              <div className="space-y-5 pt-2">
                {softwareLanes.map((lane) => (
                  <div key={lane.title} className="flex gap-4">
                    <div className="h-11 w-11 shrink-0 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <lane.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold leading-tight">{lane.title}</p>
                      <p className="text-sm text-white/50 leading-relaxed">{lane.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button asChild size="lg" className="h-14 px-10 rounded-2xl bg-white text-ink hover:bg-white/90 text-lg font-bold group">
                  <Link href="#contact">
                    Agendar diagnóstico
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* La prueba del carril caro no es una lista de features: es
                software nuestro corriendo, que el visitante puede abrir. */}
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
                Construido y operado por nosotros
              </p>
              {SOFTWARE_PROOF.map((project) => (
                <Link
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:border-primary/40 hover:bg-white/[0.08]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="font-headline text-xl font-bold tracking-tight">{project.name}</p>
                      <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-white/30 transition-colors group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
