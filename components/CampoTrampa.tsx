// Campo trampa contra bots para los formularios de prospectos.
//
// Una persona no lo ve ni llega a él con el teclado; un bot que rellena todos
// los campos sí lo llena. /api/leads descarta en silencio cualquier envío que
// lo traiga con texto (no guarda el lead ni manda el WhatsApp de bienvenida).
//
// El nombre es deliberadamente neutro: no debe parecerse a un dato que el
// autocompletado del navegador rellene (nombre, correo, teléfono, dirección),
// porque eso descartaría a una persona real.

export const NOMBRE_CAMPO_TRAMPA = "campo_extra";

export default function CampoTrampa() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: 1,
        height: 1,
        overflow: "hidden",
      }}
    >
      <input
        type="text"
        name={NOMBRE_CAMPO_TRAMPA}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

/** Lee el campo trampa del formulario. Llamar ANTES de cualquier `await` en el
 *  manejador: después React ya soltó `currentTarget`. */
export function leerCampoTrampa(form: EventTarget | null): string {
  if (!(form instanceof HTMLFormElement)) return "";
  return String(new FormData(form).get(NOMBRE_CAMPO_TRAMPA) ?? "");
}
