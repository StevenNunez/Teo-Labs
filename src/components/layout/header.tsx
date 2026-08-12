"use client";

import * as React from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Globe, Brain, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import InteractiveLogo from "@/components/ui/interactive-logo";
import ThemeToggle from "@/components/layout/theme-toggle";

const navLinks = [
  { href: "/#about", label: "Nosotros" },
  { href: "/#services", label: "Servicios" },
  { href: "/#ai-consultant", label: "AI Advisor", icon: <Brain className="h-4 w-4 mr-2 text-primary" /> },
  { href: "/portafolio-web", label: "Portafolio", icon: <Globe className="h-4 w-4 mr-2" /> },
  { href: "/#projects", label: "Proyectos" },
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
          ? "bg-surface/80 backdrop-blur-2xl border border-white/10" 
          : "bg-transparent border-transparent"
      )}>
        
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center group">
            <InteractiveLogo text="Teo Labs" variant="header" className="text-2xl font-bold font-headline tracking-tighter" />
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
                Empezar Proyecto
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
                 <SheetTitle className="font-bold font-headline text-3xl tracking-tighter">
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