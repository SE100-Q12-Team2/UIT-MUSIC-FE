import React, { useState, useMemo } from 'react';
import { useTrendingSongs } from '@/core/services/song.service';
import { useRecordLabel } from '@/core/services/label.service';
import { usePlaylistsWithTrackCounts } from '@/core/services/playlist.service';
import { useAllPlaylistSongIds } from '@/core/services/playlist.service';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import AddTrackItem, { AddTrack } from './AddTrackItem';
import SelectPlaylistModal from './SelectPlaylistModal';
import CreatePlaylistModal from './CreatePlaylistModal';

interface AddTracksSectionProps {
  onSeeAll?: () => void;
  onTrackClick?: (track: AddTrack) => void;
  onFavoriteToggle?: (trackId: number) => void;
}

const AddTracksSection: React.FC<AddTracksSectionProps> = ({
  onSeeAll,
  onTrackClick,
  onFavoriteToggle,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [showSelectPlaylistModal, setShowSelectPlaylistModal] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const { user } = useAuth();
  
  // Fetch playlists for modals
  const { data: playlists = [] } = usePlaylistsWithTrackCounts();
  
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
  
  // Show first 6 tracks or all tracks based on state
  const displayedTracks = showAll ? allTracks : allTracks.slice(0, 6);
  
  const handleSeeAll = () => {
    setShowAll(!showAll);
    if (!showAll && onSeeAll) {
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
        {allTracks.length > 8 && (
          <button className="add-tracks-section__see-all" onClick={handleSeeAll}>
            {showAll ? 'Show Less' : 'See All'}
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
              onAddToExisting={() => {
                setSelectedTrackId(track.id);
                setShowSelectPlaylistModal(true);
              }}
              onAddToNew={() => {
                setSelectedTrackId(track.id);
                setShowCreatePlaylistModal(true);
              }}
            />
          );
        })}
      </div>

      {/* Select Existing Playlist Modal */}
      <SelectPlaylistModal
        isOpen={showSelectPlaylistModal}
        playlists={playlists}
        trackId={selectedTrackId ?? undefined}
        onClose={() => setShowSelectPlaylistModal(false)}
        onConfirm={(playlistId) => {
          console.log('Added track', selectedTrackId, 'to playlist:', playlistId);
          setShowSelectPlaylistModal(false);
        }}
      />

      {/* Create New Playlist Modal */}
      <CreatePlaylistModal
        isOpen={showCreatePlaylistModal}
        trackId={selectedTrackId ?? undefined}
        onClose={() => setShowCreatePlaylistModal(false)}
        onPlaylistCreated={(playlistId) => {
          console.log('Created playlist:', playlistId, 'with track:', selectedTrackId);
          setShowCreatePlaylistModal(false);
        }}
      />
    </div>
  );
};

export default AddTracksSection;
