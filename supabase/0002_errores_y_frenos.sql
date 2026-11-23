-- ============================================================================
-- 0002 — Registro de errores y frenos de uso
--
-- CÓMO SE APLICA: Supabase → SQL Editor del proyecto de teolabs.app → pegar
-- entero → Run. Es idempotente: correrlo dos veces no rompe nada. Va después
-- de schema.sql.
--
-- 1) ERRORES. Cuando algo falla en el sitio (una página que no carga, el
--    asesor de IA, el panel), el servidor lo anota acá y la primera vez que
--    aparece un error nuevo manda un aviso a hola@teolabs.app. Una fila por
--    error, no por vez: la `huella` agrupa el mismo error (mismo lugar y mismo
--    mensaje, sin números ni identificadores). Si un error marcado como
--    resuelto vuelve a aparecer, se reabre y avisa de nuevo.
--
-- 2) FRENOS. Cuenta cuántas veces alguien usó algo en una ventana de tiempo
--    (por ejemplo, preguntas al asesor de IA por IP y por hora), para que
--    nadie pueda gastar la clave de Gemini haciendo miles de llamadas.
--
-- Las dos tablas tienen RLS sin políticas: solo el servidor (clave de
-- servicio) las toca. Se revisan en el panel de Supabase → Table Editor.
-- ============================================================================

-- ---------------------------------------------------------------- errores ---

create table if not exists public.errores (
  huella        text primary key,
  origen        text not null check (origen in ('navegador', 'servidor')),
  donde         text not null,
  mensaje       text not null,
  detalle       jsonb not null default '{}'::jsonb,
  veces         integer not null default 1,
  primera_vez   timestamptz not null default now(),
  ultima_vez    timestamptz not null default now(),
  resuelto      boolean not null default false
);

comment on table public.errores is
  'Errores de teolabs.app agrupados por huella (lugar + mensaje normalizado). Los escribe el servidor; marcar resuelto = true al arreglar: si vuelve a pasar, se reabre y avisa.';

create index if not exists errores_recientes on public.errores (resuelto, ultima_vez desc);

alter table public.errores enable row level security;

/* Anota un error y dice si es nuevo (o si vuelve después de resuelto), para
   que el servidor avise solo esa vez. */
create or replace function public.registrar_error(
  p_huella text,
  p_origen text,
  p_donde text,
  p_mensaje text,
  p_detalle jsonb
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  previo boolean;
begin
  select resuelto into previo from public.errores where huella = p_huella;

  insert into public.errores (huella, origen, donde, mensaje, detalle)
  values (p_huella, p_origen, left(p_donde, 300), left(p_mensaje, 2000), coalesce(p_detalle, '{}'::jsonb))
  on conflict (huella) do update
    set veces      = public.errores.veces + 1,
        ultima_vez = now(),
        detalle    = excluded.detalle,
        resuelto   = false;

  return previo is null or previo;
end;
$$;

revoke all on function public.registrar_error(text, text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.registrar_error(text, text, text, text, jsonb) to service_role;

-- ----------------------------------------------------------------- frenos ---

create table if not exists public.frenos (
  clave   text primary key,
  desde   timestamptz not null default now(),
  usos    integer not null default 1
);

comment on table public.frenos is
  'Contadores de uso por ventana de tiempo (p. ej. preguntas al asesor de IA por IP). Las filas viejas se limpian solas.';

alter table public.frenos enable row level security;

/* Suma un uso a `p_clave` y dice si todavía está dentro del límite. La ventana
   empieza con el primer uso y se reinicia cuando vence. */
create or replace function public.tomar_turno(
  p_clave text,
  p_maximo integer,
  p_ventana_segundos integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  insert into public.frenos as f (clave, desde, usos)
  values (left(p_clave, 200), now(), 1)
  on conflict (clave) do update
    set usos  = case when f.desde < now() - make_interval(secs => p_ventana_segundos) then 1 else f.usos + 1 end,
        desde = case when f.desde < now() - make_interval(secs => p_ventana_segundos) then now() else f.desde end
  returning usos into n;

  -- De vez en cuando, barrer lo que tiene más de un día.
  if random() < 0.02 then
    delete from public.frenos where desde < now() - interval '1 day';
  end if;

  return n <= p_maximo;
end;
$$;

revoke all on function public.tomar_turno(text, integer, integer) from public, anon, authenticated;
grant execute on function public.tomar_turno(text, integer, integer) to service_role;

notify pgrst, 'reload schema';
