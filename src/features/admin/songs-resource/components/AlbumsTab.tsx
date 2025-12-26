import React, { useState } from 'react';

interface Album {
  id: number;
  title: string;
  artist: string;
  songCount: number;
  year: number;
  coverUrl?: string;
}

const AlbumsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const albums: Album[] = [
    {
      id: 1,
      title: 'Lạc Trôi',
      artist: 'Sơn Tùng M-TP',
      songCount: 8,
      year: 2017,
    },
    {
      id: 2,
      title: 'Sky Tour',
      artist: 'Sơn Tùng M-TP',
      songCount: 12,
      year: 2019,
    },
    {
      id: 3,
      title: 'M-TP Album',
      artist: 'Sơn Tùng M-TP',
      songCount: 10,
      year: 2015,
    },
    {
      id: 4,
      title: 'Hãy Trao Cho Anh',
      artist: 'Sơn Tùng M-TP',
      songCount: 6,
      year: 2019,
    },
    {
      id: 5,
      title: 'Chúng Ta Của Hiện Tại',
      artist: 'Sơn Tùng M-TP',
      songCount: 5,
      year: 2018,
    },
    {
      id: 6,
      title: 'Nơi Này Có Anh',
      artist: 'Sơn Tùng M-TP',
      songCount: 7,
      year: 2018,
    },
    {
      id: 7,
      title: 'Buông Đôi Tay Nhau Ra',
      artist: 'Sơn Tùng M-TP',
      songCount: 9,
      year: 2020,
    },
    {
      id: 8,
      title: 'Em Của Ngày Hôm Qua',
      artist: 'Sơn Tùng M-TP',
      songCount: 11,
      year: 2014,
    },
  ];

  const filteredAlbums = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          onChange={(e) => setSearchQuery(e.target.value)}
          className="albums-tab__search-input"
        />
      </div>

      {/* Albums Grid */}
      <div className="albums-grid">
        {filteredAlbums.map((album) => (
          <div key={album.id} className="album-card">
            <div className="album-card__cover">
              <div className="album-card__play-overlay">
                <button className="album-card__play-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
              <div className="album-card__placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>
            <div className="album-card__info">
              <h3 className="album-card__title">{album.title}</h3>
              <p className="album-card__artist">{album.artist}</p>
              <div className="album-card__meta">
                <span>{album.songCount} songs</span>
                <span className="album-card__separator">•</span>
                <span>{album.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlbums.length === 0 && (
        <div className="albums-tab__empty">
          <p>No albums found</p>
        </div>
      )}
    </div>
  );
};

export default AlbumsTab;
