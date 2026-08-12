'use server';
/**
 * @fileOverview Consultor de IA para educar a prospectos sobre servicios de Teo Labs.
 * 
 * - validateIdea - Responde dudas sobre hosting, dominios, mantenimiento y servicios.
 * Utiliza la base de conocimientos de docs/business-info.md (emulada en el prompt).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ConsultantInputSchema = z.object({
  query: z.string().describe('La duda o pregunta del cliente sobre tecnología o servicios.'),
});

const ConsultantOutputSchema = z.object({
  answer: z.string().describe('Explicación clara, estructurada con saltos de línea y educativa sobre el tema solicitado.'),
  relatedService: z.string().describe('El servicio de Teo Labs que resuelve esta necesidad.'),
  priceContext: z.string().describe('Mención sutil de precios base o modalidad de cotización.'),
  salesPitch: z.string().describe('Un cierre persuasivo que invite a contactar por WhatsApp.'),
});

export type ConsultantOutput = z.infer<typeof ConsultantOutputSchema>;

const consultantPrompt = ai.definePrompt({
  name: 'consultantPrompt',
  input: { schema: ConsultantInputSchema },
  output: { schema: ConsultantOutputSchema },
  prompt: `Actúa como el Consultor Senior de Ventas de Teo Labs en Chile. Tu objetivo es educar al cliente de forma extremadamente clara y cerrar la venta.
    
    BASE DE CONOCIMIENTOS DE TEO LABS:
    - Identidad: Agencia de software premium para Pymes y Startups.
    - Servicios: 
        1. Webs Corporativas (Desde $60.000 + Dominio).
        2. E-commerce Pro (Desde $180.000 hasta $280.000).
        3. Software a medida (Apps, ERP, CRM, IA) -> Requiere cotización.
    - Hosting: Alta velocidad incluido el primer año en todos los planes.
    - Dominio .cl: Lo gestionamos nosotros ($20.000 el primer año en Plan Pyme).
    - Mantención Anual: Crítica para seguridad y velocidad (Desde $75.000/año).
    - Valor Diferencial: Código propio (no plantillas), optimización SEO real, soporte local en Chile.

    Pregunta del cliente: "{{{query}}}"
    
    Instrucciones de formato para "answer":
    1. Divide la explicación en párrafos cortos y puntos numerados si es necesario.
    2. Usa saltos de línea dobles entre puntos importantes para máxima claridad visual.
    3. No uses Markdown (como **negritas**), solo texto plano con espacios generosos.
    4. El tono debe ser de experto cercano que ayuda a tomar la mejor decisión de negocio.`,
});

export async function validateIdea(query: string): Promise<ConsultantOutput> {
  const { output } = await consultantPrompt({ query });
  if (!output) throw new Error('No se generó respuesta de consultoría');
  return output;
}
