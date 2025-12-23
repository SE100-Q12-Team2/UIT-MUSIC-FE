import React from 'react';
import { Heart, GripVertical } from 'lucide-react';
import { Song } from '@/features/user/home/types/home.types';
import { Song as ApiSong } from '@/core/services/song.service';

interface SongRowProps {
  song: Song | ApiSong;
  index?: number;
  allSongs?: (Song | ApiSong)[];
}

interface SongWithCoverUrl {
  coverUrl?: string;
  artist?: string;
  album?: string;
  [key: string]: unknown;
}

const SongRow: React.FC<SongRowProps> = ({ song }) => {
  // Handle both Song types
  const songWithCover = song as unknown as SongWithCoverUrl;
  const apiSong = song as ApiSong;
  const coverUrl = songWithCover.coverUrl || apiSong.album?.coverImage || 'https://via.placeholder.com/100';
  const artist = songWithCover.artist || apiSong.songArtists?.map((sa) => sa.artist?.artistName).join(', ') || 'Unknown Artist';
  const album = songWithCover.album || apiSong.album?.albumTitle || '-';
  const duration = typeof song.duration === 'string' ? song.duration : '-';

  return (
    <div 
      className="group flex items-center justify-between p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative h-12 w-12 flex-shrink-0">
          <img src={coverUrl} alt={song.title} className="h-full w-full rounded-md object-cover" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium text-white truncate">{song.title}</span>
          <span className="text-xs text-gray-400 truncate">{artist}</span>
        </div>
      </div>

      <div className="hidden md:flex flex-1 justify-center">
        <span className="text-xs text-gray-500">{album}</span>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-xs text-gray-400">{duration}</span>
        <Heart 
            size={18} 
            className="text-gray-400 group-hover:text-white" 
        />
        <GripVertical size={18} className="text-gray-600 group-hover:text-gray-300" />
      </div>
    </div>
  );
};

export default SongRow;