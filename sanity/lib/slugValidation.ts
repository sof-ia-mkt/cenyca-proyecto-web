/**
 * Helpers de validación para campos `slug` en todos los schemas.
 *
 * Resuelven dos problemas reales:
 *
 *  1. Slugs duplicados → Sanity por default NO valida unicidad. Dos
 *     carreras con slug "derecho" se guardan ambas y la URL
 *     /carreras/derecho muestra una al azar (la última que GROQ devuelva).
 *     Esto rompe SEO y experiencia.
 *
 *  2. Slugs con caracteres raros → el slugify por default acepta caracteres
 *     mexicanos pero también acepta espacios/símbolos si el editor los
 *     escribe manualmente. Forzamos un slug 100% URL-safe.
 */
import type { SlugRule, ValidationContext } from "sanity";

/**
 * slugify estricto: lowercase, sólo a-z 0-9 y guiones, sin guiones al
 * principio o final, máximo 96 chars.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    // elimina diacríticos (á → a, ñ → n)
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

/**
 * Validador asíncrono que pregunta a Sanity si ya existe OTRO documento
 * del mismo type con ese slug. Ignora el documento actual (incluyendo
 * su draft) para que editar un slug y volver a guardar el mismo valor
 * no marque error.
 */
export async function isUniqueSlug(
  slug: string,
  context: ValidationContext
): Promise<boolean> {
  const { document, getClient } = context;
  if (!slug || !document?._type) return true;

  const client = getClient({ apiVersion: "2024-01-01" });
  const id = document._id.replace(/^drafts\./, "");

  const duplicateCount = await client.fetch<number>(
    `count(*[_type == $type && slug.current == $slug && !(_id in [$id, "drafts." + $id])])`,
    { type: document._type, slug, id }
  );

  return duplicateCount === 0;
}

/**
 * Helper que se usa en cada schema:
 *
 *   defineField({
 *     name: 'slug',
 *     type: 'slug',
 *     options: slugOptions('titulo'),
 *     validation: slugValidation,
 *   })
 */
export const slugOptions = (sourceField: string) => ({
  source: sourceField,
  maxLength: 96,
  slugify,
});

export const slugValidation = (rule: SlugRule) =>
  rule.required().custom(async (value, ctx) => {
    if (!value?.current) return "El slug es requerido";
    const unique = await isUniqueSlug(value.current, ctx);
    return unique ? true : "Ya existe otro documento publicado con este slug";
  });
