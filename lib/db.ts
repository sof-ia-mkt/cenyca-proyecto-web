// Cliente Neon (Postgres serverless) compartido por toda la app.
// Usa el driver HTTP de Neon — sin TCP, sin pool: cada query es un fetch
// directo. Eso lo hace compatible con el edge runtime de Vercel y evita
// el overhead de mantener conexiones abiertas en serverless functions.
//
// La env var DATABASE_URL la inyecta Vercel automáticamente cuando se
// conecta la integración de Neon al proyecto.
//
// Inicialización perezosa: `neon()` lanza si la URL está vacía, lo que
// rompía `next build` durante el "collecting page data" (porque al
// recolectar metadata se carga el módulo). Resolvemos creando el cliente
// la primera vez que se invoca `sql`, no al cargar el módulo.

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _client: NeonQueryFunction<false, false> | null = null;

function getClient(): NeonQueryFunction<false, false> {
  if (_client) return _client;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "[lib/db] DATABASE_URL no está configurada. Conecta la integración Neon en Vercel " +
        "o agrega DATABASE_URL a tu .env.local.",
    );
  }
  _client = neon(url);
  return _client;
}

// Proxy a tagged template: `sql\`SELECT ...\`` lo redirige al cliente
// real, creándolo on-demand. Mantiene la misma firma que `neon(...)`.
export const sql: NeonQueryFunction<false, false> = ((
  ...args: Parameters<NeonQueryFunction<false, false>>
) => {
  return (getClient() as (...a: unknown[]) => unknown)(...(args as unknown[])) as ReturnType<
    NeonQueryFunction<false, false>
  >;
}) as NeonQueryFunction<false, false>;
