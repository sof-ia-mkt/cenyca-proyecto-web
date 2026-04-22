// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Sin tokens: el sitio solo consume contenido publicado. Si más adelante quieres
  // preview de drafts live, cambia estos `false` por tokens de Sanity con rol Viewer.
  serverToken: false,
  browserToken: false,
});
