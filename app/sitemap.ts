import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { todasCarrerasQuery } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cenyca-proyecto-web.vercel.app";

  const carreras = await client.fetch<{ slug: string }[]>(todasCarrerasQuery);

  const carrerasUrls = carreras.map((c) => ({
    url: `${base}/carreras/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: base,                         lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/licenciaturas`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/nosotros`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/admisiones`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/becas`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/noticias`,            lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    ...carrerasUrls,
  ];
}
