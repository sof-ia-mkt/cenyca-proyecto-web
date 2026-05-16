/**
 * Llena el campo `promocionInscripcion` del documento `configuracion-general`
 * en Sanity. Una vez completado, el formulario de captura aparece en todas
 * las páginas de carrera.
 *
 * Uso: SANITY_TOKEN=<token> node scripts/fill-promocion.mjs
 */
import { createClient } from "@sanity/client";

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error("Falta SANITY_TOKEN en el ambiente.");
  process.exit(1);
}

const client = createClient({
  projectId: "1zsi1hi5",
  dataset: "production",
  apiVersion: "2026-04-08",
  token,
  useCdn: false,
});

const promo = {
  activa: true,
  porcentaje: 20,
  kicker: "Descuento de inscripción",
  titulo: "Reclama tu descuento del {porcentaje}% en tu inscripción",
  subtitulo:
    "Solo por tiempo limitado para nuevos alumnos. Deja tus datos y un asesor te contactará por WhatsApp.",
  mensajeComprobante: "Envía este comprobante a tu asesor o preséntalo al inscribirte",
  diasExpiracion: 30,
};

const modalidadesHorarios = {
  activa: true,
  kicker: "Modalidades de estudio",
  titulo: "Tu carrera, a tu ritmo",
  subtitulo: "Estudia sin pausar tus actividades cotidianas.",
  cards: [
    {
      _key: "card-entre-semana",
      tag: "Entre semana",
      titulo: "1 día a la semana",
      valorDestacado: "Solo 1 día",
      descripcion:
        "Asiste un día entre semana y sigue con tu trabajo o actividades el resto de la semana. Flexibilidad real.",
    },
    {
      _key: "card-fin-de-semana",
      tag: "Ejecutivo",
      titulo: "Fin de semana",
      valorDestacado: "Sábado o domingo",
      descripcion:
        "Dedica tu sábado o domingo a formarte. Perfecto para quienes tienen compromisos de lunes a viernes.",
    },
  ],
};

const result = await client
  .patch("configuracion-general")
  .set({ promocionInscripcion: promo, modalidadesHorarios })
  .commit();

console.log("OK — documento actualizado:", result._id, "rev", result._rev);
