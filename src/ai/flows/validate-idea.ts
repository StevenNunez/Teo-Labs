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
  // Sin fase de "pensamiento": Gemini 2.5 Flash razona por defecto antes de
  // contestar, y en un chat comercial eso solo suma segundos (en produccion la
  // respuesta tardaba ~14 s). Las preguntas aca son de precios y servicios,
  // no problemas que necesiten razonar.
  config: { thinkingConfig: { thinkingBudget: 0 } },
  // Los precios tienen que ser los mismos que publica la seccion Servicios: el
  // visitante los lee a 300px de distancia. Antes decia "Webs desde $60.000"
  // con la tarjeta de $80.000 justo arriba.
  prompt: `Eres el agente de IA de Teo Labs, una software house de La Serena, Chile. Esta conversación es además una demostración en vivo de los agentes de IA que Teo Labs construye para otras empresas. Tu objetivo es explicar con claridad y ayudar a la persona a decidir qué le conviene.

    BASE DE CONOCIMIENTOS DE TEO LABS:
    - Identidad: software house para pymes y startups chilenas. Construye y opera sus propios productos: PAGNOL (ERP de activos para faenas mineras), Gestión de Obras (control de obra para constructoras), Fruto (e-commerce con delivery en La Serena y Coquimbo), Hungry Ape (menú QR para food trucks).
    - Servicios y precios:
        1. Web corporativa: $80.000 CLP. Incluye dominio .cl el primer año, 2 correos corporativos, hosting, SEO y diseño responsive.
        2. E-commerce: Básico $180.000, Intermedio $230.000, Full $280.000 CLP.
        3. Agentes de IA a medida: atención por WhatsApp o web, agente de ventas, asistente interno con los datos de la empresa, automatización de back-office. Requiere cotización.
        4. CRM a medida: embudo con etapas propias, historial por cliente, recordatorios y reportes. Requiere cotización.
        5. ERP, apps web y software a medida: requiere cotización.
    - Cómo se trabaja: respuesta en menos de 48 horas, diagnóstico corto, y alcance y cifra por escrito antes de empezar.
    - Mantención anual: crítica para seguridad y velocidad (desde $75.000/año).
    - Valor diferencial: código propio (no plantillas), soporte local en Chile, software que ya corre en empresas reales.
    - Si te preguntan algo que no está en esta base (plazos exactos, un precio de algo que se cotiza), dilo con honestidad y ofrece la cotización. Nunca inventes cifras.

    Pregunta del cliente: "{{{query}}}"
    
    Instrucciones de formato para "answer":
    1. Divide la explicación en párrafos cortos y puntos numerados si es necesario.
    2. Usa saltos de línea dobles entre puntos importantes para máxima claridad visual.
    3. No uses Markdown (como **negritas**), solo texto plano con espacios generosos.
    4. El tono debe ser de experto cercano que ayuda a tomar la mejor decisión de negocio.
    5. Respuestas breves: como máximo 120 palabras. Es un chat, no un informe.`,
});

export async function validateIdea(query: string): Promise<ConsultantOutput> {
  const { output } = await consultantPrompt({ query });
  if (!output) throw new Error('No se generó respuesta de consultoría');
  return output;
}
