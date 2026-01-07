import React, { useState, useEffect } from 'react';
import { adminApi, AdminSong } from '@/core/api/admin.api';
import Pagination from '@/shared/components/Pagination';
import '@/styles/pagination.css';
import '@/styles/loading.css';

const SongsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState<AdminSong[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    fetchSongs();
  }, [currentPage, searchQuery]);

  const fetchSongs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.getSongs(currentPage, limit, searchQuery || undefined);
      setSongs(response.items);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Failed to fetch songs');
      console.error('Error fetching songs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPlays = (plays: number | undefined | null) => {
    if (!plays || plays === 0) return '0';
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
    if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`;
    return plays.toString();
  };

  const getArtistNames = (songArtists: AdminSong['songArtists']) => {
    if (!songArtists || songArtists.length === 0) return 'Unknown Artist';
    return songArtists.map(sa => sa.artist.artistName).join(', ');
  };

  const filteredSongs = songs;

  return (
    <div className="songs-tab">
      {/* Search Bar */}
      <div className="songs-tab__search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search songs..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="songs-tab__search-input"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading songs...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="songs-tab__error">
          <p>{error}</p>
        </div>
      )}

      {/* Songs Table */}
      {!isLoading && !error && (
        <>
          <div className="songs-table">
            <div className="songs-table__header">
              <div className="songs-table__col songs-table__col--rank">#</div>
              <div className="songs-table__col songs-table__col--play"></div>
              <div className="songs-table__col songs-table__col--title">TITLE</div>
              <div className="songs-table__col songs-table__col--artist">ARTIST</div>
              <div className="songs-table__col songs-table__col--album">ALBUM</div>
              <div className="songs-table__col songs-table__col--genre">GENRE</div>
              <div className="songs-table__col songs-table__col--duration">DURATION</div>
              <div className="songs-table__col songs-table__col--plays">PLAYS</div>
              <div className="songs-table__col songs-table__col--actions"></div>
            </div>

            <div className="songs-table__body">
              {filteredSongs.map((song, index) => (
                <div key={song.id} className="songs-table__row">
                  <div className="songs-table__cell songs-table__cell--rank">
                    {(currentPage - 1) * limit + index + 1}
                  </div>
                  <div className="songs-table__cell songs-table__cell--play">
                    <button className="play-btn">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                  <div className="songs-table__cell songs-table__cell--title">{song.title}</div>
                  <div className="songs-table__cell songs-table__cell--artist">
                    {getArtistNames(song.songArtists)}
                  </div>
                  <div className="songs-table__cell songs-table__cell--album">
                    {song.album?.albumTitle || 'N/A'}
                  </div>
                  <div className="songs-table__cell songs-table__cell--genre">
                    <span className="genre-badge">{song.genre?.genreName || 'N/A'}</span>
                  </div>
                  <div className="songs-table__cell songs-table__cell--duration">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {formatDuration(song.duration)}
                  </div>
                  <div className="songs-table__cell songs-table__cell--plays">
                    {formatPlays(song.playCount)}
                  </div>
                  <div className="songs-table__cell songs-table__cell--actions">
                    <button className="action-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredSongs.length === 0 && (
            <div className="songs-tab__empty">
              <p>No songs found</p>
            </div>
          )}

          {/* Pagination */}
          {filteredSongs.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SongsTab;
