import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { SITE_URL_FALLBACK } from "@/lib/siteUrl";

const carrerasSlugsQuery = groq`*[_type == "carrera" && activa == true]{ "slug": slug.current }`;
const noticiasSlugsQuery = groq`*[_type == "noticia"]{ "slug": slug.current, "fecha": fecha }`;
const avisosSlugsQuery = groq`*[_type == "avisoPrivacidad"]{ "slug": slug.current, "fecha": fecha }`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_FALLBACK;

  const [carreras, noticias, avisos] = await Promise.all([
    client.fetch<{ slug: string }[]>(carrerasSlugsQuery).catch(() => []),
    client.fetch<{ slug: string; fecha?: string }[]>(noticiasSlugsQuery).catch(() => []),
    client.fetch<{ slug: string; fecha?: string }[]>(avisosSlugsQuery).catch(() => []),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/oferta-academica`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${base}/licenciaturas`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/ingenierias`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/nosotros`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/noticias`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/documentos`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/avisos-de-privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const carreraRoutes: MetadataRoute.Sitemap = carreras
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${base}/carreras/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const noticiaRoutes: MetadataRoute.Sitemap = noticias
    .filter((n) => n.slug)
    .map((n) => ({
      url: `${base}/noticias/${n.slug}`,
      lastModified: n.fecha ? new Date(n.fecha) : now,
      changeFrequency: "yearly",
      priority: 0.5,
    }));

  const avisoRoutes: MetadataRoute.Sitemap = avisos
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${base}/avisos-de-privacidad/${a.slug}`,
      lastModified: a.fecha ? new Date(a.fecha) : now,
      changeFrequency: "yearly",
      priority: 0.3,
    }));

  return [...staticRoutes, ...carreraRoutes, ...noticiaRoutes, ...avisoRoutes];
}
