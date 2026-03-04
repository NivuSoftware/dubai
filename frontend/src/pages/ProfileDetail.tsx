import Layout from '../components/Layout';
import { useParams, Link } from 'react-router';
import {
  BadgeCheck,
  MapPin,
  Calendar,
  Clock,
  MessageCircle,
  Phone,
  Mail,
  AlertCircle,
  Star,
  Flag,
  ChevronLeft,
} from 'lucide-react';

export default function ProfileDetail() {
  const { id } = useParams();

  const profile = {
    id: id || '1',
    name: 'Sofia',
    age: 24,
    city: 'Quito',
    verified: true,
    tagline: 'Acompañante elegante para ocasiones sofisticadas',
    about:
      'Acompañante profesional que ofrece compañía discreta y refinada para personas sofisticadas. Fluida en inglés y español. Disponible para cenas, eventos y ocasiones privadas.',
    availability: ['Lunes - Viernes', 'Fines de semana', 'Noches'],
    location: 'Quito, Ecuador (zona Centro Histórico)',
    rating: 4.9,
    reviews: 23,
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black">
        <div className="bg-[#0a0a0a] border-b border-[#a83d8e]/20 py-4 px-8">
          <div className="max-w-[1440px] mx-auto">
            <Link
              to="/profiles"
              className="flex items-center gap-2 text-gray-400 hover:text-[#a83d8e] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Volver a perfiles
            </Link>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl overflow-hidden border border-[#a83d8e]/20">
                <div className="relative h-96 bg-gradient-to-br from-[#a83d8e]/20 to-black">
                  <div className="absolute inset-0 backdrop-blur-3xl bg-black/40 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-[#a83d8e]/30 flex items-center justify-center">
                      <span className="text-8xl text-[#a83d8e]">{profile.name.charAt(0)}</span>
                    </div>
                  </div>

                  {profile.verified && (
                    <div className="absolute top-6 left-6 bg-[#a83d8e] text-white px-4 py-2 rounded-full flex items-center gap-2">
                      <BadgeCheck className="w-5 h-5" />
                      Perfil verificado
                    </div>
                  )}

                  <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                    <span>{profile.rating}</span>
                    <span className="text-gray-400 text-sm">({profile.reviews})</span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="mb-6">
                    <h1 className="text-4xl text-white mb-2">{profile.name}</h1>
                    <div className="flex items-center gap-4 text-gray-400">
                      <span>{profile.age} años</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.city}
                      </div>
                    </div>
                  </div>

                  <p className="text-xl text-gray-300 mb-8">{profile.tagline}</p>

                  <div className="mb-8">
                    <h2 className="text-2xl text-white mb-4 flex items-center gap-2">Sobre mí</h2>
                    <p className="text-gray-300 leading-relaxed">{profile.about}</p>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-[#a83d8e]" />
                      Disponibilidad
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {profile.availability.map((time, index) => (
                        <div
                          key={index}
                          className="bg-[#0a0a0a] border border-[#a83d8e]/30 rounded-lg px-4 py-3 flex items-center gap-2"
                        >
                          <Clock className="w-4 h-4 text-[#a83d8e]" />
                          <span className="text-gray-300">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-[#a83d8e]" />
                      Zona de ubicación
                    </h2>
                    <div className="bg-[#0a0a0a] border border-[#a83d8e]/30 rounded-lg px-4 py-3">
                      <span className="text-gray-300">{profile.location}</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                      <Star className="w-6 h-6 text-[#d4af37]" />
                      Reseñas
                    </h2>
                    <div className="space-y-4">
                      {[1, 2, 3].map((review) => (
                        <div
                          key={review}
                          className="bg-[#0a0a0a] border border-[#a83d8e]/30 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="w-4 h-4 fill-[#d4af37] text-[#d4af37]"
                                />
                              ))}
                            </div>
                            <span className="text-gray-400 text-sm">hace 2 días</span>
                          </div>
                          <p className="text-gray-300 text-sm">
                            Profesional, discreta y puntual. Muy recomendada.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 border border-[#a83d8e]/20">
                  <h3 className="text-xl text-white mb-4">Contacto</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-3">
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </button>
                    <button className="w-full bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(168,61,142,0.5)]">
                      <Phone className="w-5 h-5" />
                      Llamar ahora
                    </button>
                    <button className="w-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-3">
                      <Mail className="w-5 h-5" />
                      Enviar mensaje
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 border border-[#d4af37]/20">
                  <h3 className="text-xl text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#d4af37]" />
                    Notas de seguridad
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-[#d4af37] mt-1">•</span>
                      <span>Siempre reúnete primero en lugares públicos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#d4af37] mt-1">•</span>
                      <span>Verifica la identidad antes de reunirte</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#d4af37] mt-1">•</span>
                      <span>Confía en tu intuición</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#d4af37] mt-1">•</span>
                      <span>Mantén privada tu información personal</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-3">
                  <Flag className="w-5 h-5" />
                  Reportar perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
