import Layout from '../components/Layout';
import { Link } from 'react-router';
import { Shield, Lock, UserCheck, Eye } from 'lucide-react';
import Seo from '../components/Seo';

export default function About() {
  return (
    <Layout>
      <Seo
        title="Sobre la plataforma"
        description="Conoce cómo funciona Dubai Escorts, el proceso de verificación de perfiles y el enfoque de seguridad de la plataforma para que disfrutes de la experiencia VIP con seguridad."
        path="/about"
        image="/images/logo.png"
      />
      <div className="min-h-screen bg-black">
        <div className="bg-gradient-to-b from-[#0a0a0a] to-black py-20 px-8 border-b border-[#a83d8e]/20">
          <div className="max-w-[1000px] mx-auto text-center">
            <h1 className="text-6xl mb-6 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
              Sobre Dubai Escorts Ecuador
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
                Gracias a Dubai vive y disfruta una experiencia premium con las mejores escorts de Ecuador!            
            </p>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto px-8 py-20">
          <section className="mb-16">
            <h2 className="text-4xl text-white mb-6">Nuestra misión</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              DUBAI es una plataforma de escorts premium diseñada para conectar con modelos verificadas y sus servicios de calidad en Ecuador.
              Priorizamos la seguridad, la discreción y el profesionalismo en cada interacción.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-4xl text-white mb-8">Cómo funciona</h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-xl p-6 border-l-4 border-[#a83d8e]">
                <h3 className="text-xl text-white mb-2">1. Explora perfiles verificados</h3>
                <p className="text-gray-400 leading-relaxed">
                  Busca en nuestra selección premium de escorts verificadas en las principales
                  ciudades del Ecuador.
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-xl p-6 border-l-4 border-[#a83d8e]">
                <h3 className="text-xl text-white mb-2">2. Revisa los detalles</h3>
                <p className="text-gray-400 leading-relaxed">
                  Cada perfil incluye información sobre la zona de ubicación e informacion de la modelo.
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-xl p-6 border-l-4 border-[#a83d8e]">
                <h3 className="text-xl text-white mb-2">3. Contacta directamente</h3>
                <p className="text-gray-400 leading-relaxed">
                  Conecta por WhatsApp. Todos los acuerdos,
                  incluidos horarios y precios, se gestionan con confidencialidad.
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-xl p-6 border-l-4 border-[#a83d8e]">
                <h3 className="text-xl text-white mb-2">4. Reúnete y vive la experiencia DUBAI - VIP</h3>
                <p className="text-gray-400 leading-relaxed">
                  Reunete con tu modelo, paga de forma segura y disfruta de una experiencia premium con la máxima discreción.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-[#a83d8e]/20">
            <h2 className="text-3xl text-white mb-4">Nuestro compromiso</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              En DUBAI estamos comprometidos con mantener los más altos estándares de seguridad,
              discreción y profesionalismo. No toleramos ninguna forma de explotación, coerción o
              actividad ilegal en nuestra plataforma.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Todas las modelos publicadas son verificadas y mayores de edad (18+). Promovemos el comportamiento responsable y el respeto mutuo.
            </p>
          </section>

          <section className="mt-10 rounded-2xl p-8 border border-[#d4af37]/40 bg-gradient-to-r from-[#a83d8e]/20 to-[#d4af37]/15 text-center">
            <div className="inline-flex items-center rounded-full border border-[#d4af37]/50 bg-black/40 px-4 py-1 mb-5">
              <span className="text-[#d4af37] text-xs tracking-[0.2em]">EXCLUSIVO DUBAI</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-white leading-tight mb-4">
              Evita extorsiones y estafas.
              <span className="block bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
                Elige Dubai Escorts Ecuador.
              </span>
            </h2>
            <p className="text-gray-200 text-base md:text-lg max-w-3xl mx-auto mb-7">
              Accede a perfiles verificados, trato discreto y experiencia VIP en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/profiles"
                className="inline-flex items-center justify-center w-full sm:w-auto bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white px-10 py-3 rounded-lg transition-all hover:shadow-[0_0_30px_rgba(168,61,142,0.65)]"
              >
                Ver perfiles VIP
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
