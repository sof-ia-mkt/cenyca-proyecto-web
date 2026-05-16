"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

type Props = {
  videoUrl: string;
  title?: string;
  posterUrl?: string | null;
};

// Lazy embed para video self-hosted (MP4/WebM). Muestra el poster como imagen
// estática y solo carga el <video> al hacer click. Si no hay poster, muestra
// el primer frame con preload="metadata" (carga unos KB para el poster nativo).
export default function LazySelfHostedVideo({ videoUrl, title = "Video", posterUrl }: Props) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={videoUrl}
          poster={posterUrl ?? undefined}
          controls
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full"
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
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        // Sin poster, usamos el primer frame nativo del video (preload metadata, ~unos KB).
        /* eslint-disable-next-line jsx-a11y/media-has-caption */
        <video
          src={`${videoUrl}#t=0.5`}
          preload="metadata"
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {/* Overlay degradado para profundidad */}
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
