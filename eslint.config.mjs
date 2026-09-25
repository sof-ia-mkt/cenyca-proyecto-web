import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Sin esto la regla no estaba activa y los `eslint-disable-next-line
      // no-console` del código no hacían nada. warn/error sí son legítimos
      // en el servidor (van a los logs de Vercel); console.log no.
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // `sanity deploy` deja aquí el build del Studio: bundles de varios MB que
    // hacían reventar a ESLint por falta de memoria. Git ya lo ignora.
    "dist/**",
  ]),
]);

export default eslintConfig;
