import Link from 'next/link';
import LegalPage, { LegalList, type LegalSection } from '@/components/layout/legal-page';

/**
 * Terminos de uso del sitio.
 *
 * Regulan el SITIO (navegar, cotizar, usar el agente demo), no los proyectos:
 * cada proyecto se rige por su propuesta escrita, que es lo que el sitio ya
 * promete ("alcance y cifra por escrito antes de escribir una linea de
 * codigo"). Por eso aca no hay plazos de pago, garantias ni condiciones de
 * entrega: inventarlas aca contradiria lo que despues se firma.
 */

const CONTACT = 'hola@teolabs.app';

const sections: LegalSection[] = [
  {
    id: 'alcance',
    title: 'Qué regulan estos términos',
    body: (
      <p>
        Estos términos regulan el uso de teolabs.app, el sitio de TEO LABS SpA, RUT 78.518.165-4 (La
        Serena, Región de Coquimbo, Chile). Al navegarlo, enviar el formulario o usar el agente de demostración, aceptas
        estas condiciones. Los servicios que contrates se rigen por su propia propuesta o contrato, como
        se explica más abajo.
      </p>
    ),
  },
  {
    id: 'precios',
    title: 'Precios e información publicada',
    body: (
      <>
        <p>
          Los precios publicados (por ejemplo, la web corporativa o los planes de e-commerce) están en
          pesos chilenos y son valores de referencia de cada plan. Pueden cambiar sin aviso previo, y no
          constituyen por sí solos una oferta vinculante.
        </p>
        <p>
          Lo que vale es la propuesta escrita que te enviamos para tu proyecto: indica el alcance, el
          precio, si incluye impuestos, los plazos y la forma de pago. Los servicios a medida (agentes de
          IA, CRM, ERP, apps) no tienen precio de lista y se cotizan siempre por escrito.
        </p>
      </>
    ),
  },
  {
    id: 'contratacion',
    title: 'Contratación de proyectos',
    body: (
      <p>
        Enviar el formulario o escribirnos es una solicitud de información, no una contratación. Un
        proyecto comienza cuando ambas partes aceptan por escrito su propuesta. Si algo de esa propuesta
        difiere de lo que dice este sitio, prevalece la propuesta.
      </p>
    ),
  },
  {
    id: 'agente',
    title: 'Agente de IA de demostración',
    body: (
      <LegalList
        items={[
          'Es una demostración: sus respuestas se generan automáticamente con inteligencia artificial y son orientativas.',
          'Puede equivocarse. Ningún precio, plazo o compromiso que mencione es vinculante; para eso está la cotización escrita.',
          'No ingreses datos personales, contraseñas ni información confidencial en tus preguntas.',
          'Las preguntas se procesan con un proveedor externo de IA, como se explica en la Política de privacidad.',
        ]}
      />
    ),
  },
  {
    id: 'uso',
    title: 'Uso permitido del sitio',
    body: (
      <>
        <p>Al usar el sitio te comprometes a no:</p>
        <LegalList
          items={[
            'Intentar acceder a áreas restringidas o vulnerar su seguridad.',
            'Enviar solicitudes automatizadas o masivas al formulario o al agente.',
            'Usar el sitio para enviar contenido ilícito, engañoso o de terceros sin autorización.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'propiedad',
    title: 'Propiedad intelectual',
    body: (
      <>
        <p>
          El diseño, los textos, el código y la marca Teo Labs pertenecen a Teo Labs. Lo mismo vale para
          los nombres de nuestros productos (PAGNOL, Gestión de Obras, Fruto, Hungry Ape, Monty y Habii).
          No puedes copiarlos ni reutilizarlos sin autorización escrita.
        </p>
        <p>
          Los nombres y logos de nuestros clientes pertenecen a sus dueños y se muestran como referencia de
          trabajos realizados. La propiedad de lo que desarrollemos para tu proyecto se define en su
          propuesta.
        </p>
      </>
    ),
  },
  {
    id: 'enlaces',
    title: 'Enlaces a otros sitios',
    body: (
      <p>
        El sitio enlaza a productos y sitios de clientes en línea para que puedas comprobar nuestro
        trabajo. Esos sitios tienen sus propias condiciones y políticas, de las que no somos responsables.
      </p>
    ),
  },
  {
    id: 'responsabilidad',
    title: 'Disponibilidad y responsabilidad',
    body: (
      <p>
        Hacemos lo posible para que el sitio esté disponible y su información sea exacta, pero puede haber
        interrupciones o errores. No respondemos por daños derivados de decisiones tomadas solo a partir
        del contenido del sitio o del agente de demostración, sin una propuesta escrita. Nada de esto
        limita los derechos que te reconoce la ley chilena, incluida la de protección al consumidor
        cuando corresponda.
      </p>
    ),
  },
  {
    id: 'privacidad',
    title: 'Datos personales',
    body: (
      <p>
        Cómo tratamos tus datos se explica en la{' '}
        <Link href="/privacidad" className="font-semibold text-foreground underline underline-offset-2">
          Política de privacidad
        </Link>
        , que forma parte de estos términos.
      </p>
    ),
  },
  {
    id: 'ley',
    title: 'Cambios, ley aplicable y contacto',
    body: (
      <p>
        Podemos actualizar estos términos; la versión vigente es la publicada aquí, con su fecha. Se rigen
        por las leyes de Chile, y cualquier controversia se someterá a los tribunales de La Serena, sin
        perjuicio de los derechos que la ley te reconozca. Para consultas, escríbenos a{' '}
        <a href={`mailto:${CONTACT}`} className="font-semibold text-foreground underline underline-offset-2">
          {CONTACT}
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Términos de uso"
      updated="10 de octubre de 2026"
      summary={[
        'Los precios del sitio son referencias en pesos chilenos. Lo que vale es la cotización escrita de tu proyecto.',
        'Enviar el formulario no te compromete a nada: un proyecto empieza cuando ambos aceptamos su propuesta.',
        'El agente de IA es una demostración: orienta, pero puede equivocarse y no fija precios ni plazos.',
        'Se rigen por la ley chilena y no limitan los derechos que ella te reconoce.',
      ]}
      sections={sections}
    />
  );
}
