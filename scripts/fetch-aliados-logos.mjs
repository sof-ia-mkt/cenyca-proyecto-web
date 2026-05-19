#!/usr/bin/env node
/**
 * Lee el sheet público de aliados, filtra vigentes + autorizados para mercadotecnia,
 * y genera el manifest con nombres limpios para el marquee de aliados.
 *
 *   - public/vinculacion/aliados.json
 *
 * Reejecutar cuando el sheet cambie:  node scripts/fetch-aliados-logos.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";

const SHEET_ID = "1StFysSZDWPNhbyi3I90BKt7-OUpLgdlDLQ1vCbxFPQI";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
const OUT = path.resolve("public/vinculacion/aliados.json");

function parseCSV(text) {
  const rows = [];
  let row = [], cell = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQ = false;
      else cell += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
      else if (c === "\r") {}
      else cell += c;
    }
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

// Limpia el nombre para mostrar: quita razón social, paréntesis, etc.
function cleanName(s) {
  return s
    .replace(/\s+/g, " ")
    .replace(/,?\s*S\.?\s*A\.?\s*(de\s*)?C\.?\s*V\.?/gi, "")
    .replace(/,?\s*S\.?\s*de\s*R\.?\s*L\.?\s*(de\s*C\.?\s*V\.?)?/gi, "")
    .replace(/\s*A\.?C\.?$/i, "")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/,$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  console.log("→ Descargando sheet...");
  const csv = await fetch(SHEET_URL).then(r => r.text());
  const rows = parseCSV(csv);
  const headerIdx = rows.findIndex(r => r[0] === "No.");
  if (headerIdx < 0) throw new Error("Header no encontrado");

  const data = rows.slice(headerIdx + 1).filter(r => r[4]?.trim());
  console.log(`  ${data.length} entidades totales`);

  const eligibles = data.filter(r => {
    const estado = (r[1] || "").toLowerCase();
    const mkt = (r[7] || "").trim().toLowerCase();
    return estado.includes("vigente") && mkt.startsWith("si");
  });
  console.log(`  ${eligibles.length} vigentes + autorizadas para mostrar\n`);

  // Dedup por nombre limpio
  const seen = new Set();
  const aliados = [];
  for (const r of eligibles) {
    const raw = r[4].trim();
    const nombre = cleanName(raw);
    const key = nombre.toLowerCase();
    if (seen.has(key) || nombre.length < 2) continue;
    seen.add(key);
    const sector = (r[6] || "").trim();
    const ciudad = (r[15] || "").trim();
    aliados.push({ nombre, sector, ciudad });
  }

  const totalActivos = data.filter(r => (r[1] || "").toLowerCase().includes("vigente")).length;
  const totalHistorico = data.length;

  const out = {
    generatedAt: new Date().toISOString(),
    fuente: "Google Sheets — Convenios Cenyca",
    stats: {
      totalHistorico,
      activos: totalActivos,
      publicosDestacados: aliados.length,
    },
    aliados,
  };

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(out, null, 2));

  console.log(`✓ ${aliados.length} aliados públicos listados`);
  console.log(`✓ Stats — históricos: ${totalHistorico} · activos: ${totalActivos}`);
  console.log(`✓ Archivo: ${OUT}`);
  console.log("\nAliados publicados:");
  aliados.forEach(a => console.log(`  · ${a.nombre} (${a.sector})`));
}

main().catch(e => { console.error(e); process.exit(1); });
