import React from 'react';
import { Playlist } from '@/types/playlist.types';
import PlaylistCard from './PlaylistCard';

interface PlaylistSectionProps {
  title: string;
  playlists: Playlist[];
  onSeeAll?: () => void;
  onPlaylistClick?: (playlist: Playlist) => void;
  onFavoriteToggle?: (playlistId: number) => void;
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({
  title,
  playlists,
  onSeeAll,
  onPlaylistClick,
  onFavoriteToggle,
}) => {
  return (
    <section className="playlist-section">
      <div className="playlist-section__header">
        <h2 className="playlist-section__title">{title}</h2>
        {onSeeAll && (
          <button className="playlist-section__see-all" onClick={onSeeAll}>
            See All
          </button>
        )}
      </div>
      <div className="playlist-section__grid">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onClick={onPlaylistClick}
            onFavoriteToggle={onFavoriteToggle}
          />
        ))}
      </div>
    </section>
  );
};

export default PlaylistSection;
