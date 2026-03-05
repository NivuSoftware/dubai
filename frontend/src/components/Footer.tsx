import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#a83d8e]/30 py-12 px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl tracking-wider text-[#a83d8e] mb-4">DUBAI</h3>
            <p className="text-gray-400 text-sm">
              Escorts premium y verficadas en Ecuador.
            </p>
          </div>
          
          <div>
            <h4 className="text-white mb-4">Enlaces rápidos</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-[#d4af37] text-sm transition-colors">
                Inicio
              </Link>
              <Link to="/profiles" className="block text-gray-400 hover:text-[#d4af37] text-sm transition-colors">
                Perfiles
              </Link>
              <Link to="/about" className="block text-gray-400 hover:text-[#d4af37] text-sm transition-colors">
                Sobre nosotros
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-[#d4af37] text-sm transition-colors">
                Contacto
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <div className="space-y-2">
              <Link to="/safety" className="block text-gray-400 hover:text-[#d4af37] text-sm transition-colors">
                Guías de seguridad
              </Link>
              <a href="#" className="block text-gray-400 hover:text-[#d4af37] text-sm transition-colors">
                Términos del servicio
              </a>
              <a href="#" className="block text-gray-400 hover:text-[#d4af37] text-sm transition-colors">
                Política de privacidad
              </a>
              <a href="#" className="block text-gray-400 hover:text-[#d4af37] text-sm transition-colors">
                Reportar abuso
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white mb-4">Importante</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>🔞 Solo adultos (18+)</p>
              <p>📋 Solo directorio — sin reservas</p>
              <p>🚫 No se permite contenido explícito</p>
              <p>⚠️ Reporta actividad sospechosa</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#a83d8e]/20 pt-6 text-center text-sm text-gray-500">
          <p>© 2026 DUBAI - Escorts Ecuador - Vive la experiecia VIP. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
