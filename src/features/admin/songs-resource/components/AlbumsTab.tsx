import React, { useState, useEffect } from 'react';
import { adminApi, AdminAlbum } from '@/core/api/admin.api';
import Pagination from '@/shared/components/Pagination';
import '@/styles/pagination.css';
import '@/styles/loading.css';

const AlbumsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [albums, setAlbums] = useState<AdminAlbum[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const limit = 12;

  useEffect(() => {
    fetchAlbums();
  }, [currentPage, searchQuery]);

  const fetchAlbums = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminApi.getAlbums(currentPage, limit, searchQuery || undefined);
      setAlbums(response.items);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Failed to fetch albums');
      console.error('Error fetching albums:', err);
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

  const getArtistNames = (album: AdminAlbum) => {
    if (!album.songs || album.songs.length === 0) return album.label?.labelName || 'Unknown';
    const artists = album.songs[0]?.songArtists?.map(sa => sa.artist.artistName) || [];
    return artists.length > 0 ? artists.join(', ') : album.label?.labelName || 'Unknown';
  };

  const getReleaseYear = (releaseDate: string) => {
    return new Date(releaseDate).getFullYear();
  };

  return (
    <div className="albums-tab">
      {/* Search Bar */}
      <div className="albums-tab__search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search albums..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="albums-tab__search-input"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading albums...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="albums-tab__error">
          <p>{error}</p>
        </div>
      )}

      {/* Albums Grid */}
      {!isLoading && !error && (
        <>
          <div className="albums-grid">
            {albums.map((album) => (
              <div key={album.id} className="album-card">
                <div className="album-card__cover">
                  <div className="album-card__play-overlay">
                    <button className="album-card__play-btn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                  {album.coverImage ? (
                    <img src={album.coverImage} alt={album.albumTitle} className="album-card__image" />
                  ) : (
                    <div className="album-card__placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="album-card__info">
                  <h3 className="album-card__title">{album.albumTitle}</h3>
                  <p className="album-card__artist">{getArtistNames(album)}</p>
                  <div className="album-card__meta">
                    <span>{album._count.songs} songs</span>
                    <span className="album-card__separator">•</span>
                    <span>{getReleaseYear(album.releaseDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {albums.length === 0 && (
            <div className="albums-tab__empty">
              <p>No albums found</p>
            </div>
          )}

          {/* Pagination */}
          {albums.length > 0 && totalPages > 1 && (
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

export default AlbumsTab;
