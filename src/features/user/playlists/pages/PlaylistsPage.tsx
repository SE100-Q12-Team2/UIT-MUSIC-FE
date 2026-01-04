import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaylistsWithTrackCounts, usePlaylistTracks, useRemoveTrackFromPlaylist } from '@/core/services/playlist.service';
import { Playlist, PlaylistTrack as PlaylistTrackType } from '@/types/playlist.types';
import {
  PlaylistSection,
  PlaylistDetail,
  Track,
  AddTracksSection,
  SelectPlaylistModal,
  CreatePlaylistModal,
} from '../components';
import '@/styles/playlists.css';

const playlistTrackToTrack = (playlistTrack: PlaylistTrackType, playlistId: number): Track => {
  const artistNames = (playlistTrack.song.songArtists || [])
    .map((sa) => sa.artist.artistName)
    .join(', ');
  
  return {
    id: playlistTrack.song.id,
    title: playlistTrack.song.title,
    artist: artistNames || 'Unknown Artist',
    coverImage: playlistTrack.song.album?.coverImage,
    albumId: playlistTrack.song.album?.id,
    album: playlistTrack.song.album?.albumTitle,
    duration: playlistTrack.song.duration,
    isFavorite: false,
    playlistId: playlistId,
  };
};

// Helper to format duration from seconds to HH:MM:SS
const formatTotalDuration = (tracks: PlaylistTrackType[]): string => {
  const totalSeconds = tracks.reduce((acc, track) => acc + (track.song?.duration || 0), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const PlaylistsPage: React.FC = () => {
  // const [activeCategory, setActiveCategory] = useState<string>('recent');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [showAllPlaylists, setShowAllPlaylists] = useState<boolean>(false);
  const [showSelectPlaylistModal, setShowSelectPlaylistModal] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const navigate = useNavigate();
  
  // Fetch playlists with track counts from API
  const { data: playlists = [], isLoading, error } = usePlaylistsWithTrackCounts();
  
  // Fetch playlist tracks when a playlist is selected
  const { data: playlistTracks = [], isLoading: isLoadingTracks } = usePlaylistTracks(
    selectedPlaylist?.id ?? 0
  );

  // Mutation for removing tracks
  const removeTrackMutation = useRemoveTrackFromPlaylist();
  
  // Convert playlist tracks to Track format for UI (use album cover image for each track)
  const tracks: Track[] = useMemo(() => 
    playlistTracks.map((pt) => playlistTrackToTrack(pt, selectedPlaylist?.id ?? 0)),
    [playlistTracks, selectedPlaylist?.id]
  );
  
  // Calculate total duration from playlist tracks
  const totalDuration = useMemo(() => 
    formatTotalDuration(playlistTracks),
    [playlistTracks]
  );
  
  // Show only first 6 playlists initially
  const displayedPlaylists = showAllPlaylists ? playlists : playlists.slice(0, 6);

  // Close detail panel handler
  const handleCloseDetail = () => {
    setSelectedPlaylist(null);
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleRemoveTrackFromPlaylist = (trackId: number, playlistId: number) => {
    removeTrackMutation.mutate({ playlistId, trackId });
  };

  const handlePlayTrack = (trackId: number) => {
    navigate(`/player?trackId=${trackId}`);
  };
  
  const handleSeeAllPlaylists = () => {
    setShowAllPlaylists(true);
  };

  if (isLoading) {
    return (
      <div className="playlists-page">
        <div className="playlists-page__loading">Loading playlists...</div>
      </div>
    );
  }

  // Only show error if there's an actual error AND we have no data
  // Don't show error when playlists is just empty array (valid state)
  if (error && !Array.isArray(playlists)) {
    return (
      <div className="playlists-page">
        <div className="playlists-page__error">Failed to load playlists</div>
      </div>
    );
  }

  return (
    <div className="playlists-page">
      {/* Main Content */}
      <div className="playlists-page__main">

        {/* Your Playlists Section */}
        <PlaylistSection
          title="Your Playlists"
          playlists={displayedPlaylists}
          onSeeAll={!showAllPlaylists && playlists.length > 6 ? handleSeeAllPlaylists : undefined}
          onPlaylistClick={handlePlaylistClick}
          onAddToExisting={() => setShowSelectPlaylistModal(true)}
          onAddToNew={() => setShowCreatePlaylistModal(true)}
        />

        {/* Add Tracks To Your Playlists Section */}
        <AddTracksSection
          onSeeAll={() => console.log('See all tracks to add')}
        />

      </div>

      {/* Playlist Detail Panel - Only show when a playlist is selected */}
      {selectedPlaylist && (
        <aside className="playlists-page__detail">
          {isLoadingTracks ? (
            <div className="playlists-page__detail-loading">Loading tracks...</div>
          ) : (
            <PlaylistDetail
              title={selectedPlaylist.playlistName}
              coverImage={selectedPlaylist.coverImageUrl}
              trackCount={playlistTracks.length}
              duration={totalDuration}
              author="You"
              tracks={tracks}
              onTrackClick={(track) => console.log('Play track:', track)}
              onRemoveFromPlaylist={handleRemoveTrackFromPlaylist}
              onPlayTrack={handlePlayTrack}
              onClose={handleCloseDetail}
            />
          )}
        </aside>
      )}

      {/* Select Existing Playlist Modal */}
      <SelectPlaylistModal
        isOpen={showSelectPlaylistModal}
        playlists={playlists}
        onClose={() => setShowSelectPlaylistModal(false)}
        onConfirm={(playlistId) => {
          console.log('Add to playlist:', playlistId);
          setShowSelectPlaylistModal(false);
        }}
      />

      {/* Create New Playlist Modal */}
      <CreatePlaylistModal
        isOpen={showCreatePlaylistModal}
        onClose={() => setShowCreatePlaylistModal(false)}
        onPlaylistCreated={(playlistId) => {
          console.log('Playlist created:', playlistId);
          setShowCreatePlaylistModal(false);
        }}
      />
    </div>
  );
};

export default PlaylistsPage;
