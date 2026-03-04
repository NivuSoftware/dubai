import { ReactNode } from 'react';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <TopBar />
      <Header />
      {children}
      <Footer />
    </div>
  );
}
