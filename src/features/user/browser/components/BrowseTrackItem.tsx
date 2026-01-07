import React from 'react';
import { MoreHorizontal } from 'lucide-react';

export interface BrowseTrack {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverImage: string;
}

// Helper to format duration
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface BrowseTrackItemProps {
  track: BrowseTrack;
  onClick?: (track: BrowseTrack) => void;
  onMoreClick?: (track: BrowseTrack) => void;
  onPlayTrack?: (trackId: number) => void;
}

const BrowseTrackItem: React.FC<BrowseTrackItemProps> = ({
  track,
  onClick,
  onMoreClick,
  onPlayTrack,
}) => {
  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoreClick?.(track);
  };

  const handleTrackClick = () => {
    if (onPlayTrack) {
      onPlayTrack(track.id);
    } else if (onClick) {
      onClick(track);
    }
  };

  return (
    <div className="browse-track-item" onClick={handleTrackClick}>
      <img
        src={track.coverImage}
        alt={track.title}
        className="browse-track-item__image"
      />
      <div className="browse-track-item__info">
        <span className="browse-track-item__title">{track.title}</span>
        <span className="browse-track-item__artist">{track.artist}</span>
      </div>
      <div className="browse-track-item__album">{track.album}</div>
      <div className="browse-track-item__duration">{formatDuration(track.duration)}</div>
      <button className="browse-track-item__more" onClick={handleMoreClick}>
        <MoreHorizontal size={18} stroke="#fff" />
      </button>
    </div>
  );
};

export default BrowseTrackItem;
