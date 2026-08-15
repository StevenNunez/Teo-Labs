import { supabaseAdmin } from '@/lib/supabase-admin';
import type { Client, ProjectStep, ProjectWithClient } from '@/lib/admin-types';

/**
 * Consultas del panel y del seguimiento. Solo servidor: importa supabase-admin.
 *
 * Ninguna de estas funciones lanza cuando la base no esta configurada; devuelven
 * listas vacias o null. El sitio publico no depende de la base y tiene que poder
 * construirse sin ella (produccion hoy corre asi).
 *
 * Ojo con la diferencia entre "no hay filas" y "la consulta fallo": las dos
 * devuelven lista vacia, y si se confunden el panel dice "todavia no hay
 * proyectos" cuando en realidad falta correr el esquema. Por eso loadAdminData
 * propaga el error en vez de tragarselo.
 */

const PROJECT_COLUMNS =
  'id, client_id, name, type, status, payment, progress, current_step, next_milestone, ' +
  'delivery_date, maintenance_until, amount_clp, prototype_url, notes, created_at, updated_at';

/** Postgres/PostgREST cuando la tabla no existe: falta correr supabase/schema.sql. */
function isMissingTable(message: string): boolean {
  return message.includes('schema cache') || message.includes('does not exist');
}

export type AdminData =
  | {
      ok: true;
      projects: ProjectWithClient[];
      clients: Client[];
      stepsByProject: Record<string, ProjectStep[]>;
    }
  | { ok: false; reason: 'missing-tables' | 'error'; message: string };

/**
 * Todo lo que necesita /admin, en una sola llamada.
 *
 * Va junto y no como tres funciones sueltas porque la pagina necesita las tres
 * y porque un fallo de cualquiera tiene que poder contarse como tal.
 */
export async function loadAdminData(): Promise<AdminData> {
  if (!supabaseAdmin) {
    return { ok: false, reason: 'error', message: 'La base de datos no está configurada.' };
  }

  const [projects, clients, steps] = await Promise.all([
    listProjects(),
    listClients(),
    listStepsByProject(),
  ]);

  const failure = [projects, clients, steps].find((result) => 'error' in result);
  if (failure && 'error' in failure) {
    return {
      ok: false,
      reason: isMissingTable(failure.error) ? 'missing-tables' : 'error',
      message: failure.error,
    };
  }

  return {
    ok: true,
    projects: 'data' in projects ? projects.data : [],
    clients: 'data' in clients ? clients.data : [],
    stepsByProject: 'data' in steps ? steps.data : {},
  };
}

type Query<T> = { data: T } | { error: string };

async function listProjects(): Promise<Query<ProjectWithClient[]>> {
  if (!supabaseAdmin) return { data: [] };

  const { data, error } = await supabaseAdmin
    .from('projects')
    .select(`${PROJECT_COLUMNS}, client:clients (id, name, contact_name)`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('No se pudieron leer los proyectos:', error.message);
    return { error: error.message };
  }

  // El join llega como objeto, pero el tipo generado por supabase-js lo declara
  // mas ancho de lo que es; el cast lo alinea con ProjectWithClient.
  return { data: (data ?? []) as unknown as ProjectWithClient[] };
}

async function listClients(): Promise<Query<Client[]>> {
  if (!supabaseAdmin) return { data: [] };

  const { data, error } = await supabaseAdmin
    .from('clients')
    .select('id, name, contact_name, email, whatsapp, created_at')
    .order('name');

  if (error) {
    console.error('No se pudieron leer los clientes:', error.message);
    return { error: error.message };
  }

  return { data: (data ?? []) as Client[] };
}

/**
 * Todas las etapas, agrupadas por proyecto.
 *
 * Una sola consulta en vez de una por fila del panel: son pocas filas (cinco por
 * proyecto) y asi la tabla no dispara N+1 consultas al abrirse.
 */
async function listStepsByProject(): Promise<Query<Record<string, ProjectStep[]>>> {
  if (!supabaseAdmin) return { data: {} };

  const { data, error } = await supabaseAdmin
    .from('project_steps')
    .select('id, project_id, position, name, description, status')
    .order('position');

  if (error) {
    console.error('No se pudieron leer las etapas:', error.message);
    return { error: error.message };
  }

  const grouped: Record<string, ProjectStep[]> = {};
  for (const step of (data ?? []) as ProjectStep[]) {
    (grouped[step.project_id] ??= []).push(step);
  }
  return { data: grouped };
}

/**
 * Datos de /seguimiento/[id]: el proyecto, su cliente y la ruta de trabajo.
 *
 * Devuelve null si el id no existe o no es un UUID valido. Esa pagina es publica
 * (el cliente entra sin clave), y lo unico que la protege es que el id sea
 * imposible de adivinar: por eso son UUID y no 1, 2, 3.
 */
export async function getTrackedProject(
  id: string
): Promise<{ project: ProjectWithClient; steps: ProjectStep[] } | null> {
  if (!supabaseAdmin) return null;

  // Postgres responde con error 22P02 si el texto no es un UUID. Se corta antes
  // para no gastar una consulta en cada /seguimiento/loquesea.
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isUuid) return null;

  const { data, error } = await supabaseAdmin
    .from('projects')
    .select(`${PROJECT_COLUMNS}, client:clients (id, name, contact_name)`)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('No se pudo leer el proyecto:', error.message);
    return null;
  }
  if (!data) return null;

  const { data: steps, error: stepsError } = await supabaseAdmin
    .from('project_steps')
    .select('id, project_id, position, name, description, status')
    .eq('project_id', id)
    .order('position');

  if (stepsError) {
    console.error('No se pudieron leer las etapas:', stepsError.message);
  }

  return {
    project: data as unknown as ProjectWithClient,
    steps: (steps ?? []) as ProjectStep[],
  };
}
