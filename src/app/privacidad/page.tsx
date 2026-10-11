import LegalPage, { LegalList, type LegalSection } from '@/components/layout/legal-page';

/**
 * Politica de privacidad.
 *
 * Cada afirmacion de esta pagina sale de lo que el sitio hace de verdad, y hay
 * que actualizarla si eso cambia:
 * - Formulario (project-wizard.tsx): nombre, correo, WhatsApp y las respuestas
 *   del wizard. Se guardan en Supabase (tabla `leads`) y se envian por correo
 *   con Web3Forms.
 * - Agente demo (agent-demo.tsx -> validate-idea.ts): la pregunta va a Google
 *   Gemini a traves de Genkit. No se guarda en nuestra base.
 * - Analytics (analytics.tsx): GA4 solo carga si el visitante acepta en el
 *   banner. Sin aceptar no se carga nada.
 * - Almacenamiento local: `cookie-consent` y `teolabs-theme` (localStorage),
 *   `teolabs-splash-seen` (sessionStorage). Ninguno identifica a la persona.
 * - Hosting: Firebase App Hosting (Google Cloud).
 *
 * Marco legal: Ley 19.628 vigente, y redactada para la Ley 21.719 (publicada el
 * 13-12-2024), cuya entrada en vigencia estaba fijada para el 1-12-2026 con un
 * proyecto en el Congreso para postergarla. Por eso no se cita una fecha.
 */

const CONTACT = 'hola@teolabs.app';

const sections: LegalSection[] = [
  {
    id: 'responsable',
    title: 'Quién es responsable de tus datos',
    body: (
      <p>
        <strong className="text-foreground">TEO LABS SpA</strong>, RUT 78.518.165-4, software house con
        base en La Serena, Región de Coquimbo, Chile, es responsable del tratamiento de los datos que
        se recogen en teolabs.app. Para cualquier consulta sobre esta
        política o sobre tus datos, escríbenos a{' '}
        <a href={`mailto:${CONTACT}`} className="font-semibold text-foreground underline underline-offset-2">
          {CONTACT}
        </a>
        .
      </p>
    ),
  },
  {
    id: 'que-datos',
    title: 'Qué datos recogemos',
    body: (
      <>
        <p>Solo lo que tú nos entregas, y solo en estos casos:</p>
        <LegalList
          items={[
            <>
              <strong className="text-foreground">Formulario de cotización:</strong> tu nombre, correo
              electrónico y número de WhatsApp, más lo que respondes sobre tu proyecto (tipo, rango de
              presupuesto, plazo y mensaje).
            </>,
            <>
              <strong className="text-foreground">Agente de IA de demostración:</strong> la pregunta que
              escribes. No te pide datos personales y te recomendamos no incluirlos.
            </>,
            <>
              <strong className="text-foreground">WhatsApp y correo:</strong> si nos escribes por esos
              canales, lo que tú nos envíes.
            </>,
            <>
              <strong className="text-foreground">Navegación:</strong> solo si aceptas el aviso de
              cookies, datos de uso del sitio a través de Google Analytics (páginas visitadas, dispositivo,
              origen de la visita), con la dirección IP anonimizada.
            </>,
          ]}
        />
        <p>No recogemos datos sensibles ni datos de pago en este sitio.</p>
      </>
    ),
  },
  {
    id: 'para-que',
    title: 'Para qué los usamos',
    body: (
      <LegalList
        items={[
          'Responder tu consulta y preparar una propuesta o cotización.',
          'Contactarte por correo o WhatsApp sobre esa solicitud.',
          'Si contratas un proyecto, gestionar la relación comercial y mantenerte al tanto de su avance.',
          'Si aceptaste la medición, entender cómo se usa el sitio para mejorarlo.',
        ]}
      />
    ),
  },
  {
    id: 'base',
    title: 'Con qué base legal',
    body: (
      <p>
        Tratamos tus datos porque tú los entregas y consientes al enviar el formulario o escribirnos, y
        porque son necesarios para responder tu solicitud y, si corresponde, ejecutar el contrato. La
        medición con Google Analytics se basa únicamente en tu consentimiento, que das o rechazas en el
        aviso de cookies.
      </p>
    ),
  },
  {
    id: 'terceros',
    title: 'Con quién los compartimos',
    body: (
      <>
        <p>
          No vendemos ni cedemos tus datos. Para que el sitio funcione usamos estos proveedores, que los
          tratan por cuenta nuestra:
        </p>
        <LegalList
          items={[
            <><strong className="text-foreground">Supabase:</strong> base de datos donde quedan guardadas las solicitudes del formulario.</>,
            <><strong className="text-foreground">Web3Forms:</strong> envío por correo de cada solicitud del formulario.</>,
            <><strong className="text-foreground">Google Cloud (Firebase App Hosting):</strong> servidores donde corre el sitio.</>,
            <><strong className="text-foreground">Google (Gemini):</strong> procesa las preguntas del agente de demostración para generar la respuesta.</>,
            <><strong className="text-foreground">Google Analytics:</strong> solo si aceptas la medición.</>,
            <><strong className="text-foreground">WhatsApp (Meta):</strong> solo si eliges escribirnos por ese canal.</>,
          ]}
        />
        <p>
          Algunos de estos proveedores pueden alojar la información fuera de Chile. Solo trabajamos con
          servicios que aplican medidas de seguridad reconocidas.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies y almacenamiento del navegador',
    body: (
      <>
        <p>
          El sitio guarda en tu navegador tres preferencias técnicas que no te identifican: si aceptaste
          o rechazaste la medición, el tema claro u oscuro que elegiste, y que ya viste la animación de
          entrada (esta última se borra al cerrar la pestaña).
        </p>
        <p>
          Las cookies de Google Analytics solo se instalan si aceptas el aviso. Si lo rechazas o lo
          cierras, no se carga ninguna herramienta de medición. Puedes cambiar tu decisión borrando los
          datos del sitio en tu navegador.
        </p>
      </>
    ),
  },
  {
    id: 'plazo',
    title: 'Cuánto tiempo los guardamos',
    body: (
      <p>
        Las solicitudes de cotización se conservan mientras dure la conversación comercial y hasta 24
        meses desde el último contacto, salvo que nos pidas borrarlas antes. Si contratas un proyecto,
        conservamos los datos necesarios durante la relación y el tiempo que exija la ley (por ejemplo, la
        tributaria).
      </p>
    ),
  },
  {
    id: 'derechos',
    title: 'Tus derechos',
    body: (
      <>
        <p>Respecto de tus datos personales, puedes pedirnos en cualquier momento:</p>
        <LegalList
          items={[
            'Acceso: saber qué datos tuyos tenemos y para qué.',
            'Rectificación: corregirlos si están incompletos o equivocados.',
            'Supresión: que los eliminemos.',
            'Oposición: que dejemos de usarlos para un fin determinado.',
            'Portabilidad: recibirlos en un formato que puedas llevar a otro proveedor.',
            'Bloqueo: que suspendamos su uso mientras se resuelve una solicitud tuya.',
          ]}
        />
        <p>
          Escríbenos a{' '}
          <a href={`mailto:${CONTACT}`} className="font-semibold text-foreground underline underline-offset-2">
            {CONTACT}
          </a>{' '}
          desde el correo que usaste en el formulario. Te respondemos dentro de los plazos que fija la
          ley. Si no quedas conforme con la respuesta, puedes recurrir a la autoridad de protección de
          datos competente.
        </p>
      </>
    ),
  },
  {
    id: 'seguridad',
    title: 'Seguridad',
    body: (
      <p>
        El sitio funciona solo con conexión cifrada (HTTPS). Las solicitudes se guardan en una base con
        acceso restringido: no pueden leerse desde el navegador, solo desde nuestro servidor con
        credenciales privadas. Ningún sistema es invulnerable, pero si detectamos un incidente que afecte
        tus datos, te lo informaremos.
      </p>
    ),
  },
  {
    id: 'cambios',
    title: 'Cambios a esta política',
    body: (
      <p>
        Si cambiamos cómo tratamos los datos (por ejemplo, al sumar una herramienta nueva), actualizaremos
        esta página y su fecha. Los cambios importantes los destacaremos en el sitio.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Política de privacidad"
      updated="10 de octubre de 2026"
      summary={[
        'Solo pedimos lo necesario para responderte: nombre, correo, WhatsApp y lo que nos cuentes de tu proyecto.',
        'No vendemos ni cedemos tus datos. Los usan solo los servicios que hacen funcionar el sitio.',
        'Google Analytics se carga únicamente si lo aceptas en el aviso de cookies.',
        <>
          Puedes pedir ver, corregir o borrar tus datos cuando quieras escribiendo a{' '}
          <a href={`mailto:${CONTACT}`} className="font-semibold underline underline-offset-2">
            {CONTACT}
          </a>
          .
        </>,
      ]}
      sections={sections}
    />
  );
}
