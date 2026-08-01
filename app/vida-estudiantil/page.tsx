import PlaceholderPage from '@/components/PlaceholderPage'
// El item "Vida Estudiantil" del Navbar se activa con el toggle
// navegacion.mostrarVidaEstudiantil en Sanity; esta página placeholder
// garantiza que activarlo nunca publique un enlace a 404.
export const metadata = { title: 'Vida Estudiantil', robots: { index: false, follow: true } }
export default function VidaEstudiantilPage() {
  return <PlaceholderPage titulo="Vida Estudiantil" descripcion="Deportes, cultura, comunidad y todo lo que vive un estudiante CENYCA fuera del aula. Muy pronto." seccion="Vida Estudiantil" />
}
