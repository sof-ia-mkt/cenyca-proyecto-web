import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { credencialesValidas } from "@/lib/admin-auth";

/**
 * Verificación propia para todo /admin. El proxy ya pide las credenciales,
 * pero si por cualquier motivo no corrió (su matcher ignora las rutas con
 * punto, o un cambio futuro de configuración), aquí no se sirve nada.
 *
 * Se responde 404 y no 401 a propósito: quien no tiene credenciales no
 * necesita enterarse de que existe un panel. El diálogo de acceso lo sigue
 * mostrando el proxy en el flujo normal.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cabeceras = await headers();
  if (!(await credencialesValidas(cabeceras.get("authorization")))) {
    notFound();
  }
  return <>{children}</>;
}
