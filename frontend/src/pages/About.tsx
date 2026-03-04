import Layout from '../components/Layout';
import { Shield, Lock, UserCheck, Eye } from 'lucide-react';

export default function About() {
  return (
    <Layout>
      <div className="min-h-screen bg-black">
        <div className="bg-gradient-to-b from-[#0a0a0a] to-black py-20 px-8 border-b border-[#a83d8e]/20">
          <div className="max-w-[1000px] mx-auto text-center">
            <h1 className="text-6xl mb-6 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
              Sobre Dubai Escorts Ecuador
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
                Gracias a Dubai vive y discruta una experiencia premium con las mejores escorts de Ecuador!            
            </p>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto px-8 py-20">
          <section className="mb-16">
            <h2 className="text-4xl text-white mb-6">Nuestra misión</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              DUBAI es una plataforma de directorio premium diseñada para conectar acompañantes
              adultas verificadas con personas exigentes que buscan compañía sofisticada en Ecuador.
              Priorizamos la seguridad, la discreción y el profesionalismo en cada interacción.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-4xl text-white mb-8">Cómo funciona</h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-xl p-6 border-l-4 border-[#a83d8e]">
                <h3 className="text-xl text-white mb-2">1. Explora perfiles verificados</h3>
                <p className="text-gray-400 leading-relaxed">
                  Busca en nuestra selección curada de acompañantes verificadas en las principales
                  ciudades del Ecuador. Filtra por ubicación, disponibilidad y preferencias.
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-xl p-6 border-l-4 border-[#a83d8e]">
                <h3 className="text-xl text-white mb-2">2. Revisa los detalles</h3>
                <p className="text-gray-400 leading-relaxed">
                  Cada perfil incluye información sobre disponibilidad, zona de ubicación y reseñas
                  de clientes anteriores para ayudarte a tomar decisiones informadas.
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-xl p-6 border-l-4 border-[#a83d8e]">
                <h3 className="text-xl text-white mb-2">3. Contacta directamente</h3>
                <p className="text-gray-400 leading-relaxed">
                  Conecta por WhatsApp, teléfono o formulario de mensaje. Todos los acuerdos,
                  incluidos horarios y precios, se gestionan directamente entre las partes.
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-xl p-6 border-l-4 border-[#a83d8e]">
                <h3 className="text-xl text-white mb-2">4. Reúnete con seguridad</h3>
                <p className="text-gray-400 leading-relaxed">
                  Sigue nuestras guías de seguridad: reúnanse primero en lugares públicos, verifica
                  identidad, respeta límites y mantén discreción en todo momento.
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
              Todas las personas publicadas son adultas verificadas (18+) que operan de manera
              independiente. Promovemos el comportamiento responsable, el respeto mutuo y el
              cumplimiento de las leyes y regulaciones locales.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
