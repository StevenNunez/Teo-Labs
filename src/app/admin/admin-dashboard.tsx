'use client';

import React, { useMemo, useState } from 'react';
import { Search, ExternalLink, Calendar, Sparkles, TrendingUp, FolderOpen } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { generateStatusReport } from '@/ai/flows/generate-status-report';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ProjectDialog from './project-dialog';
import {
  PAYMENT_STATUS_LABELS,
  PROJECT_STATUS_LABELS,
  formatCLP,
  isMaintenanceOverdue,
  parseDateOnly,
  type Client,
  type ProjectStatus,
  type ProjectStep,
  type ProjectWithClient,
} from '@/lib/admin-types';

/**
 * La tabla del panel. Antes tenia los proyectos escritos a mano en el archivo;
 * ahora todo llega por props desde el Server Component, que es quien habla con
 * la base con la service_role key.
 */

interface Props {
  projects: ProjectWithClient[];
  clients: Client[];
  /** Etapas indexadas por id de proyecto. */
  stepsByProject: Record<string, ProjectStep[]>;
  summary: {
    chart: Array<{ month: string; projects: number }>;
    revenueYear: number;
    overdueMaintenance: number;
  };
}

const STATUS_BADGE: Record<ProjectStatus, string> = {
  active: 'bg-green-500/10 text-green-600 border-green-200',
  in_progress: 'bg-blue-500/10 text-blue-600 border-blue-200',
  paused: 'bg-amber-500/10 text-amber-600 border-amber-200',
  finished: 'bg-muted text-muted-foreground border-border',
};

function formatDate(value: string | null): string {
  const date = parseDateOnly(value);
  if (!date) return 'N/A';
  return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminDashboard({ projects, clients, stepsByProject, summary }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.client?.name ?? '').toLowerCase().includes(term) ||
        (p.client?.contact_name ?? '').toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);

  const handleGenerateReport = async (project: ProjectWithClient) => {
    setIsGenerating(project.id);
    try {
      const report = await generateStatusReport({
        projectName: project.name,
        clientName: project.client?.contact_name || project.client?.name || 'Cliente',
        progress: project.progress,
        currentStep: project.current_step || 'En desarrollo',
        nextMilestone: project.next_milestone || 'Próxima entrega',
      });

      window.open(
        `https://wa.me/56930938222?text=${encodeURIComponent(report.message)}`,
        '_blank'
      );
      toast({
        title: 'Reporte con IA generado',
        description: 'Se ha abierto WhatsApp con el mensaje redactado.',
      });
    } catch (error) {
      console.error('Fallo la generacion del reporte:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No pudimos conectar con la IA en este momento.',
      });
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">Centro de Mandos</h1>
          <p className="text-muted-foreground mt-1">
            Gestión inteligente de clientes y proyectos Teo Labs.
          </p>
        </div>
        <ProjectDialog clients={clients} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 border-border/50 shadow-xl overflow-hidden rounded-2xl bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Crecimiento de Cartera
            </CardTitle>
            <CardDescription>Proyectos iniciados en los últimos 6 meses.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] p-0 pb-4">
            {/* Sin proyectos el grafico es un rectangulo en blanco que parece
                roto. Mejor decir que todavia no hay nada que graficar. */}
            {projects.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  Cuando cargues proyectos vas a ver acá cuántos iniciaste cada mes.
                </p>
              </div>
            ) : (
              <ChartContainer config={{ projects: { label: 'Proyectos', color: 'hsl(var(--primary))' } }}>
                <BarChart data={summary.chart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <Bar dataKey="projects" fill="var(--color-projects)" radius={[4, 4, 0, 0]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card className="border-border/50 shadow-sm rounded-2xl bg-gradient-to-br from-primary/10 to-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Facturación del año</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-headline">
                {formatCLP(summary.revenueYear)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Suma de proyectos marcados como pagados este año.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-sm rounded-2xl bg-card">
            <CardHeader className="pb-2">
              <CardTitle
                className={cn(
                  'text-sm font-medium',
                  summary.overdueMaintenance > 0 && 'text-red-500'
                )}
              >
                Mantenimientos vencidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  'text-3xl font-bold font-headline',
                  summary.overdueMaintenance > 0 ? 'text-red-500' : 'text-muted-foreground'
                )}
              >
                {summary.overdueMaintenance}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.overdueMaintenance > 0
                  ? 'Requieren acción inmediata'
                  : 'Todo al día'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/50 shadow-2xl rounded-2xl overflow-hidden bg-card/80 backdrop-blur-xl">
        <CardHeader className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50">
          <div>
            <CardTitle className="font-headline text-xl">Gestión de Proyectos</CardTitle>
            <CardDescription>
              Monitorea el avance y usa la IA para informar a tus clientes.
            </CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente o proyecto..."
              className="pl-10 w-[200px] md:w-[350px] rounded-xl h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center px-6">
              <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg">Todavía no hay proyectos</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Crea el primero y el cliente podrá seguir su avance desde su link privado.
                </p>
              </div>
              <ProjectDialog clients={clients} />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold py-4">Proyecto / Cliente</TableHead>
                  <TableHead className="text-center font-bold">Estado</TableHead>
                  <TableHead className="font-bold">Avance</TableHead>
                  <TableHead className="font-bold">Mantenimiento</TableHead>
                  <TableHead className="text-right font-bold pr-6">Acciones IA &amp; Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((project) => {
                  const overdue = isMaintenanceOverdue(project.maintenance_until);
                  return (
                    <TableRow key={project.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-base">{project.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {project.client?.name ?? 'Sin cliente'} · {project.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <Badge className={STATUS_BADGE[project.status]}>
                            {PROJECT_STATUS_LABELS[project.status]}
                          </Badge>
                          <span
                            className={cn(
                              'text-[10px] font-bold uppercase tracking-wider',
                              project.payment === 'paid'
                                ? 'text-green-600'
                                : project.payment === 'partial'
                                  ? 'text-amber-600'
                                  : 'text-red-500'
                            )}
                          >
                            {PAYMENT_STATUS_LABELS[project.payment]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[160px]">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold gap-2">
                            <span>{project.progress}%</span>
                            <span className="text-muted-foreground uppercase truncate">
                              {project.current_step || '—'}
                            </span>
                          </div>
                          <Progress value={project.progress} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            'flex items-center gap-2 text-sm',
                            overdue && 'text-red-500 font-bold'
                          )}
                        >
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatDate(project.maintenance_until)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-primary/20 hover:bg-primary/5"
                            onClick={() => handleGenerateReport(project)}
                            disabled={isGenerating === project.id}
                          >
                            <Sparkles
                              className={cn(
                                'h-4 w-4 mr-2',
                                isGenerating === project.id ? 'animate-spin' : 'text-primary'
                              )}
                            />
                            {isGenerating === project.id ? 'Redactando...' : 'Reporte IA'}
                          </Button>
                          <ProjectDialog
                            clients={clients}
                            project={project}
                            steps={stepsByProject[project.id] ?? []}
                          />
                          <Button variant="ghost" size="icon" className="rounded-xl" asChild>
                            <a
                              href={`/seguimiento/${project.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Ver como cliente"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
