#!/usr/bin/env node
/**
 * Parsea el export HTML del Google Sheet de convenios y extrae aliados públicos
 * (vigentes + autorización mercadotecnia), copiando logos al directorio público.
 *
 * Inputs (rutas fijas, ajustar si el export cambia de ubicación):
 *   /tmp/convenios-cenyca/Convenios GRAL.html
 *   /tmp/convenios-cenyca/resources/cellImage_1287013149_{idx}.jpg
 *
 * Outputs:
 *   public/vinculacion/logos/{slug}.jpg
 *   public/vinculacion/aliados.json
 *
 * Notas sobre el HTML del export:
 *   - El sheet exporta columnas A,B,C,D,E,F,G,I,J,K,... (la H está oculta
 *     en el export HTML; el orden visual de <td> sí incluye H).
 *   - El render usa una fila "header phantom" + 3 filas de banner combinadas,
 *     así que los datos empiezan en R4.
 *   - Cada celda de logo (col D) tiene <img src="resources/cellImage_..._{idx}.jpg">
 *     donde idx = (No. de fila del convenio) - 1.
 *   - La columna H ("Para uso de Mercadotecnia") NO está en el HTML, por lo que
 *     ese filtro se complementa contra el CSV público.
 */
import fs from "node:fs/promises";
import path from "node:path";

const HTML_PATH = "/tmp/convenios-cenyca/Convenios GRAL.html";
const RES_DIR = "/tmp/convenios-cenyca/resources";
const SHEET_ID = "1StFysSZDWPNhbyi3I90BKt7-OUpLgdlDLQ1vCbxFPQI";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const LOGOS_DIR = path.join(ROOT, "public/vinculacion/logos");
const OUT_JSON = path.join(ROOT, "public/vinculacion/aliados.json");

// --- helpers reutilizados de scripts/fetch-aliados-logos.mjs ---
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

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

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

// --- overrides manuales (case-insensitive match contra nombre limpio) ---
// Usa para corregir clasificaciones y marcar destacados (los que salen
// con prioridad en pilares/hero).
const OVERRIDES = {
  // industria — manufactura/aeroespacial/electrónica reconocibles
  "bose": { sector: "industria", destacado: true },
  "carl zeiss vision manufactura": { sector: "industria", destacado: true, displayName: "CARL ZEISS" },
  "npa de mexico jabil": { sector: "industria", destacado: true, displayName: "JABIL" },
  "safran cabin": { sector: "industria", destacado: true, displayName: "SAFRAN" },
  "sohnen de méxico": { sector: "industria", destacado: true, displayName: "SOHNEN" },
  "martek power": { sector: "industria", destacado: true },
  "smk electronica": { sector: "industria", destacado: true, displayName: "SMK ELECTRONICS" },
  "sinil industry": { sector: "industria" },
  "macfa automatizacion": { sector: "industria" },
  "mpa": { sector: "industria" },
  "alimentos y salsas": { sector: "industria" },

  // educación
  "cetis 156": { sector: "educacion", destacado: true },
  "colegio de bachilleres méxico": { sector: "educacion", destacado: true, displayName: "COLEGIO DE BACHILLERES" },
  "colegio de estudios científicos y tecnológicos de baja california, cecytebc": { sector: "educacion", destacado: true, displayName: "CECYTE BC" },

  // social / responsabilidad
  "dif estatal": { sector: "social", destacado: true, displayName: "DIF BC" },
  "imjuvet": { sector: "social", destacado: true, displayName: "IMJUVET TECATE" },
  "instituto municipal contra las adicciones": { sector: "social", displayName: "IMCA" },
  "sindicato 18 de septiembre de trabajadores de baja california": { sector: "social", displayName: "SINDICATO 18 DE SEPT." },
  "sindicato 1ro. de mayo de trabajadores y empleados": { sector: "social", displayName: "SINDICATO 1RO. DE MAYO" },
  "sindicato de empleados y trabajadores de la industria, el campo y el comercio del": { sector: "social", displayName: "SINDICATO IND., CAMPO Y COMERCIO" },

  // servicios
  "oxxo": { sector: "servicios", destacado: true, displayName: "OXXO" },
  "club de empresarios de baja california": { sector: "servicios", displayName: "CLUB DE EMPRESARIOS BC" },
  "mam de la frontera": { sector: "servicios" },
};

// --- categorización de sector ---
function categorize(sectorRaw, nombre, descripcion) {
  const t = `${sectorRaw} ${nombre} ${descripcion}`.toLowerCase();
  // educacion
  if (/(escuela|colegio|instituto|universidad|preparatoria|cbtis|cetis|cetys|cobach|conalep|secundaria|primaria|kínder|bachiller|educat|educac)/.test(t))
    return "educacion";
  // social
  if (/(fundac|asociac|onga|asilo|cáritas|caritas|hospital|salud|cruz roja|dif|gobierno|municipi|ayuntamiento|público|publico|sindicato|iglesia|parroqu|comunidad|albergue|orfan|casa hogar|migrant)/.test(t))
    return "social";
  // industria (antes que deporte para evitar falsos positivos con "club"/"automation")
  if (/(industri|manufactur|automotri|aeroespaci|electrónic|electronic|médic|medic|farmac|aliment|maquilad|planta|fábric|fabric|ensambl|metalmec|plástic|plastic|químic|quimic|automation|engineering|technology|tech\b|robotics)/.test(t))
    return "industria";
  // deporte
  if (/(deport|liga|fútbol|futbol|béisbol|beisbol|basquet|atlet|gimnas|fitness|crossfit)/.test(t))
    return "deporte";
  // servicios catchall
  return "servicios";
}

// --- main ---
async function main() {
  console.log("→ Leyendo HTML…");
  const html = await fs.readFile(HTML_PATH, "utf8");

  console.log("→ Descargando CSV (para columna mkt oculta)…");
  const csv = await fetch(CSV_URL, { redirect: "follow" }).then(r => r.text());
  const csvRows = parseCSV(csv);
  const headerIdx = csvRows.findIndex(r => r[0] === "No.");
  if (headerIdx < 0) throw new Error("CSV header no encontrado");
  const csvData = csvRows.slice(headerIdx + 1).filter(r => r[0]?.trim());
  // Index por No.
  const csvByNo = new Map();
  for (const r of csvData) {
    const no = (r[0] || "").trim();
    if (no) csvByNo.set(no, r);
  }

  // Parse HTML rows: <tr ...> ... </tr>
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  const htmlRows = [];
  let m;
  while ((m = trRe.exec(html))) htmlRows.push(m[1]);

  // Extract per-row: No., image idx (from cellImage_..._{idx}.jpg)
  const htmlByNo = new Map();
  for (const r of htmlRows) {
    const tdRe = /<td[^>]*>([\s\S]*?)<\/td>/g;
    const cells = [];
    let cm;
    while ((cm = tdRe.exec(r))) cells.push(cm[1]);
    if (!cells.length) continue;
    const noText = cells[0].replace(/<[^>]+>/g, "").trim();
    if (!/^\d+$/.test(noText)) continue;
    const imgM = r.match(/cellImage_1287013149_(\d+)\.jpg/);
    htmlByNo.set(noText, { imgIdx: imgM ? imgM[1] : null });
  }
  console.log(`  ${htmlByNo.size} filas con No. en HTML`);

  // Combinar y filtrar
  let totalHistorico = csvData.length;
  let totalVigentes = 0;
  let totalMktSi = 0;

  const seen = new Set();
  const aliados = [];

  for (const [no, csvRow] of csvByNo) {
    const estado = (csvRow[1] || "").toLowerCase();
    const mkt = (csvRow[7] || "").trim().toLowerCase();
    const isVigente = estado.includes("vigente");
    if (isVigente) totalVigentes++;
    const isMkt = mkt.startsWith("si") || mkt.startsWith("sí");
    if (isVigente && isMkt) totalMktSi++;
    if (!isVigente || !isMkt) continue;

    const raw = (csvRow[4] || "").trim();
    if (!raw) continue;
    const nombre = cleanName(raw);
    const key = nombre.toLowerCase();
    if (seen.has(key) || nombre.length < 2) continue;
    seen.add(key);

    const sectorRaw = (csvRow[6] || "").trim();
    const descripcion = (csvRow[5] || "").trim();
    const ciudad = (csvRow[15] || "").trim();
    const auto = categorize(sectorRaw, nombre, descripcion);
    const override = OVERRIDES[key] ?? {};
    const sector = override.sector ?? auto;
    const destacado = override.destacado ?? false;
    const displayName = override.displayName ?? nombre;

    // Logo: del HTML, image idx = No - 1 (verificado)
    const slug = slugify(nombre);
    const htmlInfo = htmlByNo.get(no);
    let logoRel = null;
    if (htmlInfo?.imgIdx != null) {
      const srcPath = path.join(RES_DIR, `cellImage_1287013149_${htmlInfo.imgIdx}.jpg`);
      try {
        await fs.access(srcPath);
        const destPath = path.join(LOGOS_DIR, `${slug}.jpg`);
        await fs.mkdir(LOGOS_DIR, { recursive: true });
        await fs.copyFile(srcPath, destPath);
        logoRel = `/vinculacion/logos/${slug}.jpg`;
      } catch {
        // no image in resources
      }
    }

    aliados.push({
      nombre: displayName,
      nombreLegal: nombre,
      sector,
      sectorRaw,
      ciudad,
      logo: logoRel,
      destacado,
    });
  }

  // Stats
  const conLogo = aliados.filter(a => a.logo).length;
  const sinLogo = aliados.length - conLogo;
  const porCategoria = {};
  for (const a of aliados) porCategoria[a.sector] = (porCategoria[a.sector] || 0) + 1;

  const out = {
    generatedAt: new Date().toISOString(),
    fuente: "Google Sheets — Convenios CENYCA (export HTML + CSV)",
    stats: {
      totalHistorico,
      activos: totalVigentes,
      publicosDestacados: aliados.length,
    },
    aliados: aliados.sort((a, b) => a.nombre.localeCompare(b.nombre)),
  };

  await fs.mkdir(path.dirname(OUT_JSON), { recursive: true });
  await fs.writeFile(OUT_JSON, JSON.stringify(out, null, 2));

  console.log("\n========== REPORTE ==========");
  console.log(`Histórico total:        ${totalHistorico}`);
  console.log(`Vigentes:               ${totalVigentes}`);
  console.log(`Vigentes + mkt Sí:      ${totalMktSi}`);
  console.log(`Aliados únicos (dedup): ${aliados.length}`);
  console.log(`  con logo:             ${conLogo}`);
  console.log(`  sin logo:             ${sinLogo}`);
  console.log("Por categoría:");
  for (const [k, v] of Object.entries(porCategoria).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(12)} ${v}`);
  }
  console.log(`\n→ JSON escrito en: ${OUT_JSON}`);
  console.log(`→ Logos en: ${LOGOS_DIR}`);
}

main().catch(e => { console.error(e); process.exit(1); });
