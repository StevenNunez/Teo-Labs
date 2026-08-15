'use client';

import React, { useState } from 'react';
import { Loader2, Plus, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { createProject, updateProject, updateStepStatus } from './actions';
import {
  PAYMENT_STATUS_LABELS,
  PROJECT_STATUS_LABELS,
  PROJECT_TYPES,
  type Client,
  type PaymentStatus,
  type ProjectStatus,
  type ProjectStep,
  type ProjectWithClient,
  type StepStatus,
} from '@/lib/admin-types';

const STEP_STATUS_LABELS: Record<StepStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En curso',
  completed: 'Lista',
};

/**
 * Alta y edicion de proyectos, en el mismo formulario.
 *
 * Las dos operaciones piden los mismos campos; lo unico que cambia es el cliente:
 * al crear se puede inventar uno nuevo sin salir del panel, al editar solo se
 * elige entre los que ya existen.
 *
 * Guarda contra Server Actions, no contra el navegador: la service_role key
 * nunca baja al bundle.
 */

interface Props {
  clients: Client[];
  /** Sin proyecto es alta; con proyecto, edicion. */
  project?: ProjectWithClient;
  /** Ruta de trabajo del proyecto. Solo llega en edicion. */
  steps?: ProjectStep[];
}

type FormState = {
  name: string;
  type: string;
  status: ProjectStatus;
  payment: PaymentStatus;
  progress: string;
  current_step: string;
  next_milestone: string;
  delivery_date: string;
  maintenance_until: string;
  amount_clp: string;
  prototype_url: string;
  notes: string;
};

function initialState(project?: ProjectWithClient): FormState {
  return {
    name: project?.name ?? '',
    type: project?.type ?? 'Web Corporativa',
    status: project?.status ?? 'in_progress',
    payment: project?.payment ?? 'pending',
    progress: String(project?.progress ?? 0),
    current_step: project?.current_step ?? '',
    next_milestone: project?.next_milestone ?? '',
    delivery_date: project?.delivery_date ?? '',
    maintenance_until: project?.maintenance_until ?? '',
    amount_clp: project?.amount_clp != null ? String(project.amount_clp) : '',
    prototype_url: project?.prototype_url ?? '',
    notes: project?.notes ?? '',
  };
}

export default function ProjectDialog({ clients, project, steps = [] }: Props) {
  const isEdit = Boolean(project);
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<FormState>(() => initialState(project));
  // Las etapas se guardan al toque, no con el boton del formulario: mover una
  // casilla y que no pase nada visible hasta apretar "Guardar" invita a cerrar
  // el dialogo creyendo que ya estaba.
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(() =>
    Object.fromEntries(steps.map((step) => [step.id, step.status]))
  );
  const [clientMode, setClientMode] = useState<'existing' | 'new'>(
    clients.length > 0 ? 'existing' : 'new'
  );
  const [clientId, setClientId] = useState(project?.client_id ?? '');
  const [newClient, setNewClient] = useState({
    client_name: '',
    contact_name: '',
    client_email: '',
    client_whatsapp: '',
  });
  const { toast } = useToast();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Al reabrir, el formulario vuelve a los datos guardados: si alguien empieza a
  // editar, cancela y entra de nuevo, no puede quedarse con los cambios viejos
  // a medio escribir creyendo que se guardaron.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setForm(initialState(project));
      setClientId(project?.client_id ?? '');
      setClientMode(clients.length > 0 ? 'existing' : 'new');
      setNewClient({ client_name: '', contact_name: '', client_email: '', client_whatsapp: '' });
      setStepStatuses(Object.fromEntries(steps.map((step) => [step.id, step.status])));
    }
    setOpen(next);
  };

  const handleStepChange = async (stepId: string, status: StepStatus) => {
    const previous = stepStatuses[stepId];
    setStepStatuses((prev) => ({ ...prev, [stepId]: status }));

    const result = await updateStepStatus({ stepId, projectId: project!.id, status });
    if (!result.ok) {
      // Vuelve a como estaba: dejar la casilla movida mentiria sobre lo guardado.
      setStepStatuses((prev) => ({ ...prev, [stepId]: previous }));
      toast({ variant: 'destructive', title: 'No se pudo actualizar', description: result.message });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const result = isEdit
        ? await updateProject({ ...form, id: project!.id, client_id: clientId })
        : await createProject(
            clientMode === 'existing'
              ? { ...form, clientMode: 'existing', client_id: clientId }
              : { ...form, clientMode: 'new', ...newClient }
          );

      if (!result.ok) {
        toast({ variant: 'destructive', title: 'No se pudo guardar', description: result.message });
        return;
      }

      toast({
        title: isEdit ? 'Proyecto actualizado' : 'Proyecto creado',
        description: isEdit
          ? 'Los cambios ya se ven en el seguimiento del cliente.'
          : 'Se creó con la ruta de trabajo de cinco etapas.',
      });
      setOpen(false);
    } catch (error) {
      console.error('Fallo al guardar el proyecto:', error);
      toast({
        variant: 'destructive',
        title: 'No se pudo guardar',
        description: 'Revisa la conexión e intenta de nuevo.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon" className="rounded-xl" title="Editar proyecto">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            {isEdit ? 'Editar proyecto' : 'Nuevo proyecto'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Lo que cambies acá se refleja al instante en el link de seguimiento del cliente.'
              : 'Se crea con la ruta de trabajo de cinco etapas, lista para ir avanzando.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          {/* Cliente */}
          <div className="space-y-3 rounded-2xl border border-border/50 p-4">
            <div className="flex items-center justify-between gap-4">
              <Label className="text-[10px] font-semibold uppercase tracking-widest">Cliente</Label>
              {!isEdit && clients.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setClientMode((m) => (m === 'existing' ? 'new' : 'existing'))}
                >
                  {clientMode === 'existing' ? '+ Cliente nuevo' : 'Elegir existente'}
                </Button>
              )}
            </div>

            {clientMode === 'existing' || isEdit ? (
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                      {client.contact_name ? ` · ${client.contact_name}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  className="h-11 rounded-xl"
                  placeholder="Empresa o razón social"
                  value={newClient.client_name}
                  onChange={(e) => setNewClient({ ...newClient, client_name: e.target.value })}
                />
                <Input
                  className="h-11 rounded-xl"
                  placeholder="Persona de contacto"
                  value={newClient.contact_name}
                  onChange={(e) => setNewClient({ ...newClient, contact_name: e.target.value })}
                />
                <Input
                  type="email"
                  className="h-11 rounded-xl"
                  placeholder="Email"
                  value={newClient.client_email}
                  onChange={(e) => setNewClient({ ...newClient, client_email: e.target.value })}
                />
                <Input
                  className="h-11 rounded-xl"
                  placeholder="WhatsApp"
                  value={newClient.client_whatsapp}
                  onChange={(e) => setNewClient({ ...newClient, client_whatsapp: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* Proyecto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-[10px] font-semibold uppercase tracking-widest">Proyecto</Label>
              <Input
                className="h-11 rounded-xl"
                placeholder="Sitio web Clínica Dental"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-widest">Tipo</Label>
              <Select value={form.type} onValueChange={(v) => set('type', v)}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-widest">Estado</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v as ProjectStatus)}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-widest">Pago</Label>
              <Select value={form.payment} onValueChange={(v) => set('payment', v as PaymentStatus)}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-widest">
                Monto (CLP)
              </Label>
              <Input
                inputMode="numeric"
                className="h-11 rounded-xl"
                placeholder="850000"
                value={form.amount_clp}
                onChange={(e) => set('amount_clp', e.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-[10px] font-semibold uppercase tracking-widest">
                Avance: {form.progress}%
              </Label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={form.progress}
                onChange={(e) => set('progress', e.target.value)}
                className="w-full accent-[hsl(var(--primary))]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-widest">
                Tarea actual
              </Label>
              <Input
                className="h-11 rounded-xl"
                placeholder="Diseño de interfaz"
                value={form.current_step}
                onChange={(e) => set('current_step', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-widest">
                Próximo hito
              </Label>
              <Input
                className="h-11 rounded-xl"
                placeholder="Integración backend"
                value={form.next_milestone}
                onChange={(e) => set('next_milestone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-widest">
                Entrega estimada
              </Label>
              <Input
                type="date"
                className="h-11 rounded-xl"
                value={form.delivery_date}
                onChange={(e) => set('delivery_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-widest">
                Mantenimiento hasta
              </Label>
              <Input
                type="date"
                className="h-11 rounded-xl"
                value={form.maintenance_until}
                onChange={(e) => set('maintenance_until', e.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-[10px] font-semibold uppercase tracking-widest">
                Link del prototipo{' '}
                <span className="normal-case tracking-normal text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                type="url"
                className="h-11 rounded-xl"
                placeholder="https://preview.teolabs.app/..."
                value={form.prototype_url}
                onChange={(e) => set('prototype_url', e.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-[10px] font-semibold uppercase tracking-widest">
                Notas internas{' '}
                <span className="normal-case tracking-normal text-muted-foreground">
                  (el cliente no las ve)
                </span>
              </Label>
              <Textarea
                className="min-h-[90px] rounded-xl"
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
              />
            </div>
          </div>

          {/* Ruta de trabajo: es la linea de tiempo que ve el cliente. */}
          {isEdit && steps.length > 0 && (
            <div className="space-y-3 rounded-2xl border border-border/50 p-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold uppercase tracking-widest">
                  Ruta de trabajo
                </Label>
                <p className="text-xs text-muted-foreground">
                  Se guarda al instante y el cliente lo ve en su link.
                </p>
              </div>
              {steps.map((step) => (
                <div key={step.id} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium truncate">
                    {step.position}. {step.name}
                  </span>
                  <Select
                    value={stepStatuses[step.id] ?? step.status}
                    onValueChange={(value) => handleStepChange(step.id, value as StepStatus)}
                  >
                    <SelectTrigger className="h-9 w-[140px] shrink-0 rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STEP_STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl"
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl px-8 bg-primary" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEdit ? (
                'Guardar cambios'
              ) : (
                'Crear proyecto'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
