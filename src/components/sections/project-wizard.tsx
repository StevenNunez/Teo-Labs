'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Layout,
  Building2,
  ShoppingCart,
  Boxes,
  Brain,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { track } from '@/components/layout/analytics';

/**
 * Wizard de 3 pasos.
 *
 * Antes eran 7 y solo servian para webs: preguntaba "que tipo de WEB" con
 * cuatro opciones (portafolio, landing, e-commerce, corporativa) y despues
 * pedia secciones tipo "Inicio / Nosotros / Blog". Un gerente que venia a
 * cotizar un ERP no tenia por donde entrar; el proyecto mas valioso que
 * podemos vender no cabia en el formulario.
 *
 * Ademas el rango de presupuesto mas bajo era $300.000 mientras la seccion de
 * servicios ofrece webs desde $60.000: quien venia por eso tenia que declarar
 * cinco veces mas de lo que pensaba gastar, o abandonar.
 *
 * Lo que se saco (secciones, funcionalidades, estado del contenido, fecha
 * exacta) no se perdio: es informacion que se levanta mejor en la llamada, y
 * pedirla antes de tener el contacto costaba mas leads de los que aportaba.
 */

const wizardSchema = z.object({
  type: z.string().min(1, 'Cuéntanos qué necesitas'),
  budget: z.string().min(1, 'Elige un rango, o marca «Aún no lo defino»'),
  timeline: z.string().min(1, 'Elige un plazo'),
  name: z.string().min(2, 'Tu nombre es obligatorio'),
  email: z.string().email('Ingresa un email válido'),
  whatsapp: z.string().min(8, 'Ingresa un número válido'),
  message: z.string().optional(),
});

type WizardData = z.infer<typeof wizardSchema>;

/** Las dos primeras filas son presencia digital; las dos ultimas, software. */
const PROJECT_TYPES = [
  { id: 'Landing Page', icon: Layout, label: 'Landing page', hint: 'Una página para vender' },
  { id: 'Web Corporativa', icon: Building2, label: 'Web corporativa', hint: 'Presencia de tu empresa' },
  { id: 'E-commerce', icon: ShoppingCart, label: 'E-commerce', hint: 'Tienda con pagos online' },
  { id: 'App Web', icon: Smartphone, label: 'App web a medida', hint: 'Plataforma propia' },
  { id: 'ERP', icon: Boxes, label: 'ERP / Sistema de gestión', hint: 'Inventario, obras, activos' },
  { id: 'Automatización IA', icon: Brain, label: 'Automatización & IA', hint: 'Procesos que se repiten' },
];

/**
 * Rangos alineados con los precios reales del sitio (webs desde $60.000).
 * "Aún no lo defino" existe a proposito: obligar a declarar presupuesto antes
 * de hablar espanta justamente a los proyectos grandes que todavia no tienen
 * una cifra cerrada.
 */
const BUDGETS = [
  { id: 'hasta-150', label: 'Hasta $150.000' },
  { id: '150-500', label: '$150.000 – $500.000' },
  { id: '500-2000', label: '$500.000 – $2.000.000' },
  { id: 'mas-2000', label: 'Más de $2.000.000' },
  { id: 'indefinido', label: 'Aún no lo defino' },
];

const TIMELINES = [
  { id: 'urgente', label: 'Lo antes posible' },
  { id: '1-2-meses', label: 'En 1 a 2 meses' },
  { id: '3-mas', label: 'En 3 meses o más' },
  { id: 'explorando', label: 'Estoy explorando' },
];

const TOTAL_STEPS = 3;

const STEP_FIELDS: Record<number, (keyof WizardData)[]> = {
  1: ['type'],
  2: ['budget', 'timeline'],
  3: ['name', 'email', 'whatsapp'],
};

export default function ProjectWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const methods = useForm<WizardData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: { type: '', budget: '', timeline: '', message: '' },
  });

  const { watch, setValue, trigger, handleSubmit, formState: { errors } } = methods;
  const formData = watch();

  const progress = (step / TOTAL_STEPS) * 100;

  const nextStep = async () => {
    const isValid = await trigger(STEP_FIELDS[step]);
    if (!isValid) {
      // Tan importante como el avance: dice que pregunta esta frenando gente.
      track('wizard_step_bloqueado', { paso: step });
      return;
    }
    const next = Math.min(step + 1, TOTAL_STEPS);
    track('wizard_step', { paso: next, tipo: formData.type });
    setStep(next);
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Errores del paso actual. Sin esto, al apretar "Siguiente" sin elegir nada
  // no pasaba absolutamente nada y no habia forma de saber por que.
  const stepErrors = STEP_FIELDS[step]
    .map((field) => errors[field]?.message)
    .filter((message): message is string => typeof message === 'string');

  const onSubmit = async (data: WizardData) => {
    setIsSubmitting(true);
    try {
      if (supabase) {
        // Supabase no lanza: devuelve { error }. Si falla la copia en base de
        // datos igual seguimos, porque el mail es el canal que si o si tiene
        // que llegar.
        const { error } = await supabase.from('leads').insert([{
          name: data.name, email: data.email, whatsapp: data.whatsapp, project_details: data
        }]);
        if (error) console.error('No se pudo guardar el lead en Supabase:', error);
      }
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '8e3b89ba-2751-4a5e-bd0c-35c83d890645',
          subject: `NUEVO PROYECTO: ${data.name} (${data.type})`,
          from_name: 'Teo Labs Wizard',
          ...data,
          whatsapp: `+569${data.whatsapp}`,
        }),
      });
      // Antes un `if (response.ok)` sin else: si el envio fallaba, el boton
      // volvia a la normalidad y el visitante se quedaba mirando el formulario
      // sin saber que su solicitud nunca salio.
      if (!response.ok) throw new Error(`Web3Forms respondio ${response.status}`);

      setIsSuccess(true);
      track('lead_enviado', { tipo: data.type, presupuesto: data.budget, plazo: data.timeline });
      toast({ title: 'Solicitud enviada', description: 'Te contactamos en menos de 48 horas.' });
    } catch (e) {
      console.error('Fallo el envio del wizard:', e);
      track('lead_error');
      toast({
        variant: 'destructive',
        title: 'No pudimos enviar tu solicitud',
        description: 'Escríbenos por WhatsApp al +56 9 3093 8222 y lo vemos al tiro.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
        <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-3xl font-bold mb-4">¡Todo listo!</h3>
        <p className="text-muted-foreground mb-8">
          Revisamos tu solicitud y te escribimos por WhatsApp en menos de 48 horas.
        </p>
        <Button onClick={() => { setIsSuccess(false); setStep(1); methods.reset(); }} variant="outline" className="rounded-2xl px-8 h-12 font-semibold">
          Enviar otra
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-semibold text-primary uppercase tracking-[0.3em]">
            Paso {step} de {TOTAL_STEPS}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {step === 1 && 'Menos de 1 minuto'}
            {step === 2 && 'Ya casi'}
            {step === 3 && 'Último paso'}
          </span>
        </div>
        <Progress value={progress} className="h-2 transition-all duration-700 bg-muted/50" />
      </div>

      <div className="min-h-[360px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <FormProvider {...methods}>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">¿Qué necesitas construir?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PROJECT_TYPES.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => { setValue('type', opt.id); nextStep(); }}
                          className={cn(
                            'flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300 group',
                            formData.type === opt.id
                              ? 'border-primary bg-primary/5 shadow-lg'
                              : 'border-border/50 hover:border-primary/40 hover:bg-muted/30'
                          )}
                        >
                          <div className={cn(
                            'h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition-colors',
                            formData.type === opt.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground group-hover:text-primary'
                          )}>
                            <opt.icon className="h-5 w-5" />
                          </div>
                          <span className="space-y-0.5">
                            <span className="block text-sm font-bold leading-tight">{opt.label}</span>
                            <span className="block text-xs text-muted-foreground">{opt.hint}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold">¿Presupuesto estimado?</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {BUDGETS.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setValue('budget', b.label)}
                            className={cn(
                              'p-4 rounded-xl border-2 text-left transition-all text-sm font-semibold',
                              formData.budget === b.label
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border/50 hover:border-primary/40'
                            )}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl font-bold">¿Para cuándo?</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {TIMELINES.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setValue('timeline', t.label)}
                            className={cn(
                              'p-4 rounded-xl border-2 text-left transition-all text-sm font-semibold',
                              formData.timeline === t.label
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border/50 hover:border-primary/40'
                            )}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">¿Dónde te contactamos?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold uppercase tracking-widest">Nombre</Label>
                        <Input {...methods.register('name')} placeholder="Juan Pérez" className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold uppercase tracking-widest">WhatsApp</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">+569</span>
                          <Input {...methods.register('whatsapp')} inputMode="numeric" placeholder="12345678" className="h-12 rounded-xl pl-14" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-semibold uppercase tracking-widest">Email</Label>
                      <Input type="email" {...methods.register('email')} placeholder="juan@empresa.cl" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-semibold uppercase tracking-widest">
                        Cuéntanos tu desafío <span className="normal-case tracking-normal text-muted-foreground">(opcional)</span>
                      </Label>
                      <Textarea
                        {...methods.register('message')}
                        placeholder="Qué problema quieres resolver, con qué sistemas trabajas hoy, cuántas personas lo usarían..."
                        className="min-h-[110px] rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </form>
            </FormProvider>
          </motion.div>
        </AnimatePresence>
      </div>

      {stepErrors.length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <ul className="space-y-1 text-sm font-semibold text-destructive">
            {stepErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center pt-8 border-t border-border/50">
        <Button variant="ghost" onClick={prevStep} disabled={step === 1 || isSubmitting} className="rounded-2xl h-12 px-6 font-semibold">
          <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
        </Button>
        {step < TOTAL_STEPS ? (
          <Button onClick={nextStep} className="rounded-2xl h-12 px-10 bg-primary text-white font-semibold shadow-lg">
            Siguiente <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="rounded-2xl h-14 px-10 bg-primary text-white font-bold text-lg group">
            {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : (
              <span className="flex items-center gap-3">Enviar <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" /></span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
