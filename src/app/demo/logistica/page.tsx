
'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Package, 
  Map as MapIcon, 
  Bell, 
  Search,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Box
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function LogisticaDemo() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex">
      {/* Discreet Exit Button */}
      <Link href="/portafolio-web" className="fixed bottom-6 right-6 z-[100] bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md transition-all border border-white/10 flex items-center gap-2">
        <ArrowLeft size={14} /> Salir de la Demo
      </Link>

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 hidden lg:flex flex-col p-6 space-y-10">
        <div className="flex items-center gap-3 text-white">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Truck size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight">LogiExpress</span>
        </div>

        <nav className="flex-1 space-y-2">
           {[
             { label: 'Dashboard', icon: <LayoutDashboard size={18} />, active: true },
             { label: 'Envíos Activos', icon: <Box size={18} /> },
             { label: 'Flota', icon: <Truck size={18} /> },
             { label: 'Rutas', icon: <MapIcon size={18} /> },
             { label: 'Reportes', icon: <TrendingUp size={18} /> },
           ].map((item, i) => (
             <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-blue-600 text-white' : 'hover:bg-slate-900 text-slate-400'}`}>
               {item.icon}
               {item.label}
             </button>
           ))}
        </nav>

        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
           <p className="text-xs font-bold text-slate-500 uppercase">Capacidad Flota</p>
           <Progress value={78} className="h-1.5 bg-slate-800" />
           <p className="text-[10px] text-slate-400">78% de unidades en uso</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-slate-800 px-8 flex items-center justify-between">
           <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
              <input 
                placeholder="Buscar envío, conductor, ruta..." 
                className="w-full bg-slate-900/50 border-slate-800 rounded-xl h-10 pl-10 pr-4 text-sm focus:ring-1 focus:ring-blue-600 outline-none"
              />
           </div>
           <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 h-2 w-2 bg-blue-600 rounded-full border-2 border-slate-950" />
              </Button>
              <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700" />
           </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-8 space-y-8">
           <div className="flex items-center justify-between">
              <div>
                 <h1 className="text-2xl font-bold text-white">Centro de Control</h1>
                 <p className="text-slate-500 text-sm">Monitoreo en tiempo real de operaciones globales.</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Nuevo Despacho</Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'En Camino', value: '142', growth: '+12%', icon: <Truck className="text-blue-500" /> },
                { title: 'Entregados Hoy', value: '48', growth: '+5%', icon: <Package className="text-emerald-500" /> },
                { title: 'Incidentes', value: '2', growth: '-50%', icon: <Bell className="text-red-500" /> },
                { title: 'T. Promedio', value: '45m', growth: '-8%', icon: <TrendingUp className="text-purple-500" /> },
              ].map((card, i) => (
                <Card key={i} className="bg-slate-900 border-slate-800 shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase">{card.title}</CardTitle>
                    {card.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{card.value}</div>
                    <p className={`text-[10px] font-bold mt-1 ${card.growth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                       {card.growth} <span className="text-slate-600 font-normal">vs periodo anterior</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-slate-900 border-slate-800 shadow-none">
                 <CardHeader>
                    <CardTitle className="text-lg">Estado de la Flota (Real-time)</CardTitle>
                 </CardHeader>
                 <CardContent className="h-[400px] flex items-center justify-center border-t border-slate-800">
                    <div className="text-center space-y-4">
                       <div className="inline-block p-4 bg-slate-800 rounded-full text-blue-500 animate-pulse">
                          <MapIcon size={40} />
                       </div>
                       <p className="text-slate-500 text-sm italic">Cargando mapa dinámico de unidades...</p>
                    </div>
                 </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 shadow-none">
                 <CardHeader>
                    <CardTitle className="text-lg">Entregas Recientes</CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="divide-y divide-slate-800">
                       {[
                         { id: '#TRK-902', dest: 'Santiago, CL', status: 'Entregado' },
                         { id: '#TRK-903', dest: 'La Serena, CL', status: 'En Ruta' },
                         { id: '#TRK-904', dest: 'Antofagasta, CL', status: 'Pendiente' },
                         { id: '#TRK-905', dest: 'Viña del Mar, CL', status: 'Entregado' },
                       ].map((item, i) => (
                         <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                            <div className="space-y-1">
                               <p className="text-sm font-bold text-white">{item.id}</p>
                               <p className="text-[10px] text-slate-500">{item.dest}</p>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-[10px] font-bold ${item.status === 'Entregado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                               {item.status}
                            </div>
                         </div>
                       ))}
                    </div>
                    <Button variant="ghost" className="w-full text-blue-500 text-xs py-4 hover:bg-slate-800">
                       Ver todo el historial <ChevronRight size={14} className="ml-2" />
                    </Button>
                 </CardContent>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
