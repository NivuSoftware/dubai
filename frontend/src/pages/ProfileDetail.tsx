import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  BadgeCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import { getPublicModelo, Modelo } from "../services/modelosService";
import {
  CONTACT_TELEGRAM_URL,
  CONTACT_WHATSAPP_NUMBER,
  getContactWhatsAppUrl,
} from "../constants/contact";
import { absoluteUrl } from "../lib/seo";
import { buildServiceInquiryMessage, withPrefilledMessage } from "../lib/whatsapp";
import { getPublicAnuncio } from "../services/anunciosService";

function categoryClasses(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("bronce")) {
    return "bg-[#CD7F32]/30 border-[#CD7F32]/85 text-[#ffd2a3] shadow-[0_0_22px_rgba(205,127,50,0.5)]";
  }
  if (normalized.includes("plata")) {
    return "bg-[#C0C0C0]/30 border-[#C0C0C0]/85 text-[#f3f4f6] shadow-[0_0_22px_rgba(192,192,192,0.45)]";
  }
  if (normalized.includes("oro")) {
    return "bg-[#D4AF37]/30 border-[#D4AF37]/90 text-[#ffe69c] shadow-[0_0_22px_rgba(212,175,55,0.55)]";
  }
  if (normalized.includes("platino")) {
    return "bg-[#38bdf8]/35 border-[#38bdf8]/95 text-[#e6f6ff] shadow-[0_0_24px_rgba(56,189,248,0.65)]";
  }
  return "bg-[#d4af37]/30 border-[#d4af37]/85 text-[#ffe69c] shadow-[0_0_22px_rgba(212,175,55,0.55)]";
}

export default function ProfileDetail() {
  useTranslation();
  const { id } = useParams();
  const [modelo, setModelo] = useState<Modelo | null>(null);
  const [isAdvertiserProfile, setIsAdvertiserProfile] = useState(false);
  const [advertiserWhatsAppUrl, setAdvertiserWhatsAppUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("Perfil no encontrado.");
        setLoading(false);
        return;
      }

      setActiveImage(0);
      setError("");

      try {
        const isAdvertiserAd = id.startsWith("a-");
        const profileId =
          id.startsWith("a-") || id.startsWith("m-") ? id.slice(2) : id;

        if (isAdvertiserAd) {
          setIsAdvertiserProfile(true);
          const ad = await getPublicAnuncio(profileId);
          setAdvertiserWhatsAppUrl(ad.whatsapp_url || "");
          setModelo({
            id: ad.id,
            nombre: ad.titulo,
            edad: 18,
            descripcion: ad.descripcion,
            disponibilidad: "",
            ubicacion: ad.ubicacion,
            categoria: "",
            precio: ad.precio,
            created_at: ad.created_at,
            updated_at: ad.updated_at,
            images: ad.images ?? [],
          });
        } else {
          setIsAdvertiserProfile(false);
          setAdvertiserWhatsAppUrl("");
          const data = await getPublicModelo(profileId);
          setModelo(data);
        }
      } catch {
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const images = useMemo(() => modelo?.images ?? [], [modelo]);

  const nextImage = () => {
    if (!images.length) return;
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!images.length) return;
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black px-8 py-16 text-gray-300">Cargando perfil...</div>
      </Layout>
    );
  }

  if (error || !modelo) {
    return (
      <Layout>
        <div className="min-h-screen bg-black px-8 py-16 text-red-400">{error || "Sin datos"}</div>
      </Layout>
    );
  }

  const reportMessage = encodeURIComponent(`Hola quiero reportar el perfil de ${modelo.nombre}`);
  const reportWhatsAppUrl = `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${reportMessage}`;
  const detailWhatsAppUrlRaw =
    isAdvertiserProfile && advertiserWhatsAppUrl ? advertiserWhatsAppUrl : getContactWhatsAppUrl();
  const prefilledMessage = buildServiceInquiryMessage(
    typeof window !== "undefined" ? window.location.href : `/profile/${id ?? ""}`
  );
  const detailWhatsAppUrl = withPrefilledMessage(detailWhatsAppUrlRaw, prefilledMessage);
  const availability = modelo.disponibilidad
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const seoDescription = [
    `Escort, prepago, puta, verificada en ${modelo.ubicacion}.`,
    modelo.descripcion,
  ]
    .filter(Boolean)
    .join(" ");
  const profilePath = `/profile/${id ?? ""}`;
  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${modelo.nombre} en ${modelo.ubicacion}`,
    description: seoDescription,
    url: absoluteUrl(profilePath),
    mainEntity: {
      "@type": "Person",
      name: modelo.nombre,
      description: seoDescription,
      image: images[0]?.url,
      homeLocation: {
        "@type": "Place",
        name: modelo.ubicacion,
      },
      identifier: id,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Perfiles",
          item: absoluteUrl("/profiles"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: modelo.nombre,
          item: absoluteUrl(profilePath),
        },
      ],
    },
  };

  return (
    <Layout>
      <Seo
        title={`${modelo.nombre} en ${modelo.ubicacion}`}
        description={seoDescription}
        path={profilePath}
        image={images[0]?.url || "/images/logo.png"}
        type="profile"
        jsonLd={profileSchema}
      />
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

        <div className="max-w-[1440px] mx-auto px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl overflow-hidden border border-[#a83d8e]/20">
                <div className="lg:hidden">
                  <div className="relative h-96 bg-gradient-to-br from-[#a83d8e]/20 to-black">
                    {images.length > 0 ? (
                      <img
                        src={images[activeImage].url}
                        alt={modelo.nombre}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 backdrop-blur-3xl bg-black/40 flex items-center justify-center">
                        <div className="w-48 h-48 rounded-full bg-[#a83d8e]/30 flex items-center justify-center">
                          <span className="text-8xl text-[#a83d8e]">{modelo.nombre.charAt(0)}</span>
                        </div>
                      </div>
                    )}

                    <div className="absolute left-3 top-3 bg-[#a83d8e] text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Perfil verificado
                    </div>

                    {images.length > 1 ? (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
                          aria-label="Imagen anterior"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white"
                          aria-label="Imagen siguiente"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    ) : null}
                  </div>

                  {images.length > 1 ? (
                    <div className="flex gap-2 overflow-x-auto border-b border-white/10 bg-[#0f1523] p-3">
                      {images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setActiveImage(index)}
                          className={`shrink-0 rounded-lg border ${
                            index === activeImage ? "border-[#d4af37]" : "border-white/20"
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={`${modelo.nombre} miniatura ${index + 1}`}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div className="p-8">
                    <div className="mb-6">
                      <h1 className="text-4xl text-white mb-2">{modelo.nombre}</h1>
                      <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {modelo.ubicacion}
                        </div>
                      </div>
                      {!isAdvertiserProfile ? (
                        <span
                          className={`mt-3 inline-flex rounded-full border px-4 py-1.5 text-sm font-bold tracking-wide ${categoryClasses(
                            modelo.categoria
                          )}`}
                        >
                          {modelo.categoria}
                        </span>
                      ) : null}
                    </div>

                    <div className="mb-8">
                      <h2 className="text-2xl text-white mb-4">Descripción</h2>
                      <p className="text-gray-300 leading-relaxed">{modelo.descripcion}</p>
                    </div>

                    {!isAdvertiserProfile ? (
                      <div className="mb-8">
                        <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                          <Calendar className="w-6 h-6 text-[#a83d8e]" />
                          Disponibilidad
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {availability.length ? (
                            availability.map((time, index) => (
                              <div
                                key={index}
                                className="bg-[#0a0a0a] border border-[#a83d8e]/30 rounded-lg px-4 py-3 flex items-center gap-2"
                              >
                                <Clock className="w-4 h-4 text-[#a83d8e]" />
                                <span className="text-gray-300">{time}</span>
                              </div>
                            ))
                          ) : (
                            <div className="bg-[#0a0a0a] border border-[#a83d8e]/30 rounded-lg px-4 py-3 text-gray-300">
                              {modelo.disponibilidad}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}

                    <div className="space-y-3">
                      <h3 className="text-xl text-white">Contacto</h3>
                      <a
                        href={detailWhatsAppUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-3"
                      >
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp
                      </a>
                      {!isAdvertiserProfile ? (
                        <a
                          href={CONTACT_TELEGRAM_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-[#24A1DE] hover:bg-[#1b8fc9] text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-3"
                        >
                          <Send className="w-5 h-5" />
                          Telegram
                        </a>
                      ) : null}
                      <a
                        href={reportWhatsAppUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-3"
                      >
                        <Flag className="w-5 h-5" />
                        Reportar perfil
                      </a>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:grid lg:grid-cols-[500px_minmax(0,1fr)]">
                  <div className="border-r border-white/10 bg-[#0d1320] p-5">
                    <div className="relative h-[700px] overflow-hidden rounded-2xl border border-white/15 bg-black/30">
                      {images.length > 0 ? (
                        <img
                          src={images[activeImage].url}
                          alt={modelo.nombre}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="h-40 w-40 rounded-full bg-[#a83d8e]/25 flex items-center justify-center">
                            <span className="text-7xl text-[#a83d8e]">{modelo.nombre.charAt(0)}</span>
                          </div>
                        </div>
                      )}

                      <div className="absolute left-4 top-4 bg-[#a83d8e] text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-sm">
                        <BadgeCheck className="w-4 h-4" />
                        Verificado
                      </div>

                      {images.length > 1 ? (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white"
                            aria-label="Imagen anterior"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white"
                            aria-label="Imagen siguiente"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      ) : null}
                    </div>

                    {images.length > 1 ? (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {images.map((image, index) => (
                          <button
                            key={image.id}
                            onClick={() => setActiveImage(index)}
                            className={`overflow-hidden rounded-lg border ${
                              index === activeImage
                                ? "border-[#d4af37] shadow-[0_0_14px_rgba(212,175,55,0.4)]"
                                : "border-white/20"
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={`${modelo.nombre} miniatura ${index + 1}`}
                              className="h-20 w-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="p-8">
                    <div className="mb-6">
                      <h1 className="text-4xl text-white mb-2">{modelo.nombre}</h1>
                      <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {modelo.ubicacion}
                        </div>
                      </div>
                      {!isAdvertiserProfile ? (
                        <span
                          className={`mt-3 inline-flex rounded-full border px-4 py-1.5 text-sm font-bold tracking-wide ${categoryClasses(
                            modelo.categoria
                          )}`}
                        >
                          {modelo.categoria}
                        </span>
                      ) : null}
                    </div>

                    <div className="mb-8">
                      <h2 className="text-2xl text-white mb-4">Descripción</h2>
                      <p className="text-gray-300 leading-relaxed">{modelo.descripcion}</p>
                    </div>

                    {!isAdvertiserProfile ? (
                      <div className="mb-8">
                        <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                          <Calendar className="w-6 h-6 text-[#a83d8e]" />
                          Disponibilidad
                        </h2>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                          {availability.length ? (
                            availability.map((time, index) => (
                              <div
                                key={index}
                                className="bg-[#0a0a0a] border border-[#a83d8e]/30 rounded-lg px-4 py-3 flex items-center gap-2"
                              >
                                <Clock className="w-4 h-4 text-[#a83d8e]" />
                                <span className="text-gray-300">{time}</span>
                              </div>
                            ))
                          ) : (
                            <div className="bg-[#0a0a0a] border border-[#a83d8e]/30 rounded-lg px-4 py-3 text-gray-300">
                              {modelo.disponibilidad}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}

                    <div className="space-y-3">
                      <h3 className="text-xl text-white">Contacto</h3>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                        <a
                          href={detailWhatsAppUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-3"
                        >
                          <MessageCircle className="w-5 h-5" />
                          WhatsApp
                        </a>
                        {!isAdvertiserProfile ? (
                          <a
                            href={CONTACT_TELEGRAM_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-[#24A1DE] hover:bg-[#1b8fc9] text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-3"
                          >
                            <Send className="w-5 h-5" />
                            Telegram
                          </a>
                        ) : null}
                      </div>
                      <a
                        href={reportWhatsAppUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-3"
                      >
                        <Flag className="w-5 h-5" />
                        Reportar perfil
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
