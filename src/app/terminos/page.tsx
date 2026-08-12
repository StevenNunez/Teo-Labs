'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container max-w-4xl py-20 px-4 md:px-6">
        <div className="mb-12">
          <Button asChild variant="ghost" className="mb-6 -ml-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold font-headline tracking-tight">Términos de Servicio</h1>
          </div>
          <p className="text-muted-foreground">Última actualización: 24 de mayo de 2024</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Aceptación de los Términos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al acceder y utilizar los servicios de <strong>Teo Labs</strong>, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Descripción del Servicio</h2>
            <p className="text-muted-foreground leading-relaxed">
              Teo Labs ofrece servicios de desarrollo de software a medida, consultoría tecnológica, automatización de procesos y soluciones digitales para Pymes y Startups. Cada proyecto se rige por un contrato específico que detalla el alcance, los plazos y los costos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Propiedad Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              A menos que se acuerde lo contrario por escrito, la propiedad intelectual del software desarrollado se transfiere al cliente tras el pago completo del proyecto. Teo Labs retiene los derechos sobre sus metodologías, herramientas base y código preexistente utilizado en el desarrollo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Responsabilidad</h2>
            <p className="text-muted-foreground leading-relaxed">
              Teo Labs se compromete a seguir las mejores prácticas de la industria. Sin embargo, no nos hacemos responsables de pérdidas indirectas, lucro cesante o daños derivados del uso de las aplicaciones desarrolladas una vez entregadas y aceptadas por el cliente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Ley Aplicable</h2>
            <p className="text-muted-foreground leading-relaxed">
              Estos términos se rigen por las leyes de la República de Chile. Cualquier disputa relacionada con estos términos se resolverá ante los tribunales competentes de la ciudad de La Serena, Chile.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
