'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { WhatsAppIcon } from '@/components/layout/whatsapp-button';
import { track } from '@/components/layout/analytics';

/**
 * WhatsApp con el mensaje ya escrito.
 *
 * Antes este bloque mostraba el numero y nada mas: ni era un enlace. El
 * visitante tenia que seleccionar +56 9 3093 8222, copiarlo, abrir WhatsApp,
 * crear el contacto y recien ahi escribir — cinco pasos para el canal que en
 * teoria es "directo". Ahora escribe aca y llega al chat con su mensaje puesto.
 *
 * El destino es un `<a>` con el href calculado del estado, no un
 * `window.open()` en un handler: asi funciona el clic con rueda y con Ctrl,
 * no lo bloquea ningun bloqueador de popups, y si el JS no cargo el enlace
 * sigue llevando al chat con el mensaje por defecto.
 */

const WHATSAPP_NUMBER = '56930938222';
const DISPLAY_NUMBER = '+56 9 3093 8222';

/** Lo que se envia si el visitante aprieta sin escribir nada. */
const FALLBACK = 'Hola Teo Labs! Quiero conversar sobre un proyecto.';

/**
 * Atajos para quien no sabe como empezar. Son los mismos tres caminos que
 * ofrece el boton flotante, para que el visitante encuentre lo mismo por los
 * dos lados. Rellenan el campo en vez de enviar de una: el mensaje sigue
 * siendo editable antes de salir.
 */
const STARTERS = [
  { label: 'ERP a medida', text: 'Hola Teo Labs! Necesito un ERP o sistema de gestión para mi empresa. ' },
  { label: 'Web o e-commerce', text: 'Hola! Quiero cotizar una página web o tienda online. ' },
  { label: 'Automatizar con IA', text: 'Hola! Quiero automatizar procesos de mi empresa con IA. ' },
];

export default function WhatsAppDirect() {
  const [message, setMessage] = useState('');

  const text = message.trim() || FALLBACK;
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  return (
    <div className="rounded-3xl border border-border/60 bg-canvas p-6 shadow-sm md:p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white">
          <WhatsAppIcon className="h-[22px] w-[22px]" />
        </span>
        <div className="min-w-0">
          <p className="font-headline text-lg font-bold leading-none">Escríbenos por WhatsApp</p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {DISPLAY_NUMBER} · sin formularios, respondemos en el día
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {STARTERS.map((starter) => (
          <button
            key={starter.label}
            type="button"
            onClick={() => setMessage(starter.text)}
            className="rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-foreground"
          >
            {starter.label}
          </button>
        ))}
      </div>

      <label className="mt-4 block">
        <span className="sr-only">Tu mensaje para Teo Labs por WhatsApp</span>
        <Textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          maxLength={900}
          placeholder="Hola, tengo una constructora y necesito controlar el avance de obra en terreno…"
          className="min-h-[96px] resize-none rounded-2xl text-[15px]"
        />
      </label>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('whatsapp_directo', { escribio: message.trim().length > 0 })}
        className="group mt-4 flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-6 font-bold text-white transition-colors hover:bg-[#1FB855] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Abrir el chat con este mensaje
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
