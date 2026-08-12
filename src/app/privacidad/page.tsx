'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPage() {
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
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold font-headline tracking-tight">Política de Privacidad</h1>
          </div>
          <p className="text-muted-foreground">Última actualización: 24 de mayo de 2024</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Recopilación de Información</h2>
            <p className="text-muted-foreground leading-relaxed">
              En Teo Labs, recopilamos información personal básica (nombre, correo electrónico y mensaje) únicamente cuando usted completa nuestro formulario de contacto o se comunica directamente con nosotros vía WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Uso de la Información</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos su información exclusivamente para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-4 space-y-2">
              <li>Responder a sus consultas y solicitudes de presupuesto.</li>
              <li>Gestionar la relación comercial en caso de contratación.</li>
              <li>Enviar actualizaciones relevantes sobre sus proyectos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Protección de Datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra acceso no autorizado, alteración o divulgación. No compartimos ni vendemos su información a terceros con fines publicitarios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Este sitio utiliza cookies para mejorar la experiencia del usuario y analizar el tráfico web. Usted puede configurar su navegador para rechazar todas las cookies, aunque esto podría afectar el funcionamiento de algunas partes del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Derechos del Usuario</h2>
            <p className="text-muted-foreground leading-relaxed">
              Usted tiene derecho a acceder, rectificar o solicitar la eliminación de sus datos personales en cualquier momento. Para ejercer estos derechos, envíenos un correo electrónico a <strong>hola@teolabs.com</strong>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
