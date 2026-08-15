import type { Metadata } from 'next';
import { Database, TriangleAlert } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadAdminData } from '@/lib/admin-data';
import { isDatabaseConfigured } from '@/lib/supabase-admin';
import { isMaintenanceOverdue, type ProjectWithClient } from '@/lib/admin-types';
import AdminDashboard from './admin-dashboard';

/**
 * Panel interno. Server Component a proposito: la lectura de clientes, montos y
 * estados de pago se hace aca con la service_role key y solo bajan al navegador
 * los datos ya renderizados. La proteccion de acceso vive en src/middleware.ts.
 */

export const metadata: Metadata = {
  title: 'Centro de Mandos',
  robots: { index: false, follow: false },
};

// Sin esto Next intentaria prerenderizar el panel en el build, cuando todavia no
// hay datos (ni variables de entorno de base) y mostraria una foto vieja.
export const dynamic = 'force-dynamic';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** Proyectos iniciados por mes en los ultimos 6, incluido el actual. */
function buildChart(projects: ProjectWithClient[]) {
  const now = new Date();
  const buckets = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return { key: `${date.getFullYear()}-${date.getMonth()}`, month: MONTHS[date.getMonth()], projects: 0 };
  });

  for (const project of projects) {
    const created = new Date(project.created_at);
    const key = `${created.getFullYear()}-${created.getMonth()}`;
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) bucket.projects += 1;
  }

  return buckets.map(({ month, projects: count }) => ({ month, projects: count }));
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{children}</code>;
}

/** Pantalla de setup: el panel no puede mostrar datos y explica exactamente por que. */
function SetupCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      <main className="flex-1 container pt-32 pb-20 px-4 md:px-8 max-w-2xl mx-auto">
        <Card className="border-border/50 shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              {icon}
            </div>
            <CardTitle className="font-headline text-2xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            {children}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default async function AdminPage() {
  if (!isDatabaseConfigured) {
    return (
      <SetupCard icon={<Database className="h-6 w-6 text-primary" />} title="Falta conectar la base">
        <p>
          El panel lee los proyectos desde Supabase y todavía no hay credenciales configuradas en
          este entorno.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Crea el proyecto en supabase.com y corre <Code>supabase/schema.sql</Code> en su SQL
            Editor.
          </li>
          <li>
            Copia en las variables de entorno <Code>NEXT_PUBLIC_SUPABASE_URL</Code>,{' '}
            <Code>NEXT_PUBLIC_SUPABASE_ANON_KEY</Code> y <Code>SUPABASE_SERVICE_ROLE_KEY</Code>.
          </li>
          <li>Reinicia el servidor.</li>
        </ol>
        <p className="text-xs">
          La service_role key nunca lleva prefijo NEXT_PUBLIC: si lo llevara, quedaría expuesta en
          el navegador.
        </p>
      </SetupCard>
    );
  }

  const data = await loadAdminData();

  if (!data.ok) {
    // Distinto de "no hay proyectos": la consulta fallo. Mostrarlo como panel
    // vacio haria buscar el problema en el lugar equivocado.
    return (
      <SetupCard
        icon={<TriangleAlert className="h-6 w-6 text-primary" />}
        title={data.reason === 'missing-tables' ? 'Faltan las tablas' : 'No se pudo leer la base'}
      >
        {data.reason === 'missing-tables' ? (
          <>
            <p>
              Las credenciales de Supabase funcionan, pero el esquema todavía no está creado: no
              existen las tablas <Code>clients</Code>, <Code>projects</Code> y{' '}
              <Code>project_steps</Code>.
            </p>
            <p>
              Abre el <strong>SQL Editor</strong> del proyecto en supabase.com, pega el contenido
              completo de <Code>supabase/schema.sql</Code> y ejecútalo. Se puede correr las veces
              que haga falta sin romper nada.
            </p>
          </>
        ) : (
          <p>Supabase respondió con un error al consultar los proyectos.</p>
        )}
        <p className="rounded-xl border border-border/50 bg-muted/50 p-3 font-mono text-xs">
          {data.message}
        </p>
      </SetupCard>
    );
  }

  const { projects, clients, stepsByProject } = data;
  const currentYear = new Date().getFullYear();
  const summary = {
    chart: buildChart(projects),
    revenueYear: projects
      .filter((p) => p.payment === 'paid' && new Date(p.created_at).getFullYear() === currentYear)
      .reduce((total, p) => total + (p.amount_clp ?? 0), 0),
    overdueMaintenance: projects.filter((p) => isMaintenanceOverdue(p.maintenance_until)).length,
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      {/* pt-32: el Header es `fixed top-0`, asi que el contenido tiene que
          empezar por debajo o el titulo se le monta encima. Mismo valor que
          usa /portafolio-web. */}
      <main className="flex-1 container pt-32 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
        <AdminDashboard
          projects={projects}
          clients={clients}
          stepsByProject={stepsByProject}
          summary={summary}
        />
      </main>
      <Footer />
    </div>
  );
}
