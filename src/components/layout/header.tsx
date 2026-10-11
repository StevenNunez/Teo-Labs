"use client";

import * as React from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import InteractiveLogo from "@/components/ui/interactive-logo";
import BrandMark from "@/components/ui/brand-mark";
import ThemeToggle from "@/components/layout/theme-toggle";

/**
 * Cuatro destinos, en el orden en que se decide una compra: que hacen, lo
 * nuevo (agentes), la prueba, y quienes son.
 *
 * Eran seis. "Portafolio" y "Proyectos" llevaban a lo mismo con dos nombres, y
 * "Asesor IA" era una segunda seccion de IA pegada a Agentes; ahora vive
 * adentro de Agentes como demo ("Prueba un agente"). El portafolio sigue a un
 * clic desde Proyectos y desde el footer.
 */
const navLinks: { href: string; label: string; icon?: React.ReactNode }[] = [
  { href: "/#services", label: "Servicios" },
  { href: "/#agentes", label: "Agentes IA", icon: <Sparkles className="h-4 w-4 mr-2 text-primary" /> },
  { href: "/#projects", label: "Proyectos" },
  { href: "/#about", label: "Nosotros" },
];

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-500 px-4 md:px-8 pt-4",
      scrolled ? "pt-2" : "pt-4"
    )}>
      <div className={cn(
        "container flex h-16 max-w-7xl items-center justify-between px-6 rounded-2xl transition-all duration-500",
        scrolled 
          ? "bg-surface/80 backdrop-blur-2xl border border-border"
          : "bg-transparent border-transparent"
      )}>
        
        <div className="flex items-center gap-12">
          {/* El signo fijo (la Θ) y al lado el nombre animado letra por letra:
              lo fijo es la marca, lo animado es la firma del sitio. */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandMark title="" className="h-8 w-8 shrink-0 transition-transform duration-500 group-hover:rotate-[20deg]" />
            <InteractiveLogo text="Teo Labs" variant="header" className="font-wordmark text-2xl font-bold tracking-wordmark" />
          </Link>

          <nav className="hidden lg:flex items-center gap-10 text-sm font-bold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center text-muted-foreground transition-all hover:text-primary relative py-1"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden md:flex">
            <Button asChild className="rounded-xl px-6 font-bold bg-primary text-white transition-all group">
              <Link href="/#contact" className="flex items-center gap-2">
                Cotizar proyecto
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl bg-muted/50"
                aria-label="Abrir menú"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l-0 bg-background/95 backdrop-blur-xl rounded-l-[2rem]">
              <SheetHeader className="text-left mb-12">
                 <SheetTitle className="flex items-center gap-3 font-wordmark font-bold text-3xl tracking-wordmark">
                    <BrandMark title="" className="h-9 w-9" />
                    Teo Labs
                 </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-2 py-2 text-2xl font-bold font-headline text-foreground hover:text-primary transition-colors border-b border-border/50"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                <Link 
                    href="/#contact" 
                    onClick={() => setIsOpen(false)}
                    className="mt-4"
                >
                    <Button className="w-full h-16 rounded-2xl text-xl font-bold bg-primary text-white">
                        Contáctanos
                    </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}