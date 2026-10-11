
'use client';

import React from 'react';
import { 
  Dumbbell, 
  Calendar, 
  Users, 
  Flame, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Zap,
  Check
} from 'lucide-react';
import { DemoBar, DemoCredit, demoAction, goTo } from '@/components/demo/demo-kit';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const classes = [
  { name: 'Power Lifting', time: '08:00 AM', coach: 'Mike T.', level: 'Avanzado', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=70&w=800' },
  { name: 'HIIT Cardio', time: '10:30 AM', coach: 'Sarah J.', level: 'Intermedio', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=70&w=800' },
  { name: 'CrossFit WOD', time: '06:00 PM', coach: 'Alex R.', level: 'Todo Nivel', img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=70&w=800' },
];

export default function FitnessDemo() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-yellow-400 selection:text-black">
      <DemoBar business="Gimnasio ficticio" />

      {/* Navigation */}
      <nav className="h-20 border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-yellow-400 rounded-lg flex items-center justify-center text-black shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                <Dumbbell size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">FIT<span className="text-yellow-400">PRO</span></span>
           </div>
           
           <div className="hidden lg:flex items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-black">
              <a href="#clases" className="hover:text-yellow-400 transition-colors">Clases</a>
              <a href="#planes" className="hover:text-yellow-400 transition-colors">Membresías</a>
              <a href="#contacto" className="hover:text-yellow-400 transition-colors">Contacto</a>
              <Button onClick={() => goTo('planes')} className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-none px-8 font-black shadow-lg shadow-yellow-400/20">ÚNETE AHORA</Button>
           </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
         <img 
           src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=70&w=1600" 
           alt="Gym Hero" 
           className="absolute inset-0 w-full h-full object-cover opacity-50"
         />
         <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
         <div className="container relative z-10 px-6">
            <div className="max-w-4xl space-y-8">
              <Badge className="bg-yellow-400 text-black rounded-none px-4 py-1.5 font-black text-xs uppercase tracking-widest mb-4">NO EXCUSES · TEMPORADA 2026</Badge>
              <h1 className="text-6xl md:text-9xl font-black leading-[0.8] uppercase italic tracking-tighter">SIN LÍMITES <br/><span className="text-yellow-400">SIN MIEDO</span></h1>
              <p className="text-xl text-slate-300 max-w-xl font-medium leading-relaxed">Transforma tu cuerpo y mente con los mejores entrenadores de la ciudad. Equipamiento de elite y comunidad imparable.</p>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                 <Button size="lg" onClick={() => demoAction('Clase de prueba reservada', 'En el sitio real, el gimnasio recibe tu reserva y te confirma por WhatsApp.')} className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-none px-12 h-16 text-xs uppercase tracking-widest font-black shadow-2xl shadow-yellow-400/20">Comenzar Gratis</Button>
                 <Button size="lg" variant="outline" onClick={() => goTo('clases')} className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white rounded-none px-12 h-16 text-xs uppercase tracking-widest font-black">Ver Programas</Button>
              </div>
            </div>
         </div>
      </section>

      {/* Stats Marquee */}
      <div className="bg-yellow-400 py-6 overflow-hidden">
         <div className="flex animate-marquee whitespace-nowrap">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-12 mx-12 text-black font-black text-2xl italic uppercase">
                <span>Push Your Limits</span>
                <Flame size={24} />
                <span>Modern Equipment</span>
                <Zap size={24} />
                <span>Expert Trainers</span>
                <Dumbbell size={24} />
              </div>
            ))}
         </div>
      </div>

      {/* Programs Section */}
      <section id="clases" className="scroll-mt-20 py-32 container mx-auto px-6">
         <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
               <span className="text-yellow-400 text-sm font-black uppercase tracking-[0.3em]">Nuestras Clases</span>
               <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none">Elige tu <br/>desafío</h2>
            </div>
            <p className="text-slate-500 max-w-md font-medium text-lg leading-relaxed">Sesiones diseñadas para maximizar tus resultados en el menor tiempo posible.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {classes.map((c, i) => (
               <button
                  type="button"
                  key={i}
                  onClick={() => demoAction(`Reservaste ${c.name}`, `${c.time} con ${c.coach}. En el sitio real, la reserva llega directo a la agenda del gimnasio.`)}
                  className="group relative block w-full text-left aspect-[4/5] overflow-hidden border border-white/10"
               >
                  <img 
                    loading="lazy"
                    src={c.img} 
                    alt={c.name} 
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                     <div className="space-y-2 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center gap-2 text-yellow-400 text-[10px] font-semibold uppercase tracking-widest">
                           <Clock size={12} /> {c.time} · {c.coach}
                        </div>
                        <h3 className="text-3xl font-black uppercase italic">{c.name}</h3>
                        <p className="text-slate-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Nivel {c.level} · 60 minutos · Toca para reservar</p>
                     </div>
                  </div>
               </button>
            ))}
         </div>
      </section>

      {/* Membership Plans */}
      <section id="planes" className="scroll-mt-20 py-32 bg-[#0F0F0F]">
         <div className="container mx-auto px-6">
            <div className="text-center mb-20">
               <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-4">Membresías</h2>
               <p className="text-slate-500 font-medium">Invierte en tu versión más fuerte.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               {[
                 { name: 'Basic', price: '$24.990', features: ['Acceso 08:00 - 17:00', 'Pesas Libres', 'Duchas'] },
                 { name: 'Premium', price: '$34.990', features: ['Acceso Ilimitado', 'Clases Grupales', '1 Evaluación Mes', 'Sauna'], highlight: true },
                 { name: 'Elite', price: '$54.990', features: ['Todo lo Premium', 'Personal Trainer', 'Suplementos x2', 'Invitado Gratis'] },
               ].map((plan, i) => (
                 <div key={i} className={`p-12 border transition-all duration-500 ${plan.highlight ? 'bg-yellow-400 border-yellow-400 text-black scale-105 shadow-2xl shadow-yellow-400/20' : 'bg-black border-white/10 text-white hover:border-white/30'}`}>
                    <h3 className="text-2xl font-black uppercase italic mb-2">{plan.name}</h3>
                    <div className="text-4xl font-black mb-8">{plan.price}<span className="text-sm font-medium">/mes</span></div>
                    <ul className="space-y-4 mb-12">
                       {plan.features.map((f, idx) => (
                         <li key={idx} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                            <Check size={14} className={plan.highlight ? 'text-black' : 'text-yellow-400'} /> {f}
                         </li>
                       ))}
                    </ul>
                    <Button onClick={() => demoAction(`Plan ${plan.name} seleccionado`, 'En el sitio real, aquí pagas la membresía con Webpay o Mercado Pago.')} className={`w-full rounded-none h-14 font-black text-[10px] uppercase tracking-widest transition-all ${plan.highlight ? 'bg-black text-white hover:bg-slate-900' : 'bg-yellow-400 text-black hover:bg-yellow-500'}`}>
                       Seleccionar Plan
                    </Button>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5">
         <div className="container mx-auto grid md:grid-cols-4 gap-12 font-sans">
            <div className="space-y-6">
               <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-yellow-400 rounded-lg flex items-center justify-center text-black">
                    <Dumbbell size={20} />
                  </div>
                  <span className="text-xl font-black tracking-tighter uppercase italic">FIT<span className="text-yellow-400">PRO</span></span>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-tighter">Más que un gimnasio, <br/>tu nueva realidad.</p>
            </div>
            {[
              { title: 'Entrena', items: ['Clases grupales', 'Personal trainer', 'Evaluación física'] },
              { title: 'Horarios', items: ['Lun a vie · 06:00 a 23:00', 'Sábado · 08:00 a 20:00', 'Domingo · 09:00 a 14:00'] },
              { title: 'Contacto', items: ['Av. del Mar 4500, La Serena', '+56 9 1234 5678', 'hola@fitpro.cl'] },
            ].map((col) => (
               <div key={col.title} id={col.title === 'Contacto' ? 'contacto' : undefined} className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-yellow-400">{col.title}</h4>
                  <ul className="space-y-3 text-[11px] text-slate-500 font-black uppercase">
                     {col.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
               </div>
            ))}
         </div>
         <div className="container mx-auto mt-20 pt-8 border-t border-white/5 text-center text-[9px] text-slate-700 uppercase tracking-widest font-black">
            © 2026 FitPro Gym · <DemoCredit className="normal-case tracking-normal text-slate-500" />
         </div>
      </footer>
    </div>
  );
}
