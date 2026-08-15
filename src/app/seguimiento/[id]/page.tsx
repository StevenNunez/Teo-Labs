import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  MessageCircle,
  ShieldCheck,
  Globe,
  Zap,
  ArrowLeft,
  Calendar as CalendarIcon,
} from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getTrackedProject } from '@/lib/admin-data';
import { PROJECT_STATUS_LABELS, parseDateOnly } from '@/lib/admin-types';

/**
 * Seguimiento del cliente.
 *
 * Es publica (el cliente entra con un link, sin clave), pero solo muestra UN
 * proyecto y el id es un UUID: no se puede recorrer probando /seguimiento/1,
 * /seguimiento/2. Lo que es interno —montos, estado de pago, notas— no se
 * consulta ni se renderiza aca.
 */

/**
 * `cache` deduplica la consulta: generateMetadata y el componente piden lo mismo
 * y sin esto la pagina golpearia la base dos veces por visita.
 */
const loadProject = cache(getTrackedProject);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await loadProject(id);

  return {
    // El cliente abre este link desde WhatsApp: la pestaña tiene que decirle
    // cual es su proyecto, no el titulo generico del sitio.
    title: data ? `${data.project.name} · Seguimiento` : 'Seguimiento de proyecto',
    robots: { index: false, follow: false },
  };
}

// Los datos cambian cuando se toca el panel; nada de servir una version cacheada
// del build. Las escrituras ademas revalidan esta ruta.
export const dynamic = 'force-dynamic';

function formatLongDate(value: string | null): string {
  const date = parseDateOnly(value);
  if (!date) return 'Por confirmar';
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function ProjectTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadProject(id);

  // Tambien cae aca cuando la base no esta configurada: mejor un 404 limpio que
  // una pagina rota con datos de ejemplo que el cliente podria creerse.
  if (!data) notFound();

  const { project, steps } = data;
  const clientLabel = project.client?.contact_name || project.client?.name || 'tu equipo';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <Button asChild variant="ghost" className="-ml-4 h-8 text-muted-foreground hover:text-primary">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Teo Labs
                </Link>
              </Button>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold font-headline tracking-tight">{project.name}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    Proyecto en desarrollo exclusivo para {clientLabel}
                  </p>
                </div>
              </div>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-bold rounded-xl uppercase">
              Estado: {PROJECT_STATUS_LABELS[project.status]}
            </Badge>
          </div>

          {/* Progress Card */}
          <Card className="border-border/50 shadow-2xl rounded-panel overflow-hidden bg-card/50 backdrop-blur-sm relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500" />
            <CardContent className="p-10 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs font-semibold text-primary uppercase tracking-[0.3em]">
                    Avance del Proyecto
                  </span>
                  <div className="text-7xl font-bold font-headline tracking-tighter transition-all group-hover:scale-105 duration-500">
                    {project.progress}%
                  </div>
                </div>
                <div className="bg-muted/50 p-6 rounded-3xl border border-border/50 text-center md:text-right min-w-[220px]">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Entrega Estimada
                  </p>
                  <p className="text-xl font-bold flex items-center justify-center md:justify-end gap-2 text-foreground">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    {formatLongDate(project.delivery_date)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Progress
                  value={project.progress}
                  className="h-5 rounded-full bg-primary/5 border border-primary/10"
                />
                {project.current_step && (
                  <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-muted-foreground">
                    <span className="flex h-3 w-3 rounded-full bg-primary animate-ping" />
                    Trabajando en:{' '}
                    <span className="text-foreground font-bold italic">{project.current_step}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          {steps.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold font-headline px-2">Ruta de Trabajo</h3>
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-muted before:to-transparent">
                {steps.map((step) => (
                  <div key={step.id} className="relative flex items-start md:justify-center gap-6 md:gap-12">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-background bg-card shadow-xl z-10 shrink-0">
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : step.status === 'in_progress' ? (
                        <div className="h-4 w-4 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground/30" />
                      )}
                    </div>

                    <div
                      className={cn(
                        'w-full md:max-w-[400px] p-6 rounded-3xl border transition-all duration-500',
                        step.status === 'in_progress'
                          ? 'bg-primary/5 border-primary/30 shadow-xl shadow-primary/5 scale-[1.02] ring-1 ring-primary/20'
                          : 'bg-card border-border/50 opacity-60'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold font-headline text-lg">{step.name}</h4>
                        {step.status === 'in_progress' && (
                          <span className="text-[10px] font-semibold bg-primary text-white px-2 py-0.5 rounded-full animate-pulse">
                            ACTUAL
                          </span>
                        )}
                      </div>
                      {step.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-[#25D366]/10 to-transparent rounded-panel p-8 md:p-12 border border-[#25D366]/20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h4 className="text-2xl font-bold font-headline">¿Alguna observación?</h4>
              <p className="text-muted-foreground max-w-sm">
                Tu equipo de desarrollo está listo para escuchar tus comentarios.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-2xl h-14 px-8 font-bold text-lg shadow-xl shadow-[#25D366]/20"
              >
                <a
                  href={`https://wa.me/56930938222?text=${encodeURIComponent(
                    `Hola Teo Labs, tengo una consulta sobre el proyecto ${project.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-3 h-6 w-6" /> Chat Directo
                </a>
              </Button>
              {project.prototype_url && (
                <Button
                  asChild
                  variant="outline"
                  className="rounded-2xl h-14 px-8 font-bold border-primary/20 bg-background/50"
                >
                  <a href={project.prototype_url} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-3 h-6 w-6 text-primary" /> Ver Prototipo
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
