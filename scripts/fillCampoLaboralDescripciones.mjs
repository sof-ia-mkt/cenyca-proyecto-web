// Llena las descripciones del campo laboral para todas las carreras.
// Mantiene el _key existente de cada item y solo actualiza el campo `descripcion`
// cuando hay un match exacto por título.

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "1zsi1hi5",
  dataset: "production",
  apiVersion: "2026-04-07",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// Descripciones por docId → titulo → descripcion (2-3 oraciones, tono profesional)
const DATA = {
  "carrera-administracion": {
    "Gerencia General":
      "Diriges la operación completa de una empresa: defines la estrategia, coordinas las áreas y respondes por los resultados. Es el camino natural hacia la dirección general en compañías locales, maquiladoras o cadenas regionales.",
    "Recursos Humanos":
      "Diseñas políticas de atracción, desarrollo y retención del talento clave de la organización. Trabajas codo a codo con la dirección para construir cultura, planes de compensación y planes de carrera en empresas con plantillas medianas y grandes.",
    "Consultoría Empresarial":
      "Asesoras a empresas externas en problemas concretos: rentabilidad, estructura, expansión o transformación digital. Es ideal si quieres exposición a múltiples industrias sin atarte a una sola compañía.",
    "Finanzas Corporativas":
      "Gestionas el dinero de la empresa: presupuestos, flujo, financiamiento e inversión. Te conviertes en el socio estratégico del CEO para decidir cuándo crecer, cuándo invertir y cómo proteger el capital.",
    "Emprendimiento Propio":
      "Aplicas todo lo aprendido para construir tu propia empresa, desde la idea hasta la operación. Tijuana y el noroeste ofrecen acceso a capital, mercado binacional y ecosistema de proveedores ideal para arrancar.",
    "Dirección Comercial":
      "Lideras los equipos de ventas y marketing y respondes por la facturación de la empresa. Diseñas estrategias de canal, precios y posicionamiento para crecer market share en mercados locales o de exportación.",
    "Gestión de Proyectos":
      "Coordinas iniciativas que cruzan varias áreas: lanzamientos, expansiones, implementaciones tecnológicas. Aplicas metodologías como PMI o ágil para entregar a tiempo, en presupuesto y con la calidad acordada.",
    "Sector Público":
      "Aportas visión gerencial al gobierno municipal, estatal o federal: planeación, presupuesto, evaluación de programas y modernización administrativa. Una vía con alto impacto social y proyección política.",
  },
  "carrera-educacion": {
    Docencia:
      "Diseñas e impartes clases en preescolar, primaria, secundaria o nivel superior. Más que dar clase, formas criterio, valores y habilidades que acompañan a tus alumnos toda la vida.",
    "Diseño Curricular":
      "Construyes planes y programas de estudio: defines competencias, secuencias didácticas y formas de evaluación. Trabajas con escuelas, universidades o instituciones que necesitan modernizar su oferta educativa.",
    Psicopedagogía:
      "Acompañas a estudiantes con dificultades de aprendizaje, atención o conducta. Diseñas intervenciones individualizadas y trabajas con padres y maestros para garantizar trayectorias exitosas.",
    "Tecnología Educativa":
      "Integras plataformas digitales, IA y herramientas multimedia para potenciar el aprendizaje. Es uno de los campos con mayor crecimiento desde la pandemia, especialmente en educación híbrida y corporativa.",
    "Capacitación Corporativa":
      "Diseñas programas de formación dentro de empresas: onboarding, liderazgo, habilidades técnicas, certificaciones. Una salida muy demandada en la maquiladora y en compañías con planes de carrera estructurados.",
    "Gestión Escolar":
      "Diriges una escuela o una red de planteles: administras presupuesto, plantilla docente, vinculación con padres y autoridades. Es el paso hacia direcciones y subdirecciones académicas.",
    "Orientación Vocacional":
      "Acompañas a jóvenes en la elección de carrera y proyecto de vida mediante pruebas, entrevistas y talleres. Trabajas en preparatorias, universidades o consultorías privadas.",
    Investigación:
      "Estudias problemas educativos reales: deserción, brechas de aprendizaje, eficacia de métodos. Publicas, propones políticas y trabajas con universidades, fundaciones o centros de investigación.",
  },
  "carrera-contaduria": {
    "Auditoría Financiera":
      "Revisas los estados financieros de empresas para garantizar que reflejan la realidad y cumplen con la normativa. Trabajas en firmas como las Big Four, despachos locales o áreas internas de auditoría.",
    "Asesoría Fiscal":
      "Diseñas estrategias para que personas y empresas paguen lo justo, ni un peso de más. En el contexto frontera con régimen IMMEX y operaciones binacionales, es una de las especialidades mejor pagadas.",
    "Banca Financiera":
      "Trabajas en bancos comerciales o de inversión: análisis de crédito, productos financieros, banca patrimonial o tesorería. Ideal si te interesa el sistema financiero y los grandes flujos de capital.",
    Contraloría:
      "Eres el guardián financiero de la empresa: controlas presupuestos, costos, márgenes y compliance. Es el paso natural hacia CFO en compañías medianas y grandes.",
    "Despacho Propio":
      "Montas tu propia firma para asesorar a empresas y personas en contabilidad, impuestos y finanzas. Tijuana concentra miles de pymes y maquilas que necesitan asesoría especializada.",
    "Consultoría en Inversiones":
      "Asesoras a personas y empresas para invertir su dinero según objetivos y tolerancia al riesgo. Requiere certificaciones AMIB, pero ofrece ingresos altos y trabajo con patrimonios significativos.",
    Fintech:
      "Trabajas en empresas tecnológicas que reinventan los servicios financieros: pagos, crédito, ahorro o seguros. Un sector con crecimiento explosivo y demanda de profesionales que entiendan finanzas y tecnología.",
    "Finanzas Corporativas":
      "Gestionas las decisiones financieras de gran impacto: fusiones, financiamiento, inversión en capital, planeación de largo plazo. Es el camino hacia direcciones de finanzas y CFO.",
  },
  "carrera-criminologia": {
    "Perito Criminalista":
      "Procesas la escena del crimen: levantas evidencia física, biológica o digital, la analizas y elaboras dictámenes que se presentan en juicio. Eres pieza clave para que la justicia se sostenga en hechos, no en suposiciones.",
    "Fiscalías y Ministerios":
      "Te incorporas a las fiscalías estatales o federales para integrar carpetas de investigación, coordinar policías de investigación y litigar audiencias bajo el sistema penal acusatorio.",
    "Seguridad Corporativa":
      "Diseñas y operas la seguridad de empresas medianas y grandes: análisis de riesgos, prevención de fraudes internos, protección de personal e instalaciones. Una salida muy demandada en maquiladoras y empresas binacionales.",
    "Perfilación Criminal":
      "Analizas el comportamiento y el patrón de operación de delincuentes para apoyar investigaciones complejas: homicidios seriales, secuestros, delitos sexuales. Trabajas con corporaciones de inteligencia y fiscalías.",
    "Prevención del Delito":
      "Diseñas e implementas programas que reducen la incidencia delictiva en colonias, escuelas o empresas. Trabajas con gobiernos municipales, ONGs internacionales o áreas de responsabilidad social corporativa.",
    "Readaptación Social":
      "Diseñas y aplicas programas de reinserción dentro y fuera del sistema penitenciario: tratamiento, capacitación, seguimiento post-liberación. Una vía con fuerte componente social.",
    "Asesoría Jurídica Privada":
      "Asesoras a víctimas, imputados o empresas en temas criminológicos: peritajes privados, segunda opinión técnica, apoyo en juicios. Generalmente desde un despacho propio o como perito independiente.",
    "Investigador Forense":
      "Te especializas en alguna rama forense: balística, dactiloscopía, documentos, genética o digital. Eres el experto al que llaman cuando el caso necesita evidencia técnica irrefutable.",
  },
  "carrera-derecho": {
    "Litigante Privado":
      "Representas a personas o empresas en juicios civiles, mercantiles, familiares, laborales o penales. Es el camino clásico del abogado: construir un despacho propio o asociarte con firmas establecidas.",
    "Poder Judicial":
      "Te incorporas como secretario, actuario o aspiras a juez federal o estatal. Una carrera judicial sólida, con estabilidad, prestaciones y la posibilidad real de impartir justicia.",
    "Abogado Corporativo":
      "Eres el área legal de una empresa: contratos, compliance, propiedad intelectual, asuntos laborales y litigios. Especialmente demandado en maquiladoras y compañías con operación binacional.",
    "Notarías y Corredurías":
      "Das fe pública de actos jurídicos: compraventas, sociedades, testamentos, poderes. Una de las salidas más estables y mejor pagadas del derecho, sobre todo al titular eventualmente tu propia notaría.",
    "Derecho Internacional":
      "Asesoras en operaciones que cruzan fronteras: comercio exterior, inversión extranjera, arbitraje internacional, migración. En Tijuana esta especialidad tiene demanda natural por la proximidad con EE.UU.",
    "Derecho Laboral":
      "Asesoras a empresas o trabajadores en relaciones laborales, contratos colectivos, despidos, juntas y tribunales laborales. Con la reforma laboral, los especialistas tienen demanda explosiva.",
    "Defensa Penal":
      "Defiendes a personas imputadas bajo el sistema acusatorio: audiencias, estrategia probatoria, juicio oral. Requiere habilidad oratoria, técnica y nervios firmes.",
    "Asesor Político":
      "Acompañas a funcionarios, partidos o candidatos en asuntos jurídicos, regulatorios y de comunicación política. Una vía con alta exposición y proyección hacia cargos públicos.",
  },
  "carrera-gastronomia": {
    "Chef ejecutivo":
      "Diriges la cocina de un restaurante, hotel o cadena: defines el menú, gestionas al equipo, controlas costos y garantizas la consistencia del producto. El puesto que combina creatividad y operación.",
    "Director de restaurantes":
      "Operas uno o varios restaurantes desde la perspectiva del negocio: rentabilidad, experiencia del cliente, marketing y expansión. Ideal para quien quiere unir gastronomía con visión empresarial.",
    "Supervisor de producción de alimentos":
      "Coordinas la producción a gran escala en plantas, cocinas centrales o catering industrial. Aseguras inocuidad, rendimientos y cumplimiento de normas como HACCP o ISO 22000.",
    "Emprendimiento gastronómico":
      "Montas tu propio concepto: restaurante, food truck, marca de productos o servicio de catering. Tijuana es una de las plazas gastronómicas más reconocidas de México y un laboratorio ideal para emprender.",
    "Panadería y repostería profesional":
      "Te especializas en panadería artesanal, repostería fina o pastelería de autor. Puedes trabajar en hoteles boutique, abrir tu propia marca o desarrollar productos para cadenas y eventos.",
    "Consultoría en alimentos y bebidas":
      "Asesoras a restaurantes, hoteles o cadenas en menús, costeo, operación y posicionamiento. Cobras por proyecto y trabajas con múltiples clientes en paralelo.",
    "Gastronomía hotelera y turística":
      "Te incorporas a cadenas hoteleras o destinos turísticos coordinando restaurantes, banquetes y experiencias gastronómicas. Una vía con desarrollo internacional y movilidad entre destinos.",
    "Desarrollo de productos alimenticios":
      "Trabajas en empresas de alimentos creando nuevos productos: formulación, pruebas sensoriales, escalado a producción. Une cocina, ciencia y mercado.",
  },
  "carrera-electromecanica": {
    "Automatización industrial":
      "Diseñas, programas y mantienes sistemas automatizados con PLCs, HMIs y SCADA. La maquiladora del noroeste demanda este perfil de forma constante para modernizar líneas de producción.",
    "Redes Eléctricas y Potencia":
      "Diseñas y mantienes sistemas de distribución eléctrica industrial y comercial: subestaciones, transformadores, protecciones. Una salida con alta demanda y proyectos de gran escala.",
    "Manufactura avanzada":
      "Trabajas con tecnologías como CNC, robótica, impresión 3D y manufactura aditiva en plantas del sector automotriz, aeroespacial o electrónico. El corazón del cluster industrial de Baja California.",
    "Mantenimiento a Maquinaria":
      "Diriges los programas de mantenimiento predictivo, preventivo y correctivo de maquinaria pesada. Eres clave para que la planta no pare y el costo por hora de paro no se dispare.",
    "Industria aeroespacial":
      "Te incorporas al cluster aeroespacial de Baja California (uno de los más grandes de América Latina) en manufactura de componentes, ensamble o ingeniería de procesos para empresas como Honeywell, UTC o Gulfstream.",
    "Diseño de productos tecnológicos":
      "Diseñas dispositivos electromecánicos desde el concepto hasta el prototipo funcional: CAD, simulación, materiales, manufactura. Trabajas en áreas de I+D o desarrollas tus propios productos.",
    "Control de calidad y procesos":
      "Garantizas que cada producto cumpla las especificaciones técnicas mediante inspección, metrología y análisis estadístico. Imprescindible en industrias reguladas como automotriz, aeroespacial y dispositivos médicos.",
    "Emprendimiento tecnológico":
      "Aprovechas tu formación técnica para montar tu propia empresa de servicios industriales, integración de sistemas o desarrollo de productos. Tijuana es un hub natural por proximidad a EE.UU. y cluster manufacturero.",
  },
  "carrera-industrial": {
    "Mejora Continua y Lean":
      "Identificas desperdicios, rediseñas procesos y aplicas herramientas como Six Sigma, Kaizen y Value Stream Mapping. Uno de los perfiles más demandados en la maquila del noroeste para ganar productividad sin invertir más capital.",
    "Gerencia de Producción":
      "Diriges la operación diaria de una planta: producción, plantilla, indicadores y calidad. Es el camino más directo a una gerencia general en manufactura.",
    "Logística y Supply Chain":
      "Diseñas y operas cadenas de suministro: proveeduría, almacén, transporte, importación y exportación. Tijuana, como puerta de entrada/salida con EE.UU., concentra una de las mayores demandas del país en este perfil.",
    "Costos y Finanzas Ind.":
      "Conviertes la operación en números: costeo por producto, márgenes, evaluación de inversiones en piso. Una salida híbrida entre ingeniería y finanzas con muy buena proyección a CFO operativo.",
    "Aseguramiento de Calidad":
      "Diseñas y operas los sistemas de calidad bajo normas como ISO 9001, IATF 16949 o AS9100. Eres responsable de que el cliente nunca vea un defecto y de mantener certificaciones críticas para el negocio.",
    "Seguridad Industrial (EHS)":
      "Gestionas el entorno seguro: prevención de accidentes, cumplimiento normativo (NOMs, OSHA), medio ambiente y salud laboral. Imprescindible en plantas con operación binacional.",
    "Auditoría en Piso":
      "Recorres operaciones para detectar desviaciones de proceso, calidad o cumplimiento. Trabajas con la dirección para implementar planes de acción y proteger certificaciones del cliente final.",
    "Planeación Estratégica":
      "Defines hacia dónde va la planta o el negocio: capacidad, inversión, nuevos productos, expansiones. Es la antesala natural a direcciones generales.",
  },
  "carrera-mecatronica": {
    "Automatización industrial":
      "Diseñas, programas y pones en marcha celdas automatizadas con PLCs, robots y sistemas de visión. El perfil más buscado en la maquila del noroeste para evolucionar líneas manuales a manufactura inteligente.",
    "Robótica y sistemas inteligentes":
      "Integras robots industriales y colaborativos (ABB, Fanuc, KUKA, Universal Robots) en procesos reales. Aplicaciones que van desde soldadura automotriz hasta picking logístico.",
    "Manufactura avanzada":
      "Trabajas con tecnologías de Industria 4.0: gemelos digitales, IoT industrial, manufactura aditiva. Empujas a las plantas hacia el siguiente nivel de productividad y conectividad.",
    "Desarrollo de software embebido":
      "Programas el firmware que vive dentro de máquinas, dispositivos médicos, autos o productos de consumo. Una salida muy bien pagada por la combinación poco común de hardware + software.",
    "Industria aeroespacial":
      "Te integras al cluster aeroespacial de Baja California en automatización de líneas, integración de sistemas o desarrollo de instrumentación. Sector con altos estándares y proyectos de larga duración.",
    "Diseño de productos tecnológicos":
      "Llevas un producto desde la idea al prototipo funcional integrando mecánica, electrónica y software. Puedes hacerlo en una empresa establecida o como parte de tu propio startup.",
    "Control de calidad y procesos":
      "Aplicas técnicas estadísticas, metrología avanzada y sistemas de visión automatizada para garantizar productos sin defecto. Particularmente crítico en automotriz, dispositivos médicos y aeroespacial.",
    "Emprendimiento tecnológico":
      "Montas tu propia empresa de automatización, integración o desarrollo de producto. La frontera ofrece acceso a clientes industriales sofisticados y cadena de suministro de ambos lados.",
  },
  "carrera-sistemas": {
    "Ingeniería de Software":
      "Diseñas, construyes y mantienes sistemas de software de calidad industrial: arquitectura, código, pruebas y despliegue. La base de las posiciones mejor pagadas de la industria tecnológica.",
    "Arquitecto Cloud":
      "Diseñas soluciones en AWS, Azure o Google Cloud para empresas que migran o nacen en la nube. Combinas dominio técnico con visión de costo, seguridad y escalabilidad — uno de los perfiles mejor remunerados del mercado.",
    "Desarrollo Full Stack":
      "Construyes aplicaciones web y móviles de extremo a extremo: frontend, backend, base de datos e integraciones. La salida con más vacantes abiertas, tanto en empresas locales como en remoto para EE.UU.",
    "Ciberseguridad y Redes":
      "Proteges la información, los sistemas y la red de la organización: pruebas de penetración, respuesta a incidentes, compliance. Demanda explosiva por el crecimiento de ataques y regulación.",
    "Analista de Datos (BI)":
      "Conviertes datos en decisiones de negocio mediante SQL, Python, Power BI y modelado. Cada empresa mediana o grande necesita este perfil hoy, sin excepción.",
    "Ingeniero DevOps":
      "Automatizas el ciclo de vida del software: CI/CD, infraestructura como código, monitoreo. Eres puente entre desarrollo y operaciones y aceleras la entrega de nuevas versiones a producción.",
    "Desarrollo de Videojuegos":
      "Programas juegos con motores como Unity o Unreal, desde móviles hasta consola. Una industria con crecimiento sostenido y comunidad muy activa en México.",
    "Startups Tech":
      "Te sumas (o fundas) un startup que resuelve un problema con tecnología. Tijuana cuenta con aceleradoras, fondos locales y acceso natural al mercado de EE.UU. para construir desde cero.",
  },
};

const docs = await client.fetch(
  '*[_type=="carrera" && defined(campoLaboral)]{_id,campoLaboral}',
);

let totalUpdated = 0;
for (const d of docs) {
  const map = DATA[d._id];
  if (!map) {
    console.log("skip (sin data):", d._id);
    continue;
  }
  const next = d.campoLaboral.map((item) => {
    const nueva = map[item.titulo];
    if (!nueva) return item;
    return { ...item, descripcion: nueva };
  });
  await client.patch(d._id).set({ campoLaboral: next }).commit();
  const updated = next.filter((it) => it.descripcion).length;
  totalUpdated += updated;
  console.log(`✓ ${d._id} → ${updated}/${d.campoLaboral.length} con descripción`);
}
console.log(`\nTotal descripciones llenadas: ${totalUpdated}`);
