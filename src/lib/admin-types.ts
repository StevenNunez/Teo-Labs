/**
 * Tipos y etiquetas de proyectos, clientes y etapas.
 *
 * Este archivo NO importa Supabase a proposito: lo comparten el panel (que corre
 * en el navegador) y las consultas del servidor. Si importara supabase-admin, el
 * componente cliente arrastraria la service_role key al bundle.
 *
 * Los valores de cada union son exactamente los enums de supabase/schema.sql.
 */

export type ProjectStatus = 'in_progress' | 'active' | 'paused' | 'finished';
export type PaymentStatus = 'pending' | 'partial' | 'paid';
export type StepStatus = 'pending' | 'in_progress' | 'completed';

export interface Client {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  whatsapp: string | null;
  created_at: string;
}

export interface ProjectStep {
  id: string;
  project_id: string;
  position: number;
  name: string;
  description: string | null;
  status: StepStatus;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  type: string;
  status: ProjectStatus;
  payment: PaymentStatus;
  progress: number;
  current_step: string | null;
  next_milestone: string | null;
  delivery_date: string | null;
  maintenance_until: string | null;
  amount_clp: number | null;
  prototype_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Un proyecto con el nombre del cliente ya resuelto, que es como se lista. */
export interface ProjectWithClient extends Project {
  client: Pick<Client, 'id' | 'name' | 'contact_name'> | null;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  in_progress: 'En construcción',
  active: 'Activo',
  paused: 'Pausado',
  finished: 'Finalizado',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pendiente',
  partial: 'Abono',
  paid: 'Pagado',
};

/** Mismos tipos que ofrece el wizard, para que panel y formulario hablen igual. */
export const PROJECT_TYPES = [
  'Landing Page',
  'Web Corporativa',
  'E-commerce',
  'App Web',
  'ERP',
  'Automatización IA',
  'Mantenimiento',
] as const;

/**
 * Ruta de trabajo por defecto.
 *
 * Son las cinco etapas que estaban escritas a mano en /seguimiento/[id]. Ahora
 * se insertan como filas al crear un proyecto, para que cada uno pueda cambiar
 * las suyas sin tocar el codigo.
 */
export const DEFAULT_STEPS: Array<{ name: string; description: string }> = [
  {
    name: 'Planificación y Diseño',
    description: 'Definición de estructura, colores y prototipo inicial.',
  },
  {
    name: 'Desarrollo Frontend',
    description: 'Construcción de la interfaz visual y animaciones.',
  },
  {
    name: 'Integración Backend',
    description: 'Conexión con bases de datos y sistemas de contacto.',
  },
  {
    name: 'Pruebas y Optimización',
    description: 'Ajustes finales de velocidad, SEO y seguridad.',
  },
  {
    name: 'Lanzamiento y Dominio',
    description: 'Puesta en marcha oficial en el dominio .cl.',
  },
];

/** Formato chileno: $1.250.000. Devuelve un guion cuando no hay monto. */
export function formatCLP(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Las fechas vienen como 'YYYY-MM-DD' (columna date, sin hora).
 * `new Date('2026-06-15')` las interpreta en UTC y en Chile puede mostrar el dia
 * anterior, asi que se parsea a mano.
 */
export function parseDateOnly(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

/** El mantenimiento vencio si la fecha ya paso (comparando por dia, no por hora). */
export function isMaintenanceOverdue(value: string | null | undefined): boolean {
  const date = parseDateOnly(value);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}
