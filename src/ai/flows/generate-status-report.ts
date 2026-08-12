'use server';
/**
 * @fileOverview Generador de reportes de avance para clientes.
 * 
 * - generateStatusReport: Crea un mensaje profesional para WhatsApp basado en el progreso.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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

export async function generateStatusReport(input: StatusReportInput) {
  const { output } = await statusReportPrompt(input);
  if (!output) throw new Error('No se pudo generar el reporte de estado');
  return output;
}
