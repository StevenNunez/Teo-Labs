import { Monitor, GitBranch, Database, Server } from 'lucide-react';

/**
 * Visual de la seccion "Nosotros".
 *
 * Reemplaza a una foto de banco de un equipo generico en una oficina, que
 * ademas venia con un alt que afirmaba ser el equipo de Teo Labs. Para una casa
 * de software esa foto no dice nada: es la misma que usan mil consultoras.
 *
 * Esto es un diagrama, no una captura: no simula ser producto real, muestra las
 * capas que efectivamente construimos. Ilustra sin mentir.
 */

const LAYERS = [
  {
    icon: Monitor,
    label: 'Interfaz',
    detail: 'Lo que usa tu equipo, en oficina y en terreno',
  },
  {
    icon: GitBranch,
    label: 'Lógica de negocio',
    detail: 'Tus reglas, no las de un software genérico',
  },
  {
    icon: Database,
    label: 'Datos y trazabilidad',
    detail: 'Cada movimiento queda registrado y auditable',
  },
  {
    icon: Server,
    label: 'Infraestructura',
    detail: 'Corre 24/7, con o sin señal en faena',
  },
];

export default function StackVisual() {
  return (
    // `dark` por la misma razon que en idea-validator.tsx: el panel es oscuro en
    // los dos temas y `text-primary` tiene que resolver al azul del tema oscuro.
    <div className="dark relative w-full overflow-hidden bg-ink p-8 md:p-10">
      {/* Resplandor de marca y grilla tecnica */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,#2563EB30,transparent_55%),radial-gradient(circle_at_85%_100%,#22C55E20,transparent_55%)]" />

      {/* pb-24 reserva el hueco de la tarjeta "Resultados Reales", que va
          posicionada absoluta encima (ver about.tsx). Sin esto se montaria
          sobre la ultima capa ahora que el alto lo define el contenido. */}
      <div className="relative flex flex-col gap-3 pb-24">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">
          Lo que construimos
        </p>

        {LAYERS.map((layer, index) => (
          <div key={layer.label} className="relative">
            {/* Linea que conecta las capas, con el gradiente de marca */}
            {index < LAYERS.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-[27px] top-[54px] h-[calc(100%-42px)] w-px bg-gradient-to-b from-primary/50 to-transparent"
              />
            )}

            <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition-colors hover:border-primary/30">
              <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/15">
                <layer.icon className="h-[18px] w-[18px] text-primary" />
              </div>
              <div className="min-w-0 space-y-1 pt-0.5">
                <p className="font-headline text-[15px] font-bold leading-none text-white">
                  {layer.label}
                </p>
                <p className="text-[12px] leading-snug text-white/45">{layer.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
