/**
 * Llena el campo `seo` (titulo, descripcion, imagen OG) de cada carrera.
 *
 * Run from main repo root:
 *   npx tsx .claude/worktrees/focused-napier-1bd9ed/scripts/seedCarrerasSEO.ts
 */
import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = "/Users/eme/cenyca-proyecto-web";
const token = fs
  .readFileSync(path.join(REPO_ROOT, ".env.local"), "utf8")
  .match(/SANITY_API_WRITE_TOKEN=(.+)/)?.[1]
  .trim();
if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN");

const client = createClient({
  projectId: "1zsi1hi5",
  dataset: "production",
  apiVersion: "2026-04-08",
  token,
  useCdn: false,
});

const RAW = "https://raw.githubusercontent.com/sof-ia-mkt/landing-pages.cenyca/main";

type SeoRow = {
  docId: string;
  landingSlug: string | null;
  titulo: string;
  descripcion: string;
};

const ROWS: SeoRow[] = [
  {
    docId: "carrera-administracion",
    landingSlug: "administracion-de-empresas",
    titulo: "Lic. en Administración de Empresas en Tijuana | CENYCA",
    descripcion:
      "Forma líderes empresariales con visión estratégica. Titulación en 3 años, RVOE oficial, becas y horarios flexibles en Tijuana.",
  },
  {
    docId: "carrera-mecatronica",
    landingSlug: "ingenieria-mecatronica",
    titulo: "Ingeniería Mecatrónica en Tijuana | CENYCA Universidad",
    descripcion:
      "Diseña sistemas automatizados combinando mecánica, electrónica y programación. RVOE oficial, titulación en 3 años, becas en Tijuana.",
  },
  {
    docId: "carrera-gastronomia",
    landingSlug: "gastronomia",
    titulo: "Lic. en Gastronomía en Baja California | CENYCA",
    descripcion:
      "Fórmate como chef y empresario gastronómico en la región culinaria líder de México. Prácticas reales, RVOE, becas y horario sabatino.",
  },
  {
    docId: "carrera-derecho",
    landingSlug: null,
    titulo: "Licenciatura en Derecho en Tijuana | CENYCA",
    descripcion:
      "Domina la ley, la oralidad y el sistema de justicia. Litiga, asesora o ejerce en el sector público. RVOE oficial y modalidad ejecutiva.",
  },
  {
    docId: "carrera-contaduria",
    landingSlug: null,
    titulo: "Lic. en Contaduría y Finanzas en Tijuana | CENYCA",
    descripcion:
      "Auditoría, impuestos y fintech en una sola carrera. Perfil más demandado en empresas. Titulación en 3 años con RVOE oficial y becas.",
  },
  {
    docId: "carrera-criminologia",
    landingSlug: "criminologia-y-criminalistica",
    titulo: "Criminología y Criminalística en Tijuana | CENYCA",
    descripcion:
      "Perfilamiento criminal, ciencias forenses y prevención del delito. Alta demanda en fiscalías y seguridad. RVOE oficial, becas disponibles.",
  },
  {
    docId: "carrera-electromecanica",
    landingSlug: "ingenieria-electromecanica",
    titulo: "Ingeniería Electromecánica en Tijuana | CENYCA",
    descripcion:
      "Termodinámica, electricidad y mecánica para la industria manufacturera de BC. Titulación en 3 años con RVOE oficial y becas.",
  },
  {
    docId: "carrera-industrial",
    landingSlug: "ingenieria-industrial",
    titulo: "Ingeniería Industrial en Tijuana | CENYCA",
    descripcion:
      "Optimiza producción, calidad y logística en la potencia manufacturera de México. RVOE oficial, titulación en 3 años y becas en Tijuana.",
  },
  {
    docId: "carrera-sistemas",
    landingSlug: "ingenieria-en-sistemas-computacionales",
    titulo: "Ing. en Sistemas Computacionales en Tijuana | CENYCA",
    descripcion:
      "Cloud, IA y arquitectura de software. El sector mejor pagado con trabajo remoto global. RVOE oficial, titulación en 3 años y becas.",
  },
  {
    docId: "carrera-educacion",
    landingSlug: null,
    titulo: "Lic. en Ciencias de la Educación en Tijuana | CENYCA",
    descripcion:
      "Diseña aprendizajes inclusivos y modernos para docencia, tecnología educativa y capacitación corporativa. RVOE oficial y becas.",
  },
];

async function uploadOg(slug: string, attempts = 3) {
  const url = `${RAW}/${slug}/assets/og-image.png`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch og-image ${slug}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const a = await client.assets.upload("image", buf, {
        filename: `og-${slug}.png`,
      });
      return a._id;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastErr;
}

async function main() {
  for (const row of ROWS) {
    const seo: {
      titulo: string;
      descripcion: string;
      imagen?: { _type: string; asset: { _type: string; _ref: string } };
    } = { titulo: row.titulo, descripcion: row.descripcion };

    if (row.landingSlug) {
      try {
        const assetId = await uploadOg(row.landingSlug);
        seo.imagen = {
          _type: "image",
          asset: { _type: "reference", _ref: assetId },
        };
        console.log(`  ↑ og uploaded for ${row.docId} → ${assetId}`);
      } catch (e) {
        console.log(`  ✗ og upload failed for ${row.docId}: ${(e as Error).message}`);
      }
    }

    const r = await client.patch(row.docId).set({ seo }).commit();
    console.log(`✓ ${row.docId} seo set (rev ${r._rev})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
