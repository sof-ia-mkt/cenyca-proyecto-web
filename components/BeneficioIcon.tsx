import {
  Sparkles,
  FlaskConical,
  Factory,
  Cpu,
  Briefcase,
  GraduationCap,
  Handshake,
  Wrench,
  Globe2,
  Users,
  Award,
  Lightbulb,
  ChefHat,
  Scale,
  HeartPulse,
  Leaf,
  Code2,
  TrendingUp,
  BookOpen,
  Building2,
  Clock,
  Target,
  ShieldCheck,
  Rocket,
  type LucideIcon,
} from "lucide-react";

// Mapeo de palabras clave → ícono Lucide. El primer match gana.
// Los keywords se buscan sobre el título del beneficio normalizado a NFD sin acentos.
const KEYWORD_MAP: Array<[RegExp, LucideIcon]> = [
  [/laborator|laboratory|practi[ck]/i, FlaskConical],
  [/cocina|culinar|chef|gastronom/i, ChefHat],
  [/industri|planta|manufactur|automatiz/i, Factory],
  [/tecnolog|digital|software|datos|robot|programac/i, Cpu],
  [/codig|desarroll|web|app|sistema/i, Code2],
  [/bolsa.*trabajo|empleo|insercion|laboral|carrera profesion/i, Briefcase],
  [/docente|maestr|profesor|claustro/i, GraduationCap],
  [/conveni|alianza|colabor|empres/i, Handshake],
  [/herramient|equip|taller/i, Wrench],
  [/intern[ao]ci?onal|global|extranj|mundo|movilidad/i, Globe2],
  [/red|comunidad|networking|alumni|egresad/i, Users],
  [/reconoci|premio|excelenc|calidad|certific|acredit/i, Award],
  [/innov|creativ|emprend|idea/i, Lightbulb],
  [/juridic|ley|derech|legal/i, Scale],
  [/salud|medic|clinic|enfermer|terapi/i, HeartPulse],
  [/sostenib|sustent|ambient|ecolog|verde/i, Leaf],
  [/negoci|finanz|contabl|admini/i, TrendingUp],
  [/contenido|materi|temar|plan.*estud|curricul|aprend/i, BookOpen],
  [/campus|instalac|sede|edifici|aula/i, Building2],
  [/horari|flexib|tiempo|fin de semana|cuatri/i, Clock],
  [/objetiv|enfoq|especial|profesional/i, Target],
  [/seguro|seguridad|confianza|garant/i, ShieldCheck],
  [/crecimient|impulso|acelerad|avanz|lider/i, Rocket],
];

export function getBeneficioIcon(titulo: string): LucideIcon {
  if (!titulo) return Sparkles;
  const normalized = titulo.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  for (const [pattern, icon] of KEYWORD_MAP) {
    if (pattern.test(normalized)) return icon;
  }
  return Sparkles;
}

import { createElement } from "react";

export default function BeneficioIcon({
  titulo,
  className = "w-6 h-6",
  strokeWidth = 1.75,
}: {
  titulo: string;
  className?: string;
  strokeWidth?: number;
}) {
  // Selección dinámica entre íconos estables de Lucide — declarados a nivel módulo.
  // Usamos createElement para evitar la lint rule `react-hooks/static-components`,
  // que asume creación de componentes en render. Aquí solo elegimos cuál renderizar.
  const icon = getBeneficioIcon(titulo);
  return createElement(icon, { className, strokeWidth });
}
