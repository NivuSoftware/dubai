import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

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

  const handleNavigation = (path: string) => {
    if (location.pathname === path) {
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  };

  const navLinkClass = (path: string) =>
    `text-base lg:text-lg font-medium transition-all ${
      isActive(path) ? 'text-[#a83d8e]' : 'text-gray-300 hover:text-[#d4af37]'
    }`;

  const authLinkClass = (path: string, variant: 'gold' | 'blue' | 'magenta') => {
    const base = 'px-6 py-2 rounded-full text-base font-medium transition-all text-center';

    if (variant === 'gold') {
      return `${base} ${
        isActive(path)
          ? 'bg-[#d4af37] text-black border border-[#d4af37] cursor-default'
          : 'border border-[#d4af37] text-[#f5d97a] hover:bg-[#d4af37] hover:text-black'
      }`;
    }

    if (variant === 'blue') {
      return `${base} ${
        isActive(path)
          ? 'bg-[#1f7fd8] text-white border border-[#1f7fd8] cursor-default'
          : 'border border-[#1f7fd8] text-[#93c5fd] hover:bg-[#1f7fd8] hover:text-white'
      }`;
    }

    return `${base} ${
      isActive(path)
        ? 'bg-[#a83d8e] text-white border border-[#a83d8e] cursor-default'
        : 'bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white border border-[#a83d8e]/50 hover:shadow-[0_0_20px_rgba(168,61,142,0.6)]'
    }`;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-[#a83d8e]/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link to="/" className="inline-flex items-center" onClick={() => handleNavigation('/')}>
          <img src="/images/logo.png" alt="Logo de Dubai" className="h-16 sm:h-24 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <Link to="/" className={navLinkClass('/')} aria-current={isActive('/') ? 'page' : undefined}>
            Inicio
          </Link>
          <Link
            to="/profiles"
            className={navLinkClass('/profiles')}
            aria-current={isActive('/profiles') ? 'page' : undefined}
          >
            Perfiles
          </Link>
          <Link
            to="/safety"
            className={navLinkClass('/safety')}
            aria-current={isActive('/safety') ? 'page' : undefined}
          >
            Seguridad
          </Link>
          <Link
            to="/about"
            className={navLinkClass('/about')}
            aria-current={isActive('/about') ? 'page' : undefined}
          >
            Sobre nosotros
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <LanguageSwitcher compact />
          <Link
            to="/login"
            className={authLinkClass('/login', 'gold')}
            aria-current={isActive('/login') ? 'page' : undefined}
          >
            Iniciar sesion
          </Link>
          <Link
            to="/registro-anunciante"
            className={authLinkClass('/registro-anunciante', 'blue')}
            aria-current={isActive('/registro-anunciante') ? 'page' : undefined}
          >
            Registrarse
          </Link>
          <Link
            to="/profiles"
            className={authLinkClass('/profiles', 'magenta')}
            aria-current={isActive('/profiles') ? 'page' : undefined}
          >
            Buscar perfiles
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher compact />
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md border border-[#d4af37]/60 p-2 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="md:hidden border-t border-[#a83d8e]/30 bg-black/95 backdrop-blur-xl">
          <nav className="px-8 py-5 flex flex-col gap-5">
            <Link to="/" className={navLinkClass('/')} onClick={() => handleNavigation('/')}>
              Inicio
            </Link>
            <Link
              to="/profiles"
              className={navLinkClass('/profiles')}
              onClick={() => handleNavigation('/profiles')}
            >
              Perfiles
            </Link>
            <Link
              to="/safety"
              className={navLinkClass('/safety')}
              onClick={() => handleNavigation('/safety')}
            >
              Seguridad
            </Link>
            <Link to="/about" className={navLinkClass('/about')} onClick={() => handleNavigation('/about')}>
              Sobre nosotros
            </Link>
            <div className="pt-2 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => handleNavigation('/login')}
                className={authLinkClass('/login', 'gold')}
                aria-current={isActive('/login') ? 'page' : undefined}
              >
                Iniciar sesion
              </Link>
              <Link
                to="/registro-anunciante"
                onClick={() => handleNavigation('/registro-anunciante')}
                className={authLinkClass('/registro-anunciante', 'blue')}
                aria-current={isActive('/registro-anunciante') ? 'page' : undefined}
              >
                Registrarse
              </Link>
              <Link
                to="/profiles"
                onClick={() => handleNavigation('/profiles')}
                className={authLinkClass('/profiles', 'magenta')}
                aria-current={isActive('/profiles') ? 'page' : undefined}
              >
                Buscar perfiles
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
