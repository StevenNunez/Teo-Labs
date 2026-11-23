# Teo Labs

Sitio web corporativo de **Teo Labs** — ingeniería de software a medida para pymes y startups.
La Serena, Chile.

En producción: **[teolabs.app](https://www.teolabs.app)**

## Stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix) + **Framer Motion**
- **Genkit** con Gemini 2.5 Flash para las funciones de IA
- **Supabase** (opcional) para el seguimiento de proyectos
- Desplegado en **Vercel**

## Desarrollo local

```bash
npm install
cp .env.example .env   # y rellena los valores
npm run dev            # http://localhost:3000
```

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en el puerto 3000 |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build de producción |
| `npm run typecheck` | Valida los tipos de TypeScript |
| `npm run lint` | Linter de Next.js |
| `npm run genkit:dev` | Levanta la UI de desarrollo de Genkit |

## Variables de entorno

Ver [`.env.example`](.env.example). Las de IA son obligatorias para que funcionen el
demo del agente ("Prueba un agente ahora") y el generador de reportes; las de Supabase son opcionales
(sin ellas el cliente no se inicializa y la app sigue operando).

## Despliegue

El sitio se despliega en Vercel. Cada push a `main` publica una versión nueva.
El dominio principal es `teolabs.app`; `www.teolabs.app` redirige a él (308).

Antes del primer deploy con base de datos, correr en el SQL Editor de Supabase
`supabase/schema.sql` y después `supabase/0002_errores_y_frenos.sql`.

---

Desarrollado por [Teo Labs](https://www.teolabs.app) ®
