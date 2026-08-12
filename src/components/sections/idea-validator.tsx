'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, ShieldCheck, Rocket, Loader2, Send, HelpCircle, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { validateIdea, type ConsultantOutput } from '@/ai/flows/validate-idea';
import { cn } from '@/lib/utils';
import SectionHeading from '@/components/ui/section-heading';

export default function IdeaValidator() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsultantOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConsult = async () => {
    if (!input.trim() || input.length < 5) return;
    setLoading(true);
    setError(null);
    try {
      const data = await validateIdea(input);
      setResult(data);
    } catch (err) {
      // Antes esto solo hacia console.error: si la IA fallaba (sin API key,
      // cuota agotada, timeout) el visitante apretaba el boton y no pasaba
      // nada. Parecia una pagina rota.
      console.error(err);
      setError(
        'No pudimos conectar con el consultor en este momento. Escríbenos por WhatsApp y te respondemos personalmente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-consultant" className="relative py-20 md:py-28 overflow-hidden bg-ink text-white">
      {/* Background Decor */}

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="AI Advisor"
            title="¿Dudas técnicas? Nuestra IA te explica"
            lead="¿No sabes qué es el hosting? ¿Dudas sobre el mantenimiento o los precios? Pregúntale a nuestro consultor experto."
          />

          <div className="grid gap-8 lg:grid-cols-5 items-start">
            <Card className="lg:col-span-2 bg-white/[0.04] border-white/10 backdrop-blur-xl rounded-panel overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-white/80 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    ¿En qué podemos orientarte?
                  </label>
                  <Textarea 
                    placeholder="Ej: ¿Qué es el hosting y por qué lo necesito? o ¿Cuánto cuesta mantener una web al año?..."
                    className="min-h-[180px] bg-black/40 border-white/10 text-white rounded-2xl focus:ring-primary/50 resize-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleConsult}
                  disabled={loading || input.length < 5}
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold  group transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Consultando experto...
                    </>
                  ) : (
                    <>
                      Consultar a Teo Labs
                      <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
                <div className="flex items-center gap-2 justify-center text-[10px] text-white/40 uppercase font-bold tracking-widest">
                  <ShieldCheck className="h-3 w-3" />
                  Respuesta en el momento
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-3 min-h-[400px]">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="p-8 rounded-panel bg-primary/[0.07] border border-primary/25 space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                           <Sparkles className="h-6 w-6" />
                         </div>
                         <div className="px-4 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30">
                           Respuesta Inmediata
                         </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-semibold text-primary uppercase tracking-widest">Explicación del Consultor</h4>
                        <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">{result.answer}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-6 pt-4 border-t border-white/5">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1 space-y-3">
                            <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                              <Rocket className="h-3 w-3" /> Servicio Recomendado
                            </h4>
                            <p className="text-sm font-bold text-white/80">{result.relatedService}</p>
                            <p className="text-[11px] text-white/40">{result.priceContext}</p>
                          </div>
                          <div className="flex-1 space-y-3 p-4 bg-primary/5 rounded-2xl border border-primary/15">
                            <h4 className="text-xs font-semibold text-green-400 uppercase tracking-widest flex items-center gap-2">
                              <Info className="h-3 w-3" /> Conclusión
                            </h4>
                            <p className="text-xs text-white/55 italic leading-relaxed whitespace-pre-wrap">
                              {result.salesPitch}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center pt-4">
                       <Button variant="link" className="text-primary font-bold hover:text-primary/80 text-lg" asChild>
                         <a href="https://wa.me/56930938222" target="_blank">¡Quiero empezar mi proyecto con Teo Labs ahora!</a>
                       </Button>
                    </div>
                  </motion.div>
                ) : error ? (
                  <div
                    role="alert"
                    className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-red-500/30 bg-red-500/5 rounded-panel"
                  >
                    <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                    <h3 className="text-xl font-bold text-white/90 mb-2">El consultor no está disponible</h3>
                    <p className="text-white/55 text-sm max-w-xs mb-6">{error}</p>
                    <Button asChild className="rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] font-bold">
                      <a href="https://wa.me/56930938222" target="_blank" rel="noopener noreferrer">
                        Hablar por WhatsApp
                      </a>
                    </Button>
                  </div>
                ) : (
                  // Antes: `opacity-50` + `text-slate-800` sobre `bg-slate-950`.
                  // El texto quedaba practicamente invisible.
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/15 rounded-panel">
                    <HelpCircle className="h-16 w-16 text-white/25 mb-4" />
                    <h3 className="text-xl font-bold text-white/80 mb-2">Resuelve tus dudas tecnológicas</h3>
                    <p className="text-white/55 text-sm max-w-xs">Escribe tu pregunta a la izquierda para recibir una asesoría experta de nuestra IA.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
