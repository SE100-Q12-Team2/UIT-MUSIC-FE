import React, { useState } from 'react';
import { Play } from 'lucide-react';

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
  const [imageError, setImageError] = useState(false);
  
  const getPlaceholderUrl = () => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=7c3aed&color=fff&size=300&bold=true`;
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-vio-900/50 to-purple-900/50 mb-3 border border-white/10 shadow-lg">
        {coverUrl && !imageError ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={getPlaceholderUrl()} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 flex items-center justify-center shadow-xl transition-all transform group-hover:scale-110">
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
