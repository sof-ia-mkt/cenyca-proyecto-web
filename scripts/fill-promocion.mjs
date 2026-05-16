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
  kicker: "Beca de inscripción",
  titulo: "Reclama tu beca del {porcentaje}%",
  subtitulo:
    "Solo por tiempo limitado para nuevos alumnos. Deja tus datos y un asesor te contactará por WhatsApp.",
  mensajeComprobante: "Envía este comprobante a tu asesor o preséntalo al inscribirte",
  diasExpiracion: 30,
};

const result = await client
  .patch("configuracion-general")
  .set({ promocionInscripcion: promo })
  .commit();

console.log("OK — documento actualizado:", result._id, "rev", result._rev);
