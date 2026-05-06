import { type SchemaTypeDefinition } from "sanity";
import { carrera } from "./carrera";
import { campus } from "./campus";
import { configuracion } from "./configuracion";
import { noticia } from "./noticia";
import { documento } from "./documento";
import { avisoPrivacidad } from "./avisoPrivacidad";
import { pagina } from "./pagina";
import { historia } from "./historia";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Contenido principal
    carrera,
    campus,
    noticia,
    documento,
    avisoPrivacidad,
    pagina,
    // Singletons
    configuracion,
    historia,
  ],
};
