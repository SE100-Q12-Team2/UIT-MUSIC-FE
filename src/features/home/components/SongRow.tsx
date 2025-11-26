import React from 'react';
import { Heart, GripVertical } from 'lucide-react';
import { Song } from '@/features/home/types/home.types';

interface SongRowProps {
  song: Song;
  index?: number;
}

const SongRow: React.FC<SongRowProps> = ({ song }) => {
  return (
    <div className="group flex items-center justify-between p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative h-12 w-12 flex-shrink-0">
          <img src={song.coverUrl} alt={song.title} className="h-full w-full rounded-md object-cover" />
          <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded-md">
             {/* Simple play icon overlay */}
             <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium text-white truncate">{song.title}</span>
          <span className="text-xs text-gray-400 truncate">{song.artist}</span>
        </div>
      </div>

      <div className="hidden md:flex flex-1 justify-center">
        <span className="text-xs text-gray-500">{song.album}</span>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-xs text-gray-400">{song.duration}</span>
        <Heart 
            size={18} 
            className={`${song.isLiked ? 'text-vio-accent fill-vio-accent' : 'text-gray-400 group-hover:text-white'}`} 
        />
        <GripVertical size={18} className="text-gray-600 group-hover:text-gray-300" />
      </div>
    </div>
  );
};

export default SongRow;