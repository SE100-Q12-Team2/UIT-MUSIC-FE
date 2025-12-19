import React, { useState, useMemo } from 'react';
import { usePlaylists, usePlaylistTracks } from '@/core/services/playlist.service';
import { Playlist, PlaylistTrack as PlaylistTrackType } from '@/types/playlist.types';
import {
  CategoryTabs,
  PlaylistSection,
  PlaylistDetail,
  Track,
  AddTracksSection,
} from '../components';
import '@/styles/playlists.css';

// Import category images
import categoryRecent from '@/assets/category-recent.jpg';
import categoryMost from '@/assets/category-most.jpg';
import categoryLiked from '@/assets/category-liked.jpg';

// Default categories
const defaultCategories = [
  { id: 'recent', label: 'Recently Listened', image: categoryRecent },
  { id: 'most', label: 'Most Listened', image: categoryMost },
  { id: 'liked', label: 'Liked Tracks', image: categoryLiked },
];

// Helper function to convert PlaylistTrack to Track for UI
const playlistTrackToTrack = (playlistTrack: PlaylistTrackType, playlistCoverImage: string): Track => {
  const artistNames = playlistTrack.song.songArtists
    .map((sa) => sa.artist.artistName)
    .join(', ');
  
  return {
    id: playlistTrack.song.id,
    title: playlistTrack.song.title,
    artist: artistNames || 'Unknown Artist',
    coverImage: playlistCoverImage || '/default-track.jpg',
    album: playlistTrack.song.album?.albumTitle,
    duration: playlistTrack.song.duration,
    isFavorite: false,
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
  const [activeCategory, setActiveCategory] = useState<string>('recent');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  
  // Fetch playlists from API
  const { data: playlists = [], isLoading, error } = usePlaylists();
  
  // Fetch playlist tracks when a playlist is selected
  const { data: playlistTracks = [], isLoading: isLoadingTracks } = usePlaylistTracks(
    selectedPlaylist?.id ?? 0
  );
  
  // Convert playlist tracks to Track format for UI (use playlist cover image for all tracks)
  const tracks: Track[] = useMemo(() => 
    playlistTracks.map((pt) => playlistTrackToTrack(pt, selectedPlaylist?.coverImageUrl || '')),
    [playlistTracks, selectedPlaylist?.coverImageUrl]
  );
  
  // Calculate total duration from playlist tracks
  const totalDuration = useMemo(() => 
    formatTotalDuration(playlistTracks),
    [playlistTracks]
  );

  // All playlists (no limit)
  const yourPlaylists = playlists;

  // Close detail panel handler
  const handleCloseDetail = () => {
    setSelectedPlaylist(null);
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleFavoriteToggle = (playlistId: number) => {
    console.log('Toggle favorite for playlist:', playlistId);
    // TODO: Implement favorite toggle API call
  };

  const handleTrackFavoriteToggle = (trackId: number) => {
    console.log('Toggle favorite for track:', trackId);
    // TODO: Implement track favorite toggle
  };

  if (isLoading) {
    return (
      <div className="playlists-page">
        <div className="playlists-page__loading">Loading playlists...</div>
      </div>
    );
  }

  if (error) {
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
        {/* Category Tabs */}
        <CategoryTabs
          categories={defaultCategories}
          activeCategory={activeCategory}
          onCategoryClick={setActiveCategory}
        />

        {/* Your Playlists Section */}
        <PlaylistSection
          title="Your Playlists"
          playlists={yourPlaylists}
          onSeeAll={() => console.log('See all your playlists')}
          onPlaylistClick={handlePlaylistClick}
          onFavoriteToggle={handleFavoriteToggle}
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
              onFavoriteToggle={handleTrackFavoriteToggle}
              onMoreClick={(trackId) => console.log('More options for track:', trackId)}
              onClose={handleCloseDetail}
            />
          )}
        </aside>
      )}
    </div>
  );
};

export default PlaylistsPage;
