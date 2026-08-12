/**
 * Fuente unica de verdad del portafolio.
 *
 * Antes cada proyecto estaba escrito dos veces (en la seccion de la home y en
 * /portafolio-web) y las descripciones no coincidian entre si: el mismo sitio
 * aparecia como "ERP de inventario para retail industrial" en un lado y como
 * "ERP de inventarios y logistica" en el otro, cuando en realidad es un
 * software de control de obra. Ahora los dos leen de aca.
 *
 * Las descripciones salen de lo que cada sitio declara de si mismo en su
 * propia metadata, no de suposiciones.
 */

export type ProjectKind = 'producto' | 'cliente';

export type Project = {
  id: string;
  name: string;
  description: string;
  url: string;
  /**
   * Captura real en /public/proyectos. Si falta, la tarjeta cae en un panel de
   * marca en vez de una foto de stock: preferimos no tener imagen antes que
   * simular uuna que no es del proyecto.
   */
  image?: string;
  tags: string[];
  kind: ProjectKind;
  /** Aparece en la seccion de la home (las 6 mas fuertes). */
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  // --- Productos propios de Teo Labs ---------------------------------------
  {
    id: 'pagnol',
    name: 'PAGNOL',
    description:
      'ERP chileno de gestión de activos para faenas mineras y de construcción: pañol digital con QR y biometría, inventario en tiempo real, mantenimiento de equipos y reportes de terreno.',
    url: 'https://www.pagnol.cl/',
    image: '/proyectos/pagnol.png',
    tags: ['ERP', 'Minería', 'Biometría'],
    kind: 'producto',
    featured: true,
  },
  {
    id: 'gestion-de-obras',
    name: 'Gestión de Obras',
    description:
      'Software de control operativo para constructoras y contratistas: bodega de materiales, compras, avance físico con EDT y Carta Gantt, estados de pago, prevención de riesgos y asistencia.',
    url: 'https://www.gestiondeobras.app/',
    tags: ['SaaS', 'Construcción', 'Carta Gantt'],
    kind: 'producto',
    featured: true,
  },
  {
    id: 'fruto',
    name: 'Fruto',
    description:
      'E-commerce de frutas y verduras con delivery el mismo día en La Serena, Coquimbo y Las Compañías, con pagos por Mercado Pago y transferencia.',
    url: 'https://www.fruto.app/',
    tags: ['E-commerce', 'Delivery', 'Mercado Pago'],
    kind: 'producto',
    featured: true,
  },
  {
    id: 'hungry-ape',
    name: 'Hungry Ape',
    description:
      'Plataforma SaaS para food trucks: menú digital por QR, pedidos en tiempo real y control de stock e inventario.',
    url: 'https://ape.teolabs.app/',
    tags: ['SaaS', 'QR', 'Gastronomía'],
    kind: 'producto',
    featured: true,
  },
  {
    id: 'control-de-obra',
    name: 'Control de Obra',
    description:
      'Gestión y control de obra en tiempo real para constructoras, contratistas e inmobiliarias, potenciada con un asistente de IA.',
    url: 'https://ferroactiva.teolabs.app/',
    tags: ['Control de obra', 'IA', 'Tiempo real'],
    kind: 'producto',
  },
  {
    id: 'monty',
    name: 'Monty',
    description:
      'App para conductores de aplicación: registro de ingresos diarios, control de gastos y metas financieras mensuales.',
    url: 'https://monty.teolabs.app/',
    tags: ['App', 'Finanzas personales'],
    kind: 'producto',
  },
  {
    id: 'habii',
    name: 'Habii',
    description: 'Sistema personal de seguimiento de hábitos y rutinas diarias.',
    url: 'https://habii.teolabs.app/',
    tags: ['App', 'Producto propio'],
    kind: 'producto',
  },

  // --- Sitios de clientes ---------------------------------------------------
  {
    id: 'grupo-valar',
    name: 'Valar',
    description:
      'Sitio corporativo de Servicios y Proyectos Valar SpA (Antofagasta): obras civiles, movimiento de tierra, mantenimiento industrial e ingeniería 3D. Contratista de SQM, Copec, Coca-Cola Andina y Puerto Mejillones.',
    url: 'https://www.grupovalar.cl/',
    image: '/proyectos/grupovalar.png',
    tags: ['Corporativo', 'Industrial', 'SEO Pro'],
    kind: 'cliente',
    featured: true,
  },
  {
    id: 'plumber-servicios',
    name: 'Plumber Servicios',
    description:
      'Sitio corporativo para especialistas en ingeniería hidráulica, alcantarillado, redes de incendio y gasfitería industrial en Los Ángeles, Región del Biobío.',
    url: 'https://www.plumberservicios.cl/',
    image: '/proyectos/plumber.webp',
    tags: ['Corporativo', 'Hidráulica', 'SEO Local'],
    kind: 'cliente',
    featured: true,
  },
  {
    id: 'constructora-recarp',
    name: 'Constructora Recarp',
    description:
      'Sitio corporativo de Constructora Recarp SpA: terminaciones finas y construcción especializada en la Región de Coquimbo, con obras de hormigón armado y estructuras metálicas.',
    url: 'https://www.constructorarecarp.cl/',
    tags: ['Corporativo', 'Construcción', 'SEO'],
    kind: 'cliente',
  },
  {
    id: 'irarrazaval',
    name: 'Irarrázaval Servicios',
    description:
      'Sitio corporativo de Irarrázaval Servicios SpA, especialistas en ingeniería eléctrica y construcción civil.',
    url: 'https://www.irarrazavalservicios.cl/',
    tags: ['Corporativo', 'Ingeniería', 'Eléctrica'],
    kind: 'cliente',
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
