import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Playlist } from '@/types/playlist.types';

interface PlaylistCardProps {
  playlist: Playlist;
  trackCount?: number;
  onFavoriteToggle?: (playlistId: number) => void;
  onClick?: (playlist: Playlist) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  trackCount,
  onFavoriteToggle,
  onClick,
}) => {
  const [isFavorite, setIsFavorite] = useState(playlist.isFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavoriteToggle?.(playlist.id);
  };

  // Use trackCount prop if provided, otherwise fall back to tags length
  const displayTrackCount = trackCount ?? (playlist.tags?.length || 0);

  return (
    <div 
      className="playlist-card"
      onClick={() => onClick?.(playlist)}
    >
      <div className="playlist-card__image-wrapper">
        <img
          src={playlist.coverImageUrl || '/default-playlist.jpg'}
          alt={playlist.playlistName}
          className="playlist-card__image"
        />
        <button
          className={`playlist-card__favorite ${isFavorite ? 'playlist-card__favorite--active' : ''}`}
          onClick={handleFavoriteClick}
        >
          <Heart 
            size={18} 
            fill={isFavorite ? '#fff' : 'none'}
            stroke="#fff"
          />
        </button>
      </div>
      <div className="playlist-card__info">
        <h4 className="playlist-card__name">{playlist.playlistName}</h4>
        <span className="playlist-card__tracks">
          {displayTrackCount} Tracks
        </span>
      </div>
    </div>
  );
};

export default PlaylistCard;
