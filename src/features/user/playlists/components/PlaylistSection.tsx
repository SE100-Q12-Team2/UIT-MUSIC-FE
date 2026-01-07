import React from 'react';
import { Playlist } from '@/types/playlist.types';
import PlaylistCard from './PlaylistCard';

interface PlaylistSectionProps {
  title: string;
  playlists: (Playlist & { trackCount?: number })[];
  onSeeAll?: () => void;
  onPlaylistClick?: (playlist: Playlist) => void;
  onAddToExisting?: () => void;
  onAddToNew?: () => void;
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({
  title,
  playlists,
  onSeeAll,
  onPlaylistClick,
  onAddToExisting,
  onAddToNew,
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
            trackCount={playlist.trackCount}
            playlist={playlist}
            onPlaylistClick={onPlaylistClick}
          />
        ))}
      </div>
    </section>
  );
};

export default PlaylistSection;
