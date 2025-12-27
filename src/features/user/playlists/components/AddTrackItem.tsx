import React from 'react';
import { Heart, MoreHorizontal } from 'lucide-react';
import { useCheckFavorite } from '@/core/services/favorite.service';

export interface AddTrack {
  id: number;
  title: string;
  artist: string | React.ReactNode;
  album: string;
  duration: number;
  coverImage: string;
  isFavorite?: boolean;
  labelId?: number;
}

// Helper to format duration
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface AddTrackItemProps {
  track: AddTrack;
  userId?: number;
  onFavoriteToggle?: (trackId: number) => void;
  onMoreClick?: (trackId: number) => void;
  onClick?: (track: AddTrack) => void;
}

const AddTrackItem: React.FC<AddTrackItemProps> = ({
  track,
  userId,
  onFavoriteToggle,
  onMoreClick,
  onClick,
}) => {
  // Check favorite status from API
  const { data: favoriteStatus } = useCheckFavorite(userId, track.id);
  const isFavorited = favoriteStatus?.isFavorite || false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.(track.id);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoreClick?.(track.id);
  };

  return (
    <div className="add-track-item" onClick={() => onClick?.(track)}>
      <img
        src={track.coverImage || '/default-track.jpg'}
        alt={track.title}
        className="add-track-item__image"
      />
      <div className="add-track-item__info">
        <span className="add-track-item__title">{track.title}</span>
        <span className="add-track-item__artist">{track.artist}</span>
      </div>
      <div className="add-track-item__album">{track.album}</div>
      <div className="add-track-item__duration">{formatDuration(track.duration)}</div>
      <div className="add-track-item__actions">
        <button
          className={`add-track-item__favorite ${isFavorited ? 'add-track-item__favorite--active' : ''}`}
          onClick={handleFavoriteClick}
        >
          <Heart 
            size={18} 
            fill={isFavorited ? '#fff' : 'none'}
            stroke="#fff"
          />
        </button>
        <button className="add-track-item__more" onClick={handleMoreClick}>
          <MoreHorizontal size={18} stroke="#fff" />
        </button>
      </div>
    </div>
  );
};

export default AddTrackItem;
