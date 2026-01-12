import React, { useState, useEffect } from 'react';
import { Heart, GripVertical, MoreVertical } from 'lucide-react';
import { Song as ApiSong } from '@/core/services/song.service';
import { formatTime } from '@/shared/utils/formatTime';
import { Song } from '@/types/song.types';
import { SongData } from '@/features/user/home/hooks/useHomeData';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useAddToFavorites, useRemoveFromFavorites } from '@/core/services/favorite.service';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { toast } from 'sonner';

interface SongRowProps {
  song: Song | ApiSong | SongData;
  index?: number;
  allSongs?: (Song | ApiSong | SongData)[];
  onPlay?: (song: Song | ApiSong | SongData) => void;
  showGrip?: boolean;
}

interface SongWithCoverUrl {
  coverUrl?: string;
  artist?: string;
  album?: string;
  [key: string]: unknown;
}

const SongRow: React.FC<SongRowProps> = ({ song, onPlay, showGrip = false }) => {
  const { play } = useMusicPlayer();
  const { user } = useAuth();
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const apiSong = song as ApiSong & { isLiked?: boolean };
    if (typeof apiSong.isLiked === 'boolean') {
      setIsLiked(apiSong.isLiked);
    }
  }, [song]);

  // Handle both Song types
  const songWithCover = song as unknown as SongWithCoverUrl;
  const apiSong = song as ApiSong;
  
  const getCoverUrl = () => {
    const url = songWithCover.coverUrl || apiSong.album?.coverImage;
    
    if (!url || imageError) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(song.title)}&background=7c3aed&color=fff&size=100`;
    }
    
    return url;
  };
  
  const coverUrl = getCoverUrl();
  const artist = songWithCover.artist || apiSong.contributors?.map((c) => c.label?.artistName || c.label?.labelName || '').filter(Boolean).join(', ') || 'Unknown Artist';
  
  // Fix: ensure album is always a string, not an object
  // Check both songWithCover.album and apiSong.album for object type
  let album = '-';
  if (songWithCover.album && typeof songWithCover.album === 'string') {
    album = songWithCover.album;
  } else if (songWithCover.album && typeof songWithCover.album === 'object') {
    album = (songWithCover.album as { albumTitle?: string }).albumTitle || '-';
  } else if (apiSong.album && typeof apiSong.album === 'object') {
    album = apiSong.album.albumTitle || '-';
  } else if (typeof apiSong.album === 'string') {
    album = apiSong.album;
  }
  
  const duration = typeof song.duration === 'string' ? song.duration : formatTime(song.duration);

  const handleClick = () => {
    if (onPlay) {
      onPlay(song);
    } else {
      const songToPlay = apiSong as ApiSong;
      play(songToPlay);
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user?.id) {
      toast.error('Please login to add to favorites');
      return;
    }

    if (isSubmitting) return;

    const songId = typeof song.id === 'string' ? parseInt(song.id) : song.id;
    
    try {
      setIsSubmitting(true);
      
      if (isLiked) {
        await removeFromFavorites.mutateAsync({ 
          userId: user.id, 
          songId 
        });
        setIsLiked(false);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites.mutateAsync({ 
          userId: user.id, 
          songId 
        });
        setIsLiked(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info('More options coming soon...');
  };

  return (
    <div 
      className="group flex items-center justify-between p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
      onClick={handleClick}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative h-12 w-12 shrink-0 bg-vio-900/50 rounded-md overflow-hidden">
          <img 
            src={coverUrl} 
            alt={song.title} 
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
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
        <button
          onClick={handleLikeClick}
          disabled={isSubmitting}
          className={`transition-colors ${
            isLiked 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-400 hover:text-white'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            size={18} 
            fill={isLiked ? 'currentColor' : 'none'}
          />
        </button>
        {showGrip ? (
          <div className="cursor-grab active:cursor-grabbing">
            <GripVertical size={18} className="text-gray-600 group-hover:text-gray-300" />
          </div>
        ) : (
          <button
            onClick={handleMoreClick}
            className="text-gray-600 hover:text-gray-300 transition-colors"
            aria-label="More options"
          >
            <MoreVertical size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SongRow;