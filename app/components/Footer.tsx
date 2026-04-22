export default function Footer() {
  return (
    <footer className="bg-[#121B33] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/40 text-xs font-montserrat">
          © {new Date().getFullYear()} CENYCA Universidad. Todos los derechos reservados.
        </p>
        <p className="text-white/30 text-xs font-montserrat">
          RVOE · SEP · Baja California
        </p>
      </div>
    </footer>
  );
}
