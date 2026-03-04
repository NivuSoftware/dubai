import { BadgeCheck, MessageCircle, Eye } from 'lucide-react';
import { Link } from 'react-router';

export interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  city: string;
  verified: boolean;
  tagline: string;
  tags?: string[];
  imageUrl?: string;
}

export default function ProfileCard({
  id,
  name,
  age,
  city,
  verified,
  tagline,
  tags = [],
}: ProfileCardProps) {
  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-xl overflow-hidden border border-[#a83d8e]/20 hover:border-[#a83d8e]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,61,142,0.3)] group">
      <div className="relative h-56 sm:h-64 bg-gradient-to-br from-[#a83d8e]/20 to-black overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-3xl bg-black/40 flex items-center justify-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#a83d8e]/30 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl text-[#a83d8e]">{name.charAt(0)}</span>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="absolute top-3 right-3 flex gap-2 flex-wrap justify-end max-w-[70%]">
            {tags.map((tag, index) => (
              <span key={index} className="bg-[#d4af37] text-black px-2.5 py-1 rounded-full text-[11px] sm:text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        {verified && (
          <div className="absolute top-3 left-3 bg-[#a83d8e] text-white px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" />
            Verificado
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg sm:text-xl text-white mb-1">{name}</h3>
            <p className="text-sm text-gray-400">
              {city} • {age} años
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{tagline}</p>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            to={`/profile/${id}`}
            className="flex-1 bg-transparent border border-[#a83d8e] text-[#a83d8e] hover:bg-[#a83d8e] hover:text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(168,61,142,0.4)]"
          >
            <Eye className="w-4 h-4" />
            Ver perfil
          </Link>
          <button className="bg-[#25D366] hover:bg-[#25D366]/90 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2 sm:whitespace-nowrap">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
