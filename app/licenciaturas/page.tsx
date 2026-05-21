export const revalidate = 0;

import type { Metadata } from "next";
import { CalendarClock, Users, Award, Lightbulb } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { todasCarrerasQuery, configuracionQuery } from "@/sanity/lib/queries";
import { sanityImg } from "@/sanity/lib/image-url";
import AreaTemplate, { type AreaStat, type AreaValor } from "@/app/components/AreaTemplate";
import type { CarreraCard } from "@/app/components/AreaCarreraGrid";

export const metadata: Metadata = {
  title: "Licenciaturas",
  description:
    "Licenciaturas en CENYCA Universidad: Derecho, Administración, Contaduría, Criminología, Gastronomía y Educación. RVOE SEP, horarios flexibles.",
  openGraph: {
    title: "Licenciaturas | CENYCA Universidad",
    description:
      "Licenciaturas con RVOE SEP: Derecho, Administración, Contaduría, Criminología, Gastronomía y Educación.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Licenciaturas | CENYCA Universidad" },
};

type Configuracion = {
  imagenesOferta?: { licenciaturas?: string };
};

export default async function LicenciaturasPage() {
  const [carrerasAll, config] = await Promise.all([
    client.fetch<CarreraCard[]>(todasCarrerasQuery),
    client.fetch<Configuracion>(configuracionQuery),
  ]);

  const carreras = carrerasAll.filter((c) => c.area !== "ingenieria");
  const imagenHero = sanityImg(config?.imagenesOferta?.licenciaturas, 1800);

  const stats: AreaStat[] = [
    { value: carreras.length, label: "Licenciaturas activas" },
    { value: 3, label: "Años para titularte" },
    { value: 3, label: "Modalidades de estudio" },
    { value: 100, suffix: "%", label: "Programas con RVOE" },
  ];

  const valores: AreaValor[] = [
    {
      Icon: CalendarClock,
      titulo: "Horarios flexibles",
      desc: "Modalidades ejecutiva y escolarizada para que estudies sin pausar tu vida profesional o familiar.",
    },
    {
      Icon: Users,
      titulo: "Grupos pequeños",
      desc: "Atención cercana de tus profesores y dinámicas que conectan teoría con casos del mundo real.",
    },
    {
      Icon: Award,
      titulo: "Catedráticos en activo",
      desc: "Profesionistas que ejercen en bufetes, despachos y empresas — aprendes de quien lo vive todos los días.",
    },
    {
      Icon: Lightbulb,
      titulo: "Visión multidisciplinaria",
      desc: "Programas con componentes de negocios, derecho, comunicación y emprendimiento, sin importar tu carrera.",
    },
  ];

  return (
    <AreaTemplate
      kicker="Área Profesional · 2026"
      titulo="Licenciaturas."
      descripcion="Programas ejecutivos con horarios flexibles, diseñados para profesionistas en activo que buscan dar el siguiente paso."
      stats={stats}
      valores={valores}
      carreras={carreras}
      imagenHero={imagenHero}
      cierreTitulo="Una licenciatura compatible con tu vida real."
    />
  );
}
