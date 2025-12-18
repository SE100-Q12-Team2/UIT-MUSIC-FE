import React from 'react';
import { useSongs } from '@/core/services/song.service';
import AddTrackItem, { AddTrack } from './AddTrackItem';

interface AddTracksSectionProps {
  onSeeAll?: () => void;
  onTrackClick?: (track: AddTrack) => void;
  onFavoriteToggle?: (trackId: number) => void;
  onMoreClick?: (trackId: number) => void;
}

const AddTracksSection: React.FC<AddTracksSectionProps> = ({
  onSeeAll,
  onTrackClick,
  onFavoriteToggle,
  onMoreClick,
}) => {
  // Fetch songs to add - you can customize this to fetch recommended songs
  const { data: songsResponse, isLoading } = useSongs({ limit: 4 });

  // Convert songs to AddTrack format
  const tracks: AddTrack[] = (songsResponse?.songs || []).map((song) => ({
    id: song.id,
    title: song.title,
    artist: song.artist?.artistName || 'Unknown Artist',
    album: 'Album', // TODO: Get from song.album when available
    duration: song.duration,
    coverImage: song.thumbnailPath || '/default-track.jpg',
    isFavorite: false,
  }));

  if (isLoading) {
    return (
      <div className="add-tracks-section">
        <div className="add-tracks-section__header">
          <h3 className="add-tracks-section__title">Add Tracks To Your Playlists</h3>
        </div>
        <div className="add-tracks-section__loading">Loading tracks...</div>
      </div>
    );
  }

  return (
    <div className="add-tracks-section">
      <div className="add-tracks-section__header">
        <h3 className="add-tracks-section__title">Add Tracks To Your Playlists</h3>
        <button className="add-tracks-section__see-all" onClick={onSeeAll}>
          See All
        </button>
      </div>
      <div className="add-tracks-section__list">
        {tracks.map((track) => (
          <AddTrackItem
            key={track.id}
            track={track}
            onClick={onTrackClick}
            onFavoriteToggle={onFavoriteToggle}
            onMoreClick={onMoreClick}
          />
        ))}
      </div>
    </div>
  );
};

export default AddTracksSection;
