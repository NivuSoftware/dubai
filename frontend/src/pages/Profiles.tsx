import Layout from '../components/Layout';
import { Filter, MapPin, Calendar, DollarSign, UserCheck } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import { useState } from 'react';

const ALL_PROFILES = [
  { id: '1', name: 'Sofia', age: 24, city: 'Quito', verified: true, tagline: 'Acompañante elegante para ocasiones sofisticadas', tags: ['Nuevo', 'Mejor valorado'] },
  { id: '2', name: 'Isabella', age: 26, city: 'Guayaquil', verified: true, tagline: 'Compañía profesional y discreta', tags: ['Mejor valorado'] },
  { id: '3', name: 'Valentina', age: 23, city: 'Cuenca', verified: true, tagline: 'Presencia sofisticada y encantadora', tags: ['Nuevo'] },
  { id: '4', name: 'Camila', age: 25, city: 'Quito', verified: true, tagline: 'Acompañante refinada para eventos exclusivos' },
  { id: '5', name: 'Lucia', age: 27, city: 'Guayaquil', verified: true, tagline: 'Compañía elegante y profesional', tags: ['Mejor valorado'] },
  { id: '6', name: 'Martina', age: 24, city: 'Manta', verified: true, tagline: 'Servicio de acompañamiento discreto y sofisticado' },
  { id: '7', name: 'Daniela', age: 26, city: 'Cuenca', verified: true, tagline: 'Experiencia premium de acompañamiento', tags: ['Nuevo'] },
  { id: '8', name: 'Ana', age: 25, city: 'Quito', verified: true, tagline: 'Acompañante exclusiva para clientes exigentes' },
  { id: '9', name: 'Maria', age: 28, city: 'Guayaquil', verified: true, tagline: 'Presencia sofisticada para ocasiones de alto nivel' },
  { id: '10', name: 'Carolina', age: 24, city: 'Loja', verified: true, tagline: 'Acompañante encantadora y profesional' },
  { id: '11', name: 'Andrea', age: 25, city: 'Quito', verified: true, tagline: 'Compañía discreta y refinada', tags: ['Mejor valorado'] },
  { id: '12', name: 'Gabriela', age: 26, city: 'Cuenca', verified: true, tagline: 'Servicios premium de acompañamiento' },
];

export default function Profiles() {
  const [selectedCiudad, setSelectedCiudad] = useState('all');
  const [sortBy, setSortBy] = useState('relevant');
  const [showFiltros, setShowFiltros] = useState(true);

  return (
    <Layout>
      <div className="min-h-screen bg-black">
        <div className="bg-gradient-to-b from-[#0a0a0a] to-black py-8 px-4 sm:px-6 lg:px-8 border-b border-[#a83d8e]/20">
          <div className="max-w-[1440px] mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 bg-gradient-to-r from-[#a83d8e] to-[#d4af37] bg-clip-text text-transparent">
              Explorar perfiles
            </h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
              {ALL_PROFILES.length} acompañantes verificadas disponibles
            </p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
            {showFiltros && (
              <aside className="w-full xl:w-80 xl:flex-shrink-0">
                <div className="xl:sticky xl:top-24 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-5 sm:p-6 border border-[#a83d8e]/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg sm:text-xl text-white">Filtros</h3>
                    <button className="text-[#a83d8e] text-sm hover:text-[#d4af37]">Restablecer</button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Ciudad
                      </label>
                      <div className="space-y-2">
                        {['Todas las ciudades', 'Quito', 'Guayaquil', 'Cuenca', 'Manta', 'Loja'].map((city) => (
                          <label key={city} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="radio"
                              name="city"
                              value={city.toLowerCase()}
                              checked={selectedCiudad === city.toLowerCase().replace(' ', '-')}
                              onChange={(e) => setSelectedCiudad(e.target.value)}
                              className="w-4 h-4 accent-[#a83d8e]"
                            />
                            <span className="text-gray-300 group-hover:text-white transition-colors">{city}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#a83d8e]/20 pt-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-[#a83d8e]" defaultChecked />
                        <span className="text-gray-300">Solo verificadas</span>
                      </label>
                    </div>

                    <div className="border-t border-[#a83d8e]/20 pt-6">
                      <label className="block text-sm text-gray-400 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Disponibilidad
                      </label>
                      <select className="w-full bg-[#0a0a0a] border border-[#a83d8e]/30 rounded-lg px-4 py-2 text-white focus:border-[#a83d8e] focus:outline-none">
                        <option>Todo</option>
                        <option>Disponible hoy</option>
                        <option>Esta semana</option>
                        <option>Fines de semana</option>
                      </select>
                    </div>

                    <div className="border-t border-[#a83d8e]/20 pt-6">
                      <label className="block text-sm text-gray-400 mb-3 flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Preferencias
                      </label>
                      <select className="w-full bg-[#0a0a0a] border border-[#a83d8e]/30 rounded-lg px-4 py-2 text-white focus:border-[#a83d8e] focus:outline-none">
                        <option>Todo</option>
                        <option>Elegante</option>
                        <option>Profesional</option>
                        <option>Sofisticada</option>
                      </select>
                    </div>

                    <div className="border-t border-[#a83d8e]/20 pt-6">
                      <label className="block text-sm text-gray-400 mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Rango de presupuesto
                      </label>
                      <input type="range" min="0" max="500" defaultValue="250" className="w-full accent-[#a83d8e]" />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>$0</span>
                        <span>$500</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            )}

            <div className="flex-1 min-w-0">
              <div className="mb-6 bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-xl p-4 border border-[#a83d8e]/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <button
                    onClick={() => setShowFiltros(!showFiltros)}
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-[#a83d8e] transition-colors"
                  >
                    <Filter className="w-5 h-5" />
                    {showFiltros ? 'Ocultar' : 'Mostrar'} Filtros
                  </button>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-gray-400 text-sm whitespace-nowrap">Ordenar por:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full sm:w-auto bg-[#0a0a0a] border border-[#a83d8e]/30 rounded-lg px-3 sm:px-4 py-2 text-white focus:border-[#a83d8e] focus:outline-none"
                    >
                      <option value="relevant">Más relevantes</option>
                      <option value="newest">Más nuevas</option>
                      <option value="rating">Mejor valoradas</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
                {ALL_PROFILES.map((profile) => (
                  <ProfileCard key={profile.id} {...profile} />
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-10 sm:mt-12">
                <button className="px-3 sm:px-4 py-2 rounded-lg border border-[#a83d8e]/30 text-gray-400 hover:border-[#a83d8e] hover:text-[#a83d8e] transition-colors text-sm sm:text-base">
                  Anterior
                </button>
                <button className="px-3 sm:px-4 py-2 rounded-lg bg-[#a83d8e] text-white text-sm sm:text-base">1</button>
                <button className="px-3 sm:px-4 py-2 rounded-lg border border-[#a83d8e]/30 text-gray-400 hover:border-[#a83d8e] hover:text-[#a83d8e] transition-colors text-sm sm:text-base">
                  2
                </button>
                <button className="px-3 sm:px-4 py-2 rounded-lg border border-[#a83d8e]/30 text-gray-400 hover:border-[#a83d8e] hover:text-[#a83d8e] transition-colors text-sm sm:text-base">
                  3
                </button>
                <button className="px-3 sm:px-4 py-2 rounded-lg border border-[#a83d8e]/30 text-gray-400 hover:border-[#a83d8e] hover:text-[#a83d8e] transition-colors text-sm sm:text-base">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
