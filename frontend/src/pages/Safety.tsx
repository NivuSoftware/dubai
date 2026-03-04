import Layout from '../components/Layout';
import {
  Shield,
  AlertTriangle,
  Phone,
  MapPin,
  Lock,
  Eye,
  Flag,
  UserX,
  CheckCircle,
} from 'lucide-react';

export default function Safety() {
  return (
    <Layout>
      <div className="min-h-screen bg-black">
        <div className="bg-gradient-to-b from-[#0a0a0a] to-black py-20 px-8 border-b border-[#a83d8e]/20">
          <div className="max-w-[1000px] mx-auto text-center">
            <h1 className="text-6xl mb-6 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
              Guías de seguridad
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Tu seguridad es nuestra prioridad. Sigue estas pautas para una experiencia segura.
            </p>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-8 py-20">
          <section className="mb-16">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-[#a83d8e]/20">
              <h2 className="text-4xl text-white mb-8 flex items-center gap-3">
                <Shield className="w-10 h-10 text-[#a83d8e]" />
                Lista esencial de seguridad
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: MapPin,
                    title: 'Reúnete primero en lugares públicos',
                    description:
                      'Organiza los primeros encuentros en lugares públicos y concurridos. Cafeterías, restaurantes y lobbies de hoteles son espacios seguros ideales.',
                  },
                  {
                    icon: Eye,
                    title: 'Verifica la identidad',
                    description:
                      'Confirma la identidad de la persona con la que te reunirás. Busca insignias de verificación y solicita validación adicional si es necesario.',
                  },
                  {
                    icon: Lock,
                    title: 'Protege tu privacidad',
                    description:
                      'Nunca compartas información personal sensible como tu dirección, datos financieros o lugar de trabajo.',
                  },
                  {
                    icon: Phone,
                    title: 'Avisa a alguien',
                    description:
                      'Informa a una persona de confianza a dónde vas, con quién te reunirás y cuándo esperas volver.',
                  },
                  {
                    icon: CheckCircle,
                    title: 'Confía en tu intuición',
                    description:
                      'Si algo se siente mal o incómodo, retírate de inmediato. Tu seguridad es más importante que cualquier compromiso social.',
                  },
                  {
                    icon: AlertTriangle,
                    title: 'Mantente sobria/o',
                    description:
                      'Mantén la claridad mental. Evita el consumo excesivo de alcohol o sustancias que puedan afectar tu juicio.',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#0a0a0a] rounded-xl p-6 border border-[#a83d8e]/30"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#a83d8e]/20 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-[#a83d8e]" />
                    </div>
                    <h3 className="text-xl text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
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

          <section className="mb-16">
            <h2 className="text-4xl text-white mb-8 flex items-center gap-3">
              <Flag className="w-10 h-10 text-red-500" />
              Señales de alerta
            </h2>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-red-500/20">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Ten precaución si encuentras cualquiera de estas señales:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Presión para reunirse de inmediato sin verificación',
                  'Solicitudes de dinero o información financiera por adelantado',
                  'Resistencia a videollamar o verificar identidad',
                  'Comunicación agresiva o irrespetuosa',
                  'Negativa a reunirse en lugares públicos',
                  'Información inconsistente en el perfil o mensajes',
                  'Solicitudes para usar métodos de pago no oficiales',
                  'Señales de coerción o angustia',
                ].map((flag, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-4xl text-white mb-8 flex items-center gap-3">
              <UserX className="w-10 h-10 text-[#a83d8e]" />
              Reportar actividad sospechosa
            </h2>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-[#a83d8e]/20">
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                Si encuentras conductas sospechosas, perfiles que violen nuestras pautas o crees
                que alguien está en peligro, repórtalo de inmediato.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#a83d8e]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#a83d8e]">1</span>
                  </div>
                  <div>
                    <h3 className="text-white mb-1">Usa el botón de reporte</h3>
                    <p className="text-gray-400">
                      Cada perfil tiene un botón "Reportar perfil" para reportes rápidos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#a83d8e]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#a83d8e]">2</span>
                  </div>
                  <div>
                    <h3 className="text-white mb-1">Contacta a soporte</h3>
                    <p className="text-gray-400">
                      Escríbenos desde la página de contacto para temas urgentes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#a83d8e]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#a83d8e]">3</span>
                  </div>
                  <div>
                    <h3 className="text-white mb-1">Situaciones de emergencia</h3>
                    <p className="text-gray-400">
                      Si estás en peligro inmediato, contacta a las autoridades locales (911 en Ecuador).
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white px-6 py-3 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(168,61,142,0.5)]">
                  Reportar un perfil
                </button>
                <button className="flex-1 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black px-6 py-3 rounded-lg transition-all">
                  Contacta a soporte
                </button>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl p-8 border border-red-500/30">
              <h2 className="text-3xl text-white mb-4">Contactos de emergencia</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">🚨</div>
                  <h3 className="text-white mb-1">Emergencias</h3>
                  <p className="text-2xl text-red-400">911</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">👮</div>
                  <h3 className="text-white mb-1">Policía</h3>
                  <p className="text-2xl text-red-400">101</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🏥</div>
                  <h3 className="text-white mb-1">Médico</h3>
                  <p className="text-2xl text-red-400">131</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
