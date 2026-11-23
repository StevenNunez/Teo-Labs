'use server';
/**
 * @fileOverview Generador de reportes de avance para clientes.
 * 
 * - generateStatusReport: Crea un mensaje profesional para WhatsApp basado en el progreso.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { isAdminRequest } from '@/lib/admin-guard';
import { anotarError } from '@/lib/errores-servidor';

const StatusReportInputSchema = z.object({
  projectName: z.string(),
  clientName: z.string(),
  progress: z.number(),
  currentStep: z.string(),
  nextMilestone: z.string(),
});

export type StatusReportInput = z.infer<typeof StatusReportInputSchema>;

const StatusReportOutputSchema = z.object({
  message: z.string().describe('El mensaje formateado para WhatsApp.'),
});

const statusReportPrompt = ai.definePrompt({
  name: 'statusReportPrompt',
  input: { schema: StatusReportInputSchema },
  output: { schema: StatusReportOutputSchema },
  prompt: `Actúa como un Project Manager experto de Teo Labs, una agencia de desarrollo de software premium en Chile.
    
    Tu tarea es redactar un mensaje de actualización para un cliente por WhatsApp. 
    El tono debe ser profesional, cercano y generar mucha confianza.
    
    Datos del proyecto:
    - Cliente: {{{clientName}}}
    - Proyecto: {{{projectName}}}
    - Progreso actual: {{{progress}}}%
    - Tarea actual: {{{currentStep}}}
    - Próximo hito: {{{nextMilestone}}}
    
    Usa emojis de tecnología (🚀, 💻, ✅) y menciona que el seguimiento en tiempo real está disponible en su link personalizado.
    El mensaje debe ser conciso, impactante y terminar reforzando el compromiso de Teo Labs.`,
});

/** Solo desde el panel: gasta la clave de Gemini y no tiene sentido para nadie mas. */
export async function generateStatusReport(input: StatusReportInput) {
  if (!(await isAdminRequest())) throw new Error('No autorizado.');
  const datos = StatusReportInputSchema.parse(input);
  try {
    const { output } = await statusReportPrompt(datos);
    if (!output) throw new Error('No se pudo generar el reporte de estado');
    return output;
  } catch (e) {
    await anotarError({ origen: 'servidor', donde: 'ia/informe-de-estado', error: e });
    throw e;
  }
}
