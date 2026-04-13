import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://cenyca-proyecto-web.vercel.app'

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/licenciaturas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/nosotros`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/admisiones`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/becas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/posgrados`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/noticias`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/documentos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
