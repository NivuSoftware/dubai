import Layout from '../components/Layout';
import { 
  BadgeCheck, 
  Shield, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Lock,
  Eye
} from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import FeatureCard from '../components/FeatureCard';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import * as Accordion from '@radix-ui/react-accordion';
import { CONTACT_WHATSAPP_URL } from '../constants/contact';
import { listPublicModelos, Modelo } from '../services/modelosService';
import { Anuncio, listPublicAnuncios } from '../services/anunciosService';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '../components/ui/carousel';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1760008218224-f8614778fec4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEdWJhaSUyMHNreWxpbmUlMjBuaWdodCUyMG5lb24lMjBsaWdodHN8ZW58MXx8fHwxNzcyNTgyMjkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

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
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState('');
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    const loadFeaturedProfiles = async () => {
      try {
        const [modelosData, anunciosData] = await Promise.all([
          listPublicModelos(),
          listPublicAnuncios(),
        ]);
        setModelos(modelosData);
        setAnuncios(anunciosData);
      } catch {
        setFeaturedError('No se pudieron cargar los perfiles destacados.');
      } finally {
        setLoadingFeatured(false);
      }
    };

    loadFeaturedProfiles();
  }, []);

  const featuredProfiles = useMemo<
    Array<{
      key: string;
      id: string;
      name: string;
      age: number;
      city: string;
      tagline: string;
      category?: string;
      priceValue?: number;
      imageUrl?: string;
      whatsappUrl?: string;
    }>
  >(() => {
    const sortedModelos = [...modelos].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const sortedAnuncios = [...anuncios].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const interleaved: Array<{
      key: string;
      id: string;
      name: string;
      age: number;
      city: string;
      tagline: string;
      category?: string;
      priceValue?: number;
      imageUrl?: string;
      whatsappUrl?: string;
    }> = [];
    const maxLength = Math.max(sortedModelos.length, sortedAnuncios.length);

    for (let i = 0; i < maxLength; i += 1) {
      const anuncio = sortedAnuncios[i];
      if (anuncio) {
        interleaved.push({
          key: `anuncio-${anuncio.id}`,
          id: `a-${anuncio.id}`,
          name: anuncio.titulo,
          age: 18,
          city: anuncio.ubicacion,
          tagline: anuncio.descripcion,
          priceValue: anuncio.precio,
          imageUrl: anuncio.images?.[0]?.url,
          whatsappUrl: anuncio.whatsapp_url,
        });
      }

      const modelo = sortedModelos[i];
      if (modelo) {
        interleaved.push({
          key: `modelo-${modelo.id}`,
          id: `m-${modelo.id}`,
          name: modelo.nombre,
          age: modelo.edad,
          city: modelo.ubicacion,
          tagline: modelo.descripcion,
          category: modelo.categoria,
          priceValue: modelo.precio,
          imageUrl: modelo.images?.[0]?.url,
        });
      }
    }

    return interleaved;
  }, [anuncios, modelos]);

  useEffect(() => {
    if (!carouselApi || featuredProfiles.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 4500);

    return () => window.clearInterval(timer);
  }, [carouselApi, featuredProfiles.length]);

  const goToFeaturedProfiles = () => {
    document.getElementById('featured-profiles')?.scrollIntoView({ behavior: 'smooth' });
  };

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
              <button
                type="button"
                onClick={goToFeaturedProfiles}
                className="bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white px-8 py-4 rounded-full transition-all hover:shadow-[0_0_30px_rgba(168,61,142,0.6)] border border-[#a83d8e]/50"
              >
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

      {/* Perfiles destacados */}
      <section id="featured-profiles" className="py-20 px-8 bg-[#0a0a0a]">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl mb-4 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
              Perfiles destacados
            </h2>
            <p className="text-gray-400 text-lg">
              Carrusel automático intercalado: 1 anunciante y 1 modelo
            </p>
          </div>

          {loadingFeatured ? (
            <p className="text-center text-gray-400">Cargando perfiles destacados...</p>
          ) : featuredError ? (
            <p className="text-center text-red-400">{featuredError}</p>
          ) : featuredProfiles.length === 0 ? (
            <p className="text-center text-gray-400">
              No hay perfiles destacados disponibles en este momento.
            </p>
          ) : (
            <div className="relative">
              <Carousel
                setApi={setCarouselApi}
                opts={{ align: 'start', loop: true }}
                className="w-full"
              >
                <CarouselContent>
                  {featuredProfiles.map((profile) => (
                    <CarouselItem
                      key={profile.key}
                      className="basis-full sm:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
                    >
                      <ProfileCard
                        id={profile.id}
                        name={profile.name}
                        age={profile.age}
                        city={profile.city}
                        verified={true}
                        tagline={profile.tagline}
                        category={profile.category}
                        priceValue={profile.priceValue}
                        imageUrl={profile.imageUrl}
                        whatsappUrl={profile.whatsappUrl}
                        className="h-full w-full"
                        imageClassName="h-[440px] sm:h-[340px]"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              <button
                type="button"
                onClick={() => carouselApi?.scrollPrev()}
                className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#a83d8e]/60 bg-black/70 p-2 text-white transition-all hover:bg-[#a83d8e]/20 disabled:opacity-40 sm:-left-4"
                disabled={featuredProfiles.length <= 1}
                aria-label="Card anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => carouselApi?.scrollNext()}
                className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[#a83d8e]/60 bg-black/70 p-2 text-white transition-all hover:bg-[#a83d8e]/20 disabled:opacity-40 sm:-right-4"
                disabled={featuredProfiles.length <= 1}
                aria-label="Card siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/profiles"
              className="inline-flex border border-[#a83d8e] text-[#a83d8e] hover:bg-[#a83d8e] hover:text-white px-8 py-3 rounded-full transition-all hover:shadow-[0_0_20px_rgba(168,61,142,0.5)]"
            >
              Ver todos los perfiles
            </Link>
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
            <Link
              to="/profiles"
              className="bg-[#a83d8e] hover:bg-[#a83d8e]/90 text-white px-10 py-4 rounded-full text-lg transition-all hover:shadow-[0_0_30px_rgba(168,61,142,0.6)] border border-[#a83d8e]/50 flex items-center gap-3"
            >
              <Eye className="w-5 h-5" />
              Buscar perfiles
            </Link>
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
