'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Smartphone, Check, ArrowRight, Globe, ShoppingCart, Zap, Package, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ecommerceSubPlans = [
  {
    title: 'E-commerce Básico',
    price: '$180.000.- CLP',
    features: [
      'Dominio .cl Incluido',
      '5 Correos Corporativos',
      'Hosting Anual',
      'Carrito & Pagos Online',
      'Gestión de Productos'
    ],
    icon: <Package className="h-4 w-4" />
  },
  {
    title: 'E-commerce Intermedio',
    price: '$230.000.- CLP',
    features: [
      'Todo lo del Plan Básico',
      'Gestión de Stock Pro',
      'SEO Optimizado',
      'Reportes de Ventas',
      'WhatsApp Integrado'
    ],
    icon: <CreditCard className="h-4 w-4" />
  },
  {
    title: 'E-commerce Full',
    price: '$280.000.- CLP',
    features: [
      'Todo lo del Plan Intermedio',
      'Multivendedor / Categorías',
      'Chat en Vivo',
      'Soporte 24/7',
      'App Web (PWA)'
    ],
    icon: <ShieldCheck className="h-4 w-4" />
  }
];

const services = [
  {
    id: 'static',
    icon: <Globe className="h-8 w-8 text-blue-500" />,
    title: 'Webs Corporativas',
    price: '$60.000.- CLP',
    description: 'La presencia digital profesional que tu negocio necesita para destacar.',
    features: [
      "Hosting de alta velocidad incluido",
      "5 Correos Corporativos",
      "Optimización SEO avanzada",
      "Diseño responsive premium",
      "Dominio .cl ($20.000.- CLP primer año)"
    ],
    highlight: false
  },
  {
    id: 'ecommerce',
    icon: <ShoppingCart className="h-8 w-8 text-purple-500" />,
    title: 'E-commerce Pro',
    price: 'Desde $180.000.- CLP',
    description: 'Vende sin límites con una tienda online optimizada para conversión.',
    features: [
      "Pasarelas de Pago Integradas",
      "Gestión de Stock Inteligente",
      "Panel de Administración Pro",
      "Certificado SSL de Seguridad",
      "Soporte Técnico Continuo"
    ],
    highlight: true
  },
  {
    id: 'software',
    icon: <Smartphone className="h-8 w-8 text-emerald-500" />,
    title: 'Software & Apps',
    price: 'A medida',
    description: 'Soluciones complejas de ingeniería para optimizar y escalar tu empresa.',
    features: [
      "Apps Móviles iOS & Android",
      "Sistemas ERP/CRM Propios",
      "Automatización con IA",
      "Integración de APIs",
      "Arquitectura Escalable"
    ],
    highlight: false
  },
];

export default function ServicesSection() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  return (
    <section id="services" className="relative py-24 md:py-32 bg-slate-50 overflow-hidden">
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-20 max-w-3xl mx-auto">
          <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            Servicios de Ingeniería
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-headline leading-tight">
            Tecnología que <br />
            <span className="text-primary">Mueve tu Negocio</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            Planes diseñados para el mercado chileno, combinando alta tecnología con precios accesibles.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 items-stretch">
          {services.map((service) => (
            <div 
              key={service.id}
              className="relative h-full"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <Card 
                className={cn(
                  "group relative flex flex-col h-full overflow-hidden border-border/50 bg-card transition-all duration-500 rounded-[2.5rem] shadow-sm hover:shadow-2xl",
                  service.highlight ? 'ring-2 ring-primary/20 border-primary/20' : 'hover:border-primary/30',
                  hoveredService === service.id && service.id !== 'ecommerce' && "-translate-y-2"
                )}
              >
                {service.highlight && (
                  <div className="absolute top-6 right-6 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full z-20 flex items-center gap-2 shadow-lg">
                    <Zap className="h-3 w-3 fill-current" />
                    MÁS SOLICITADO
                  </div>
                )}
                
                <CardHeader className="p-8 pb-4">
                  <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-muted/50 border border-border group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-500">
                    {service.icon}
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-black font-headline">{service.title}</CardTitle>
                    <p className="text-xl font-bold text-primary">{service.price}</p>
                  </div>
                  <CardDescription className="text-base mt-4 leading-relaxed font-medium">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-8 pt-0 flex-1">
                  <AnimatePresence mode="wait">
                    {hoveredService === 'ecommerce' && service.id === 'ecommerce' ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="space-y-4 pt-2"
                      >
                        {ecommerceSubPlans.map((sub, idx) => (
                          <div 
                            key={idx}
                            className="p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold">{sub.title}</span>
                              <span className="text-xs font-black text-primary">{sub.price}</span>
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
                      <motion.ul 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-5"
                      >
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-base text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                            <div className="mr-4 mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </CardContent>

                <div className="p-8 pt-0 mt-auto">
                  <Button asChild className={cn(
                    "w-full h-14 rounded-2xl text-lg font-bold transition-all shadow-xl group/btn",
                    service.highlight ? 'bg-primary text-white shadow-primary/20' : 'bg-muted text-foreground hover:bg-primary hover:text-white'
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
      </div>
    </section>
  );
}