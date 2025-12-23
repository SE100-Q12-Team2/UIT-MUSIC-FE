import React from 'react';
import AddTrackItem, { AddTrack } from './AddTrackItem';

// Import sample music icon
import sampleMusicIcon from '@/assets/sample-music-icon.png';

// Mock data for recommended tracks
const mockTracks: AddTrack[] = [
  {
    id: 1,
    title: 'Chihiro',
    artist: 'Billie Eilish',
    album: 'Hit Me Hard and soft',
    duration: 303,
    coverImage: sampleMusicIcon,
    isFavorite: false,
  },
  {
    id: 2,
    title: 'Low',
    artist: 'SZA',
    album: 'SOS',
    duration: 181,
    coverImage: sampleMusicIcon,
    isFavorite: false,
  },
  {
    id: 3,
    title: 'Empty Note',
    artist: 'Ghostly Kisses',
    album: 'What You See',
    duration: 228,
    coverImage: sampleMusicIcon,
    isFavorite: false,
  },
  {
    id: 4,
    title: 'Unstopble',
    artist: 'sia',
    album: 'This Is Acting',
    duration: 229,
    coverImage: sampleMusicIcon,
    isFavorite: false,
  },
];

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
  return (
    <div className="add-tracks-section">
      <div className="add-tracks-section__header">
        <h3 className="add-tracks-section__title">Add Tracks To Your Playlists</h3>
        <button className="add-tracks-section__see-all" onClick={onSeeAll}>
          See All
        </button>
      </div>
      <div className="add-tracks-section__list">
        {mockTracks.map((track) => (
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
