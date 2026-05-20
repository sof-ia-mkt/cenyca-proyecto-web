"use client";

import { useEffect, useRef } from "react";

/**
 * Video de fondo del hero que NUNCA se pausa mientras estés en la página.
 *
 * Algunos navegadores pausan el `<video loop>` cuando:
 *  - el tab pierde foco / vuelve del background
 *  - se activa el modo de bajo consumo (móviles)
 *  - hay una pausa transitoria por buffering
 *
 * Este componente vuelve a llamar a `play()` ante esas situaciones.
 */
export default function HeroVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const ensurePlaying = () => {
      if (v.paused || v.ended) {
        // play() devuelve promise; ignoramos rechazo (autoplay policy)
        v.play().catch(() => {});
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") ensurePlaying();
    };

    v.addEventListener("pause", ensurePlaying);
    v.addEventListener("ended", ensurePlaying);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", ensurePlaying);
    window.addEventListener("pageshow", ensurePlaying);

    // primer disparo: por si el autoplay no arrancó
    ensurePlaying();

    return () => {
      v.removeEventListener("pause", ensurePlaying);
      v.removeEventListener("ended", ensurePlaying);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", ensurePlaying);
      window.removeEventListener("pageshow", ensurePlaying);
    };
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      {...({ "webkit-playsinline": "true" } as Record<string, string>)}
      disablePictureInPicture
      controls={false}
      preload="auto"
      poster={poster}
      className={className}
    >
      <source src={src} />
    </video>
  );
}
