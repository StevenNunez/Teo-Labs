# Teo Labs

Sitio web corporativo de **Teo Labs** — ingeniería de software a medida para pymes y startups.
La Serena, Chile.

En producción: **[teolabs.app](https://www.teolabs.app)**

## Stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix) + **Framer Motion**
- **Genkit** con Gemini 2.5 Flash para las funciones de IA
- **Supabase** (opcional) para el seguimiento de proyectos
- Desplegado en **Firebase App Hosting**

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
validador de ideas y el generador de reportes; las de Supabase son opcionales
(sin ellas el cliente no se inicializa y la app sigue operando).

## Despliegue

El sitio se despliega en Firebase App Hosting. Cada push a `main` dispara un
rollout automático. La configuración del backend vive en `apphosting.yaml`.

---

Desarrollado por [Teo Labs](https://www.teolabs.app) ®
