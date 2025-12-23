import React from 'react';
import { Heart, MoreHorizontal } from 'lucide-react';

export interface Track {
  id: number;
  title: string;
  artist: string;
  coverImage: string;
  album?: string;
  duration?: number;
  isFavorite?: boolean;
}

// Helper to format duration - unused but kept for potential future use
// const formatDuration = (seconds?: number): string => {
//   if (!seconds) return '';
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   return `${mins}:${secs.toString().padStart(2, '0')}`;
// };

interface TrackItemProps {
  track: Track;
  onFavoriteToggle?: (trackId: number) => void;
  onMoreClick?: (trackId: number) => void;
  onClick?: (track: Track) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({
  track,
  onFavoriteToggle,
  onMoreClick,
  onClick,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.(track.id);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoreClick?.(track.id);
  };

  return (
    <div className="track-item" onClick={() => onClick?.(track)}>
      <img
        src={track.coverImage || '/default-track.jpg'}
        alt={track.title}
        className="track-item__image"
      />
      <div className="track-item__info">
        <span className="track-item__title">{track.title}</span>
        <span className="track-item__artist">{track.artist}</span>
      </div>
      <div className="track-item__actions">
        <button
          className={`track-item__favorite ${track.isFavorite ? 'track-item__favorite--active' : ''}`}
          onClick={handleFavoriteClick}
        >
          <Heart 
            size={16} 
            fill={track.isFavorite ? '#fff' : 'none'}
            stroke="#fff"
          />
        </button>
        <button className="track-item__more" onClick={handleMoreClick}>
          <MoreHorizontal size={16} stroke="#fff" />
        </button>
      </div>
    </div>
  );
};

export default TrackItem;
