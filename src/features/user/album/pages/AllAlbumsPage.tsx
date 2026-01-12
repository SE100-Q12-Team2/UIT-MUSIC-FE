import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Play } from 'lucide-react';
import { useAlbums } from '@/core/services/album.service';
import '@/styles/all-albums.css';

const AllAlbumsPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: albumsResponse, isLoading } = useAlbums({ 
    page, 
    limit,
    order: 'latest' 
  });

  const albums = albumsResponse?.items || [];
  const totalPages = albumsResponse?.totalPages || 1;

  const handleAlbumClick = (albumId: number) => {
    navigate(`/album/${albumId}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="all-albums-page">
        <div className="all-albums-page__loading">
          <div className="spinner"></div>
          <p>Loading albums...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="all-albums-page">
      <div className="all-albums-page__header">
        <h1 className="all-albums-page__title">All Albums</h1>
        <p className="all-albums-page__subtitle">
          Discover and explore all available albums
        </p>
      </div>

      {albums.length > 0 ? (
        <>
          <div className="all-albums-page__grid">
            {albums.map((album) => (
              <div
                key={album.id}
                className="album-card"
                onClick={() => handleAlbumClick(album.id)}
              >
                <div className="album-card__image-wrapper">
                  {album.coverImage ? (
                    <img
                      src={album.coverImage}
                      alt={album.albumTitle}
                      className="album-card__image"
                    />
                  ) : (
                    <div className="album-card__placeholder">
                      <span>🎵</span>
                    </div>
                  )}
                  <div className="album-card__overlay">
                    <div className="album-card__play-button">
                      <Play size={24} fill="white" className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="album-card__info">
                  <h3 className="album-card__title">{album.albumTitle}</h3>
                  <p className="album-card__meta">
                    {album.releaseDate && (
                      <span>{new Date(album.releaseDate).getFullYear()}</span>
                    )}
                    {album.releaseDate && album.totalTracks > 0 && <span> • </span>}
                    {album.totalTracks > 0 && (
                      <span>{album.totalTracks} tracks</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="all-albums-page__pagination">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <div className="pagination-info">
                Page {page} of {totalPages}
              </div>
              <button
                className="pagination-button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="all-albums-page__empty">
          <p>No albums available</p>
        </div>
      )}
    </div>
  );
};

export default AllAlbumsPage;
