import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-black text-white">
      <TopBar />
      <Header />
      {children}
      <Footer />
    </div>
  );
}
