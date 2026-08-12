// Tenia 'use client' por un estado (`whatsappMessage`) y un handler que no se
// renderizaban en ninguna parte: el formulario que los usaba no existe. Sin
// ese codigo muerto la seccion entera renderiza en el servidor.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectWizard from "./project-wizard";
import { Sparkles, Rocket, Zap } from "lucide-react";
import { WhatsAppIcon } from '@/components/layout/whatsapp-button';
import SectionHeading from '@/components/ui/section-heading';

export default function ContactSection() {
  return (
    <section id="contact" className="relative bg-white/[0.02] py-20 md:py-28 overflow-hidden">
      
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-20 lg:grid-cols-2 lg:items-start">
          
          <div className="space-y-12">
            <div className="space-y-8">
              <SectionHeading
                className="mb-0"
                eyebrow="Contacto · Agenda abierta"
                title="Construyamos tu futuro"
                lead="Cada gran empresa comenzó con una conversación. Cuéntanos tu desafío y te entregaremos una propuesta tecnológica que mueva la aguja de tu negocio."
              />
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
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-lg">Velocidad</h4>
                <p className="text-sm text-muted-foreground font-medium">Time-to-market acelerado para vencer a tu competencia.</p>
              </div>
            </div>

            <div className="flex flex-col gap-6 pt-8">
               <div className="flex items-center gap-5 p-6 rounded-3xl bg-canvas border border-border/50 shadow-sm group hover:border-primary/30 transition-all">
                  <div className="h-14 w-14 rounded-2xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                    <WhatsAppIcon className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">WhatsApp Directo</p>
                    <p className="text-xl font-bold">+56 9 3093 8222</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="relative">
            
            <Card className="relative border-border/40 bg-canvas/80 backdrop-blur-2xl rounded-panel overflow-hidden border-2">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500" />
              <CardHeader className="space-y-4 p-10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-3xl font-bold font-headline tracking-tight">
                    Inicia tu Proyecto
                  </CardTitle>
                </div>
                <CardDescription className="text-base font-medium">
                  Tres preguntas, menos de un minuto. Te respondemos con una propuesta técnica en menos de 48 horas.
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
