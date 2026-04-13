import { type SchemaTypeDefinition } from "sanity";
import { carrera } from "./carrera";
import { campus } from "./campus";
import { directorio } from "./directorio";
import { configuracion } from "./configuracion";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Contenido principal
    carrera,
    campus,
    directorio,
    // Configuración global (singleton)
    configuracion,
  ],
};
