
'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Heart,
  ChevronRight,
  Instagram,
  Facebook,
  Star
} from 'lucide-react';
import { DemoBar, DemoCredit, demoAction, goTo } from '@/components/demo/demo-kit';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const products = [
  { id: 1, name: 'Abrigo Minimalista Lana', price: '$89.990', tag: 'NEW', img: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=70&w=600' },
  { id: 2, name: 'Vestido Seda Noir', price: '$120.000', tag: 'LIMITED', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=70&w=600' },
  { id: 3, name: 'Cartera Piel Artisanal', price: '$65.000', tag: 'BEST SELLER', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=70&w=600' },
  { id: 4, name: 'Zapatillas Cuero Camel', price: '$78.000', tag: 'NEW', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=70&w=600' },
];

export default function BoutiqueDemo() {
  // El carro cuenta de verdad: es lo primero que alguien prueba en una tienda.
  const [cart, setCart] = useState(0);
  const [email, setEmail] = useState('');

  const addToBag = (name: string) => {
    setCart((n) => n + 1);
    demoAction(`${name} en tu bolsa`, 'En la tienda real, sigues al pago con Webpay, Mercado Pago o transferencia.');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-serif overflow-x-hidden">
      <DemoBar business="Tienda ficticia" />

      {/* Luxury Promo Bar */}
      <div className="bg-black text-white py-2 text-center text-[10px] uppercase tracking-[0.3em] font-sans">
        Envío gratuito en pedidos sobre $100.000 · Pagos con Transbank
      </div>

      {/* Minimal Header */}
      <nav className="h-24 border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
           <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-sans font-bold">
              <a href="#coleccion" className="hover:opacity-50 transition-opacity">Colección</a>
              <a href="#circulo" className="hover:opacity-50 transition-opacity">Novedades</a>
              <a href="#contacto" className="hover:opacity-50 transition-opacity">Nosotros</a>
           </div>

           <div className="text-3xl font-black tracking-tighter">BOUTIQUE</div>

           <div className="flex items-center gap-6">
              <button type="button" aria-label="Buscar" onClick={() => demoAction('Buscador', 'En la tienda real, buscas por producto, talla o color.')} className="hover:opacity-50 transition-opacity"><Search size={20} /></button>
              <button type="button" aria-label="Favoritos" onClick={() => demoAction('Favoritos', 'En la tienda real, guardas tus prendas favoritas para después.')} className="hover:opacity-50 transition-opacity"><Heart size={20} /></button>
              <button
                type="button"
                aria-label={`Bolsa de compras, ${cart} productos`}
                onClick={() =>
                  cart
                    ? demoAction(`Tienes ${cart} ${cart === 1 ? 'producto' : 'productos'} en tu bolsa`, 'En la tienda real, aquí revisas y pagas tu pedido.')
                    : demoAction('Tu bolsa está vacía', 'Agrega una pieza desde la colección.')
                }
                className="hover:opacity-50 transition-opacity relative"
              >
                 <ShoppingBag size={20} />
                 {cart > 0 && (
                   <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] h-4 w-4 rounded-full flex items-center justify-center">{cart}</span>
                 )}
              </button>
           </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[80vh] bg-neutral-200 overflow-hidden">
         <img
           src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=70&w=1600"
           alt="Colección de invierno en tienda"
           className="absolute inset-0 w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-black/10" />
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
            <p className="text-[12px] uppercase tracking-[0.5em] mb-6 font-sans font-bold">The Winter Edit 2026</p>
            <h1 className="text-6xl md:text-8xl font-medium mb-10 tracking-tight leading-none italic">Elegancia <br/> Atemporal</h1>
            <Button onClick={() => goTo('coleccion')} className="bg-white text-black hover:bg-black hover:text-white rounded-none px-12 py-8 text-xs uppercase tracking-widest font-sans font-bold transition-all border border-white">
               Explorar Colección
            </Button>
         </div>
      </section>

      {/* Product Grid */}
      <section id="coleccion" className="scroll-mt-28 py-24 container mx-auto px-6">
         <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
               <h2 className="text-4xl">Piezas Destacadas</h2>
               <p className="text-neutral-500 font-sans text-sm">Curaduría exclusiva de materiales nobles.</p>
            </div>
            <button type="button" onClick={() => demoAction('Catálogo completo', 'En la tienda real, aquí ves todos los productos con filtros por categoría y talla.')} className="text-[10px] font-sans font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-50">
               Ver todo <ChevronRight size={14} />
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((p) => (
               <div key={p.id} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-6">
                     <img
                       loading="lazy"
                       src={p.img}
                       alt={p.name}
                       className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                     />
                     <Badge className="absolute top-4 left-4 bg-white text-black rounded-none text-[8px] tracking-widest border-none shadow-sm">
                        {p.tag}
                     </Badge>
                     <button type="button" onClick={() => addToBag(p.name)} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black w-[90%] py-4 text-[10px] uppercase tracking-widest font-sans font-bold transition-all lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 focus:opacity-100 focus:translate-y-0">
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
      <section id="circulo" className="scroll-mt-28 py-24 bg-neutral-900 text-white text-center">
         <div className="max-w-xl mx-auto px-6 space-y-8">
            <h2 className="text-4xl italic">Únete al Círculo Privado</h2>
            <p className="text-neutral-500 font-sans text-sm tracking-wide">Recibe acceso anticipado a nuestras colecciones cápsula y eventos exclusivos.</p>
            {/* Antes el formulario se enviaba de verdad y recargaba la pagina. */}
            <form
              className="flex gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                demoAction('Bienvenida al Círculo Privado', 'En la tienda real, este correo queda suscrito y recibe la colección antes que nadie.');
                setEmail('');
              }}
            >
               <input
                 id="boutique-email"
                 type="email"
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 aria-label="Tu correo electrónico"
                 placeholder="Tu correo electrónico"
                 className="flex-1 bg-transparent border-b border-neutral-700 py-4 text-xs font-sans focus:border-white outline-none transition-colors"
               />
               <Button type="submit" className="bg-white text-black hover:bg-neutral-200 rounded-none uppercase text-[10px] tracking-widest px-8">Suscribir</Button>
            </form>
         </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="py-20 border-t border-black/5 px-6">
         <div className="container mx-auto grid md:grid-cols-4 gap-12 font-sans">
            <div className="space-y-6">
               <div className="text-xl font-black tracking-tighter">BOUTIQUE</div>
               <p className="text-xs text-neutral-400 leading-relaxed">Redefiniendo el lujo minimalista en el corazón de Chile.</p>
               <div className="flex gap-4">
                  <Instagram size={18} aria-hidden="true" className="text-neutral-400" />
                  <Facebook size={18} aria-hidden="true" className="text-neutral-400" />
               </div>
            </div>
            {/* Antes las tres columnas repetian los mismos tres enlaces. */}
            {[
              { title: 'Colección', items: ['Nuevas llegadas', 'Más vendidos', 'Accesorios'] },
              { title: 'Servicio', items: ['Guía de tallas', 'Envíos y cambios', 'Retiro en tienda'] },
              { title: 'Tienda', items: ['Av. del Mar 2100, La Serena', 'Lun a sáb · 11:00 a 20:00', 'hola@boutiquelux.cl'] },
            ].map((col) => (
               <div key={col.title} className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">{col.title}</h4>
                  <ul className="space-y-3 text-[11px] text-neutral-500">
                     {col.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
               </div>
            ))}
         </div>
         <div className="container mx-auto mt-20 pt-8 border-t border-black/5 text-center text-[9px] text-neutral-400 uppercase tracking-widest">
            © 2026 Boutique Lux · <DemoCredit className="normal-case tracking-normal text-neutral-500" />
         </div>
      </footer>
    </div>
  );
}
