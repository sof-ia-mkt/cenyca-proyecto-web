import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import SmartNotFoundSuggestions, {
  type KnownRoute,
} from "./components/SmartNotFoundSuggestions";

export const metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

const STATIC_ROUTES: KnownRoute[] = [
  { label: "Inicio", href: "/" },
  { label: "Oferta Académica", href: "/oferta-academica" },
  { label: "Licenciaturas", href: "/licenciaturas" },
  { label: "Ingenierías", href: "/ingenierias" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Vinculación", href: "/vinculacion" },
  { label: "Noticias", href: "/noticias" },
  { label: "Documentos", href: "/documentos" },
  { label: "Avisos de Privacidad", href: "/avisos-de-privacidad" },
  { label: "Contacto", href: "/#contacto" },
  { label: "Planteles", href: "/#planteles" },
];

const carrerasQuery = groq`*[_type == "carrera" && activa == true]{
  "slug": slug.current,
  nombre
}`;

export default async function NotFound() {
  const carreras = await client
    .fetch<{ slug: string; nombre: string }[]>(carrerasQuery)
    .catch(() => []);

  const carreraRoutes: KnownRoute[] = carreras
    .filter((c) => c.slug && c.nombre)
    .map((c) => ({ label: c.nombre, href: `/carreras/${c.slug}` }));

  const routes: KnownRoute[] = [...STATIC_ROUTES, ...carreraRoutes];

  return (
    <section className="min-h-[70vh] bg-[#121B33] flex items-center justify-center px-4 py-20">
      <div className="max-w-xl text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00D4FF] mb-4">
          Error 404
        </p>
        <h1
          className="font-black text-white mb-5"
          style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", letterSpacing: "-0.04em", lineHeight: 1 }}
        >
          Página no encontrada
        </h1>
        <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-10">
          La página que buscas no existe o fue movida. Te invitamos a volver al inicio
          o explorar nuestras licenciaturas.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-[#00D4FF] text-[#121B33] font-black uppercase tracking-wider text-sm px-7 py-3.5 rounded-full hover:bg-white transition-colors"
          >
            Volver al inicio
          </Link>
          <Link
            href="/licenciaturas"
            className="inline-flex items-center justify-center border border-white/25 text-white font-bold uppercase tracking-wider text-sm px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors"
          >
            Ver licenciaturas
          </Link>
        </div>

        <SmartNotFoundSuggestions routes={routes} />
      </div>
    </section>
  );
}
