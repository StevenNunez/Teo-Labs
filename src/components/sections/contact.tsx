'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectWizard from "./project-wizard";
import { MapPin, Send, Sparkles, Rocket, Zap, MessageSquare } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { WhatsAppIcon } from '@/components/layout/whatsapp-button';

export default function ContactSection() {
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const whatsappNumber = '56930938222';

  const handleWhatsappSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsappMessage.trim()) {
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setWhatsappMessage('');
    }
  };

  return (
    <section id="contact" className="relative bg-slate-50 py-24 md:py-40 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,#3b82f610,transparent_60%)] pointer-events-none" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-20 lg:grid-cols-2 lg:items-start">
          
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black uppercase tracking-[0.2em] border border-emerald-500/20">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Agenda Abierta
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter font-headline leading-[0.9]">
                Construyamos <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent italic">
                  Tu Futuro
                </span>
              </h2>
              
              <p className="max-w-[550px] text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
                Cada gran empresa comenzó con una conversación. Cuéntanos tu desafío y te entregaremos una propuesta tecnológica que mueva la aguja de tu negocio.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Rocket className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-lg">Escalabilidad</h4>
                <p className="text-sm text-muted-foreground font-medium">Arquitecturas que crecen junto a tu demanda sin fallos.</p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                  <Zap className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-lg">Velocidad</h4>
                <p className="text-sm text-muted-foreground font-medium">Time-to-market acelerado para vencer a tu competencia.</p>
              </div>
            </div>

            <div className="flex flex-col gap-6 pt-8">
               <div className="flex items-center gap-5 p-6 rounded-3xl bg-white border border-border/50 shadow-sm group hover:border-primary/30 transition-all">
                  <div className="h-14 w-14 rounded-2xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                    <WhatsAppIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">WhatsApp Directo</p>
                    <p className="text-xl font-black">+56 9 3093 8222</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-blue-600/10 to-green-500/10 rounded-[4rem] blur-3xl opacity-50" />
            
            <Card className="relative border-border/40 bg-white/80 backdrop-blur-2xl shadow-2xl rounded-[3rem] overflow-hidden border-2">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500" />
              <CardHeader className="space-y-4 p-10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-3xl font-black font-headline tracking-tight">
                    Inicia tu Proyecto
                  </CardTitle>
                </div>
                <CardDescription className="text-base font-medium">
                  Responde estas preguntas y recibe una propuesta técnica personalizada en menos de 48 horas.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0">
                <ProjectWizard />
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  )
}
