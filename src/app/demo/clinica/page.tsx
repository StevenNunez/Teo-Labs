
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  Shield, 
  ArrowLeft,
  Phone,
  MapPin,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ClinicaDemo() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Discreet Exit Button */}
      <Link href="/portafolio-web" className="fixed top-4 left-4 z-[100] bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md transition-all flex items-center gap-2">
        <ArrowLeft size={14} /> Volver al Portafolio Teo Labs
      </Link>

      {/* Demo Header */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
              <Stethoscope size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Clínica Dental Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#" className="hover:text-emerald-600">Servicios</a>
            <a href="#" className="hover:text-emerald-600">Especialistas</a>
            <a href="#" className="hover:text-emerald-600">Precios</a>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">Reservar Hora</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-emerald-50">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest">
              Tu salud dental es prioridad
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">Sonrisas que <br/><span className="text-emerald-600">Transforman Vidas</span></h1>
            <p className="text-lg text-slate-600 max-w-md">Tecnología de vanguardia y especialistas certificados para brindarte la mejor experiencia odontológica en la ciudad.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white h-14 px-8 rounded-2xl text-lg font-bold">Agendar Ahora</Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-lg font-bold border-emerald-200">Ver Tratamientos</Button>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square bg-white rounded-3xl shadow-2xl p-4 transform rotate-3 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800" alt="Clinica" className="w-full h-full object-cover rounded-2xl" />
             </div>
             <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600">
                  <Shield size={24} />
                </div>
                <div>
                   <p className="font-bold text-sm">Seguro Fonasa/Isapre</p>
                   <p className="text-xs text-slate-500">Convenios directos activos</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Pacientes Felices', value: '5k+' },
            { label: 'Especialistas', value: '12' },
            { label: 'Años de Experiencia', value: '15' },
            { label: 'Sucursales', value: '3' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <p className="text-4xl font-bold text-emerald-600">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Demo Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center mb-16 space-y-4">
           <h2 className="text-3xl md:text-5xl font-bold">Nuestros Servicios</h2>
           <p className="text-slate-500">Cuidado integral para toda la familia</p>
        </div>
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
           {[
             { title: 'Ortodoncia Invisible', icon: <CheckCircle className="text-emerald-500"/>, desc: 'Alinea tus dientes sin que nadie lo note con tecnología de punta.' },
             { title: 'Implantes Dentales', icon: <CheckCircle className="text-emerald-500"/>, desc: 'Recupera la funcionalidad de tu boca con materiales de alta calidad.' },
             { title: 'Estética Dental', icon: <CheckCircle className="text-emerald-500"/>, desc: 'Blanqueamientos y carillas para una sonrisa de comercial.' }
           ].map((s, i) => (
             <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-shadow">
               <div className="mb-4">{s.icon}</div>
               <h3 className="text-xl font-bold mb-2">{s.title}</h3>
               <p className="text-slate-500 text-sm">{s.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-center text-white space-y-8 shadow-2xl shadow-emerald-600/20">
           <h2 className="text-4xl md:text-6xl font-bold">¿Listo para sonreír?</h2>
           <p className="text-emerald-100 text-lg max-w-xl mx-auto">Reserva tu evaluación inicial gratuita y descubre lo que podemos hacer por ti.</p>
           <Button className="bg-white text-emerald-700 hover:bg-emerald-50 h-16 px-12 rounded-2xl text-xl font-bold">Agendar Evaluación Gratis</Button>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-20 mt-20">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="space-y-6">
             <div className="flex items-center gap-2 text-white">
               <Stethoscope size={24} />
               <span className="text-xl font-bold">Clínica Dental Pro</span>
             </div>
             <p className="text-sm">Líderes en salud bucal desde 2009. Cuidamos cada detalle para tu comodidad.</p>
          </div>
          <div className="space-y-4 text-sm">
             <h4 className="text-white font-bold">Contacto</h4>
             <p className="flex items-center gap-2"><Phone size={14} /> +56 9 1234 5678</p>
             <p className="flex items-center gap-2"><MapPin size={14} /> Av. Libertad 123, La Serena</p>
          </div>
          <div className="space-y-4 text-sm">
             <h4 className="text-white font-bold">Horarios</h4>
             <p>Lun - Vie: 09:00 - 20:00</p>
             <p>Sáb: 10:00 - 14:00</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
