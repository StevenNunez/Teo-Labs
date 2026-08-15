'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { DEFAULT_STEPS } from '@/lib/admin-types';

/**
 * Escrituras del panel interno.
 *
 * Corren solo en el servidor y usan la service_role key, que se salta RLS. Lo
 * que las protege es src/middleware.ts: /admin exige Basic Auth, y las Server
 * Actions de esta pagina se invocan como POST a la misma ruta, asi que pasan por
 * el mismo control. Si algun dia se mueve el matcher del middleware, estas
 * funciones quedan abiertas: van juntas.
 */

type ActionResult = { ok: true; id?: string } | { ok: false; message: string };

/** Los inputs vacios llegan como '' y en la base tienen que ser NULL, no ''. */
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === '' ? null : value))
  .nullable();

const optionalDate = optionalText.refine(
  (value) => value === null || /^\d{4}-\d{2}-\d{2}$/.test(value),
  'Fecha inválida'
);

const optionalAmount = z
  .union([z.string(), z.number(), z.null()])
  .transform((value) => {
    if (value === null || value === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.round(parsed) : null;
  });

const projectFields = z.object({
  name: z.string().trim().min(2, 'El nombre del proyecto es obligatorio'),
  type: z.string().trim().min(1, 'Elige un tipo de proyecto'),
  status: z.enum(['in_progress', 'active', 'paused', 'finished']),
  payment: z.enum(['pending', 'partial', 'paid']),
  progress: z.coerce.number().int().min(0).max(100),
  current_step: optionalText,
  next_milestone: optionalText,
  delivery_date: optionalDate,
  maintenance_until: optionalDate,
  amount_clp: optionalAmount,
  prototype_url: optionalText,
  notes: optionalText,
});

/**
 * Al crear, el cliente puede ser uno existente o uno nuevo que se escribe ahi
 * mismo. Sin esto habria que ir a Supabase a crear el cliente antes de poder
 * cargar su proyecto.
 */
const createSchema = projectFields.and(
  z.union([
    z.object({
      clientMode: z.literal('existing'),
      client_id: z.string().uuid('Elige un cliente'),
    }),
    z.object({
      clientMode: z.literal('new'),
      client_name: z.string().trim().min(2, 'El nombre del cliente es obligatorio'),
      contact_name: optionalText,
      client_email: optionalText,
      client_whatsapp: optionalText,
    }),
  ])
);

const updateSchema = projectFields.extend({
  id: z.string().uuid(),
  client_id: z.string().uuid('Elige un cliente'),
});

/** Mensaje legible a partir del primer error de zod. */
function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Revisa los datos del formulario';
}

export async function createProject(input: unknown): Promise<ActionResult> {
  if (!supabaseAdmin) {
    return { ok: false, message: 'La base de datos no está configurada.' };
  }

  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const data = parsed.data;

  let clientId: string;
  if (data.clientMode === 'existing') {
    clientId = data.client_id;
  } else {
    const { data: created, error } = await supabaseAdmin
      .from('clients')
      .insert({
        name: data.client_name,
        contact_name: data.contact_name,
        email: data.client_email,
        whatsapp: data.client_whatsapp,
      })
      .select('id')
      .single();

    if (error || !created) {
      console.error('No se pudo crear el cliente:', error?.message);
      return { ok: false, message: 'No se pudo crear el cliente.' };
    }
    clientId = created.id;
  }

  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .insert({
      client_id: clientId,
      name: data.name,
      type: data.type,
      status: data.status,
      payment: data.payment,
      progress: data.progress,
      current_step: data.current_step,
      next_milestone: data.next_milestone,
      delivery_date: data.delivery_date,
      maintenance_until: data.maintenance_until,
      amount_clp: data.amount_clp,
      prototype_url: data.prototype_url,
      notes: data.notes,
    })
    .select('id')
    .single();

  if (error || !project) {
    console.error('No se pudo crear el proyecto:', error?.message);
    return { ok: false, message: 'No se pudo crear el proyecto.' };
  }

  // La ruta de trabajo por defecto. Si falla, el proyecto igual queda creado:
  // las etapas se pueden agregar despues y no vale la pena perder la carga.
  const { error: stepsError } = await supabaseAdmin.from('project_steps').insert(
    DEFAULT_STEPS.map((step, index) => ({
      project_id: project.id,
      position: index + 1,
      name: step.name,
      description: step.description,
      status: index === 0 ? 'in_progress' : 'pending',
    }))
  );
  if (stepsError) {
    console.error('No se pudieron crear las etapas:', stepsError.message);
  }

  revalidatePath('/admin');
  revalidatePath(`/seguimiento/${project.id}`);
  return { ok: true, id: project.id };
}

export async function updateProject(input: unknown): Promise<ActionResult> {
  if (!supabaseAdmin) {
    return { ok: false, message: 'La base de datos no está configurada.' };
  }

  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const { id, ...fields } = parsed.data;

  const { error } = await supabaseAdmin.from('projects').update(fields).eq('id', id);

  if (error) {
    console.error('No se pudo actualizar el proyecto:', error.message);
    return { ok: false, message: 'No se pudo guardar el proyecto.' };
  }

  revalidatePath('/admin');
  revalidatePath(`/seguimiento/${id}`);
  return { ok: true, id };
}

const stepSchema = z.object({
  stepId: z.string().uuid(),
  projectId: z.string().uuid(),
  status: z.enum(['pending', 'in_progress', 'completed']),
});

/** Mueve una etapa de la ruta de trabajo; es lo que ve el cliente cambiar. */
export async function updateStepStatus(input: unknown): Promise<ActionResult> {
  if (!supabaseAdmin) {
    return { ok: false, message: 'La base de datos no está configurada.' };
  }

  const parsed = stepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const { stepId, projectId, status } = parsed.data;

  const { error } = await supabaseAdmin
    .from('project_steps')
    .update({ status })
    .eq('id', stepId)
    .eq('project_id', projectId);

  if (error) {
    console.error('No se pudo actualizar la etapa:', error.message);
    return { ok: false, message: 'No se pudo actualizar la etapa.' };
  }

  revalidatePath('/admin');
  revalidatePath(`/seguimiento/${projectId}`);
  return { ok: true, id: stepId };
}
