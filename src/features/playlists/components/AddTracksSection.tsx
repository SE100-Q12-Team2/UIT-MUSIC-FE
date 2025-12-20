import React, { useState, useMemo } from 'react';
import { useSongs } from '@/core/services/song.service';
import { useAllPlaylistSongIds } from '@/core/services/playlist.service';
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
  const [showAll, setShowAll] = useState(false);
  
  // Fetch latest songs from API
  const { data: songsResponse, isLoading: isLoadingSongs } = useSongs({ 
    page: 1, 
    limit: 50, 
    order: 'latest' 
  });
  
  // Fetch all song IDs that are already in playlists
  const { data: songsInPlaylists = new Set<number>(), isLoading: isLoadingPlaylistSongs } = useAllPlaylistSongIds();
  
  // Convert API songs to AddTrack format and filter out songs in playlists
  const allTracks = useMemo(() => {
    if (!songsResponse?.items) return [];
    
    return songsResponse.items
      .filter(song => !songsInPlaylists.has(song.id))
      .map((song): AddTrack => {
        const artistNames = song.songArtists
          .map(sa => sa.artist.artistName)
          .join(', ');
        
        return {
          id: song.id,
          title: song.title,
          artist: artistNames || 'Unknown Artist',
          album: song.album.albumTitle,
          duration: song.duration,
          coverImage: song.album.coverImage,
          isFavorite: song.isFavorite,
        };
      });
  }, [songsResponse, songsInPlaylists]);
  
  // Show first 4 tracks or all tracks based on state
  const displayedTracks = showAll ? allTracks : allTracks.slice(0, 4);
  
  const handleSeeAll = () => {
    setShowAll(true);
    if (onSeeAll) {
      onSeeAll();
    }
  };
  
  const isLoading = isLoadingSongs || isLoadingPlaylistSongs;
  
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
        {!showAll && allTracks.length > 4 && (
          <button className="add-tracks-section__see-all" onClick={handleSeeAll}>
            See All
          </button>
        )}
      </div>
      <div className="add-tracks-section__list">
        {displayedTracks.map((track) => (
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
