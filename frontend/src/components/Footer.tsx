import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#a83d8e]/30 py-14 px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center mb-4">
              <img
                src="/images/logo.png"
                alt="Dubai Escorts Ecuador"
                className="h-16 sm:h-20 w-auto"
              />
            </Link>
            <p className="text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Directorio premium de acompañantes verificadas en Ecuador. Priorizamos
              seguridad, discreción y experiencia VIP en cada contacto.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/profiles"
                className="inline-flex items-center justify-center bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white px-5 py-2.5 rounded-full text-sm transition-all"
              >
                Ver perfiles
              </Link>
              <Link
                to="/safety"
                className="inline-flex items-center justify-center border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black px-5 py-2.5 rounded-full text-sm transition-all"
              >
                Guía de seguridad
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white mb-4 text-lg">Enlaces rápidos</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-gray-400 hover:text-[#d4af37] text-sm sm:text-base transition-colors">
                Inicio
              </Link>
              <Link to="/profiles" className="block text-gray-400 hover:text-[#d4af37] text-sm sm:text-base transition-colors">
                Perfiles
              </Link>
              <Link to="/about" className="block text-gray-400 hover:text-[#d4af37] text-sm sm:text-base transition-colors">
                Sobre nosotros
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-[#d4af37] text-sm sm:text-base transition-colors">
                Contacto
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white mb-4 text-lg">Legal</h4>
            <div className="space-y-3">
              <Link to="/safety" className="block text-gray-400 hover:text-[#d4af37] text-sm sm:text-base transition-colors">
                Guías de seguridad
              </Link>
              <a
                href="/archives/TERMINOSYCONDICIONES.pdf"
                target="_blank"
                rel="noreferrer"
                className="block text-gray-400 hover:text-[#d4af37] text-sm sm:text-base transition-colors"
              >
                Términos y condiciones
              </a>
              <a
                href="/archives/POLITICAPROTECCIONDATOS.pdf"
                target="_blank"
                rel="noreferrer"
                className="block text-gray-400 hover:text-[#d4af37] text-sm sm:text-base transition-colors"
              >
                Política de privacidad
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#a83d8e]/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p className="text-center md:text-left">
            © 2026 DUBAI - Escorts Ecuador. Todos los derechos reservados.
          </p>
          <p className="text-center md:text-right">
            Vive la experiencia VIP con seguridad y discreción.
          </p>
        </div>
      </div>
    </footer>
  );
}
