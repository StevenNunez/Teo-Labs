'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sparkles, Boxes, Cpu } from 'lucide-react';
import Link from 'next/link';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396 0 12.032c0 2.12.542 4.19 1.57 6.05L0 24l6.12-1.605a11.833 11.833 0 005.923 1.577h.005c6.632 0 12.032-5.396 12.036-12.032a11.84 11.84 0 00-3.528-8.511z"/>
  </svg>
);

// Las opciones siguen los dos carriles de la seccion de Servicios, para que el
// visitante encuentre lo mismo por los dos caminos.
const messageOptions = [
  {
    label: 'ERP o software a medida',
    icon: <Boxes className="h-4 w-4" />,
    message: 'Hola Teo Labs! Me interesa un ERP o software a medida para mi empresa. ¿Podemos agendar un diagnóstico?',
  },
  {
    label: 'Automatización & IA',
    icon: <Cpu className="h-4 w-4" />,
    message: 'Hola! Quiero saber cómo puedo automatizar procesos de mi empresa con IA.',
  },
  {
    label: 'Web o e-commerce',
    icon: <Sparkles className="h-4 w-4" />,
    message: 'Hola! Me interesa cotizar una página web o tienda online para mi negocio.',
  },
];

export default function WhatsAppButton() {
  const whatsappNumber = '56930938222';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          {/*
            Antes: circulo verde con `animate-bounce` infinito y un punto rojo
            pulsante arriba a la derecha. El punto imitaba la insignia de
            "mensaje sin leer" de WhatsApp sin que hubiera ningun mensaje: es un
            patron oscuro, y ademas gasta la unica alarma visual de la pagina en
            algo falso. El rebote perpetuo terminaba de restarle seriedad.

            Ahora es una pastilla que se expande al pasar el mouse y muestra la
            invitacion en texto. Llama la atencion por forma, no por ansiedad.
          */}
          {/*
            Tercera version de este boton. La anterior era una pastilla en
            #25D366 pleno: el verde saturado de WhatsApp es mas fuerte que el
            azul de los CTA, asi que el boton flotante terminaba siendo el
            elemento mas llamativo de la pagina — por encima de "Iniciar
            Proyecto", que es el que queremos que se aprete.

            Ahora es una pastilla neutra, del mismo material que las tarjetas
            (fondo `card` con hairline y blur). El verde queda solo en el icono,
            que alcanza de sobra para reconocer WhatsApp al instante. Al pasar
            el mouse se tine de verde: ahi si, porque ya hay intencion.
          */}
          {/*
            Vidrio en reposo, marca al tocarlo.
            En reposo es cristal puro: fondo translucido, hairline y blur, con
            el glifo en color de texto atenuado. Al pasar el mouse o enfocarlo
            con teclado se llena del verde oficial de WhatsApp (#25D366) y
            aparece la etiqueta.

            Por que asi: el verde pleno permanente era mas fuerte que el azul
            de los CTA, o sea que el boton flotante le ganaba a "Iniciar
            Proyecto". En vidrio no compite; y cuando hay intencion, la marca
            aparece completa y es inconfundible.
          */}
          {/*
            El logo va como MARCA, no como trazo.
            El intento anterior dibujaba el glifo monocromo al 70% de opacidad
            sobre el vidrio: a 24px eso se lee como un circulo vacio, porque
            WhatsApp se reconoce por el contraste verde/blanco y no por la
            silueta del telefono.

            Ahora el vidrio es el contenedor y adentro va la insignia real —
            disco verde #25D366 con el glifo blanco—, que es exactamente como
            se ve el logo oficial. Vidrio afuera, marca adentro: cumple las dos
            cosas sin sacrificar legibilidad.
          */}
          <Button
            aria-label="Contactar por WhatsApp"
            className="group h-14 w-14 rounded-full border border-border/70 bg-foreground/[0.06] p-0 text-foreground backdrop-blur-2xl transition-all duration-300 hover:w-auto hover:border-[#25D366]/60 hover:bg-[#25D366]/10 hover:pr-5 focus-visible:w-auto focus-visible:border-[#25D366]/60 focus-visible:bg-[#25D366]/10 focus-visible:pr-5 focus-visible:ring-2 focus-visible:ring-[#25D366]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="ml-[7px] flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform duration-300 group-hover:scale-105">
              <WhatsAppIcon className="h-[22px] w-[22px]" />
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-[15px] font-semibold opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:max-w-[180px] group-hover:opacity-100 group-focus-visible:ml-3 group-focus-visible:max-w-[180px] group-focus-visible:opacity-100">
              Hablemos por WhatsApp
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="end" className="w-72 p-0 overflow-hidden rounded-2xl border-border/50 shadow-2xl">
          <div className="bg-[#25D366] p-4 text-white">
            <p className="font-bold flex items-center gap-2">
              <WhatsAppIcon className="h-5 w-5" />
              ¿Cómo podemos ayudarte?
            </p>
            <p className="text-xs opacity-90 mt-1">Selecciona una opción para chatear:</p>
          </div>
          <div className="p-2 bg-card">
            {messageOptions.map((option, index) => (
              <Link
                key={index}
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(option.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {option.icon}
                </div>
                <span className="text-sm font-semibold">{option.label}</span>
              </Link>
            ))}
          </div>
          <div className="p-3 bg-muted/30 text-center">
            <p className="text-[10px] text-muted-foreground">Respuesta rápida · Teo Labs</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { WhatsAppIcon };
