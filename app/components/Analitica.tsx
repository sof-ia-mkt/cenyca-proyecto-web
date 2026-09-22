"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * ANALÍTICA — Meta Pixel + Google Tag Manager
 *
 * Los snippets son los que entregó marketing, sin modificar. Se cargan con
 * `next/script` en estrategia `afterInteractive`, que es la que la
 * documentación de Next recomienda para gestores de etiquetas y analítica:
 * entran en cuanto la página es interactiva, sin bloquear el render.
 *
 * ⚠️ AVISO PARA MARKETING — no agregar una etiqueta de Meta Pixel dentro de
 * GTM. El pixel ya vive aquí, en el código. Si además se configura en el
 * contenedor, cada PageView y cada Lead se contarían DOS veces y la
 * optimización de campañas trabajaría con datos inflados.
 *
 * Los dominios de estos servicios están permitidos explícitamente en la
 * Content-Security-Policy de `next.config.ts`. Una etiqueta nueva en GTM que
 * cargue desde un dominio no listado ahí será bloqueada por el navegador.
 */

export const META_PIXEL_ID = "2316731552126622";
export const GTM_ID = "GTM-5TXHQXFV";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * El sitio es una SPA: después de la primera carga, navegar entre páginas no
 * recarga el documento, así que el `PageView` del snippet se dispararía UNA
 * sola vez por sesión. Esto lo vuelve a disparar en cada cambio de ruta, que
 * es lo que Meta y GTM esperan de un sitio normal.
 *
 * Sin esto se perderían casi todas las vistas y los públicos de remarketing
 * basados en URL (p. ej. "visitó /carreras/gastronomia") quedarían vacíos.
 */
function RastreoDeRuta() {
  const pathname = usePathname();
  // La carga inicial ya la reportan los snippets; evitamos duplicarla.
  const esPrimeraCarga = useRef(true);

  useEffect(() => {
    if (esPrimeraCarga.current) {
      esPrimeraCarga.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
    // Para GTM: activador de tipo "Evento personalizado" con nombre
    // `pageview_spa`. El activador nativo de Página no alcanza en una SPA.
    window.dataLayer?.push({ event: "pageview_spa", page_path: pathname });
  }, [pathname]);

  return null;
}

export default function Analitica() {
  return (
    <>
      {/* Meta Pixel Code */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>

      {/* Google Tag Manager */}
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>

      <RastreoDeRuta />
    </>
  );
}
