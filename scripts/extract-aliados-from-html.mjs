#!/usr/bin/env node
/**
 * Parsea el export HTML del Google Sheet de convenios y extrae aliados públicos.
 *
 * Fuente única: HTML del export del Sheet. El CSV público estaba cacheado y
 * desfasado vs el HTML (los `No.` no coincidían entre snapshots), causando
 * que aliados conocidos (JABIL, SAFRAN, SOHNEN, OXXO…) quedaran filtrados.
 *
 * Criterio de inclusión:
 *   - Estado == "Vigente"
 *   - Tiene logo en el sheet (la presencia del logo en el sheet es
 *     autorización implícita de uso de marca por parte de CENYCA).
 *   - No está en la denylist EXCLUIR (opt-out explícito).
 *
 * Inputs:
 *   /tmp/convenios-cenyca/Convenios GRAL.html
 *   /tmp/convenios-cenyca/resources/cellImage_1287013149_{idx}.jpg
 *
 * Outputs:
 *   public/vinculacion/logos/{slug}.jpg
 *   public/vinculacion/aliados.json
 *
 * Layout de celdas en el HTML (orden visual de <td>):
 *   0:No  1:Estado  2:Notas  3:Logo  4:Nombre  5:(H oculta=mkt, vacía)
 *   6:Giro/descripción  7:SectorRaw (Privado/Público/AC)  8:Tipo
 *   9:Inicio  10:Fin  11:Dirección  12:Contacto  13:Tel  14:Mail
 *   15:Ciudad  16:PDF  17:Beneficios  18..:N/A
 *   Logo cell tiene <img src="resources/cellImage_..._{idx}.jpg">
 *   con idx = (No. del convenio) - 1.
 */
import fs from "node:fs/promises";
import path from "node:path";

const HTML_PATH = "/tmp/convenios-cenyca/Convenios GRAL.html";
const RES_DIR = "/tmp/convenios-cenyca/resources";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const LOGOS_DIR = path.join(ROOT, "public/vinculacion/logos");
const OUT_JSON = path.join(ROOT, "public/vinculacion/aliados.json");

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

// --- denylist explícita (lowercased nombre limpio) ---
// Solo agregar aquí si CENYCA pide expresamente NO mostrar al aliado.
const EXCLUIR = new Set([
  // (vacío por defecto)
]);

// --- overrides manuales (case-insensitive match contra nombre limpio) ---
// Para corregir clasificación de sector, marcar destacado y/o usar un
// displayName corto/comercial en lugar del razón social.
const OVERRIDES = {
  // industria — manufactura / aeroespacial / electrónica / médico
  "bose": { sector: "industria", destacado: true },
  "carl zeiss vision manufactura": { sector: "industria", destacado: true, displayName: "CARL ZEISS" },
  "npa de mexico jabil": { sector: "industria", destacado: true, displayName: "JABIL" },
  "npa de mexico jabil .": { sector: "industria", destacado: true, displayName: "JABIL" },
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
  "canaco": { sector: "servicios", destacado: true },

  // deporte
  "xolos de tijuana": { sector: "deporte", destacado: true, displayName: "XOLOS DE TIJUANA" },
  "estadio de beisbol toros de tijuana": { sector: "deporte", destacado: true, displayName: "TOROS DE TIJUANA" },
  "metro fitness group": { sector: "deporte", destacado: true, displayName: "METRO FITNESS" },
};

// --- categorización heurística (sector + giro + nombre) ---
function categorize(sectorRaw, nombre, descripcion) {
  const t = `${sectorRaw} ${nombre} ${descripcion}`.toLowerCase();
  if (/(escuela|colegio|instituto|universidad|preparatoria|cbtis|cetis|cetys|cobach|conalep|secundaria|primaria|kínder|bachiller|educat|educac)/.test(t))
    return "educacion";
  if (/(fundac|asociac|onga|asilo|cáritas|caritas|hospital|salud|cruz roja|dif|gobierno|municipi|ayuntamiento|público|publico|sindicato|iglesia|parroqu|comunidad|albergue|orfan|casa hogar|migrant)/.test(t))
    return "social";
  if (/(industri|manufactur|automotri|aeroespaci|aviones|cabinas|electrónic|electronic|médic|medic|farmac|aliment|maquilad|planta|fábric|fabric|fabricante|ensambl|metalmec|plástic|plastic|químic|quimic|automation|engineering|technology|tech\b|robotics|bocinas|equipos)/.test(t))
    return "industria";
  if (/(deport|liga|fútbol|futbol|béisbol|beisbol|basquet|atlet|gimnas|fitness|crossfit)/.test(t))
    return "deporte";
  return "servicios";
}

// --- main ---
async function main() {
  console.log("→ Leyendo HTML…");
  const html = await fs.readFile(HTML_PATH, "utf8");

  // Parse rows
  const trRe = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  const htmlRows = [];
  let m;
  while ((m = trRe.exec(html))) htmlRows.push(m[1]);

  // Extract per-row cells (with raw html for image detection)
  const dataRows = []; // {no, estado, nombre, sectorRaw, descripcion, ciudad, imgIdx}
  for (const r of htmlRows) {
    const tdRe = /<td[^>]*>([\s\S]*?)<\/td>/g;
    const cells = [];
    let cm;
    while ((cm = tdRe.exec(r))) cells.push(cm[1]);
    if (!cells.length) continue;
    const noText = cells[0].replace(/<[^>]+>/g, "").trim();
    if (!/^\d+$/.test(noText)) continue;
    const strip = (i) => (cells[i] || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const imgM = r.match(/cellImage_1287013149_(\d+)\.jpg/);
    dataRows.push({
      no: noText,
      estado: strip(1).toLowerCase(),
      nombre: strip(4),
      descripcion: strip(6),
      sectorRaw: strip(7),
      ciudad: strip(15),
      imgIdx: imgM ? imgM[1] : null,
    });
  }
  console.log(`  ${dataRows.length} filas con No. en HTML`);

  // Stats reales del HTML (fuente única)
  const totalHistorico = dataRows.length;
  const vigentes = dataRows.filter((r) => r.estado.includes("vigente"));
  const totalVigentes = vigentes.length;
  const vigentesConLogo = vigentes.filter((r) => r.imgIdx != null);

  const seen = new Set();
  const aliados = [];

  for (const row of vigentesConLogo) {
    const raw = row.nombre;
    if (!raw) continue;
    const nombre = cleanName(raw);
    const key = nombre.toLowerCase();
    if (seen.has(key) || nombre.length < 2) continue;
    if (EXCLUIR.has(key)) continue;
    seen.add(key);

    const auto = categorize(row.sectorRaw, nombre, row.descripcion);
    const override = OVERRIDES[key] ?? {};
    const sector = override.sector ?? auto;
    const destacado = override.destacado ?? false;
    const displayName = override.displayName ?? nombre;

    // Copy logo
    const slug = slugify(nombre);
    let logoRel = null;
    const srcPath = path.join(RES_DIR, `cellImage_1287013149_${row.imgIdx}.jpg`);
    try {
      await fs.access(srcPath);
      const destPath = path.join(LOGOS_DIR, `${slug}.jpg`);
      await fs.mkdir(LOGOS_DIR, { recursive: true });
      await fs.copyFile(srcPath, destPath);
      logoRel = `/vinculacion/logos/${slug}.jpg`;
    } catch {
      // imagen referenciada pero ausente en resources/
    }

    aliados.push({
      nombre: displayName,
      nombreLegal: nombre,
      sector,
      sectorRaw: row.sectorRaw,
      ciudad: row.ciudad,
      logo: logoRel,
      destacado,
    });
  }

  // Stats finales
  const conLogo = aliados.filter((a) => a.logo).length;
  const sinLogo = aliados.length - conLogo;
  const porCategoria = {};
  for (const a of aliados) porCategoria[a.sector] = (porCategoria[a.sector] || 0) + 1;

  const out = {
    generatedAt: new Date().toISOString(),
    fuente: "Google Sheets — Convenios CENYCA (export HTML, fuente única)",
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
  console.log(`Histórico total:            ${totalHistorico}`);
  console.log(`Vigentes:                   ${totalVigentes}`);
  console.log(`Vigentes con logo en sheet: ${vigentesConLogo.length}`);
  console.log(`Aliados únicos (dedup):     ${aliados.length}`);
  console.log(`  con logo:                 ${conLogo}`);
  console.log(`  sin logo:                 ${sinLogo}`);
  console.log("Por categoría:");
  for (const [k, v] of Object.entries(porCategoria).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(12)} ${v}`);
  }
  console.log(`\n→ JSON escrito en: ${OUT_JSON}`);
  console.log(`→ Logos en: ${LOGOS_DIR}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
