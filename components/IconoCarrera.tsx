const paths: Record<string, React.ReactNode> = {
  derecho: (
    <>
      <path d="M12 3v18M3 9h18" />
      <path d="M5 9l-2 6h4L5 9zM19 9l-2 6h4L19 9z" />
      <path d="M8 21h8" />
    </>
  ),
  administracion: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </>
  ),
  contaduria: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="12" y2="15" />
      <path d="M15 17l1.5 1.5L19 15" />
    </>
  ),
  psicologia: (
    <>
      <path d="M9 3a3 3 0 0 1 6 0c0 2-1.5 3-3 4.5" />
      <path d="M12 7.5C10 9 8 10.5 8 13a4 4 0 0 0 8 0c0-2.5-2-4-4-5.5z" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </>
  ),
  educacion: (
    <>
      <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </>
  ),
  criminologia: (
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
      <line x1="9" y1="11" x2="13" y2="11" />
      <line x1="11" y1="9" x2="11" y2="13" />
    </>
  ),
  gastronomia: (
    <>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </>
  ),
  mecatronica: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
    </>
  ),
  electromecanica: (
    <>
      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </>
  ),
  sistemas: (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </>
  ),
  industrial: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <path d="M7 8h2v5H7zM11 6h2v7h-2zM15 9h2v4h-2z" />
    </>
  ),
}

export default function IconoCarrera({ id, className = 'w-7 h-7' }: { id: string; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[id]}
    </svg>
  )
}
