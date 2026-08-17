// Tenia 'use client' por un estado (`whatsappMessage`) y un handler que no se
// renderizaban en ninguna parte: el formulario que los usaba no existe. Sin
// ese codigo muerto la seccion entera renderiza en el servidor.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectWizard from "./project-wizard";
import WhatsAppDirect from '@/components/ui/whatsapp-direct';
import SectionHeading from '@/components/ui/section-heading';

/**
 * Que pasa despues de escribir.
 *
 * Reemplaza a dos tarjetas que decian "Escalabilidad — Arquitecturas que crecen
 * junto a tu demanda sin fallos" y "Velocidad — Time-to-market acelerado para
 * vencer a tu competencia". Eran el pitch otra vez, en la unica seccion donde
 * el visitante ya decidio escribir: a esa altura no le falta convencimiento, le
 * falta saber en que se esta metiendo. Ahi es donde la gente abandona un
 * formulario — no sabe si le van a contestar, ni cuando, ni que le van a pedir.
 *
 * Los tres pasos no son nuevas promesas: las 48 horas ya estan en la cifra de
 * "Nosotros", y el diagnostico previo a la cifra ya esta prometido en el carril
 * de software a medida de "Servicios". Aca se hacen explicitas donde importan.
 */
const STEPS = [
  {
    title: 'Te respondemos',
    detail: 'En menos de 48 horas, y contesta una persona del equipo.',
  },
  {
    title: 'Diagnóstico',
    detail: 'Una conversación corta para entender tu operación y qué la frena.',
  },
  {
    title: 'Alcance y cifra',
    detail: 'Por escrito, antes de que escribamos una línea de código.',
  },
];

export default function ContactSection() {
  return (
    // `bg-surface` en vez de `bg-white/[0.02]`: el tinte en blanco al 2% no
    // existe sobre fondo claro, asi que en tema claro la seccion no se
    // despegaba del resto de la pagina.
    <section id="contact" className="relative bg-surface py-20 md:py-28 overflow-hidden">

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-20 lg:grid-cols-2 lg:items-start">

          <div className="space-y-10">
            <SectionHeading
              className="mb-0"
              titleClassName="text-[clamp(2.5rem,4.6vw,5.5rem)]"
              eyebrow="Contacto"
              title="Construyamos tu futuro"
              lead="Cada gran empresa comenzó con una conversación. Cuéntanos tu desafío y te entregaremos una propuesta tecnológica que mueva la aguja de tu negocio."
            />

            <WhatsAppDirect />

            <div>
              <p className="border-t border-border pt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Qué pasa cuando nos escribes
              </p>

              <ol className="mt-6 space-y-5">
                {STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="mt-0.5 w-6 shrink-0 text-xs font-semibold tabular-nums tracking-[0.1em] text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-headline text-base font-bold leading-tight">
                        {step.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        {step.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="relative">

            <Card className="relative border-border/40 bg-canvas/80 backdrop-blur-2xl rounded-panel overflow-hidden border-2">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500" />
              <CardHeader className="space-y-4 p-10 pb-6">
                <CardTitle className="text-3xl font-bold font-headline tracking-tight">
                  Inicia tu Proyecto
                </CardTitle>
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
