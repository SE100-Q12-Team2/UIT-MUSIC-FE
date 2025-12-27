import React, { useState, useMemo } from 'react';
import { useTrendingSongs } from '@/core/services/song.service';
import { useCheckFavorite } from '@/core/services/favorite.service';
import { useRecordLabel } from '@/core/services/label.service';
import { useAllPlaylistSongIds } from '@/core/services/playlist.service';
import { useAuth } from '@/shared/hooks/auth/useAuth';
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
  const { user } = useAuth();
  
  // Fetch trending songs from API
  const { data: trendingResponse, isLoading: isLoadingTrending } = useTrendingSongs();
  const trendingSongs = trendingResponse?.items || [];
  
  // Fetch all song IDs that are already in playlists
  const { data: songsInPlaylists = new Set<number>(), isLoading: isLoadingPlaylistSongs } = useAllPlaylistSongIds();

  // Component to fetch and display artist name from labelId
  const ArtistName: React.FC<{ labelId: number }> = ({ labelId }) => {
    const { data: label, isLoading } = useRecordLabel(labelId);
    if (isLoading) return <span>Loading...</span>;
    return <span>{label?.labelName || "Unknown Artist"}</span>;
  };
  
  // Convert trending songs to AddTrack format and filter out songs in playlists
  const allTracks = useMemo(() => {
    if (!trendingSongs || trendingSongs.length === 0) return [];
    
    return trendingSongs
      .filter(song => !songsInPlaylists.has(song.id))
      .map((song): AddTrack => {
        return {
          id: song.id,
          title: song.title,
          artist: '', // Will be replaced by ArtistName component in rendering
          album: song.album?.albumTitle || 'Unknown Album',
          duration: song.duration,
          coverImage: song.album?.coverImage || '/default-cover.jpg',
          isFavorite: false, // Will be checked by FavoriteButton component
          labelId: song.labelId, // Add labelId for artist name lookup
        };
      });
  }, [trendingSongs, songsInPlaylists]);
  
  // Show first 8 tracks or all tracks based on state
  const displayedTracks = showAll ? allTracks : allTracks.slice(0, 8);
  
  const handleSeeAll = () => {
    setShowAll(true);
    if (onSeeAll) {
      onSeeAll();
    }
  };
  
  const isLoading = isLoadingTrending || isLoadingPlaylistSongs;
  
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
        {!showAll && allTracks.length > 8 && (
          <button className="add-tracks-section__see-all" onClick={handleSeeAll}>
            See All
          </button>
        )}
      </div>
      <div className="add-tracks-section__list">
        {displayedTracks.map((track) => {
          // Create a modified track with artist name from label
          const trackWithArtist = {
            ...track,
            artist: track.labelId ? <ArtistName labelId={track.labelId} /> : 'Unknown Artist',
          };
          
          return (
            <AddTrackItem
              key={track.id}
              track={trackWithArtist as AddTrack}
              userId={user?.id}
              onClick={onTrackClick}
              onFavoriteToggle={onFavoriteToggle}
              onMoreClick={onMoreClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AddTracksSection;
