import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  Target,
  Search,
  FileText,
  KanbanSquare,
  History,
  BellRing,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/ui/section-heading';
// three se carga adentro del componente, en su propio chunk: no pesa en la
// carga inicial de la home.
import AgentNetwork from '@/components/ui/agent-network';
import { PROJECTS } from '@/lib/projects';

/**
 * Agentes de IA y CRM.
 *
 * Es lo que mas se esta pidiendo hoy y antes no tenia lugar propio: quedaba
 * diluido en "Automatizacion & IA", una linea dentro del carril de software.
 * Un gerente que buscaba "un agente que conteste el WhatsApp" o "un CRM" no
 * encontraba esas palabras en ninguna parte del sitio.
 *
 * Reglas del contenido: ninguna cifra de resultados que no hayamos medido, y
 * la prueba es software nuestro que ya tiene IA adentro (Control de Obra), no
 * un caso inventado. Las promesas de proceso (diagnostico, alcance por escrito)
 * son las mismas que ya hace Servicios.
 */


const AGENTS = [
  {
    icon: MessageCircle,
    title: 'Agente de atención',
    description:
      'Contesta precios, horarios, stock y estado de pedidos por WhatsApp o en tu web, a cualquier hora. Cuando no sabe, deriva a una persona.',
  },
  {
    icon: Target,
    title: 'Agente de ventas',
    description:
      'Conversa con quien escribe, entiende qué necesita, toma sus datos y agenda la reunión. Llega al CRM listo para cerrar.',
  },
  {
    icon: Search,
    title: 'Asistente interno',
    description:
      'Tu equipo le pregunta en lenguaje natural por obras, inventario o documentos, y responde con los datos de tu empresa.',
  },
  {
    icon: FileText,
    title: 'Back-office automático',
    description:
      'Lee correos, facturas y planillas y los pasa a tu sistema. Lo que hoy alguien digita a mano, deja de digitarse.',
  },
];

const CRM_FEATURES = [
  { icon: KanbanSquare, label: 'Embudo de ventas con tus propias etapas' },
  { icon: History, label: 'Historial por cliente: WhatsApp, correo y llamadas' },
  { icon: BellRing, label: 'Recordatorios para que ningún seguimiento se olvide' },
  { icon: BarChart3, label: 'Reportes de ventas por vendedor y por período' },
];

const STEPS = [
  { title: 'Diagnóstico', detail: 'Qué se pregunta una y otra vez, y dónde se pierde tiempo.' },
  { title: 'Entrenamiento', detail: 'El agente aprende con tus precios, productos y procesos reales.' },
  { title: 'Conexión', detail: 'A tu WhatsApp, correo, web y sistema, sin cambiar cómo trabajas.' },
  { title: 'Ajuste', detail: 'Revisamos sus conversaciones y lo afinamos con tu equipo.' },
];

/** Software nuestro que ya trae un asistente de IA adentro. */
const AI_PROOF = PROJECTS.find((p) => p.id === 'control-de-obra');

export default function AgentsSection() {
  return (
    <section id="agentes" className="relative py-20 md:py-28 overflow-hidden">
      <div className="container relative z-10 px-4 md:px-6">
        <SectionHeading
          eyebrow="Agentes de IA y CRM"
          title="Un agente que atiende mientras tu equipo trabaja"
          lead="Inteligencia artificial entrenada con la información de tu negocio, conectada a tu WhatsApp, tu correo y tus sistemas. Y un CRM que registra cada conversación, para que ninguna venta se quede perdida en un chat."
        />

        {/* `dark`: panel oscuro en los dos temas, igual que el carril de
            software a medida de Servicios. Los brillos del 3D necesitan fondo
            negro para leerse. */}
        <div className="dark relative overflow-hidden rounded-panel bg-ink text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,#6366F130,transparent_60%)]" />

          <div className="relative grid lg:grid-cols-[1.1fr_1fr]">
            <AgentNetwork className="h-[380px] sm:h-[440px] lg:h-[560px] order-first lg:order-last cursor-grab active:cursor-grabbing" />

            <div className="p-8 md:p-12 lg:p-14 space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {AGENTS.map((agent) => (
                  <div key={agent.title} className="space-y-3">
                    <div className="h-11 w-11 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <agent.icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-headline text-lg font-bold leading-tight">{agent.title}</p>
                    <p className="text-sm text-white/55 leading-relaxed">{agent.description}</p>
                  </div>
                ))}
              </div>

              {AI_PROOF && (
                <Link
                  href={AI_PROOF.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 transition-all hover:border-primary/40 hover:bg-white/[0.08]"
                >
                  <span className="space-y-1">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                      Ya en producción
                    </span>
                    <span className="block font-headline font-bold">
                      {AI_PROOF.name} · {AI_PROOF.company}
                    </span>
                    <span className="block text-sm text-white/55 leading-relaxed">
                      {AI_PROOF.description}
                    </span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-white/30 transition-colors group-hover:text-primary" />
                </Link>
              )}

              <Button asChild size="lg" className="h-14 px-10 rounded-2xl bg-white text-ink hover:bg-white/90 text-lg font-bold group">
                <Link href="#contact">
                  Quiero un agente
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* CRM */}
          <div>
            <div className="border-t border-border pt-6">
              <h3 className="font-headline text-2xl md:text-4xl font-bold tracking-tight">
                CRM a la medida de cómo vendes
              </h3>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                No es tu equipo el que se adapta a un CRM de estantería: se arma con tus etapas,
                tus campos y tus reportes. Y conversa con tu agente, así cada cliente que escribe
                queda registrado solo.
              </p>
            </div>
            <ul className="mt-6">
              {CRM_FEATURES.map((f) => (
                <li
                  key={f.label}
                  className="flex items-center gap-3 border-t border-border py-3.5 text-[15px] text-muted-foreground"
                >
                  <f.icon className="h-4 w-4 shrink-0 text-primary" />
                  {f.label}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" size="lg" className="mt-6 h-12 rounded-2xl font-bold group">
              <Link href="#contact">
                Quiero mi CRM
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Como se implementa */}
          <div>
            <div className="border-t border-border pt-6">
              <h3 className="font-headline text-2xl md:text-4xl font-bold tracking-tight">
                Cómo lo ponemos a funcionar
              </h3>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Te entregamos alcance y cifra por escrito antes de empezar.
              </p>
            </div>
            <ol className="mt-6 space-y-5">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4 border-t border-border pt-5">
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
      </div>
    </section>
  );
}
