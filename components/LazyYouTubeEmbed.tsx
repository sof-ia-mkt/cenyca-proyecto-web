"use client";

import { useState } from "react";
import { Play } from "lucide-react";

type Props = {
  youtubeId: string;
  title?: string;
  thumbnailUrl?: string | null;
};

// Embed lazy: muestra un thumbnail (próximo a 0 KB en JS) y solo carga el iframe
// de YouTube cuando el usuario hace clic. Evita cargar el script de YouTube en
// cada carga de página, lo cual mejora LCP y privacidad.
export default function LazyYouTubeEmbed({ youtubeId, title = "Video", thumbnailUrl }: Props) {
  const [loaded, setLoaded] = useState(false);

  // Fallback al thumbnail nativo de YouTube si no hay uno custom.
  const poster = thumbnailUrl ?? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
  const fallbackPoster = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  if (loaded) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label={`Reproducir: ${title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00D4FF]/40"
    >
      {/* Necesitamos next/image con un dominio externo. i.ytimg.com no está en remotePatterns. */}
      {/* Uso <img> nativo aquí — es 1 sola imagen externa y mantenerla optimizada vía Next requeriría sumar i.ytimg.com a remotePatterns. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        onError={(e) => {
          if (e.currentTarget.src !== fallbackPoster) e.currentTarget.src = fallbackPoster;
        }}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      {/* Overlay oscuro suave */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-2xl backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-[#00D4FF] sm:h-24 sm:w-24">
          <Play className="ml-1 h-8 w-8 text-[#121B33] sm:h-10 sm:w-10" fill="currentColor" strokeWidth={0} />
        </div>
      </div>
    </button>
  );
}
