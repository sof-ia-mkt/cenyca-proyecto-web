#!/usr/bin/env node
// Uploads /public/carreras/hero/*.mp4 a Sanity como file assets y los asigna
// al campo heroVideo de cada carrera correspondiente. Solo se usó una vez para
// migrar de archivos estáticos a Sanity — déjalo por si en el futuro
// quieres re-correrlo con nuevos clips.

import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { config } from "dotenv";

config({ path: ".env.local" });

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN missing");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1zsi1hi5",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-04-07",
  token,
  useCdn: false,
});

// slug -> docId
const MAP = {
  "administracion-de-empresas": "carrera-administracion",
  "ciencias-de-la-educacion": "carrera-educacion",
  "contaduria-y-finanzas": "carrera-contaduria",
  "criminologia-y-criminalistica": "carrera-criminologia",
  "derecho": "carrera-derecho",
  "gastronomia": "carrera-gastronomia",
  "ingenieria-electromecanica": "carrera-electromecanica",
  "ingenieria-en-sistemas-computacionales": "carrera-sistemas",
  "ingenieria-industrial": "carrera-industrial",
  "ingenieria-mecatronica": "carrera-mecatronica",
};

async function main() {
  const dir = join(process.cwd(), "public/carreras/hero");

  for (const [slug, docId] of Object.entries(MAP)) {
    const file = join(dir, `${slug}.mp4`);
    try {
      await stat(file);
    } catch {
      console.warn(`⏭  ${slug}: archivo no existe, skip`);
      continue;
    }

    process.stdout.write(`⬆  ${slug} ... `);
    const asset = await client.assets.upload("file", createReadStream(file), {
      filename: `${slug}.mp4`,
      contentType: "video/mp4",
    });
    process.stdout.write(`asset ${asset._id} ... `);

    await client
      .patch(docId)
      .set({
        heroVideo: {
          _type: "file",
          asset: { _type: "reference", _ref: asset._id },
        },
      })
      .commit();
    console.log("✔");
  }

  console.log("\nDone. Publicando drafts si los hay...");
  // Si el doc tiene draft, también lo parchamos para que el editor lo vea
  for (const docId of Object.values(MAP)) {
    const draftId = `drafts.${docId}`;
    const draft = await client.getDocument(draftId);
    if (!draft) continue;
    const published = await client.getDocument(docId);
    if (published?.heroVideo) {
      await client
        .patch(draftId)
        .set({ heroVideo: published.heroVideo })
        .commit();
      console.log(`  draft ${docId} también actualizado`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
