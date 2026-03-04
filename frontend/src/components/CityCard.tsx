import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

interface CityCardProps {
  name: string;
  profileCount: number;
  imageUrl: string;
}

export default function CityCard({ name, profileCount, imageUrl }: CityCardProps) {
  return (
    <Link
      to={`/profiles?city=${name.toLowerCase()}`}
      className="group relative h-64 rounded-xl overflow-hidden border border-[#a83d8e]/20 hover:border-[#a83d8e]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,61,142,0.4)]"
    >
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>

      {/* Contenido */}
      <div className="relative h-full p-6 flex flex-col justify-end">
        <h3 className="text-3xl text-white mb-2 group-hover:text-[#a83d8e] transition-colors">
          {name}
        </h3>
        <p className="text-gray-300 text-sm mb-4">{profileCount} perfiles verificados</p>
        <div className="flex items-center gap-2 text-[#d4af37] group-hover:gap-3 transition-all">
          <span className="text-sm">Explorar perfiles</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Efecto neón al pasar el cursor */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#a83d8e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Link>
  );
}
