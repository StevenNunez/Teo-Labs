<div align="center">

# TEO LABS

**Software a medida, agentes de IA y CRM para pymes chilenas**

El sitio de Teo Labs: vitrina comercial, cotizador, asesor con IA en vivo y el panel
desde donde se lleva cada proyecto de cliente hasta la entrega.

Un producto de **[Teo Labs](https://www.teolabs.app)** ®

</div>

---

## De qué se trata

Teo Labs es una software house de La Serena que construye software propio para pymes y
startups: páginas web, tiendas online, CRM, ERP y agentes de IA. El sitio tiene que
resolver dos trabajos a la vez.

**Hacia afuera, vender.** Quien llega desde Google o desde un link de WhatsApp tiene que
entender en segundos qué hace Teo Labs, cuánto cuesta, y poder cotizar sin hablar con
nadie todavía:

- ¿Cuánto cuesta una página web o una tienda online? *(precios publicados, en pesos)*
- ¿Esto ya funciona en empresas reales? *(portafolio con productos en producción)*
- ¿Qué es un agente de IA y para qué me sirve? *(se prueba ahí mismo, en vivo)*
- ¿Cómo empiezo? *(cotizador de tres pasos, respuesta en menos de 48 horas)*

**Hacia adentro, ordenar.** Cada proyecto cerrado pasa al panel interno, donde se
registra el cliente, el monto, el estado de pago y las etapas del trabajo. El cliente
recibe un link privado para ver el avance de su proyecto sin tener que preguntar, y el
equipo genera con IA el mensaje de avance listo para mandar por WhatsApp.

---

## Lo que hace el sitio público

| Sección | Qué hace |
|---|---|
| **Portada** | Propuesta de valor, clientes, servicios con precios, agentes de IA, proyectos, testimonios, preguntas frecuentes y contacto, en una sola página renderizada en el servidor. |
| **Servicios y precios** | Web corporativa ($80.000), e-commerce en tres niveles ($180.000 / $230.000 / $280.000) y lo que se cotiza: agentes de IA, CRM, ERP y apps a medida. |
| **Asesor de IA en vivo** | "Prueba un agente ahora": responde dudas sobre servicios y precios con Gemini, con la misma base de conocimiento que usa el equipo. Es a la vez atención y demostración del producto. |
| **Cotizador** | Asistente de tres pasos (tipo de proyecto, presupuesto y plazo, datos de contacto) con validación en cada paso. La solicitud queda guardada en Supabase y llega por correo. |
| **Portafolio** (`/portafolio-web`) | Productos propios en producción (PAGNOL, Gestión de Obras, Fruto, Hungry Ape) y sitios de clientes. |
| **Demos** (`/demo/*`) | Maquetas navegables por rubro: boutique, clínica, fitness, inmobiliaria, estudio jurídico y logística. Fuera del buscador (`noindex`). |
| **Legales** | Política de privacidad y términos de uso escritos para la ley chilena, con resumen en lenguaje simple. |
| **WhatsApp directo** | Botón flotante y llamada a la acción en celular. |
| **Medición con consentimiento** | Google Analytics 4 solo se carga si el visitante acepta el aviso de cookies; registra eventos del cotizador y del asesor. |

---

## Lo que hace el panel (`/admin`)

Protegido con clave (`ADMIN_PASSWORD`). Si la variable no está configurada, el panel no
se sirve: falla cerrado.

| Módulo | Qué permite |
|---|---|
| **Centro de mandos** | Proyectos iniciados en los últimos 6 meses y facturación del año. |
| **Gestión de proyectos** | Lista con buscador por cliente o proyecto: tipo, estado (en curso, activo, pausado, terminado), pago (pendiente, parcial, pagado), avance y vencimiento de la mantención, marcada en rojo si ya venció. |
| **Alta y edición** | Proyecto nuevo con cliente existente o nuevo, monto en pesos, fecha de entrega, mantención, link al prototipo y notas internas. |
| **Ruta de trabajo** | Cada proyecto nace con sus etapas (planificación y diseño, desarrollo de la interfaz, conexión con tus datos…). Moverlas es lo que el cliente ve avanzar. |
| **Reporte con IA** | Genera el mensaje de avance para el cliente con el progreso, la etapa actual y el próximo hito, y lo abre en WhatsApp listo para enviar. |
| **Ver como cliente** | Abre la página de seguimiento tal como la ve el cliente. |

---

## Lo que ve el cliente (`/seguimiento/<id>`)

Un link privado por proyecto, sin cuenta ni contraseña: nombre del proyecto, porcentaje
de avance, entrega estimada, la ruta de trabajo con cada etapa (pendiente, en curso,
completada), el prototipo si ya existe y un botón para escribir observaciones por
WhatsApp. No muestra montos, notas internas ni estado de pago.

---

## El recorrido de un cliente

```
  Visita        ──►  llega a teolabs.app desde Google o un link compartido;
                     el HTML ya trae todo el contenido (lo leen Google y las IAs).
        │
  Asesor IA     ──►  pregunta "¿cuánto cuesta una tienda online?". validateIdea()
                     revisa el largo y el freno por IP, y Gemini responde con los
                     precios publicados, nunca inventados.
        │
  Cotizador     ──►  elige tipo, presupuesto y plazo. La solicitud se guarda en
                     `leads` (la clave pública solo puede insertar, nunca leer)
                     y llega por correo al equipo.
        │
  Proyecto      ──►  cerrado el trato, se crea en /admin con su cliente, monto y
                     etapas por defecto en `projects` y `project_steps`.
        │
  Avance        ──►  el equipo mueve etapas y el porcentaje; "Reporte con IA"
                     arma el mensaje y lo abre en WhatsApp con el link privado.
        │
  Seguimiento   ──►  el cliente abre /seguimiento/<id> y ve el avance en tiempo
                     real, sin pedir actualizaciones.
```

---

## Las decisiones que sostienen el sistema

**1. Los datos de clientes nunca pasan por el navegador.** Las tablas de clientes y
proyectos tienen RLS activo y ninguna política de lectura: la clave pública no puede
leer nada. El panel y el seguimiento leen desde el servidor con la clave de servicio,
que no sale nunca del servidor.

**2. El panel tiene dos cerraduras.** La puerta de `/admin` pide la clave, y además cada
acción del panel (crear, editar, mover etapas, generar el reporte) la vuelve a verificar
por su cuenta. Si mañana cambia una ruta, los datos no quedan expuestos.

**3. La IA pública tiene freno.** El asesor de la portada acepta preguntas de hasta 500
caracteres, 10 por hora por conexión y 300 al día en total. Nadie puede gastar la clave
de Gemini haciendo miles de llamadas; quien llega al límite es invitado a WhatsApp.

**4. El cliente ve su avance, no el negocio.** El seguimiento muestra etapas, avance y
fechas; los montos, las notas y el estado de pago se quedan en el panel.

**5. Si algo falla, Teo Labs se entera primero.** Los errores del servidor y de las
pantallas quedan anotados y agrupados en Supabase, y el primero de cada tipo llega por
correo. Un deploy nuevo no se confunde con un error: la pantalla se recarga sola una vez.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 (App Router, Server Components y Server Actions), React 18, TypeScript |
| Diseño | Tailwind CSS, shadcn/ui (Radix), Framer Motion, Three.js |
| IA | Genkit con Gemini (asesor de la portada y reportes de avance) |
| Base de datos | PostgreSQL en Supabase, RLS en todas las tablas, funciones SQL para errores y frenos |
| Formularios | React Hook Form + Zod, en el navegador y otra vez en el servidor |
| Correo | Web3Forms (solicitudes de cotización) y SMTP de Zoho (avisos de errores) |
| Medición | Google Analytics 4 con consentimiento |
| SEO | Metadata por página, `opengraph-image`, `sitemap`, `robots`, JSON-LD (`ProfessionalService`, `FAQPage`) y `llms.txt` |
| Deploy | Vercel, dominio `teolabs.app` |

---

## Puesta en marcha

```bash
git clone https://github.com/StevenNunez/Teo-Labs.git
cd Teo-Labs
npm install

cp .env.example .env   # Gemini, Supabase, clave del panel y correo
```

**1. Base de datos.** En Supabase → SQL Editor, ejecutar enteros y en este orden:
[`supabase/schema.sql`](supabase/schema.sql) (clientes, proyectos, etapas, solicitudes y
RLS) y [`supabase/0002_errores_y_frenos.sql`](supabase/0002_errores_y_frenos.sql)
(registro de errores y frenos de uso). Los dos se pueden volver a correr sin romper nada.

**2. Arrancar.**

```bash
npm run dev          # http://localhost:3000
npm run build        # build de producción
npm run typecheck    # tsc --noEmit
npm run genkit:dev   # consola de desarrollo de Genkit para probar los flujos de IA
```

Sin las variables de Supabase el sitio público funciona igual; el panel muestra cómo
configurarlo en vez de datos.

---

## Estructura

```
src/
├── app/
│   ├── page.tsx               portada
│   ├── portafolio-web/        portafolio
│   ├── demo/                  maquetas por rubro (noindex)
│   ├── privacidad/ terminos/  legales
│   ├── admin/                 panel: proyectos, acciones del servidor y diálogo de edición
│   ├── seguimiento/[id]/      página privada de avance para el cliente
│   ├── api/errores/           recibe los errores de pantalla
│   ├── error.tsx not-found.tsx
│   └── sitemap.ts robots.ts opengraph-image.tsx
├── ai/flows/                  asesor de la portada y reporte de avance (Genkit)
├── components/
│   ├── sections/              secciones de la portada, cotizador y asesor
│   ├── layout/                cabecera, pie, cookies, Analytics, WhatsApp
│   ├── demo/                  kit común de las demos
│   └── ui/                    componentes base y firma InteractiveLogo
├── lib/                       Supabase, clave del panel, frenos, errores, correo, SEO
├── instrumentation.ts         errores del servidor al registro
└── middleware.ts              clave de /admin

supabase/                      esquema y migraciones SQL
public/                        logos de clientes y llms.txt
```

---

## Deploy en Vercel

Cada push a `main` publica una versión nueva. Variables en el proyecto de Vercel: las de
[`.env.example`](.env.example). El dominio principal es `teolabs.app`;
`www.teolabs.app` redirige a él con 308, igual que el canonical que declara el sitio.

---

## Seguridad

- `.env` nunca se sube al repositorio; `.env.example` solo trae los nombres.
- `SUPABASE_SERVICE_ROLE_KEY` se usa solo en el servidor (`import 'server-only'`) y jamás
  lleva prefijo `NEXT_PUBLIC_`.
- RLS activo en todas las tablas; la clave pública solo puede insertar solicitudes.
- `/admin` con clave comparada en tiempo constante, verificada también en cada acción.
- El seguimiento es público por diseño y se protege con un id UUID imposible de adivinar;
  no muestra datos comerciales.
- Frenos por IP en el asesor de IA y en el registro de errores.

---

<div align="center">

### Construido por Teo Labs

Diseño, arquitectura e ingeniería de **[Teo Labs](https://www.teolabs.app)** ®

*Software que ya corre en empresas reales.*

</div>
