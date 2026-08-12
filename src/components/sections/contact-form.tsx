'use client';

import { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm, type FormState } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Send, Loader2 } from 'lucide-react';

const initialState: FormState = {
  message: '',
  status: 'idle',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 group transition-all"
    >
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <span className="flex items-center gap-2">
          Enviar Mensaje Directo
          <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </span>
      )}
    </Button>
  );
}

export function ContactForm() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success') {
      toast({
        title: '¡Mensaje Enviado!',
        description: state.message,
      });
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-8 p-1">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tu Nombre</Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="Ej: Steven Silva" 
            required 
            className="h-12 rounded-xl border-border/50 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Correo Electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            required
            className="h-12 rounded-xl border-border/50 focus:ring-primary/50"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tu Mensaje o Desafío</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Cuéntanos sobre tu proyecto, objetivos o dudas técnicas..."
          className="min-h-[150px] rounded-2xl border-border/50 focus:ring-primary/50 resize-none"
          required
          minLength={10}
        />
      </div>

      {state.status === 'error' && (
        <Alert variant="destructive" className="rounded-2xl bg-destructive/5 border-destructive/20">
          <Terminal className="h-4 w-4" />
          <AlertTitle className="font-bold">Error de envío</AlertTitle>
          <AlertDescription className="font-medium text-xs">
            {state.message || 'No se pudo enviar tu mensaje. Inténtalo de nuevo más tarde.'}
          </AlertDescription>
        </Alert>
      )}
      
      <SubmitButton />
    </form>
  );
}
