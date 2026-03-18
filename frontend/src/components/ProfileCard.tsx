import { BadgeCheck, MessageCircle, Eye } from 'lucide-react';
import { Link } from 'react-router';
import { CONTACT_WHATSAPP_URL } from '../constants/contact';

export interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  city: string;
  verified: boolean;
  tagline: string;
  category?: string;
  imageUrl?: string;
  whatsappUrl?: string;
  className?: string;
  imageClassName?: string;
}

export default function ProfileCard({
  id,
  name,
  age,
  city,
  verified,
  tagline,
  category,
  imageUrl,
  whatsappUrl,
  className,
  imageClassName,
}: ProfileCardProps) {
  const withPrefilledMessage = (baseUrl: string, message: string) => {
    try {
      const url = new URL(baseUrl);
      url.searchParams.set("text", message);
      return url.toString();
    } catch {
      return baseUrl;
    }
  };

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/profile/${id}`
      : `/profile/${id}`;
  const prefilledMessage = `Hola! he visto tu perfil ${profileUrl}, y quisiera preguntarte .. `;
  const whatsappHref = withPrefilledMessage(
    whatsappUrl || CONTACT_WHATSAPP_URL,
    prefilledMessage
  );

  const normalizedCategory = (category || "").toLowerCase();
  const categoryClasses = normalizedCategory.includes("bronce")
    ? "bg-[#CD7F32]/30 border-[#CD7F32]/80 text-[#ffd2a3] shadow-[0_0_18px_rgba(205,127,50,0.45)]"
    : normalizedCategory.includes("plata")
      ? "bg-[#C0C0C0]/30 border-[#C0C0C0]/80 text-[#f3f4f6] shadow-[0_0_18px_rgba(192,192,192,0.4)]"
      : normalizedCategory.includes("oro")
        ? "bg-[#D4AF37]/30 border-[#D4AF37]/85 text-[#ffe69c] shadow-[0_0_18px_rgba(212,175,55,0.5)]"
        : normalizedCategory.includes("platino")
          ? "bg-[#38bdf8]/35 border-[#38bdf8]/95 text-[#e6f6ff] shadow-[0_0_20px_rgba(56,189,248,0.6)]"
          : "bg-[#d4af37]/30 border-[#d4af37]/80 text-[#ffe69c] shadow-[0_0_18px_rgba(212,175,55,0.5)]";

  return (
    <div
      className={`bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-xl overflow-hidden border border-[#a83d8e]/20 hover:border-[#a83d8e]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,61,142,0.3)] group ${className ?? ""}`}
    >
      <div
        className={`relative bg-gradient-to-br from-[#a83d8e]/20 to-black overflow-hidden ${imageClassName ?? "h-[420px] sm:h-64"}`}
      >
        {imageUrl ? (
          <>
            <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />
          </>
        ) : (
          <div className="absolute inset-0 backdrop-blur-3xl bg-black/40 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#a83d8e]/30 flex items-center justify-center">
              <span className="text-4xl sm:text-5xl text-[#a83d8e]">{name.charAt(0)}</span>
            </div>
          </div>
        )}

        {verified && (
          <div className="absolute top-2 left-2 bg-[#a83d8e] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs flex items-center gap-1">
            <BadgeCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
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
        {category && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {category ? (
              <span
                className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm font-semibold tracking-wide ${categoryClasses}`}
              >
                {category}
              </span>
            ) : null}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            to={`/profile/${id}`}
            className="flex-1 bg-transparent border border-[#a83d8e] text-[#a83d8e] hover:bg-[#a83d8e] hover:text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(168,61,142,0.4)]"
          >
            <Eye className="w-4 h-4" />
            Ver perfil
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#25D366]/90 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2 sm:whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
