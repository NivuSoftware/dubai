import { useEffect, useMemo, useState } from "react";
import { Filter, MapPin } from "lucide-react";
import Layout from "../components/Layout";
import ProfileCard from "../components/ProfileCard";
import Seo from "../components/Seo";
import { absoluteUrl } from "../lib/seo";
import { Modelo, listPublicModelos } from "../services/modelosService";
import { Anuncio, listPublicAnuncios } from "../services/anunciosService";

export default function Profiles() {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCiudad, setSelectedCiudad] = useState("all");
  const [showFiltros, setShowFiltros] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [modelosData, anunciosData] = await Promise.all([
          listPublicModelos(),
          listPublicAnuncios(),
        ]);
        setModelos(modelosData);
        setAnuncios(anunciosData);
      } catch {
        setError("No se pudieron cargar los perfiles.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const ciudades = useMemo(() => {
    const unique = Array.from(
      new Set([...modelos.map((m) => m.ubicacion), ...anuncios.map((a) => a.ubicacion)])
    ).filter(Boolean);
    return ["all", ...unique];
  }, [anuncios, modelos]);

  const mixedProfiles = useMemo(() => {
    const modelosBase =
      selectedCiudad === "all"
        ? modelos
        : modelos.filter((item) => item.ubicacion.toLowerCase() === selectedCiudad.toLowerCase());
    const anunciosBase =
      selectedCiudad === "all"
        ? anuncios
        : anuncios.filter((item) => item.ubicacion.toLowerCase() === selectedCiudad.toLowerCase());

    let sortedModelos = [...modelosBase];
    let sortedAnuncios = [...anunciosBase];
    sortedModelos = sortedModelos.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    sortedAnuncios = sortedAnuncios.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const mixed: Array<{
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
        mixed.push({
          key: `a-${anuncio.id}`,
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
        mixed.push({
          key: `m-${modelo.id}`,
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

    return mixed;
  }, [anuncios, modelos, selectedCiudad]);

  const listingSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Perfiles verificados en Ecuador",
      description:
        "Listado de perfiles, putas, escorts, prepagos, mujeres prostitutas, chicas prepago, damas de compañía verificadas",
      url: absoluteUrl("/profiles"),
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: mixedProfiles.length,
        itemListElement: mixedProfiles.slice(0, 12).map((profile, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(`/profile/${profile.id}`),
          name: `${profile.name} en ${profile.city}`,
        })),
      },
    }),
    [mixedProfiles]
  );

  return (
    <Layout>
      <Seo
        title="Listado de perfiles, putas, escorts, prepagos, mujeres, chicas prepago, damas de compañía verificadas"
        description="Revisa perfiles verificados y anuncios activos, filtra por ciudad y encuentra publicaciones recientes en Ecuador."
        path="/profiles"
        image="/images/logo.png"
        jsonLd={listingSchema}
      />
      <div className="min-h-screen bg-black">
        <div className="bg-gradient-to-b from-[#0a0a0a] to-black py-8 px-4 sm:px-6 lg:px-8 border-b border-[#a83d8e]/20">
          <div className="max-w-[1440px] mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
              Explorar perfiles
            </h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
              {loading ? "Cargando perfiles..." : `${mixedProfiles.length} perfiles disponibles`}
            </p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
            {showFiltros && (
              <aside className="w-full xl:w-80 xl:flex-shrink-0">
                <div className="xl:sticky xl:top-24 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-5 sm:p-6 border border-[#a83d8e]/20">
                  <h3 className="text-lg sm:text-xl text-white mb-6">Filtros</h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Ubicación
                      </label>
                      <div className="space-y-2">
                        {ciudades.map((city) => (
                          <label key={city} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="radio"
                              name="city"
                              value={city}
                              checked={selectedCiudad === city}
                              onChange={(e) => setSelectedCiudad(e.target.value)}
                              className="w-4 h-4 accent-[#a83d8e]"
                            />
                            <span className="text-gray-300 group-hover:text-white transition-colors">
                              {city === "all" ? "Todas las ciudades" : city}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            )}

            <div className="flex-1 min-w-0">
              <div className="mb-6 bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-xl p-4 border border-[#a83d8e]/20">
                <button
                  onClick={() => setShowFiltros(!showFiltros)}
                  className="inline-flex items-center gap-2 text-gray-300 hover:text-[#a83d8e] transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  {showFiltros ? "Ocultar" : "Mostrar"} Filtros
                </button>
              </div>

              {error ? <p className="mb-4 text-red-400">{error}</p> : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
                {mixedProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.key}
                    id={profile.id}
                    name={profile.name}
                    age={profile.age}
                    city={profile.city}
                    verified={true}
                    tagline={profile.tagline}
                    category={profile.category}
                    imageUrl={profile.imageUrl}
                    whatsappUrl={profile.whatsappUrl}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
