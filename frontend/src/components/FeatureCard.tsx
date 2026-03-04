import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-xl p-6 border border-[#a83d8e]/20 hover:border-[#d4af37]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,61,142,0.2)]">
      <div className="w-14 h-14 rounded-lg bg-[#a83d8e]/20 flex items-center justify-center mb-4 border border-[#a83d8e]/30">
        <Icon className="w-7 h-7 text-[#a83d8e]" />
      </div>
      <h3 className="text-xl text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
