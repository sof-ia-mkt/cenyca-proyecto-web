"use client";

type Aliado = { nombre: string; sector?: string };

export default function AliadosMarquee({
  aliados,
  kicker,
  texto,
}: {
  aliados: Aliado[];
  kicker: string;
  texto: string;
}) {
  // Duplicamos para loop continuo sin saltos
  const loop = [...aliados, ...aliados];

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
        <p className="font-montserrat text-[#121B33]/60 text-sm mt-2">{texto}</p>
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

        <div className="marquee-track flex gap-12 whitespace-nowrap will-change-transform">
          {loop.map((a, i) => (
            <span
              key={`${a.nombre}-${i}`}
              className="font-montserrat font-bold text-[#121B33] text-xl sm:text-2xl uppercase tracking-wider opacity-80 hover:opacity-100 transition-opacity flex items-center gap-12"
            >
              {a.nombre}
              <span
                aria-hidden
                className="inline-block w-1.5 h-1.5 rounded-full bg-[#E9C176]"
              />
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee 60s linear infinite;
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
