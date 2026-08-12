'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  LayoutDashboard, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign, 
  Plus, 
  Search, 
  ExternalLink, 
  Calendar,
  Filter,
  Sparkles,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
  TableRow 
} from '@/components/ui/table';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { generateStatusReport } from '@/ai/flows/generate-status-report';
import { useToast } from '@/hooks/use-toast';

const chartData = [
  { month: 'Ene', projects: 2 },
  { month: 'Feb', projects: 4 },
  { month: 'Mar', projects: 3 },
  { month: 'Abr', projects: 6 },
  { month: 'May', projects: 8 },
  { month: 'Jun', projects: 12 },
];

const initialProjects = [
  {
    id: '1',
    name: 'Constructora Recarp',
    client: 'Recarp SpA',
    status: 'active',
    payment: 'paid',
    maintenance: '2025-05-15',
    progress: 100,
    type: 'Corporativo',
    currentStep: 'Finalizado',
    nextMilestone: 'Renovación Anual'
  },
  {
    id: '2',
    name: 'FerroActiva App',
    client: 'FerroActiva',
    status: 'active',
    payment: 'pending',
    maintenance: '2024-12-20',
    progress: 100,
    type: 'Web App',
    currentStep: 'Producción',
    nextMilestone: 'Nuevas Funcionalidades'
  },
  {
    id: '3',
    name: 'Nueva Clínica Dental',
    client: 'Dr. Smith',
    status: 'in_progress',
    payment: 'paid',
    maintenance: 'N/A',
    progress: 35,
    type: 'E-commerce',
    currentStep: 'Diseño de Interfaz',
    nextMilestone: 'Backend Integration'
  },
];

export default function AdminDashboard() {
  const [projects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateReport = async (project: typeof initialProjects[0]) => {
    setIsGenerating(project.id);
    try {
      const report = await generateStatusReport({
        projectName: project.name,
        clientName: project.client,
        progress: project.progress,
        currentStep: project.currentStep,
        nextMilestone: project.nextMilestone,
      });

      const whatsappUrl = `https://wa.me/56930938222?text=${encodeURIComponent(report.message)}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Reporte con IA generado",
        description: "Se ha abierto WhatsApp con el mensaje redactado.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No pudimos conectar con la IA en este momento.",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      <main className="flex-1 container py-10 px-4 md:px-8 max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold font-headline tracking-tight">Centro de Mandos</h1>
            <p className="text-muted-foreground mt-1">Gestión inteligente de clientes y proyectos Teo Labs.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl">
              <TrendingUp className="mr-2 h-4 w-4" /> Reportes Mensuales
            </Button>
            <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
            </Button>
          </div>
        </div>

        {/* Analytic Cards & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-border/50 shadow-xl overflow-hidden rounded-2xl bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Crecimiento de Cartera
              </CardTitle>
              <CardDescription>Proyectos activos y entregados este año.</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] p-0 pb-4">
              <ChartContainer config={{ projects: { label: "Proyectos", color: "hsl(var(--primary))" } }}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <Bar dataKey="projects" fill="var(--color-projects)" radius={[4, 4, 0, 0]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6">
            <Card className="border-border/50 shadow-sm rounded-2xl bg-gradient-to-br from-primary/10 to-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Facturación Anual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-headline">$12.450.000.-</div>
                <p className="text-xs text-muted-foreground mt-1">Crecimiento del +18% vs 2023</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-500">Mantenimientos Vencidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-headline text-red-500">2</div>
                <p className="text-xs text-muted-foreground mt-1">Requieren acción inmediata</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Project List */}
        <Card className="border-border/50 shadow-2xl rounded-2xl overflow-hidden bg-card/80 backdrop-blur-xl">
          <CardHeader className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50">
            <div>
              <CardTitle className="font-headline text-xl">Gestión de Proyectos</CardTitle>
              <CardDescription>Monitorea el avance y usa la IA para informar a tus clientes.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por cliente o proyecto..." 
                  className="pl-10 w-[200px] md:w-[350px] rounded-xl h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold py-4">Proyecto / Cliente</TableHead>
                  <TableHead className="text-center font-bold">Estado</TableHead>
                  <TableHead className="font-bold">Avance</TableHead>
                  <TableHead className="font-bold">Mantenimiento</TableHead>
                  <TableHead className="text-right font-bold pr-6">Acciones IA & Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.client.toLowerCase().includes(searchTerm.toLowerCase())).map((project) => (
                  <TableRow key={project.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-base">{project.name}</span>
                        <span className="text-xs text-muted-foreground">{project.client} · {project.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={
                        project.status === 'active' ? 'bg-green-500/10 text-green-600 border-green-200' :
                        'bg-blue-500/10 text-blue-600 border-blue-200'
                      }>
                        {project.status === 'active' ? 'Activo' : 'En Construcción'}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-[160px]">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>{project.progress}%</span>
                          <span className="text-muted-foreground uppercase">{project.currentStep}</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{project.maintenance}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl border-primary/20 hover:bg-primary/5 group"
                          onClick={() => handleGenerateReport(project)}
                          disabled={isGenerating === project.id}
                        >
                          <Sparkles className={`h-4 w-4 mr-2 ${isGenerating === project.id ? 'animate-spin' : 'text-primary'}`} />
                          {isGenerating === project.id ? 'Redactando...' : 'Reporte IA'}
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl" asChild>
                          <a href={`/seguimiento/${project.id}`} title="Ver como cliente">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </main>
      <Footer />
    </div>
  );
}

