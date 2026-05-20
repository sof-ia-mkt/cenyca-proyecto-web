"use client";

import Image from "next/image";

type Aliado = {
  nombre: string;
  sector?: string;
  logo?: string | null;
  destacado?: boolean;
};

export default function AliadosMarquee({
  aliados,
  kicker,
  texto,
}: {
  aliados: Aliado[];
  kicker: string;
  texto: string;
}) {
  // Prioriza destacados al frente para que se vean primero
  const sorted = [...aliados].sort(
    (a, b) => Number(b.destacado ?? false) - Number(a.destacado ?? false)
  );
  // Duplicamos para loop continuo sin saltos
  const loop = [...sorted, ...sorted];

  return (
    <section
      aria-label="Aliados de CENYCA"
      className="relative bg-white py-14 overflow-hidden"
    >
      {/* línea dorada arriba/abajo, convención del sitio */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(233,193,118,0.5) 50%, transparent 100%)",
        }}
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(233,193,118,0.5) 50%, transparent 100%)",
        }}
      />

      <div className="text-center mb-8 px-4">
        <span className="font-montserrat text-[#E9C176] text-xs font-bold uppercase tracking-[0.25em]">
          {kicker}
        </span>
        <p className="font-montserrat text-[#121B33]/60 text-sm mt-2 max-w-xl mx-auto text-pretty">
          {texto}
        </p>
      </div>

      {/* máscaras laterales para fade */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10"
          style={{
            background: "linear-gradient(90deg, #ffffff, transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10"
          style={{
            background: "linear-gradient(270deg, #ffffff, transparent)",
          }}
        />

        <div className="marquee-track flex items-center gap-14 whitespace-nowrap will-change-transform">
          {loop.map((a, i) => (
            <div
              key={`${a.nombre}-${i}`}
              className="flex items-center gap-14 shrink-0"
              title={a.nombre}
            >
              {a.logo ? (
                <span className="relative inline-flex h-16 w-32 sm:h-20 sm:w-40 items-center justify-center">
                  <Image
                    src={a.logo}
                    alt={a.nombre}
                    fill
                    sizes="160px"
                    className="object-contain opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                  />
                </span>
              ) : (
                <span className="font-montserrat font-bold text-[#121B33] text-xl sm:text-2xl uppercase tracking-wider opacity-80 hover:opacity-100 transition-opacity">
                  {a.nombre}
                </span>
              )}
              <span
                aria-hidden
                className="inline-block w-1.5 h-1.5 rounded-full bg-[#E9C176] shrink-0"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee 35s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
            flex-wrap: wrap;
            justify-content: center;
            white-space: normal;
          }
        }
      `}</style>
    </section>
  );
}
