'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Send, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateIdea, type ConsultantOutput } from '@/ai/flows/validate-idea';
import { track } from '@/components/layout/analytics';

/**
 * "Prueba un agente ahora".
 *
 * Antes era la seccion "Asesor IA", aparte y justo despues de Agentes: dos
 * secciones de IA seguidas, la segunda con medio panel de recuadro punteado
 * vacio y un boton que se veia deshabilitado hasta escribir. Ahora es la demo
 * de lo que vende la seccion de arriba: el visitante conversa con un agente
 * real y ve en primera persona lo que haria uno con los datos de su negocio.
 *
 * Usa el mismo flujo de siempre (`validateIdea`); solo cambio el encuadre.
 * Las preguntas sugeridas existen porque un cuadro de texto en blanco paraliza:
 * con un clic el visitante ya ve una respuesta.
 */

const SUGGESTIONS = [
  '¿Qué puede hacer un agente de IA por mi pyme?',
  '¿Cuánto cuesta una web corporativa?',
  '¿Necesito un CRM o me basta con Excel?',
];

export default function AgentDemo() {
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsultantOutput | null>(null);
  const [error, setError] = useState(false);

  const ask = async (text: string) => {
    const query = text.trim();
    if (query.length < 5 || loading) return;
    setQuestion(query);
    setInput('');
    setLoading(true);
    setError(false);
    setResult(null);
    track('agente_demo_pregunta');
    try {
      setResult(await validateIdea(query));
    } catch (err) {
      // Sin API key, cuota agotada o timeout: el visitante tiene que ver que
      // paso y tener otra salida, no un boton que no hace nada.
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16 lg:items-start">
      <div className="border-t border-border pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Demo en vivo</p>
        <h3 className="mt-3 font-headline text-2xl md:text-4xl font-bold tracking-tight">
          Prueba un agente ahora
        </h3>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
          Este agente conoce nuestros servicios y precios, igual que el tuyo conocería los de
          tu negocio. Pregúntale lo que quieras.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              disabled={loading}
              className="rounded-full border border-border bg-card px-4 py-2 text-left text-sm text-foreground/80 transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* La ventana de chat. Oscura en los dos temas, como el panel de arriba. */}
      <div className="dark rounded-panel border border-white/10 bg-ink text-white overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span>
            <span className="block text-sm font-bold">Agente Teo Labs</span>
            <span className="flex items-center gap-1.5 text-xs text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" /> En línea
            </span>
          </span>
        </div>

        <div className="min-h-[300px] space-y-4 p-5" aria-live="polite">
          <Bubble from="agent">
            Hola, soy el agente de Teo Labs. ¿En qué te ayudo? Puedo explicarte qué es cada
            servicio, cuánto cuesta y qué te conviene.
          </Bubble>

          {question && <Bubble from="user">{question}</Bubble>}

          {/* Sin mode="wait": con "wait" la respuesta esperaba a que terminara
              la animacion de salida del "Escribiendo…", y si la pestana quedaba
              en segundo plano (el navegador pausa las animaciones) no aparecia
              nunca. */}
          <AnimatePresence initial={false}>
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Bubble from="agent">
                  <span className="inline-flex items-center gap-2 text-white/60">
                    <Loader2 className="h-4 w-4 animate-spin" /> Escribiendo…
                  </span>
                </Bubble>
              </motion.div>
            )}

            {result && (
              <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <Bubble from="agent">
                  <span className="whitespace-pre-wrap">{result.answer}</span>
                </Bubble>
                <div className="ml-11 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm">
                  <p className="font-bold">{result.relatedService}</p>
                  <p className="mt-1 text-white/60">{result.priceContext}</p>
                  <Button asChild size="sm" className="mt-3 h-9 rounded-xl bg-white text-ink hover:bg-white/90 font-bold group">
                    <Link href="#contact">
                      Cotizar proyecto
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div key="error" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Bubble from="agent">
                  <span className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <span>
                      No pude responder en este momento.{' '}
                      <a
                        href="https://wa.me/56930938222"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold underline underline-offset-2"
                      >
                        Escríbenos por WhatsApp
                      </a>{' '}
                      y te responde una persona.
                    </span>
                  </span>
                </Bubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2 border-t border-white/10 p-3"
        >
          <label htmlFor="agent-demo-input" className="sr-only">
            Tu pregunta
          </label>
          <input
            id="agent-demo-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta…"
            className="h-11 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || input.trim().length < 5}
            aria-label="Enviar pregunta"
            className="h-11 w-11 shrink-0 rounded-xl bg-primary text-white hover:bg-primary/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}

function Bubble({ from, children }: { from: 'agent' | 'user'; children: React.ReactNode }) {
  if (from === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-white">{children}</p>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2">
      <span aria-hidden="true" className="h-8 w-8 shrink-0 rounded-full bg-brand-gradient opacity-90" />
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/[0.07] px-4 py-2.5 text-sm leading-relaxed text-white/90">
        {children}
      </div>
    </div>
  );
}
