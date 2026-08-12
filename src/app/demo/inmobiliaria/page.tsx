
'use client';

import React from 'react';
import { 
  Home, 
  Search, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize,
  ArrowLeft,
  ChevronRight,
  Heart,
  Filter,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const properties = [
  { id: 1, title: 'Penthouse Vistas al Mar', price: '$450.000.000', loc: 'La Serena, Coquimbo', beds: 4, baths: 3, sqft: '180m²', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Casa Moderna Condominio', price: '$280.000.000', loc: 'Peñuelas, Coquimbo', beds: 3, baths: 2, sqft: '145m²', img: 'https://images.unsplash.com/photo-1600585154340-be6199f7e099?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Departamento Centro Histórico', price: '$120.000.000', loc: 'Centro, La Serena', beds: 2, baths: 1, sqft: '75m²', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Parcela Valle del Elqui', price: '$190.000.000', loc: 'Vicuña, Coquimbo', beds: 3, baths: 2, sqft: '5000m²', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800' },
];

export default function InmobiliariaDemo() {
  return (
    <div className="min-h-screen bg-white text-[#1e293b] font-sans">
      {/* Discreet Exit Button */}
      <Link href="/portafolio-web" className="fixed top-24 left-6 z-[100] bg-white border border-slate-200 hover:bg-slate-50 text-[#1e293b] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-2">
        <ArrowLeft size={14} /> Salir de Demo
      </Link>

      {/* Navigation */}
      <nav className="h-20 border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Home size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight">SERENA <span className="text-blue-600">PROPERTIES</span></span>
           </div>
           
           <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
              <a href="#" className="hover:text-blue-600">Venta</a>
              <a href="#" className="hover:text-blue-600">Arriendo</a>
              <a href="#" className="hover:text-blue-600">Proyectos</a>
              <a href="#" className="hover:text-blue-600">Nosotros</a>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6">Publicar Propiedad</Button>
           </div>
        </div>
      </nav>

      {/* Hero with Search */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
         <img 
           src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000" 
           alt="Hero" 
           className="absolute inset-0 w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
         <div className="relative z-10 container px-6 text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-xl">Encuentra el hogar <br/>de tus sueños en Chile</h1>
            <div className="max-w-4xl mx-auto bg-white p-3 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center gap-3">
               <div className="flex-1 w-full relative">
                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                 <Input placeholder="Ciudad, Barrio o Comuna..." className="pl-12 border-none h-14 text-lg focus-visible:ring-0" />
               </div>
               <div className="h-10 w-px bg-slate-100 hidden md:block" />
               <div className="flex-1 w-full relative">
                 <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                 <select className="w-full h-14 pl-12 bg-transparent text-slate-500 outline-none border-none">
                    <option>Tipo de Propiedad</option>
                    <option>Departamento</option>
                    <option>Casa</option>
                    <option>Parcela</option>
                 </select>
               </div>
               <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 h-14 px-10 rounded-2xl text-lg font-bold">Buscar</Button>
            </div>
         </div>
      </section>

      {/* Properties Grid */}
      <section className="py-24 container mx-auto px-6">
         <div className="flex items-center justify-between mb-12">
            <div>
               <h2 className="text-3xl font-black">Propiedades Destacadas</h2>
               <p className="text-slate-500 font-medium">Las mejores oportunidades del mercado hoy.</p>
            </div>
            <Button variant="outline" className="rounded-xl border-slate-200 gap-2">
               <Filter size={18} /> Filtros Avanzados
            </Button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {properties.map((p) => (
               <div key={p.id} className="group cursor-pointer bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500">
                  <div className="relative aspect-[4/3] overflow-hidden">
                     <img 
                       src={p.img} 
                       alt={p.title} 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                     <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-blue-600 rounded-full px-4 py-1.5 border-none shadow-sm font-bold">
                        VENTA
                     </Badge>
                     <button className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                        <Heart size={20} />
                     </button>
                  </div>
                  <div className="p-6 space-y-4">
                     <div className="space-y-1">
                        <h3 className="font-bold text-lg line-clamp-1">{p.title}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                           <MapPin size={12} /> {p.loc}
                        </p>
                     </div>
                     <div className="text-2xl font-black text-blue-600">{p.price}</div>
                     <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
                        <div className="flex items-center gap-1.5"><BedDouble size={14} /> {p.beds} Dorm</div>
                        <div className="flex items-center gap-1.5"><Bath size={14} /> {p.baths} Baños</div>
                        <div className="flex items-center gap-1.5"><Maximize size={14} /> {p.sqft}</div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
         
         <div className="mt-16 text-center">
            <Button size="lg" variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50 rounded-xl px-12">Ver todas las propiedades <ChevronRight className="ml-2 h-4 w-4" /></Button>
         </div>
      </section>

      {/* Agents Section */}
      <section className="py-24 bg-slate-50">
         <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <Badge className="bg-blue-600/10 text-blue-600 border-none px-4 py-1.5 font-bold">EXPERTOS LOCALES</Badge>
               <h2 className="text-4xl md:text-5xl font-black leading-tight">Asesoría personalizada para cada cliente</h2>
               <p className="text-slate-500 text-lg leading-relaxed">Contamos con un equipo de agentes certificados que te acompañarán en todo el proceso legal y financiero para asegurar tu inversión.</p>
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <div className="text-3xl font-black text-slate-900">15+</div>
                     <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Años de trayectoria</div>
                  </div>
                  <div className="space-y-2">
                     <div className="text-3xl font-black text-slate-900">2.5k</div>
                     <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Propiedades vendidas</div>
                  </div>
               </div>
               <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 px-10 text-lg font-bold">Contactar un Agente</Button>
            </div>
            <div className="relative">
               <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" alt="Agent" className="w-full h-full object-cover" />
               </div>
               <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 max-w-[280px]">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black">9.8</div>
                     <div className="font-bold text-sm">Rating promedio de clientes</div>
                  </div>
                  <div className="flex gap-1 text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-slate-100 px-6">
         <div className="container mx-auto grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
               <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <Home size={18} />
                  </div>
                  <span className="text-lg font-bold tracking-tight">SERENA <span className="text-blue-600">PROPERTIES</span></span>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed font-medium">Tu portal inmobiliario de confianza en la Región de Coquimbo. Liderando el mercado desde 2009.</p>
            </div>
            {['Inversión', 'Venta', 'Soporte'].map((title, i) => (
               <div key={i} className="space-y-6">
                  <h4 className="text-[11px] uppercase tracking-widest font-black text-slate-900">{title}</h4>
                  <ul className="space-y-3 text-[12px] text-slate-500 font-medium">
                     <li className="hover:text-blue-600 cursor-pointer">Propiedades de Lujo</li>
                     <li className="hover:text-blue-600 cursor-pointer">Guía para Inversionistas</li>
                     <li className="hover:text-blue-600 cursor-pointer">Términos y Condiciones</li>
                  </ul>
               </div>
            ))}
         </div>
         <div className="container mx-auto mt-20 pt-8 border-t border-slate-100 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            © 2024 Serena Properties · Powered by Teo Labs
         </div>
      </footer>
    </div>
  );
}
