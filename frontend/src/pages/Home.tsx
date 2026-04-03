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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import * as Accordion from '@radix-ui/react-accordion';
import Seo from '../components/Seo';
import { getContactWhatsAppUrl } from '../constants/contact';
import { usePrerenderReady } from '../lib/prerender';
import { absoluteUrl } from '../lib/seo';
import { listPublicModelos, Modelo } from '../services/modelosService';
import { Anuncio, listPublicAnuncios } from '../services/anunciosService';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '../components/ui/carousel';

const FAQ_ITEMS = [
  {
    question: '¿Cómo funciona la verificación?',
    answer: 'Todos los perfiles pasan por un proceso de verificación (digital) de edad e identidad para garantizar seguridad y autenticidad. ',
  },
  {
    question: '¿Esta es una plataforma de reservas?',
    answer: 'Verificamos que los perfiles sean reales y cumplan las reglas de mayoría de edad, más no actuamos como intermediarios ni trabajamos con ninguna de las partes.',
  },
  {
    question: '¿Cómo contacto a los perfiles?',
    answer: 'Cada perfil tiene opciones de contacto por WhatsApp personal de cada anunciante. Puedes comunicarte directamente por esos canales para acordar encuentros.',
  },
  {
    question: '¿Es legal?',
    answer: 'Sí, Dubai Escorts está constituida y respaldada legalmente en Ecuador, además contamos con cumplimiento estricto de la ley de protección de datos.',
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
    answer: 'Los perfiles son publicados por personas verificadas. No hay costo por navegar. Contacta a los perfiles directamente para cualquier acuerdo. Si deseas publicar, puedes registrarte y publicar tu anuncio fácilmente.',
  },
  {
    question: '¿Qué prácticas de seguridad debo seguir?',
    answer: 'Dubai Escorts, no pide dinero por adelantado no llámanos ni escribimos a nadie EVITA ESTAFAS o EXTORSIONES y reporta los perfiles inmediatamente!',
  },
];

export default function Home() {
  useTranslation();
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState('');
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const ctaVideoRef = useRef<HTMLVideoElement | null>(null);

  usePrerenderReady(!loadingFeatured);

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

  useEffect(() => {
    const videos = [heroVideoRef.current, ctaVideoRef.current].filter(
      (video): video is HTMLVideoElement => video !== null
    );

    if (!videos.length) {
      return;
    }

    const prepareVideo = (video: HTMLVideoElement) => {
      video.muted = true;
      video.defaultMuted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.disablePictureInPicture = true;
      video.setAttribute('muted', '');
      video.setAttribute('autoplay', '');
      video.setAttribute('loop', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', 'true');
    };

    const tryPlay = (video: HTMLVideoElement) => {
      prepareVideo(video);
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Algunos navegadores móviles bloquean autoplay; reintentamos en la primera interacción.
        });
      }
    };

    const retryPlayback = () => {
      videos.forEach((video) => {
        if (video.paused) {
          tryPlay(video);
        }
      });
    };

    videos.forEach((video) => {
      prepareVideo(video);
      if (video.readyState >= 2) {
        tryPlay(video);
        return;
      }

      const onCanPlay = () => tryPlay(video);
      video.addEventListener('canplay', onCanPlay, { once: true });
    });

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        retryPlayback();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('touchstart', retryPlayback, { passive: true });
    window.addEventListener('pointerdown', retryPlayback, { passive: true });

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('touchstart', retryPlayback);
      window.removeEventListener('pointerdown', retryPlayback);
    };
  }, []);

  const goToFeaturedProfiles = () => {
    document.getElementById('featured-profiles')?.scrollIntoView({ behavior: 'smooth' });
  };

  const homeSchema = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Dubai Ecuador',
        url: absoluteUrl('/'),
        inLanguage: 'es-EC',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Dubai Ecuador',
        url: absoluteUrl('/'),
        logo: absoluteUrl('/images/logo.png'),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
    []
  );

  return (
    <Layout>
      <Seo
        title="Dubai Escorts Ecuador | Directorio verificado"
        description="Dubai Escorts Ecuador — Directorio de escorts verificadas en Quito, Guayaquil y Cuenca. Perfiles reales con contacto directo por WhatsApp. Discreción y seguridad garantizada."
        path="/"
        image="/images/logo.png"
        jsonLd={homeSchema}
      />
      {/* Sección principal */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Fondo */}
        <div className="absolute inset-0">
          <video
            ref={heroVideoRef}
            src="/video/hero1.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.06),rgba(0,0,0,0.46))]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/42 to-black/72"></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl mb-6 bg-gradient-to-r from-[#a83d8e] via-[#d4af37] to-[#a83d8e] bg-clip-text text-transparent">
             Dubai Escorts Ecuador
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
              <Link
                to="/registro-anunciante"
                className="border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black px-8 py-4 rounded-full transition-all"
              >
                Quiero anunciarme
              </Link>
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
                        imageUrl={profile.imageUrl}
                        whatsappUrl={profile.whatsappUrl}
                        className="mx-auto h-full w-full max-w-[380px]"
                        imageClassName="h-[400px] sm:h-[300px]"
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

      {/* Registro de anunciantes y compromiso de seguridad */}
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

          <div className="mb-10 overflow-hidden rounded-[28px] border border-[#38bdf8]/35 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_34%),linear-gradient(135deg,#06131a_0%,#090909_45%,#09111b_100%)] p-6 sm:p-8 shadow-[0_0_40px_rgba(56,189,248,0.16)]">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h3 className="mt-4 text-3xl sm:text-5xl text-white leading-tight">
                  ANÚNCIATE EN LA PLATAFORMA
                </h3>
                <p className="mt-3 text-lg sm:text-xl text-[#67e8f9]">
                  SIGUE 3 SIMPLES PASOS
                </p>
                <p className="mt-3 max-w-2xl text-gray-300">
                  Registro rápido, validación confiable y activación inmediata desde un solo lugar.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/registro-anunciante"
                  className="inline-flex items-center justify-center rounded-full bg-[#38bdf8] px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-[#67e8f9] hover:shadow-[0_0_28px_rgba(56,189,248,0.4)]"
                >
                  Empezar registro
                </Link>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "REGÍSTRATE 🔒",
                  description: "En minutos, datos rápidos. ¡Seguro y fácil!",
                },
                {
                  step: "02",
                  title: "VERIFICA TU PERFIL ⭐",
                  description:
                    "Valida ya: confianza total + discreción absoluta. Verificación + anuncio GRATIS solo 48 horas. Más contactos reales. ¡Aprovecha!",
                },
                {
                  step: "03",
                  title: "SUBE FOTOS DE CALIDAD 📸",
                  description:
                    "Las mejores fotos -> activa (gratis en trial) -> recibe contactos por WhatsApp ya. ¡Exclusivo desde hoy!",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-[#38bdf8]/20 bg-black/25 p-5 backdrop-blur-sm"
                >
                  <div className="text-sm tracking-[0.3em] text-[#38bdf8]">{item.step}</div>
                  <h4 className="mt-3 text-xl text-white">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
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
                <Link
                  to="/safety"
                  className="inline-flex items-center justify-center border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black px-6 py-2.5 rounded-full transition-all"
                >
                  Ver guía completa de seguridad
                </Link>
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
          <video
            ref={ctaVideoRef}
            src="/video/hero1.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
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
              href={getContactWhatsAppUrl()}
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

      {/* Por qué este directorio */}
      <section className="py-20 px-8 bg-gradient-to-b from-[#0a0a0a] to-black">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-4 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
              ¿Por qué escoger a DUBAI?
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
    </Layout>
  );
}
