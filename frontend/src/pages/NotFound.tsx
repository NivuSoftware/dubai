import Layout from '../components/Layout';
import { Link } from 'react-router';
import { Home } from 'lucide-react';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <Layout>
      <Seo title="Página no encontrada" path="/404" robots="noindex, nofollow" />
      <div className="min-h-screen bg-black flex items-center justify-center px-8">
        <div className="text-center">
          <h1 className="text-9xl mb-4 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-4xl text-white mb-4">Página no encontrada</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            La página que buscas no existe o fue movida.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white px-8 py-4 rounded-full transition-all hover:shadow-[0_0_20px_rgba(168,61,142,0.5)]"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </Layout>
  );
}
