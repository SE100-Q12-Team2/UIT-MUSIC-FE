import React from 'react';
import { Play, Music } from 'lucide-react';

interface MusicCardProps {
  id: string;
  title: string;
  subtitle?: string;
  coverUrl?: string;
  onClick?: () => void;
}

const MusicCard: React.FC<MusicCardProps> = ({ 
  title, 
  subtitle, 
  coverUrl, 
  onClick 
}) => {
  return (
    <div
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden bg-[#13132b]/50 mb-3 border border-white/5">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = parent.querySelector('.fallback-icon');
                if (fallback) {
                  (fallback as HTMLElement).style.display = 'flex';
                }
              }
            }}
          />
        ) : null}
        <div className="fallback-icon absolute inset-0 flex items-center justify-center" style={{ display: coverUrl ? 'none' : 'flex' }}>
          <Music size={48} className="text-gray-600" />
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center shadow-xl transition-colors">
            <Play size={24} fill="white" className="text-white ml-1" />
          </div>
        </div>
      </div>
      <h3 className="text-white font-medium truncate mb-1">{title}</h3>
      {subtitle && (
        <p className="text-sm text-gray-400 truncate">{subtitle}</p>
      )}
    </div>
  );
};

export default MusicCard;
