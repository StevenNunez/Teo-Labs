'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Globe, 
  ShoppingCart, 
  Building2, 
  Layout, 
  Target, 
  Eye, 
  MessageSquare, 
  DollarSign, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  Calendar,
  Wallet,
  Check,
  User,
  Mail,
  Send,
  Loader2,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const wizardSchema = z.object({
  type: z.string().min(1, "Selecciona un tipo de web"),
  goal: z.string().min(1, "Selecciona un objetivo"),
  sections: z.array(z.string()).min(1, "Selecciona al menos una sección"),
  contentStatus: z.string().min(1, "Selecciona el estado de tu contenido"),
  features: z.array(z.string()).min(1, "Selecciona al menos una funcionalidad"),
  deadline: z.string().min(1, "La fecha es obligatoria"),
  budget: z.string().min(1, "Selecciona un presupuesto"),
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Ingresa un email válido"),
  whatsapp: z.string().min(8, "Ingresa un número válido"),
  message: z.string().optional()
});

type WizardData = z.infer<typeof wizardSchema>;

const WEB_TYPES = [
  { id: 'Portafolio', icon: Globe, label: 'Web Portafolio' },
  { id: 'Landing Page', icon: Layout, label: 'Landing Page' },
  { id: 'E-commerce', icon: ShoppingCart, label: 'E-commerce Pro' },
  { id: 'Corporativa', icon: Building2, label: 'Web Corporativa' },
];

const GOALS = [
  { id: 'Clientes', icon: Target, label: 'Captar Clientes' },
  { id: 'Trabajos', icon: Eye, label: 'Mostrar Trabajos' },
  { id: 'Mensajes', icon: MessageSquare, label: 'Atención Directa' },
  { id: 'Ventas', icon: DollarSign, label: 'Ventas Online' },
];

const SECTIONS = ['Inicio', 'Nosotros', 'Portafolio', 'Servicios', 'Blog', 'Contacto'];

const CONTENT_STATUS = [
  { id: 'Completo', label: 'Tengo logo y textos listos' },
  { id: 'Solo Logo', label: 'Solo tengo mi logotipo' },
  { id: 'Ayuda', label: 'Necesito ayuda con todo' },
];

const FEATURES = [
  { id: 'WhatsApp', icon: MessageSquare, label: 'Botón WhatsApp' },
  { id: 'Formulario', icon: Mail, label: 'Formularios CRM' },
  { id: 'Pagos', icon: DollarSign, label: 'Pagos en Línea' },
  { id: 'Galería', icon: Layout, label: 'Galería Interactiva' },
];

const BUDGETS = [
  { id: '300-500', label: '$300.000 - $500.000.-' },
  { id: '500-1000', label: '$500.000 - $1.000.000.-' },
  { id: '1000-2000', label: '$1.000.000 - $2.000.000.-' },
  { id: '2000+', label: '+$2.000.000.-' },
];

export default function ProjectWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const methods = useForm<WizardData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      sections: [],
      features: [],
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
  });

  const { watch, setValue, trigger, handleSubmit, formState: { errors } } = methods;
  const formData = watch();

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['type'];
    if (step === 2) fieldsToValidate = ['goal'];
    if (step === 3) fieldsToValidate = ['sections'];
    if (step === 4) fieldsToValidate = ['contentStatus'];
    if (step === 5) fieldsToValidate = ['features'];
    if (step === 6) fieldsToValidate = ['deadline', 'budget'];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const onSubmit = async (data: WizardData) => {
    setIsSubmitting(true);
    try {
      if (supabase) {
        await supabase.from('leads').insert([{ 
          name: data.name, email: data.email, whatsapp: data.whatsapp, project_details: data 
        }]);
      }
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '8e3b89ba-2751-4a5e-bd0c-35c83d890645',
          subject: `NUEVO PROYECTO: ${data.name} (${data.type})`,
          from_name: 'Teo Labs Wizard',
          ...data,
          whatsapp: `+569${data.whatsapp}`
        }),
      });
      if (response.ok) {
        setIsSuccess(true);
        toast({ title: "Propuesta enviada", description: "Te contactaremos en breve." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Error al enviar" });
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
        <h3 className="text-3xl font-black mb-4">¡Todo listo!</h3>
        <p className="text-muted-foreground font-medium mb-8">Un experto de Teo Labs revisará tus datos y te contactará por WhatsApp.</p>
        <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-2xl px-8 h-12 font-bold">Enviar otro</Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Paso {step} de {totalSteps}</span>
          <span className="text-xs font-bold text-muted-foreground">{Math.round(progress)}% Completado</span>
        </div>
        <Progress value={progress} className="h-2 transition-all duration-700 bg-muted/50" />
      </div>

      <div className="min-h-[380px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormProvider {...methods}>
              <form className="space-y-6">
                {step === 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    {WEB_TYPES.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => { setValue('type', opt.id); nextStep(); }}
                        className={cn(
                          "flex flex-col items-center justify-center p-6 h-44 rounded-[2rem] border-2 transition-all duration-300 group",
                          formData.type === opt.id ? "border-primary bg-primary/5 shadow-xl" : "border-border/50 hover:border-primary/30"
                        )}
                      >
                        <opt.icon className={cn("h-10 w-10 mb-4 transition-transform group-hover:scale-110", formData.type === opt.id ? "text-primary" : "text-muted-foreground")} />
                        <span className="font-black text-xs uppercase tracking-widest text-center">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="grid grid-cols-2 gap-4">
                    {GOALS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => { setValue('goal', opt.id); nextStep(); }}
                        className={cn(
                          "flex flex-col items-center justify-center p-6 h-44 rounded-[2rem] border-2 transition-all duration-300 group",
                          formData.goal === opt.id ? "border-primary bg-primary/5 shadow-xl" : "border-border/50 hover:border-primary/30"
                        )}
                      >
                        <opt.icon className={cn("h-10 w-10 mb-4 transition-transform group-hover:scale-110", formData.goal === opt.id ? "text-primary" : "text-muted-foreground")} />
                        <span className="font-black text-xs uppercase tracking-widest text-center">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="grid grid-cols-2 gap-3">
                    {SECTIONS.map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => {
                          const current = formData.sections || [];
                          setValue('sections', current.includes(sec) ? current.filter(s => s !== sec) : [...current, sec]);
                        }}
                        className={cn(
                          "flex items-center justify-between p-5 rounded-2xl border-2 transition-all",
                          formData.sections?.includes(sec) ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                        )}
                      >
                        <span className="text-sm font-bold">{sec}</span>
                        {formData.sections?.includes(sec) && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    {CONTENT_STATUS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => { setValue('contentStatus', opt.id); nextStep(); }}
                        className={cn(
                          "w-full flex items-center justify-between p-7 rounded-[2rem] border-2 transition-all text-left",
                          formData.contentStatus === opt.id ? "border-primary bg-primary/5 shadow-md" : "border-border/50 hover:border-primary/30"
                        )}
                      >
                        <span className="font-black text-sm uppercase tracking-widest">{opt.label}</span>
                        <ChevronRight className="h-5 w-5 text-primary" />
                      </button>
                    ))}
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-3">
                    {FEATURES.map((feat) => (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => {
                          const current = formData.features || [];
                          setValue('features', current.includes(feat.id) ? current.filter(f => f !== feat.id) : [...current, feat.id]);
                        }}
                        className={cn(
                          "flex items-center gap-5 p-5 rounded-[1.5rem] border-2 transition-all",
                          formData.features?.includes(feat.id) ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                        )}
                      >
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", formData.features?.includes(feat.id) ? "bg-primary text-white" : "bg-muted")}>
                          <feat.icon className="h-5 w-5" />
                        </div>
                        <span className="flex-1 text-left font-bold">{feat.label}</span>
                        {formData.features?.includes(feat.id) && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </button>
                    ))}
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> Fecha Límite
                      </Label>
                      <Input type="date" {...methods.register('deadline')} className="h-14 rounded-2xl border-2 font-bold" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Wallet className="h-3 w-3" /> Presupuesto Estimado
                      </Label>
                      <div className="grid grid-cols-1 gap-2">
                        {BUDGETS.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setValue('budget', b.label)}
                            className={cn(
                              "p-4 rounded-xl border-2 text-left transition-all font-bold text-sm",
                              formData.budget === b.label ? "border-primary bg-primary/5 shadow-sm" : "border-border/50 hover:border-primary/30"
                            )}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 7 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">Nombre</Label>
                        <Input {...methods.register('name')} placeholder="Juan Pérez" className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">WhatsApp</Label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">+569</span>
                           <Input {...methods.register('whatsapp')} placeholder="12345678" className="h-12 rounded-xl pl-14" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest">Email</Label>
                      <Input type="email" {...methods.register('email')} placeholder="juan@empresa.cl" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest">Detalles Extras</Label>
                      <Textarea {...methods.register('message')} placeholder="Cuéntanos más sobre tu idea..." className="min-h-[100px] rounded-xl" />
                    </div>
                  </div>
                )}
              </form>
            </FormProvider>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-border/50">
        <Button variant="ghost" onClick={prevStep} disabled={step === 1 || isSubmitting} className="rounded-2xl h-12 px-8 font-bold">
          <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
        </Button>
        {step < totalSteps ? (
          <Button onClick={nextStep} className="rounded-2xl h-12 px-10 bg-primary text-white font-bold shadow-lg shadow-primary/20">
            Siguiente <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="rounded-2xl h-14 px-12 bg-primary text-white font-black text-lg shadow-2xl shadow-primary/20 group">
            {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : (
              <span className="flex items-center gap-3">Enviar Solicitud <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" /></span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
