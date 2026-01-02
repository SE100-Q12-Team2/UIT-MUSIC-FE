import React from 'react';
import { Playlist } from '@/types/playlist.types';

interface PlaylistCardProps {
  playlist: Playlist;
  trackCount?: number;
  onPlaylistClick?: (playlist: Playlist) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  trackCount,
  onPlaylistClick,
}) => {
  // Use trackCount prop if provided, otherwise fall back to tags length
  const displayTrackCount = trackCount ?? (playlist.tags?.length || 0);

  return (
    <div 
      className="playlist-card"
      onClick={() => onPlaylistClick?.(playlist)}
    >
      <div className="playlist-card__image-wrapper">
        <img
          src={playlist.coverImageUrl || '/default-playlist.jpg'}
          alt={playlist.playlistName}
          className="playlist-card__image"
        />
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
