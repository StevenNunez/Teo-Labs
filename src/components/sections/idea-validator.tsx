'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, ShieldCheck, Rocket, Loader2, Send, HelpCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { validateIdea, type ConsultantOutput } from '@/ai/flows/validate-idea';
import { cn } from '@/lib/utils';

export default function IdeaValidator() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsultantOutput | null>(null);

  const handleConsult = async () => {
    if (!input.trim() || input.length < 5) return;
    setLoading(true);
    try {
      const data = await validateIdea(input);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-consultant" className="relative py-24 overflow-hidden bg-slate-950">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#3b82f610,transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <Brain className="h-4 w-4" />
              Asistente de Consultoría Teo Labs
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-headline text-white tracking-tight leading-none">
              ¿Dudas Técnicas? <br />
              <span className="text-blue-500">Nuestra IA te explica</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              ¿No sabes qué es el hosting? ¿Dudas sobre el mantenimiento o los precios? Pregúntale a nuestro consultor experto.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5 items-start">
            <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 backdrop-blur-xl rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-400" />
                    ¿En qué podemos orientarte?
                  </label>
                  <Textarea 
                    placeholder="Ej: ¿Qué es el hosting y por qué lo necesito? o ¿Cuánto cuesta mantener una web al año?..."
                    className="min-h-[180px] bg-slate-950/50 border-slate-800 text-slate-200 rounded-2xl focus:ring-blue-500/50 resize-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleConsult}
                  disabled={loading || input.length < 5}
                  className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xl shadow-blue-500/20 group transition-all"
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
                <div className="flex items-center gap-2 justify-center text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                  <ShieldCheck className="h-3 w-3" />
                  Asesoría 100% Profesional
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
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                           <Sparkles className="h-6 w-6" />
                         </div>
                         <div className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30">
                           Respuesta Inmediata
                         </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">Explicación del Consultor</h4>
                        <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap">{result.answer}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-6 pt-4 border-t border-white/5">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1 space-y-3">
                            <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                              <Rocket className="h-3 w-3" /> Servicio Recomendado
                            </h4>
                            <p className="text-sm font-bold text-slate-300">{result.relatedService}</p>
                            <p className="text-[11px] text-slate-500">{result.priceContext}</p>
                          </div>
                          <div className="flex-1 space-y-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                            <h4 className="text-xs font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                              <Info className="h-3 w-3" /> Conclusión
                            </h4>
                            <p className="text-xs text-slate-400 italic leading-relaxed whitespace-pre-wrap">
                              {result.salesPitch}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center pt-4">
                       <Button variant="link" className="text-blue-400 font-bold hover:text-blue-300 text-lg" asChild>
                         <a href="https://wa.me/56930938222" target="_blank">¡Quiero empezar mi proyecto con Teo Labs ahora!</a>
                       </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-[2rem] opacity-50">
                    <HelpCircle className="h-16 w-16 text-slate-800 mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Resuelve tus dudas tecnológicas</h3>
                    <p className="text-slate-800 text-sm max-w-xs">Escribe tu pregunta a la izquierda para recibir una asesoría experta de nuestra IA.</p>
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
