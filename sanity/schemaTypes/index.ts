import { type SchemaTypeDefinition } from "sanity";
import { carrera } from "./carrera";
import { campus } from "./campus";
import { configuracion } from "./configuracion";
import { noticia } from "./noticia";
import { documento } from "./documento";
import { avisoPrivacidad } from "./avisoPrivacidad";
import { historia } from "./historia";
import { vinculacion } from "./vinculacion";
import { nosotros } from "./nosotros";
import { redirect } from "./redirect";
import { faq } from "./faq";
import { categoriaFaq } from "./categoriaFaq";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Contenido principal
    carrera,
    campus,
    noticia,
    documento,
    avisoPrivacidad,
    faq,
    categoriaFaq,
    // Operativos
    redirect,
    // Singletons
    configuracion,
    historia,
    vinculacion,
    nosotros,
  ],
};
