import React from 'react';
import BrowseTrackItem, { BrowseTrack } from './BrowseTrackItem';

interface BrowseTracksSectionProps {
  title: string;
  tracks: BrowseTrack[];
  onSeeAll?: () => void;
  onTrackClick?: (track: BrowseTrack) => void;
  onMoreClick?: (track: BrowseTrack) => void;
}

const BrowseTracksSection: React.FC<BrowseTracksSectionProps> = ({
  title,
  tracks,
  onSeeAll,
  onTrackClick,
  onMoreClick,
}) => {
  return (
    <div className="browse-tracks-section">
      <div className="browse-tracks-section__header">
        <h3 className="browse-tracks-section__title">{title}</h3>
        <button className="browse-tracks-section__see-all" onClick={onSeeAll}>
          See All
        </button>
      </div>
      <div className="browse-tracks-section__grid">
        {tracks.map((track) => (
          <BrowseTrackItem
            key={track.id}
            track={track}
            onClick={onTrackClick}
            onMoreClick={onMoreClick}
          />
        ))}
      </div>
    </div>
  );
};

export default BrowseTracksSection;
