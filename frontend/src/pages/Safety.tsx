import Layout from '../components/Layout';
import { Link } from 'react-router';
import {
  AlertTriangle,
  Flag,
  ShieldCheck,
  BadgeCheck,
  HeartPulse,
  Sparkles,
} from 'lucide-react';

export default function Safety() {
  return (
    <Layout>
      <div className="min-h-screen bg-black">
        <div className="bg-gradient-to-b from-[#0a0a0a] to-black py-20 px-8 border-b border-[#a83d8e]/20">
          <div className="max-w-[1000px] mx-auto text-center">
            <h1 className="text-6xl mb-6 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
              Seguridad y confianza en DUBAI Escorts Ecuador
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Tu seguridad es nuestra prioridad. Sigue estas pautas para una experiencia segura.
            </p>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-8 py-20">
          <section className="mb-16">
            <div className="bg-gradient-to-r from-[#a83d8e]/15 to-[#d4af37]/10 rounded-2xl p-8 border border-[#a83d8e]/30">
              <h2 className="text-3xl text-white mb-6">Compromiso oficial de seguridad</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Sitio oficial y perfiles verificados',
                    description:
                      'Este es nuestro único sitio oficial. Todas las modelos están verificadas para ayudarte a evitar estafas y extorsiones.',
                  },
                  {
                    icon: BadgeCheck,
                    title: 'Mayores de edad y control sanitario',
                    description:
                      'Todas las modelos son mayores de edad y cuentan con carné de salud vigente.',
                  },
                  {
                    icon: HeartPulse,
                    title: 'Protección obligatoria',
                    description:
                      'Todos los servicios se realizan con protección, cuidando tu salud y la de nuestras modelos.',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#0a0a0a]/80 rounded-xl p-5 border border-[#a83d8e]/40 shadow-[0_0_24px_rgba(168,61,142,0.18)]"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#a83d8e]/30 to-[#d4af37]/20 border border-[#a83d8e]/50 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <h3 className="text-white text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-xl border border-[#d4af37]/50 bg-gradient-to-r from-[#a83d8e]/30 via-[#a83d8e]/15 to-[#d4af37]/20 p-6 md:p-7 shadow-[0_0_35px_rgba(212,175,55,0.2)]">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/50 bg-[#0a0a0a]/40 px-3 py-1 text-xs text-[#d4af37] mb-4">
                  <Sparkles className="w-4 h-4" />
                  EXPERIENCIA PREMIUM
                </div>
                <p className="text-white text-2xl md:text-3xl font-semibold leading-tight">
                  Solo DUBAI te da este nivel de seguridad, discreción y experiencia VIP.
                </p>
                <p className="text-gray-200 mt-3 text-sm md:text-base">
                  Perfiles verificados, atención privada y selección exclusiva para que conectes con confianza.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/profiles"
                    className="inline-flex items-center justify-center bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white px-6 py-3 rounded-lg transition-all hover:shadow-[0_0_24px_rgba(168,61,142,0.6)]"
                  >
                    Ver perfiles
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-[#d4af37]/20">
              <h2 className="text-4xl text-white mb-8 flex items-center gap-3">
                <AlertTriangle className="w-10 h-10 text-[#d4af37]" />
                Reglas de la comunidad
              </h2>
              <div className="space-y-4">
                {[
                  'Solo adultos (18+) - Se exige verificación estricta de edad para todos los perfiles',
                  'Respeta límites y consentimiento - Respeta siempre los límites de las demás personas',
                  'Mantén la discreción - Protege la privacidad de todas las personas con las que interactúas',
                  'Reporta actividad sospechosa - Ayuda a mantener segura nuestra comunidad',
                ].map((rule, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-[#0a0a0a] rounded-lg border border-[#d4af37]/30"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
                    </div>
                    <span className="text-gray-300">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
