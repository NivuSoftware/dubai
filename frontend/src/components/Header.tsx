import { Link, useLocation } from 'react-router';
import { Menu, MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;
  const navLinkClass = (path: string) =>
    `text-base lg:text-lg font-medium transition-all ${isActive(path) ? 'text-[#a83d8e]' : 'text-gray-300 hover:text-[#d4af37]'}`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-[#a83d8e]/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center">
          <img
            src="/images/logo.png"
            alt="Logo de Dubai"
            className="h-16 sm:h-24 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <Link to="/" className={navLinkClass('/')}>
            Inicio
          </Link>
          <Link to="/profiles" className={navLinkClass('/profiles')}>
            Perfiles
          </Link>
          <Link to="/safety" className={navLinkClass('/safety')}>
            Seguridad
          </Link>
          <Link to="/about" className={navLinkClass('/about')}>
            Sobre nosotros
          </Link>
          <Link to="/contact" className={navLinkClass('/contact')}>
            Contacto
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/profiles"
            className="bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white px-6 py-2 rounded-full text-base font-medium transition-all hover:shadow-[0_0_20px_rgba(168,61,142,0.6)] border border-[#a83d8e]/50"
          >
            Buscar perfiles
          </Link>
          <button className="border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black px-6 py-2 rounded-full text-base font-medium transition-all flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
        </div>

        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden inline-flex items-center justify-center rounded-md border border-[#d4af37]/60 p-2 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#a83d8e]/30 bg-black/95 backdrop-blur-xl">
          <nav className="px-8 py-5 flex flex-col gap-5">
            <Link to="/" className={navLinkClass('/')}>
              Inicio
            </Link>
            <Link to="/profiles" className={navLinkClass('/profiles')}>
              Perfiles
            </Link>
            <Link to="/safety" className={navLinkClass('/safety')}>
              Seguridad
            </Link>
            <Link to="/about" className={navLinkClass('/about')}>
              Sobre nosotros
            </Link>
            <Link to="/contact" className={navLinkClass('/contact')}>
              Contacto
            </Link>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                to="/profiles"
                className="bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white px-6 py-2 rounded-full text-base font-medium transition-all text-center border border-[#a83d8e]/50"
              >
                Buscar perfiles
              </Link>
              <button className="border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black px-6 py-2 rounded-full text-base font-medium transition-all flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
