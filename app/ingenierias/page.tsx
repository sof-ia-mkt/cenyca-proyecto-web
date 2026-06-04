export const revalidate = 0;

import type { Metadata } from "next";
import { Cpu, Wrench, Briefcase, ShieldCheck } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { todasCarrerasQuery, configuracionQuery } from "@/sanity/lib/queries";
import { sanityImg } from "@/sanity/lib/image-url";
import AreaTemplate, { type AreaStat, type AreaValor } from "@/app/components/AreaTemplate";
import type { CarreraCard } from "@/app/components/AreaCarreraGrid";

export const metadata: Metadata = {
  title: "Ingenierías",
  description:
    "Programas de ingeniería en CENYCA Universidad: Mecatrónica, Sistemas, Industrial y Electromecánica. RVOE SEP, modelo cuatrimestral, titúlate en 3 años.",
  openGraph: {
    title: "Ingenierías | CENYCA Universidad",
    description:
      "Ingenierías con RVOE SEP: Mecatrónica, Sistemas, Industrial y Electromecánica. Titúlate en 3 años.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Ingenierías | CENYCA Universidad" },
};

type Configuracion = {
  imagenesOferta?: { ingenierias?: string };
};

export default async function IngenieriasPage() {
  const [carrerasAll, config] = await Promise.all([
    client.fetch<CarreraCard[]>(todasCarrerasQuery),
    client.fetch<Configuracion>(configuracionQuery),
  ]);

  const carreras = carrerasAll.filter((c) => c.area === "ingenieria");
  const imagenHero = sanityImg(config?.imagenesOferta?.ingenierias, 1800);

  const stats: AreaStat[] = [
    { value: carreras.length, label: "Programas de ingeniería" },
    { value: 3, label: "Años para titularte" },
    { value: 2, label: "Modalidades de estudio" },
    { value: 100, suffix: "%", label: "Programas con RVOE" },
  ];

  const valores: AreaValor[] = [
    {
      Icon: Cpu,
      titulo: "Tecnología de punta",
      desc: "Laboratorios equipados con robótica, automatización y desarrollo de software para que practiques con lo último de la industria.",
    },
    {
      Icon: Wrench,
      titulo: "Aprendizaje aplicado",
      desc: "Cada cuatrimestre incluye proyectos reales: dejas de memorizar fórmulas y empiezas a construir soluciones.",
    },
    {
      Icon: Briefcase,
      titulo: "Vinculación con industria",
      desc: "Convenios con empresas del noroeste para prácticas profesionales y bolsa de trabajo desde tu primer año.",
    },
    {
      Icon: ShieldCheck,
      titulo: "RVOE SEP federal",
      desc: "Todos nuestros planes están reconocidos por la Secretaría de Educación Pública. Tu título es oficial.",
    },
  ];

  return (
    <AreaTemplate
      kicker="Área de Ingeniería · 2026"
      titulo="Ingenierías."
      descripcion="Formación técnica de élite para liderar la transformación industrial y tecnológica de Baja California."
      stats={stats}
      valores={valores}
      carreras={carreras}
      imagenHero={imagenHero}
      cierreTitulo="Una ingeniería pensada para el mercado de Baja California."
    />
  );
}
