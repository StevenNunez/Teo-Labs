import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SectionHeading from '@/components/ui/section-heading';

/**
 * Preguntas frecuentes, justo antes de Contacto.
 *
 * Es donde el visitante decide si escribe o no, y las dudas que lo frenan son
 * siempre las mismas: cuanto cuesta, cuanto demoran en responder, si trabajan
 * fuera de La Serena, que pasa despues de la entrega. Cada respuesta sale de
 * algo que el sitio ya publica (Servicios, Contacto, el portafolio) o que el
 * agente de IA ya informa (la mantencion): nada nuevo prometido aca.
 *
 * Ademas va el JSON-LD de FAQPage, que es lo que Google y los asistentes de IA
 * leen para responder "cuanto cuesta una web en La Serena".
 */
const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: '¿Cuánto cuesta una página web?',
    a: 'Una web corporativa cuesta $80.000 e incluye dominio .cl el primer año, 2 correos corporativos, hosting y diseño adaptado a celular. Las tiendas online parten en $180.000 (Básico), $230.000 (Intermedio) y $280.000 (Full).',
    link: { href: '#services', label: 'Ver qué incluye cada plan' },
  },
  {
    q: '¿Cuánto cuesta un agente de IA, un CRM o un ERP?',
    a: 'Se cotizan, porque dependen de tu proceso. Partimos con un diagnóstico corto y te entregamos el alcance y el precio por escrito antes de escribir una línea de código.',
  },
  {
    q: '¿En cuánto tiempo me responden?',
    a: 'En menos de 48 horas, por el formulario o por WhatsApp, y te responde una persona del equipo.',
  },
  {
    q: '¿Trabajan solo en La Serena?',
    a: 'Nuestra base está en La Serena, pero trabajamos con empresas de todo Chile: hoy tenemos clientes en Antofagasta, Los Ángeles y la Región de Coquimbo.',
    link: { href: '/portafolio-web', label: 'Ver los proyectos' },
  },
  {
    q: '¿Qué pasa después de que me entregan el proyecto?',
    a: 'Seguimos contigo. Ofrecemos mantención anual desde $75.000 para que el sitio siga seguro, rápido y al día. En los sistemas a medida, la mantención y el soporte quedan definidos en la propuesta.',
  },
  {
    q: '¿Cómo sé que pueden hacer lo que prometen?',
    a: 'Porque puedes abrirlo: PAGNOL, Gestión de Obras, Fruto y Hungry Ape son productos nuestros que funcionan hoy en empresas reales. Y puedes probar ahora mismo un agente de IA en esta página.',
    link: { href: '#agentes', label: 'Probar el agente' },
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FaqSection() {
  return (
    <section id="preguntas" className="relative py-20 md:py-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeading
            className="mb-0"
            titleClassName="text-[clamp(2.5rem,4.6vw,5.5rem)]"
            eyebrow="Preguntas frecuentes"
            title="Antes de cotizar"
            lead="Lo que casi todos nos preguntan en la primera conversación."
          />
          <Accordion type="single" collapsible defaultValue="item-0" className="border-t border-border">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="py-5 text-left font-headline text-lg font-bold tracking-tight hover:no-underline md:text-xl">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                  <p>{f.a}</p>
                  {f.link && (
                    <Link href={f.link.href} className="mt-3 inline-block font-semibold text-primary underline-offset-4 hover:underline">
                      {f.link.label} →
                    </Link>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
