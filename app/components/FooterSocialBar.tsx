"use client";

import { usePathname } from "next/navigation";

// Rutas donde la barra social del footer se oculta, porque la página ya tiene
// una sección dedicada "Síguenos en redes sociales" propia (ej. /carreras/[slug]).
const HIDE_ON_PREFIXES = ["/carreras/"];

// Wrapper client-only que oculta a sus hijos vía CSS cuando la ruta actual
// matchea uno de los prefijos. El contenido se renderiza siempre en SSR (bueno
// para SEO/no-JS), pero queda invisible en cliente cuando aplica.
export default function FooterSocialBar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hide = pathname ? HIDE_ON_PREFIXES.some((p) => pathname.startsWith(p)) : false;

  if (hide) return null;
  return <>{children}</>;
}
