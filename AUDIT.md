# Auditoría completa — CENYCA Web

**Fecha:** 2026-05-18
**Stack:** Next.js 16.2.2 (App Router, Turbopack) · React 19.2.4 · Sanity 5.x · Tailwind 4
**Ámbito:** read-only — sin modificar código
**Despliegue:** Vercel (`cenyca-proyecto-web.vercel.app`) — dominio custom pendiente

---

## 📊 Resumen ejecutivo

| Dimensión | Estado | Hallazgos |
|---|---|---|
| 1. Build & TypeSafety | 🟢 OK | Build limpio, TS sin errores |
| 2. Lint | 🟡 Atención | 4 errores, 5 warnings |
| 3. Seguridad | 🔴 Crítico | **`/studio` sin proteger**, 4 advisories npm |
| 4. SEO | 🟡 Atención | Sin JSON-LD, sin OG por página, faltan páginas en sitemap |
| 5. Performance | 🟡 Atención | Video 9.5MB en `public/`, sin analytics |
| 6. Accesibilidad | 🟢 OK general | h1 únicos, alts presentes, contraste OK |
| 7. Formularios | 🔴 Crítico | 2 de 3 formularios **no envían a nada** (TODO) |
| 8. Legal / Producción | 🟡 Atención | Aviso de privacidad incompleto, sin cookies banner, sin monitoring |

**🔴 Bloqueadores de producción:** 3
**🟡 Importantes:** 12
**🟢 Mejoras:** 8

---

## 🔴 CRÍTICO (bloquea producción)

### C1. `/studio` expuesto sin autenticación
**Archivo:** `app/studio/[[...tool]]/page.tsx` + ausencia de `middleware.ts`
**Detalle:** Las variables `STUDIO_USERNAME` / `STUDIO_PASSWORD` existen en `.env.local` y en `.env.example`, pero **no hay middleware que las use**. Cualquier persona puede entrar a `https://tu-dominio.com/studio` y editar contenido si tiene un usuario de Sanity con permisos.
**Riesgo:** El control de acceso al Studio depende solo de los permisos de Sanity (lo cual es defensa válida), pero el dominio público expone una superficie de ataque innecesaria (bots, DoS, intentos de login).
**Fix:** Crear `middleware.ts` que pida Basic Auth en `/studio/*` usando esas envs. Esfuerzo: S (30 min).

### C2. `FormularioLead` y `NewsletterSuscripcion` no envían datos
**Archivos:** `app/components/FormularioLead.tsx:36` y `app/components/NewsletterSuscripcion.tsx:14`
**Detalle:** Ambos tienen un `setTimeout(..., 600)` falso y un `// TODO: conectar backend`. El usuario llena el formulario, ve "¡Enviado!", pero **nadie recibe nada**. Solo `PromocionFormulario` sí envía (a Emma/Railway).
**Riesgo:** Pérdida de leads. Posible reclamación legal por simular envío sin entregar.
**Fix:** Conectar a backend (Emma como `PromocionFormulario`, o Resend / webhook a CRM). Esfuerzo: M (1-2h por formulario).

### C3. Vulnerabilidades npm (4 advisories)
**Detalle:** `npm audit` reporta:
- 🔴 high: `@babel/plugin-transform-modules-systemjs` (arbitrary code on malicious input)
- 🟡 moderate: `brace-expansion` (DoS), `dompurify` (XSS bypass), `js-yaml` (prototype pollution)
**Fix:** `npm audit fix` resuelve las 4 sin breaking changes. `npm audit fix --force` actualizaría Sanity a 5.14.1 (breaking). Esfuerzo: S.

---

## 🟡 IMPORTANTE

### I1. ESLint: 4 errores reales
- **`components/BeneficioIcon.tsx:75-76`** — Componente creado durante render. Reset de estado en cada render.
  ```tsx
  const Icon = getBeneficioIcon(titulo);
  return <Icon ... />
  ```
  **Fix:** mover la selección fuera del componente o memoizar.
- **`app/components/PromoPopup.tsx:160`** — `<a href="/">` en vez de `<Link>`. Causa full page reload.
- **Warnings:** vars no usadas en `PromoPopup` (`url`), `SeccionModalidades` (`Link`), `BloqueInversion` (`ahorro`); directivas eslint-disable inservibles en `LazySelfHostedVideo`.

### I2. Sin SEO estructurado (JSON-LD)
**Detalle:** Cero uso de `application/ld+json`. Google no entiende qué tipo de entidad es CENYCA, ni qué cursos ofrece.
**Falta:** `EducationalOrganization` en layout, `Course` en `/carreras/[slug]`, `BreadcrumbList`, `FAQPage` donde aplique.
**Impacto:** Posicionamiento orgánico debilitado, sin rich results en Google.
**Fix:** Esfuerzo M (2-3h).

### I3. Open Graph solo en 2 lugares
**Detalle:** Solo `app/layout.tsx` (genérico) y `app/carreras/[slug]` tienen OG. Faltan en:
- `/oferta-academica`, `/licenciaturas`, `/ingenierias`
- `/nosotros`, `/admisiones`, `/becas`, `/posgrados`
- `/noticias`, `/noticias/[slug]`
- `/avisos-de-privacidad/[slug]`
**Impacto:** Cuando comparten links por WhatsApp/Facebook, sale preview pobre.
**Fix:** Añadir `generateMetadata` con OG + Twitter por página. Esfuerzo: M.

### I4. Sitemap incompleto
**Archivo:** `app/sitemap.ts`
**Faltan:** `/ingenierias`, `/oferta-academica`, `/educacion-continua`, `/intercambios`, `/avisos-de-privacidad`.
**Fix:** Añadir 5 entradas. Esfuerzo: S (10 min).

### I5. `NEXT_PUBLIC_SITE_URL` inconsistente
**Detalle:**
- `layout.tsx` fallback: `http://localhost:3000`
- `sitemap.ts` y `robots.ts` fallback: `https://cenyca-proyecto-web.vercel.app`
- `noticias/[slug]/page.tsx` fallback: `https://cenycauniversidad.mx`
Tres fallbacks distintos. Si la env no está bien configurada en Vercel, hay enlaces canónicos / OG rotos.
**Fix:** Confirmar que `NEXT_PUBLIC_SITE_URL` está en Vercel y unificar fallback. Esfuerzo: S.

### I6. Sin analytics ni monitoring
**Detalle:** Cero analytics (GA4, Vercel Analytics, Plausible) y cero error tracking (Sentry).
**Impacto:** No sabes cuántos visitantes tienes ni qué errores ven en producción.
**Fix:** Instalar Vercel Analytics (1 línea) + Sentry. Esfuerzo: M.

### I7. Video hero de 9.5MB en `public/`
**Archivo:** `public/videos/VIDEO-HERO-WEB-CENYCA.mov`
**Detalle:** `.mov` (no optimizado para web), 9.5MB. Bloquea LCP en móvil.
**Fix:** Convertir a `.mp4` H.264 + `.webm` VP9, comprimir a <2MB. Esfuerzo: S (con ffmpeg).

### I8. `instalaciones-7.jpg` duplicada y pesada
**Archivos:** `public/instalaciones/instalaciones-7.jpg` (848KB) + `.webp` (536KB).
**Fix:** Eliminar el `.jpg`. Esfuerzo: S.

### I9. Páginas placeholder sin contenido
**Archivos:** `app/admisiones`, `app/becas`, `app/intercambios`, `app/educacion-continua`, `app/posgrados`
**Detalle:** Las 5 usan `<PlaceholderPage>`. Están indexables por Google y aparecen en sitemap → señal de "sitio incompleto".
**Fix:** O construirlas, o marcarlas `robots: { index: false }` mientras tanto. Esfuerzo: depende.

### I10. Aviso de privacidad incompleto
**Detalle:** Solo 2 secciones (de ~8 esperadas). Sin derechos ARCO, sin transferencias, sin cambios al aviso, sin contacto de privacidad.
**Riesgo legal:** LFPDPPP (México) exige contenido mínimo.
**Fix:** Conseguir versión completa. Esfuerzo: depende del cliente.

### I11. Sin banner de cookies
**Detalle:** Si se instala analytics o tracking de Meta (`fbq` ya está en código), se requiere consentimiento previo según LFPDPPP.
**Riesgo:** Multa por uso no consentido de cookies de marketing.
**Fix:** Instalar cookie banner. Esfuerzo: M.

### I12. API key pública en código cliente
**Archivo:** `components/PromocionFormulario.tsx:24-25`
```ts
const API_KEY = "sofia-cenyca-2026-xK9mP4";
```
**Detalle:** El propio comentario aclara que "ya es pública porque vive en HTML estático". Aun así no es ideal — debería ir tras un proxy server-side (`/api/lead`) que añada la key.
**Riesgo:** Abuso del endpoint Emma por bots. Costos / spam.
**Fix:** Crear proxy `/api/lead` y rate-limit. Esfuerzo: M.

---

## 🟢 MEJORAS (nice-to-have)

### M1. Dependencias desactualizadas
9 paquetes con minor updates disponibles (Next 16.2.2→16.2.6, Sanity 5.20→5.25, etc.). Ninguna breaking.
**Fix:** `npx npm-check-updates --target minor -u && npm install`. Esfuerzo: S.

### M2. ESLint config no ignora `.next/dev/`
Al correr `npm run lint`, ESLint procesa archivos de cache de Turbopack → 20+ warnings de Babel. Añadir `.next/dev/**` a `globalIgnores` en `eslint.config.ts`.

### M3. Lighthouse + Core Web Vitals pendientes
No corrí Lighthouse (requiere navegador). Recomiendo:
```
npx lighthouse https://cenyca-proyecto-web.vercel.app/ --view
```
Y revisar LCP, CLS, INP en producción con Vercel Speed Insights.

### M4. Sin tests
Cero tests unitarios o e2e. Para un sitio universitario es OK por ahora, pero formularios y rutas críticas deberían tener al menos smoke tests (Playwright).

### M5. `console.warn` en producción
`app/api/csp-report/route.ts:69` deja `console.warn`. OK para CSP reports (telemetría útil), pero idealmente va a un servicio externo (Sentry, Axiom).

### M6. Doble carpeta `/components` y `/app/components`
Tienes 2 ubicaciones de componentes. Funciona, pero confunde. Unificar a una sola (`/components`) cuando haya bandwidth.

### M7. Loader `useCdn: false`
`sanity/lib/client.ts:8` — desactiva el CDN siempre. Para contenido público (no draft) podrías usar CDN y reducir latencia. Trade-off: contenido potencialmente 30-60s desactualizado.

### M8. Headers de seguridad: añadir `X-DNS-Prefetch-Control`
Menor, pero buen estándar. CSP ya es robusta. ✅

---

## ✅ Lo que SÍ está bien (no tocar)

- TypeScript estricto, 0 errores
- Build de producción limpio (15s, 26 páginas, ISR funcionando)
- Headers de seguridad sólidos: CSP, HSTS, X-Frame-Options, COOP/CORP, Permissions-Policy ✅
- CSP con reporting endpoint propio
- Manejo de `null` en queries Sanity con `.catch(() => null)`
- `next/image` usado consistentemente con `sizes` y `fill`
- Fuente Inter con `display: swap` (no FOIT)
- Página 404 custom con `noindex`
- `rel="noopener noreferrer"` en todos los `target="_blank"` ✅
- `poweredByHeader: false`
- `robots.ts` excluye `/studio/` y `/api/`
- 100% server components donde corresponde, `"use client"` solo donde necesita
- Sin secretos hardcodeados (solo la API key pública documentada)

---

## 🎯 Plan de acción sugerido (orden de prioridad)

**Sprint 1 — Seguridad y leads (2-3 días):**
1. Crear `middleware.ts` para proteger `/studio`
2. Conectar `FormularioLead` y `NewsletterSuscripcion` a backend real
3. `npm audit fix`
4. Conseguir aviso de privacidad completo

**Sprint 2 — SEO y trackeo (2-3 días):**
5. JSON-LD (`EducationalOrganization`, `Course`, `BreadcrumbList`)
6. OG por página
7. Sitemap completo
8. Vercel Analytics + Sentry
9. Cookie banner

**Sprint 3 — Performance y producción (1-2 días):**
10. Convertir video hero a MP4/WebM comprimido
11. Eliminar duplicados de instalaciones
12. Decidir destino de páginas placeholder (build o noindex)
13. Actualizar deps minor
14. Lighthouse audit en producción
15. Apuntar dominio definitivo (cuando esté listo)

---

**Estimación total:** ~5-8 días de trabajo para producción "lista para escala".
**Estado actual:** Funcional y desplegada, pero con 3 bloqueadores que conviene resolver antes de hacer marketing serio.
