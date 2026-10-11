'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Truck,
  Package,
  Map as MapIcon,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  Box,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DemoBar, DemoCredit, demoAction } from '@/components/demo/demo-kit';

/**
 * Demo de panel de logistica.
 *
 * Correcciones de 2026-10-10:
 * - El mapa decia "Cargando mapa dinamico de unidades..." para siempre: se leia
 *   como una pagina rota. Ahora es un mapa dibujado de la ruta norte-sur con
 *   los camiones en movimiento.
 * - "Incidentes -50%" y "T. promedio -8%" salian en rojo: bajar ahi es bueno.
 *   El color ahora depende de si el cambio es bueno, no del signo.
 * - El buscador media 384px fijos y se salia de la pantalla en celular.
 */

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Envíos activos', icon: Box },
  { label: 'Flota', icon: Truck },
  { label: 'Rutas', icon: MapIcon },
  { label: 'Reportes', icon: TrendingUp },
];

const KPIS = [
  { title: 'En camino', value: '142', change: '+12%', good: true, icon: <Truck className="text-blue-500" /> },
  { title: 'Entregados hoy', value: '48', change: '+5%', good: true, icon: <Package className="text-emerald-500" /> },
  { title: 'Incidentes', value: '2', change: '-50%', good: true, icon: <Bell className="text-red-500" /> },
  { title: 'Tiempo promedio', value: '45 min', change: '-8%', good: true, icon: <TrendingUp className="text-purple-500" /> },
];

const DELIVERIES = [
  { id: '#TRK-902', dest: 'Santiago', status: 'Entregado' },
  { id: '#TRK-903', dest: 'La Serena', status: 'En ruta' },
  { id: '#TRK-904', dest: 'Antofagasta', status: 'Pendiente' },
  { id: '#TRK-905', dest: 'Viña del Mar', status: 'Entregado' },
];

const STATUS_STYLE: Record<string, string> = {
  Entregado: 'bg-emerald-500/10 text-emerald-400',
  'En ruta': 'bg-blue-500/10 text-blue-400',
  Pendiente: 'bg-amber-500/10 text-amber-400',
};

// Ruta norte-sur (coordenadas del dibujo, no geograficas exactas).
const CITIES = [
  { name: 'Antofagasta', x: 120, y: 40 },
  { name: 'Copiapó', x: 132, y: 120 },
  { name: 'La Serena', x: 126, y: 190 },
  { name: 'Viña del Mar', x: 112, y: 270 },
  { name: 'Santiago', x: 150, y: 290 },
  { name: 'Concepción', x: 120, y: 370 },
];
const ROUTE = 'M120 40 C 140 80, 128 100, 132 120 S 120 170, 126 190 S 104 250, 112 270 S 150 280, 150 290 S 118 340, 120 370';

function FleetMap() {
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 300 410" className="h-full w-full" role="img" aria-label="Mapa de la flota en la ruta Antofagasta–Concepción">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#1e293b" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="300" height="410" fill="url(#grid)" />
        {/* costa */}
        <path d="M92 0 C 100 90, 96 160, 92 230 S 84 330, 90 410" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 6" />
        <text x="40" y="200" fill="#475569" fontSize="10" transform="rotate(-90 40 200)">Océano Pacífico</text>
        <path id="ruta" d={ROUTE} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        {CITIES.map((c) => (
          <g key={c.name}>
            <circle cx={c.x} cy={c.y} r="5" fill="#0f172a" stroke="#60a5fa" strokeWidth="2" />
            <text x={c.x + 12} y={c.y + 4} fill="#cbd5e1" fontSize="11" fontWeight="600">{c.name}</text>
          </g>
        ))}
        {/* camiones recorriendo la ruta */}
        {[0, 2.6, 5.2].map((delay, i) => (
          <circle key={i} r="6" fill={i === 1 ? '#22c55e' : '#f8fafc'} stroke="#2563eb" strokeWidth="2">
            <animateMotion dur="8s" begin={`-${delay}s`} repeatCount="indefinite" rotate="auto">
              <mpath href="#ruta" />
            </animateMotion>
          </circle>
        ))}
      </svg>
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-lg bg-slate-950/80 px-3 py-2 text-[10px] text-slate-300">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-50" /> En ruta</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Por llegar</span>
        <span>3 unidades visibles · actualizado hace 1 min</span>
      </div>
    </div>
  );
}

export default function LogisticaDemo() {
  const [active, setActive] = useState('Dashboard');
  const [query, setQuery] = useState('');

  const openView = (label: string) => {
    setActive(label);
    if (label !== 'Dashboard') {
      demoAction(label, `En el sistema real, "${label}" abre su propia vista con datos de la operación.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
      <DemoBar business="Panel de logística ficticio" />

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-800 hidden lg:flex flex-col p-6 space-y-10">
          <div className="flex items-center gap-3 text-white">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Truck size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">LogiExpress</span>
          </div>

          <nav className="flex-1 space-y-2">
            {NAV.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => openView(item.label)}
                aria-current={active === item.label ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active === item.label ? 'bg-blue-600 text-white' : 'hover:bg-slate-900 text-slate-400'}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase">Capacidad de flota</p>
            <Progress value={78} className="h-1.5 bg-slate-800" />
            <p className="text-[10px] text-slate-400">78% de unidades en uso</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Header */}
          <header className="h-20 border-b border-slate-800 px-4 md:px-8 flex items-center justify-between gap-4">
            <form
              className="relative w-full max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                demoAction(query ? `Buscando "${query}"` : 'Buscador', 'En el sistema real, encuentras cualquier envío, conductor o ruta al instante.');
              }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
              <input
                id="logistica-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Buscar envío, conductor o ruta"
                placeholder="Buscar envío, conductor, ruta..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl h-10 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-blue-600 outline-none"
              />
            </form>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notificaciones"
                onClick={() => demoAction('2 incidentes nuevos', 'Retraso en Copiapó y un cambio de dirección en Viña del Mar.')}
                className="relative text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 h-2 w-2 bg-blue-600 rounded-full border-2 border-slate-950" />
              </Button>
              <div className="h-10 w-10 shrink-0 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                MR
              </div>
            </div>
          </header>

          {/* Dashboard Grid */}
          <div className="p-4 md:p-8 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Centro de control</h1>
                <p className="text-slate-500 text-sm">Monitoreo en tiempo real de la operación en todo Chile.</p>
              </div>
              <Button
                onClick={() => demoAction('Nuevo despacho', 'En el sistema real, asignas camión, conductor y ruta, y el cliente recibe su código de seguimiento.')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                Nuevo despacho
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {KPIS.map((card) => (
                <Card key={card.title} className="bg-slate-900 border-slate-800 shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase">{card.title}</CardTitle>
                    {card.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{card.value}</div>
                    <p className={`text-[10px] font-bold mt-1 ${card.good ? 'text-emerald-500' : 'text-red-500'}`}>
                      {card.change} <span className="text-slate-500 font-normal">vs periodo anterior</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-slate-900 border-slate-800 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Estado de la flota en tiempo real</CardTitle>
                </CardHeader>
                <CardContent className="h-[420px] border-t border-slate-800 p-0">
                  <FleetMap />
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Entregas recientes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-800">
                    {DELIVERIES.map((item) => (
                      <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">{item.id}</p>
                          <p className="text-[10px] text-slate-500">{item.dest}, CL</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-[10px] font-bold ${STATUS_STYLE[item.status]}`}>
                          {item.status}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => demoAction('Historial completo', 'En el sistema real, filtras por fecha, cliente o conductor y exportas a Excel.')}
                    className="w-full text-blue-400 text-xs py-4 hover:bg-slate-800 hover:text-blue-300"
                  >
                    Ver todo el historial <ChevronRight size={14} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <p className="pt-4 text-center text-xs text-slate-500">
              LogiExpress · <DemoCredit className="text-slate-400" />
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
