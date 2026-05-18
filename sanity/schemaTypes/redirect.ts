import { defineField, defineType } from "sanity";

/**
 * Redirects 301/302 administrados desde Sanity.
 *
 * Caso de uso principal: cuando cambias el slug de una noticia o carrera,
 * Google y los backlinks externos quedan apuntando a la URL vieja → 404.
 * Aquí registras `from = /noticias/slug-viejo` y `to = /noticias/slug-nuevo`
 * y el middleware redirige automáticamente, preservando el SEO.
 *
 * También sirve para:
 *  - Vanity URLs (/admision → /admisiones)
 *  - Migraciones desde el sitio anterior
 *  - Campañas (/promo-verano → /becas)
 */
export const redirect = defineType({
  name: "redirect",
  title: "Redirects (URLs viejas → nuevas)",
  type: "document",
  icon: () => "↪️",
  fields: [
    defineField({
      name: "from",
      title: "URL origen",
      description:
        'Ruta relativa que se va a redirigir. Empieza con "/". Ejemplo: /noticias/slug-viejo',
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            if (!value) return "Requerido";
            if (!value.startsWith("/"))
              return 'Debe empezar con "/" (ruta relativa)';
            if (value.includes(" ")) return "No puede contener espacios";
            return true;
          })
          .custom(async (value, ctx) => {
            if (!value) return true;
            const client = ctx.getClient({ apiVersion: "2024-01-01" });
            const id = ctx.document?._id.replace(/^drafts\./, "");
            const count = await client.fetch<number>(
              `count(*[_type == "redirect" && from == $from && !(_id in [$id, "drafts." + $id])])`,
              { from: value, id }
            );
            return count > 0
              ? "Ya existe otro redirect para esta URL origen"
              : true;
          }),
    }),
    defineField({
      name: "to",
      title: "URL destino",
      description:
        'A dónde se redirige. Puede ser ruta relativa (/becas) o URL completa (https://...).',
      type: "string",
      validation: (rule) =>
        rule.required().custom((value, ctx) => {
          if (!value) return "Requerido";
          if (value === (ctx.document as { from?: string })?.from)
            return "El destino no puede ser igual al origen (loop)";
          return true;
        }),
    }),
    defineField({
      name: "permanent",
      title: "Redirect permanente (301)",
      description:
        "Activado = 301 (le dice a Google que la URL nueva reemplaza a la vieja, transfiere SEO). Desactivado = 302 (temporal).",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "notas",
      title: "Notas internas",
      description: "Para tu referencia: ¿por qué se creó este redirect?",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { from: "from", to: "to", permanent: "permanent" },
    prepare({ from, to, permanent }) {
      return {
        title: `${from} → ${to}`,
        subtitle: permanent ? "301 permanente" : "302 temporal",
      };
    },
  },
});
