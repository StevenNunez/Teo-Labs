
'use client';

import React from 'react';
import { 
  Scale, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  Phone, 
  ArrowLeft,
  ChevronRight,
  Gavel,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LegalDemo() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-serif">
      {/* Discreet Exit Button */}
      <Link href="/portafolio-web" className="fixed top-24 left-6 z-[100] bg-white border border-slate-200 hover:bg-slate-50 text-[#1e293b] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-2 font-sans">
        <ArrowLeft size={14} /> Salir de Demo
      </Link>

      {/* Luxury Navigation */}
      <nav className="h-24 bg-[#0F172A] text-white border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#94a3b8]/20 border border-[#94a3b8]/30 rounded-lg flex items-center justify-center text-[#94a3b8]">
                <Scale size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight font-sans">SILVA & ASOCIADOS</span>
                <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-slate-400">ESTUDIO JURÍDICO PREMIUM</span>
              </div>
           </div>
           
           <div className="hidden lg:flex items-center gap-10 text-[11px] uppercase tracking-widest font-sans font-bold">
              <a href="#" className="hover:text-slate-300 transition-colors">Áreas de Práctica</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Nuestro Equipo</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Consultas</a>
              <Button className="bg-[#94a3b8] hover:bg-[#cbd5e1] text-[#0F172A] rounded-none px-6 font-black">CONSULTA INICIAL</Button>
           </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] bg-slate-900 overflow-hidden">
         <img 
           src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=2000" 
           alt="Law Office" 
           className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
         />
         <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
         <div className="absolute inset-0 flex flex-col items-start justify-center container mx-auto px-6">
            <div className="space-y-6 max-w-2xl">
              <div className="h-1 w-20 bg-[#94a3b8]" />
              <h1 className="text-6xl md:text-8xl font-medium text-white leading-[0.9] tracking-tighter">Justicia con <br/><span className="italic">Excelencia.</span></h1>
              <p className="text-xl text-slate-300 font-sans leading-relaxed max-w-lg">Defensa legal especializada en derecho corporativo, civil y familiar con más de 20 años de trayectoria impecable en Chile.</p>
              <div className="flex gap-4 pt-6">
                 <Button size="lg" className="bg-[#94a3b8] hover:bg-[#cbd5e1] text-[#0F172A] rounded-none px-10 h-16 text-xs uppercase tracking-widest font-black font-sans">Ver Especialidades</Button>
                 <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-none px-10 h-16 text-xs uppercase tracking-widest font-black font-sans">Nuestra Historia</Button>
              </div>
            </div>
         </div>
      </section>

      {/* Practice Areas */}
      <section className="py-32 container mx-auto px-6">
         <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl">Especialidades Jurídicas</h2>
            <p className="text-slate-500 font-sans">Soluciones estratégicas para desafíos legales complejos.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Derecho Corporativo', icon: <Gavel size={32}/>, desc: 'Asesoría integral para empresas, fusiones, adquisiciones y litigios comerciales.' },
              { title: 'Defensa Civil', icon: <ShieldCheck size={32}/>, desc: 'Protección de patrimonio, contratos complejos y responsabilidad civil contractual.' },
              { title: 'Derecho de Familia', icon: <Users size={32}/>, desc: 'Mediación y litigios especializados con un enfoque humano y profesional.' },
            ].map((area, i) => (
              <div key={i} className="bg-white p-12 border border-slate-100 shadow-sm group hover:border-[#94a3b8] transition-all duration-500">
                <div className="text-slate-400 group-hover:text-[#94a3b8] transition-colors mb-8">
                  {area.icon}
                </div>
                <h3 className="text-2xl mb-4">{area.title}</h3>
                <p className="text-slate-500 font-sans text-sm leading-relaxed mb-8">{area.desc}</p>
                <a href="#" className="inline-flex items-center gap-2 text-[10px] font-sans font-black uppercase tracking-widest text-[#94a3b8] hover:text-[#0F172A] transition-colors">
                  Saber más <ChevronRight size={14} />
                </a>
              </div>
            ))}
         </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#0F172A] py-24 text-white">
         <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Casos Exitosos', value: '1.200+' },
              { label: 'Años de Experiencia', value: '25' },
              { label: 'Abogados Senior', value: '12' },
              { label: 'Premios Nacionales', value: '08' },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl font-bold font-sans text-[#94a3b8]">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black">{stat.label}</div>
              </div>
            ))}
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#F1F5F9]">
         <div className="container mx-auto px-6">
            <div className="bg-white border border-slate-200 p-16 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="space-y-6 max-w-xl">
                  <h2 className="text-4xl md:text-5xl leading-tight">¿Requiere una evaluación legal inmediata?</h2>
                  <p className="text-slate-500 font-sans">Agende una consulta privada con nuestros especialistas y reciba una estrategia clara para su caso.</p>
               </div>
               <div className="flex flex-col items-center gap-4">
                  <Button size="lg" className="bg-[#0F172A] hover:bg-slate-800 text-white rounded-none px-12 h-16 font-sans font-black text-xs uppercase tracking-widest">Agendar Consultoría</Button>
                  <p className="text-[10px] font-sans text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> Respuesta en menos de 24 horas
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-24 px-6 border-t border-white/5">
         <div className="container mx-auto grid md:grid-cols-4 gap-12 font-sans">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <Scale size={20} className="text-[#94a3b8]" />
                  <span className="text-lg font-bold tracking-tight">SILVA & ASOCIADOS</span>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed">Defensa de elite para los desafíos legales más exigentes del siglo XXI.</p>
            </div>
            {['Oficinas', 'Servicios', 'Empresa'].map((title, i) => (
               <div key={i} className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#94a3b8]">{title}</h4>
                  <ul className="space-y-3 text-[11px] text-slate-400">
                     <li className="hover:text-white cursor-pointer transition-colors">Santiago, Chile</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Derecho Civil</li>
                     <li className="hover:text-white cursor-pointer transition-colors">Política de Privacidad</li>
                  </ul>
               </div>
            ))}
         </div>
         <div className="container mx-auto mt-20 pt-8 border-t border-white/5 text-center text-[9px] text-slate-500 uppercase tracking-widest">
            © 2024 Silva & Asociados · Legal Partner de Teo Labs
         </div>
      </footer>
    </div>
  );
}
