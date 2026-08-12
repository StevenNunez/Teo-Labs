
'use client';

import React from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  ArrowLeft,
  ChevronRight,
  Instagram,
  Facebook,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const products = [
  { id: 1, name: 'Abrigo Minimalista Lana', price: '$89.990', tag: 'NEW', img: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'Vestido Seda Noir', price: '$120.000', tag: 'LIMITED', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600' },
  { id: 3, name: 'Cartera Piel Artisanal', price: '$65.000', tag: 'BEST SELLER', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600' },
  { id: 4, name: 'Botines Classic Brown', price: '$78.000', tag: 'NEW', img: 'https://images.unsplash.com/photo-1520639889313-7272a61311d3?auto=format&fit=crop&q=80&w=600' },
];

export default function BoutiqueDemo() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-serif overflow-x-hidden">
      {/* Discreet Exit Button */}
      <Link href="/portafolio-web" className="fixed top-24 left-6 z-[100] bg-white border border-black/5 hover:bg-slate-50 text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2">
        <ArrowLeft size={14} /> Salir de Demo
      </Link>

      {/* Luxury Promo Bar */}
      <div className="bg-black text-white py-2 text-center text-[10px] uppercase tracking-[0.3em] font-sans">
        Envío gratuito en pedidos sobre $100.000 · Pagos con Transbank
      </div>

      {/* Minimal Header */}
      <nav className="h-24 border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
           <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-sans font-bold">
              <a href="#" className="hover:opacity-50 transition-opacity">Colección</a>
              <a href="#" className="hover:opacity-50 transition-opacity">Novedades</a>
              <a href="#" className="hover:opacity-50 transition-opacity">Nosotros</a>
           </div>
           
           <div className="text-3xl font-black tracking-tighter">BOUTIQUE</div>

           <div className="flex items-center gap-6">
              <button className="hover:opacity-50 transition-opacity"><Search size={20} /></button>
              <button className="hover:opacity-50 transition-opacity"><Heart size={20} /></button>
              <button className="hover:opacity-50 transition-opacity relative">
                 <ShoppingBag size={20} />
                 <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] h-4 w-4 rounded-full flex items-center justify-center">2</span>
              </button>
           </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[80vh] bg-neutral-200 overflow-hidden">
         <img 
           src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
           alt="Hero" 
           className="absolute inset-0 w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-black/10" />
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
            <p className="text-[12px] uppercase tracking-[0.5em] mb-6 font-sans font-bold">The Winter Edit 2024</p>
            <h1 className="text-6xl md:text-8xl font-medium mb-10 tracking-tight leading-none italic">Elegancia <br/> Atemporal</h1>
            <Button className="bg-white text-black hover:bg-black hover:text-white rounded-none px-12 py-8 text-xs uppercase tracking-widest font-sans font-bold transition-all border border-white">
               Explorar Colección
            </Button>
         </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 container mx-auto px-6">
         <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
               <h2 className="text-4xl">Piezas Destacadas</h2>
               <p className="text-neutral-500 font-sans text-sm">Curaduría exclusiva de materiales nobles.</p>
            </div>
            <a href="#" className="text-[10px] font-sans font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-50">
               Ver todo <ChevronRight size={14} />
            </a>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((p) => (
               <div key={p.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-6">
                     <img 
                       src={p.img} 
                       alt={p.name} 
                       className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                     />
                     <Badge className="absolute top-4 left-4 bg-white text-black rounded-none text-[8px] tracking-widest border-none shadow-sm">
                        {p.tag}
                     </Badge>
                     <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black w-[90%] py-4 text-[10px] uppercase tracking-widest font-sans font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                        Añadir a Bolsa
                     </button>
                  </div>
                  <div className="space-y-1">
                     <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium">{p.name}</h3>
                        <div className="flex items-center text-yellow-500"><Star size={10} fill="currentColor" /></div>
                     </div>
                     <p className="text-xs text-neutral-400 font-sans font-bold">{p.price}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-neutral-900 text-white text-center">
         <div className="max-w-xl mx-auto px-6 space-y-8">
            <h2 className="text-4xl italic">Únete al Círculo Privado</h2>
            <p className="text-neutral-500 font-sans text-sm tracking-wide">Recibe acceso anticipado a nuestras colecciones cápsula y eventos exclusivos.</p>
            <form className="flex gap-4">
               <input 
                 placeholder="Tu correo electrónico" 
                 className="flex-1 bg-transparent border-b border-neutral-700 py-4 text-xs font-sans focus:border-white outline-none transition-colors"
               />
               <Button className="bg-white text-black rounded-none uppercase text-[10px] tracking-widest px-8">Suscribir</Button>
            </form>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-black/5 px-6">
         <div className="container mx-auto grid md:grid-cols-4 gap-12 font-sans">
            <div className="space-y-6">
               <div className="text-xl font-black tracking-tighter">BOUTIQUE</div>
               <p className="text-xs text-neutral-400 leading-relaxed">Redefiniendo el lujo minimalista en el corazón de Chile.</p>
               <div className="flex gap-4">
                  <Instagram size={18} className="text-neutral-400 cursor-pointer hover:text-black" />
                  <Facebook size={18} className="text-neutral-400 cursor-pointer hover:text-black" />
               </div>
            </div>
            {['Colección', 'Servicio', 'Legal'].map((title, i) => (
               <div key={i} className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">{title}</h4>
                  <ul className="space-y-3 text-[11px] text-neutral-500">
                     <li className="hover:text-black cursor-pointer">Nuevas Llegadas</li>
                     <li className="hover:text-black cursor-pointer">Bestsellers</li>
                     <li className="hover:text-black cursor-pointer">Guía de Tallas</li>
                  </ul>
               </div>
            ))}
         </div>
         <div className="container mx-auto mt-20 pt-8 border-t border-black/5 text-center text-[9px] text-neutral-400 uppercase tracking-widest">
            © 2024 Boutique Lux · Made with passion by Teo Labs
         </div>
      </footer>
    </div>
  );
}
