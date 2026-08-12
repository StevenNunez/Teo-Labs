'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquare, Sparkles, Rocket, Cpu } from 'lucide-react';
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

const messageOptions = [
  {
    label: 'Software a Medida',
    icon: <Rocket className="h-4 w-4" />,
    message: 'Hola Teo Labs! Me gustaría recibir información sobre el desarrollo de software a medida para mi empresa.',
  },
  {
    label: 'IA & Automatización',
    icon: <Cpu className="h-4 w-4" />,
    message: 'Hola! Quiero saber cómo puedo optimizar mis procesos actuales usando Inteligencia Artificial.',
  },
  {
    label: 'Páginas Web / E-commerce',
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
          <Button
            className="h-16 w-16 rounded-full bg-[#25D366] text-white shadow-2xl transition-all hover:scale-110 hover:bg-[#20ba5a] group animate-bounce"
            style={{ animationDuration: '3s' }}
          >
            <WhatsAppIcon className="h-9 w-9" />
            <span className="sr-only">Contactar por WhatsApp</span>
            <div className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-white"></span>
            </div>
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
