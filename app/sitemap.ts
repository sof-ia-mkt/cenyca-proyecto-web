import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

const carrerasSlugsQuery = groq`*[_type == "carrera" && activa == true]{ "slug": slug.current }`;
const noticiasSlugsQuery = groq`*[_type == "noticia"]{ "slug": slug.current, "fecha": fecha }`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cenyca-proyecto-web.vercel.app";

  const [carreras, noticias] = await Promise.all([
    client.fetch<{ slug: string }[]>(carrerasSlugsQuery).catch(() => []),
    client.fetch<{ slug: string; fecha?: string }[]>(noticiasSlugsQuery).catch(() => []),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/licenciaturas`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/nosotros`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/admisiones`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/becas`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/posgrados`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/noticias`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/documentos`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
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

  return [...staticRoutes, ...carreraRoutes, ...noticiaRoutes];
}
