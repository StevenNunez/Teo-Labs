-- ---------------------------------------------------------------------------
-- Esquema de Teo Labs (Supabase / Postgres)
--
-- Se ejecuta una sola vez, completo, en el SQL Editor de Supabase.
-- Es idempotente: se puede volver a correr sin romper nada.
--
-- Modelo de acceso, que es lo que explica el resto del archivo:
--
--   * RLS queda ACTIVADO en todas las tablas y casi sin politicas. Eso significa
--     que la anon key (la que viaja al navegador, publica por definicion) no
--     puede leer absolutamente nada: ni clientes, ni montos, ni estados de pago.
--   * El panel /admin y la pagina /seguimiento leen desde el SERVIDOR con la
--     service_role key, que se salta RLS y nunca sale al browser.
--   * La unica excepcion es `leads`: el wizard corre en el navegador y necesita
--     poder INSERTAR. Puede escribir, no puede leer lo que escribieron otros.
-- ---------------------------------------------------------------------------

-- Tipos -----------------------------------------------------------------------
-- Postgres no tiene "create type if not exists", de ahi el bloque.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'project_status') then
    create type project_status as enum ('in_progress', 'active', 'paused', 'finished');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('pending', 'partial', 'paid');
  end if;
  if not exists (select 1 from pg_type where typname = 'step_status') then
    create type step_status as enum ('pending', 'in_progress', 'completed');
  end if;
end $$;

-- Clientes --------------------------------------------------------------------
create table if not exists public.clients (
  id           uuid primary key default gen_random_uuid(),
  -- Nombre con el que factura: "Recarp SpA".
  name         text not null,
  -- Persona con la que se habla: "Dr. Smith".
  contact_name text,
  email        text,
  whatsapp     text,
  created_at   timestamptz not null default now()
);

-- Proyectos -------------------------------------------------------------------
create table if not exists public.projects (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references public.clients(id) on delete cascade,
  name              text not null,
  type              text not null default 'Web Corporativa',
  status            project_status not null default 'in_progress',
  payment           payment_status not null default 'pending',
  progress          smallint not null default 0 check (progress between 0 and 100),
  -- Lo que se muestra en el panel y en el reporte con IA.
  current_step      text,
  next_milestone    text,
  delivery_date     date,
  -- Hasta cuando corre el mantenimiento contratado. Vencido = fila roja.
  maintenance_until date,
  -- En pesos, sin decimales: el peso chileno no los usa.
  amount_clp        integer,
  -- Link que ve el cliente en "Ver Prototipo". Opcional.
  prototype_url     text,
  -- Notas internas: NO se muestran en /seguimiento.
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists projects_client_id_idx on public.projects (client_id);

-- Etapas del proyecto ---------------------------------------------------------
-- Son la "Ruta de Trabajo" que ve el cliente en /seguimiento/[id]. Van en tabla
-- aparte y no como columna JSON porque cada etapa cambia de estado por separado.
create table if not exists public.project_steps (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  -- Orden de la linea de tiempo, empezando en 1.
  position    smallint not null,
  name        text not null,
  description text,
  status      step_status not null default 'pending',
  unique (project_id, position)
);

create index if not exists project_steps_project_id_idx on public.project_steps (project_id);

-- Leads del wizard ------------------------------------------------------------
-- Ya la usaba src/components/sections/project-wizard.tsx; aca queda declarada.
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text,
  whatsapp        text,
  -- El objeto completo del formulario, tal cual lo manda el wizard.
  project_details jsonb,
  created_at      timestamptz not null default now()
);

-- updated_at automatico --------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- Row Level Security ----------------------------------------------------------
alter table public.clients       enable row level security;
alter table public.projects      enable row level security;
alter table public.project_steps enable row level security;
alter table public.leads         enable row level security;

-- Sin politicas de SELECT a proposito: nadie lee con la anon key.
-- La service_role key ignora RLS, y es la unica que usa el servidor.

-- Unica politica del esquema: el wizard publico puede dejar su lead.
-- `with check (true)` permite insertar; sin politica de select, no puede
-- leer los leads de nadie mas (ni los propios).
drop policy if exists "wizard publico puede crear leads" on public.leads;
create policy "wizard publico puede crear leads"
  on public.leads
  for insert
  to anon
  with check (true);
