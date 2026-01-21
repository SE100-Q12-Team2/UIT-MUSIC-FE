import React, { useState, useMemo, useEffect } from 'react';
import { useTrendingSongs } from '@/core/services/song.service';
import { useSearch } from '@/core/services/search.service';
import { useGenres } from '@/core/services/genre.service';
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
  onPlayTrack?: (trackId: number) => void;
}

const AddTracksSection: React.FC<AddTracksSectionProps> = ({
  onSeeAll,
  onTrackClick,
  onFavoriteToggle,
  onPlayTrack,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [showSelectPlaylistModal, setShowSelectPlaylistModal] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const { user } = useAuth();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch genres for filter
  const { data: genresResponse } = useGenres({ limit: 100 });
  const genres = genresResponse?.data || [];

  // Fetch playlists for modals
  const { data: playlists = [] } = usePlaylistsWithTrackCounts();

  // Fetch trending songs from API
  const { data: trendingResponse, isLoading: isLoadingTrending } = useTrendingSongs({ limit: 50 });
  const trendingSongs = trendingResponse?.items || [];

  // Search songs when query exists
  const { data: searchResult, isLoading: isSearching } = useSearch({
    query: debouncedQuery,
    type: 'songs',
    limit: 50,
    page: 1,
  });

  // Fetch all song IDs that are already in playlists
  const { data: songsInPlaylists = new Set<number>(), isLoading: isLoadingPlaylistSongs } = useAllPlaylistSongIds();

  // Component to fetch and display artist name from labelId
  const ArtistName: React.FC<{ labelId: number }> = ({ labelId }) => {
    const { data: label, isLoading } = useRecordLabel(labelId);
    if (isLoading) return <span>Loading...</span>;
    return <span>{label?.labelName || "Unknown Artist"}</span>;
  };

  // Get search results songs
  const searchSongs = useMemo(() => {
    if (!searchResult?.songs?.items) return [];
    return searchResult.songs.items;
  }, [searchResult]);

  // Determine which songs to display
  const isSearchMode = debouncedQuery.length > 0;
  const sourceSongs = isSearchMode ? searchSongs : trendingSongs;

  // Convert songs to AddTrack format, filter by genre and exclude songs already in playlists
  const allTracks = useMemo(() => {
    if (!sourceSongs || sourceSongs.length === 0) return [];

    return sourceSongs
      .filter(song => !songsInPlaylists.has(song.id))
      .filter(song => {
        // Filter by genre if selected
        if (selectedGenreId === null) return true;
        return song.genreId === selectedGenreId;
      })
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
          genreId: song.genreId, // Add genreId for filtering
        };
      });
  }, [sourceSongs, songsInPlaylists, selectedGenreId]);

  // Show first 6 tracks or all tracks based on state
  const displayedTracks = showAll ? allTracks : allTracks.slice(0, 6);

  const handleSeeAll = () => {
    setShowAll(!showAll);
    if (!showAll && onSeeAll) {
      onSeeAll();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedGenreId(null);
  };

  const isLoading = isLoadingTrending || isLoadingPlaylistSongs;
  const hasFilters = isSearchMode || selectedGenreId !== null;

  return (
    <div className="add-tracks-section">
      <div className="add-tracks-section__header">
        <h3 className="add-tracks-section__title">
          {isSearchMode
            ? `Search Results for "${debouncedQuery}"`
            : selectedGenreId
              ? `Tracks in ${genres.find(g => g.id === selectedGenreId)?.genreName || 'Selected Genre'}`
              : 'Add Tracks To Your Playlists'}
        </h3>
        {!hasFilters && allTracks.length > 6 && (
          <button className="add-tracks-section__see-all cursor-pointer" onClick={handleSeeAll}>
            {showAll ? 'Show Less' : 'See All'}
          </button>
        )}
      </div>

      {/* Search and Filter Row */}
      <div className="add-tracks-section__filters">
        {/* Search Input */}
        <div className="add-tracks-section__search">
          <div className="add-tracks-section__search-wrapper">
            <svg className="add-tracks-section__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="add-tracks-section__search-input"
              placeholder="Search for songs to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="add-tracks-section__search-clear"
                onClick={handleClearSearch}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          {isSearching && <span className="add-tracks-section__search-loading">Searching...</span>}
        </div>

        {/* Genre Filter Dropdown */}
        <div className="add-tracks-section__genre-filter">
          <select
            className="add-tracks-section__genre-select"
            value={selectedGenreId || ''}
            onChange={(e) => setSelectedGenreId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.genreName}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            className="add-tracks-section__clear-filters"
            onClick={handleClearFilters}
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear Filters
          </button>
        )}
      </div>

      {/* Track List */}
      {isLoading ? (
        <div className="add-tracks-section__loading">Loading tracks...</div>
      ) : displayedTracks.length === 0 ? (
        <div className="add-tracks-section__empty">
          {hasFilters ? 'No songs found matching your filters.' : 'No tracks available to add.'}
        </div>
      ) : (
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
                onPlayTrack={onPlayTrack}
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
      )}

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
