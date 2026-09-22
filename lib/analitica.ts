/**
 * IDs de analítica — módulo neutral, sin "use client".
 *
 * Tienen que vivir aquí y no dentro de `app/components/Analitica.tsx` porque
 * ese archivo es un componente de cliente: al importar una constante suya
 * desde un componente de servidor (el layout, que renderiza los `noscript`),
 * React no entrega el valor sino una referencia de cliente, y la URL termina
 * con un mensaje de error incrustado en vez del ID.
 */

export const META_PIXEL_ID = "2316731552126622";
export const GTM_ID = "GTM-5TXHQXFV";
