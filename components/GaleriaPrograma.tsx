import Image from "next/image";

export type GaleriaItem = {
  url: string;
  alt?: string;
  lqip?: string;
  width?: number;
  height?: number;
};

type Props = {
  items: GaleriaItem[];
  carreraNombre: string;
  accent?: string;
};

// Grid uniforme 3×2 en desktop, 2 columnas en tablet, 1 en mobile.
// El crop es cuadrado (aspect-square) para que la rejilla sea consistente sin
// importar cuántas fotos suban en CMS (entre 3 y 8). Si hay menos de 6, fluye
// natural; si hay más, se rellena una tercera fila.
export default function GaleriaPrograma({ items, carreraNombre, accent = "#00D4FF" }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-[#F5F5F5] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <span
            className="font-montserrat text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ color: accent }}
          >
            Instalaciones y vida del programa
          </span>
          <h2 className="font-bebas text-[#121B33] text-4xl sm:text-5xl lg:text-6xl tracking-wide leading-[1.05] mt-3">
            Así se vive {carreraNombre}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {items.map((img, i) => (
            <figure
              key={`${img.url}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-[#E8E8E8]"
            >
              <Image
                src={img.url}
                alt={img.alt || `${carreraNombre} — foto ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder={img.lqip ? "blur" : "empty"}
                blurDataURL={img.lqip}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay degradado al hover para dar profundidad sin lightbox. */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
