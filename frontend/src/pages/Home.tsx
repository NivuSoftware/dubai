import Layout from '../components/Layout';
import { 
  BadgeCheck, 
  Shield, 
  ChevronDown,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  MessageCircle,
  Lock,
  UserCheck,
  Eye
} from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import FeatureCard from '../components/FeatureCard';
import CityCard from '../components/CityCard';
import { motion } from 'framer-motion';
import { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { CONTACT_WHATSAPP_URL } from '../constants/contact';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1760008218224-f8614778fec4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEdWJhaSUyMHNreWxpbmUlMjBuaWdodCUyMG5lb24lMjBsaWdodHN8ZW58MXx8fHwxNzcyNTgyMjkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

const FEATURED_PROFILES = [
  {
    id: '1',
    name: 'Sofia',
    age: 24,
    city: 'Quito',
    verified: true,
    tagline: 'Acompañante elegante para ocasiones sofisticadas',
    price: '$120 / 1 hora',
    tags: ['Nuevo', 'Mejor valorado'],
  },
  {
    id: '2',
    name: 'Isabella',
    age: 26,
    city: 'Guayaquil',
    verified: true,
    tagline: 'Compañía profesional y discreta',
    price: '$120 / 1 hora',
    tags: ['Mejor valorado'],
  },
  {
    id: '3',
    name: 'Valentina',
    age: 23,
    city: 'Cuenca',
    verified: true,
    tagline: 'Presencia sofisticada y encantadora',
    price: '$120 / 1 hora',
    tags: ['Nuevo'],
  },
  {
    id: '4',
    name: 'Camila',
    age: 25,
    city: 'Quito',
    verified: true,
    tagline: 'Acompañante refinada para eventos exclusivos',
    price: '$120 / 1 hora',
  },
  {
    id: '5',
    name: 'Lucia',
    age: 27,
    city: 'Guayaquil',
    verified: true,
    tagline: 'Compañía elegante y profesional',
    tags: ['Mejor valorado'],
  },
  {
    id: '6',
    name: 'Martina',
    age: 24,
    city: 'Manta',
    verified: true,
    tagline: 'Servicio de acompañamiento discreto y sofisticado',
  },
  {
    id: '7',
    name: 'Daniela',
    age: 26,
    city: 'Cuenca',
    verified: true,
    tagline: 'Experiencia premium de acompañamiento',
    tags: ['Nuevo'],
  },
  {
    id: '8',
    name: 'Ana',
    age: 25,
    city: 'Quito',
    verified: true,
    tagline: 'Acompañante exclusiva para clientes exigentes',
  },
];

const FAQ_ITEMS = [
  {
    question: '¿Cómo funciona la verificación?',
    answer: 'Todos los perfiles pasan por un proceso estricto de verificación, incluyendo identidad, confirmación de edad y revisiones para garantizar seguridad y autenticidad.',
  },
  {
    question: '¿Esta es una plataforma de reservas?',
    answer: 'No, DUBAI es solo un directorio. Proporcionamos información de contacto de adultos verificados. Todos los acuerdos se realizan directamente entre las partes.',
  },
  {
    question: '¿Cómo contacto a los perfiles?',
    answer: 'Cada perfil tiene opciones de contacto por WhatsApp y teléfono. Puedes comunicarte directamente por esos canales para acordar encuentros.',
  },
  {
    question: '¿Qué contenido está permitido?',
    answer: 'Mantenemos estándares estrictos. No se permite contenido explícito, desnudos ni material pornográfico. Todos los perfiles deben ser discretos y profesionales.',
  },
  {
    question: '¿Cómo puedo reportar un perfil?',
    answer: 'Cada perfil tiene un botón de "Reportar perfil". También puedes contactar a nuestro equipo de soporte desde la página de contacto.',
  },
  {
    question: 'Privacidad y protección de datos',
    answer: 'Nos tomamos la privacidad muy en serio. Todos los datos están cifrados y nunca compartimos información personal sin consentimiento. Lee nuestra Política de privacidad para más detalles.',
  },
  {
    question: '¿Hay costos por publicar o navegar?',
    answer: 'Los perfiles son publicados por personas verificadas. No hay costo por navegar. Contacta a los perfiles directamente para cualquier acuerdo.',
  },
  {
    question: '¿Qué prácticas de seguridad debo seguir?',
    answer: 'Siempre reúnete primero en lugares públicos, verifica identidad, respeta límites, actúa con discreción y nunca compartas información personal sensible.',
  },
];

export default function Home() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [budget, setBudget] = useState([0, 500]);

  return (
    <Layout>
      {/* Sección principal */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Fondo */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="panorámica de Dubai"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black"></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl mb-6 bg-gradient-to-r from-[#a83d8e] via-[#d4af37] to-[#a83d8e] bg-clip-text text-transparent">
             Dubai - Escorts Ecuador
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              +18 años
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Busca, Contacta y Disfruta de una experiencia segura y privada.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button className="bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white px-8 py-4 rounded-full transition-all hover:shadow-[0_0_30px_rgba(168,61,142,0.6)] border border-[#a83d8e]/50">
                Busca Perfiles
              </button>
              <button className="border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black px-8 py-4 rounded-full transition-all">
                Indicaciones de Seguridad
              </button>
            </div>

            {/* Insignias de confianza */}
            <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="text-2xl">🔞</span>
                <span>Solo 18+</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Lock className="w-5 h-5 text-[#a83d8e]" />
                <span>Directorio discreto</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield className="w-5 h-5 text-[#a83d8e]" />
                <span>Seguridad y experiencia VIP</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Indicador de desplazamiento */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-[#a83d8e]" />
        </div>
      </section>

      {/* Barra de búsqueda y filtros */}
      <section className="py-12 px-8 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-[#a83d8e]/30 backdrop-blur-xl shadow-[0_0_40px_rgba(168,61,142,0.2)]">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Ciudad */}
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Ciudad
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#a83d8e]/30 rounded-lg px-4 py-3 text-white focus:border-[#a83d8e] focus:outline-none transition-colors"
                >
                  <option value="all">Todas las ciudades</option>
                  <option value="quito">Quito</option>
                  <option value="guayaquil">Guayaquil</option>
                  <option value="cuenca">Cuenca</option>
                  <option value="manta">Manta</option>
                  <option value="loja">Loja</option>
                </select>
              </div>

              {/* Disponibilidad */}
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Disponibilidad
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#a83d8e]/30 rounded-lg px-4 py-3 text-white focus:border-[#a83d8e] focus:outline-none transition-colors"
                >
                  <option value="all">Todo</option>
                  <option value="today">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="weekend">Fines de semana</option>
                </select>
              </div>

              {/* Preferencias */}
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Preferencias
                </label>
                <select className="w-full bg-[#0a0a0a] border border-[#a83d8e]/30 rounded-lg px-4 py-3 text-white focus:border-[#a83d8e] focus:outline-none transition-colors">
                  <option>Todo</option>
                  <option>Elegante</option>
                  <option>Profesional</option>
                  <option>Sofisticada</option>
                </select>
              </div>

              {/* Presupuesto */}
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Rango de presupuesto
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={budget[1]}
                  onChange={(e) => setBudget([0, parseInt(e.target.value)])}
                  className="w-full h-10 accent-[#a83d8e]"
                />
                <div className="text-xs text-gray-500 mt-1">${budget[0]} - ${budget[1]}</div>
              </div>

              {/* Botón de búsqueda */}
              <div className="flex items-end">
                <button className="w-full bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,61,142,0.5)]">
                  <Search className="w-5 h-5" />
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perfiles destacados */}
      <section className="py-20 px-8 bg-[#0a0a0a]">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl mb-4 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
              Perfiles destacados
            </h2>
            <p className="text-gray-400 text-lg">
              Explora nuestra selección de escorts verificadas y profesionales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PROFILES.map((profile) => (
              <ProfileCard key={profile.id} {...profile} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="border border-[#a83d8e] text-[#a83d8e] hover:bg-[#a83d8e] hover:text-white px-8 py-3 rounded-full transition-all hover:shadow-[0_0_20px_rgba(168,61,142,0.5)]">
              Ver todos los perfiles
            </button>
          </div>
        </div>
      </section>

      {/* Por qué este directorio */}
      <section className="py-20 px-8 bg-gradient-to-b from-[#0a0a0a] to-black">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-4 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
              Por qué escoger a DUBAI
            </h2>
            <p className="text-gray-400 text-lg">
              Directorio premium, verificado, discreto y VIP
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={BadgeCheck}
              title="Sitio oficial y perfiles verificados"
              description="Este es nuestro único sitio oficial. Todas las modelos están verificadas para ayudarte a evitar estafas y extorsiones."
            />
            <FeatureCard
              icon={Lock}
              title="Experiencia discreta"
              description="Sistema de contacto privado que protege tu identidad y mantiene total confidencialidad."
            />
            <FeatureCard
              icon={Shield}
              title="Mayores de edad y control sanitario"
              description="Todas las modelos son mayores de edad y cuentan con carné de salud vigente."
            />
          </div>
        </div>
      </section>



      {/* Trabaja con nosotros y compromiso de seguridad */}
      <section className="py-20 px-8 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-4 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
              Oportunidad y confianza en un solo lugar
            </h2>
            <p className="text-gray-400 text-lg">
              Únete al directorio y conoce nuestro compromiso oficial de seguridad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-6 sm:p-8 border border-[#229ED9]/30 bg-gradient-to-r from-[#051017] via-[#0a0a0a] to-[#151008] shadow-[0_0_40px_rgba(34,158,217,0.15)]">
              <div className="inline-flex items-center rounded-full border border-[#229ED9]/50 bg-[#229ED9]/10 px-4 py-1 mb-4">
                <span className="text-[#7dd3fc] text-xs tracking-[0.2em]">NUEVAS VACANTES</span>
              </div>
              <h3 className="text-2xl sm:text-4xl text-white leading-tight mb-3">
                ¿QUIERES TRABAJAR CON NOSOTROS?
              </h3>
              <p className="text-base sm:text-lg text-gray-200 mb-6">
                Escanea el código QR y envíanos un mensaje por Telegram. Proceso directo,
                reservado y rápido.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-items-center">
                <a
                  href="https://t.me/DBE593"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full"
                >
                  <img
                    src="/images/telegram.png"
                    alt="Código QR de Telegram"
                    className="w-full max-w-[320px] mx-auto"
                  />
                </a>
                <img
                  src="/images/wpp.png"
                  alt="Código QR de WhatsApp"
                  className="w-full max-w-[320px] mx-auto"
                />
              </div>
              <div className="mt-5 text-center">
                <a
                  href="https://t.me/DBE593"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#24A1DE] hover:bg-[#1b8fc9] text-white px-6 py-2.5 text-sm font-medium transition-all shadow-[0_0_24px_rgba(36,161,222,0.45)]"
                >
                  Escribir por Telegram @DBE593
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-8 border border-[#a83d8e]/20">
              <h3 className="text-2xl text-white mb-3 flex items-center gap-3">
                <Shield className="w-7 h-7 text-[#a83d8e]" />
                Compromiso oficial de seguridad
              </h3>
              <p className="text-gray-300 mb-6">
                En DUBAI mantenemos control estricto de perfiles para proteger la privacidad,
                la discreción y el bienestar de toda la comunidad.
              </p>
              <div className="space-y-4">
                {[
                  'Verificación de identidad y mayoría de edad (18+)',
                  'Tolerancia cero a estafas, coerción o actividad ilegal',
                  'Moderación activa y revisión manual de reportes',
                  'Canales de contacto directos y confidenciales',
                  'Cumplimiento de leyes y regulaciones locales',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#a83d8e]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#a83d8e]"></div>
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7">
                <a
                  href="/safety"
                  className="inline-flex items-center justify-center border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black px-6 py-2.5 rounded-full transition-all"
                >
                  Ver guía completa de seguridad
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de FAQ */}
      <section id="faq" className="py-20 px-8 bg-[#0a0a0a]">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-4 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
              Preguntas frecuentes
            </h2>
            <p className="text-gray-400 text-lg">
              Todo lo que necesitas saber sobre nuestro directorio
            </p>
          </div>

          <Accordion.Root type="single" collapsible className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <Accordion.Item
                key={index}
                value={`item-${index}`}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-xl border border-[#a83d8e]/20 overflow-hidden"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#a83d8e]/5 transition-colors group">
                    <span className="text-lg text-white group-hover:text-[#a83d8e] transition-colors">
                      {item.question}
                    </span>
                    <ChevronDown className="w-5 h-5 text-[#a83d8e] transition-transform group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="px-6 pb-5 text-gray-400 leading-relaxed">
                  {item.answer}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* Llamado final a la acción */}
      <section className="py-20 px-8 bg-gradient-to-b from-[#0a0a0a] to-black relative overflow-hidden">
        {/* Fondo */}
        <div className="absolute inset-0 opacity-20">
          <img
            src={HERO_IMAGE}
            alt="Fondo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black"></div>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto text-center">
          <h2 className="text-5xl mb-6 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
            Explora perfiles verificados en Ecuador
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Conecta directamente con acompañantes verificadas. Seguro, discreto y vive la mejor experiencia.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button className="bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white px-10 py-4 rounded-full text-lg transition-all hover:shadow-[0_0_30px_rgba(168,61,142,0.6)] border border-[#a83d8e]/50 flex items-center gap-3">
              <Eye className="w-5 h-5" />
              Buscar perfiles
            </button>
            <a
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white px-10 py-4 rounded-full text-lg transition-all flex items-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
