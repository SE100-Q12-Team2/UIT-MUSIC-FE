import React, { useState } from 'react';

interface Song {
  id: number;
  rank: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  plays: string;
}

const SongsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const songs: Song[] = [
    {
      id: 1,
      rank: 1,
      title: 'Lạc Trôi',
      artist: 'Sơn Tùng M-TP',
      album: 'Lạc Trôi',
      genre: 'V-Pop',
      duration: '3:45',
      plays: '7.4M',
    },
    {
      id: 2,
      rank: 2,
      title: 'Em Của Ngày Hôm Qua',
      artist: 'Sơn Tùng M-TP',
      album: 'M-TP Album',
      genre: 'Ballad',
      duration: '4:12',
      plays: '2.1M',
    },
    {
      id: 3,
      rank: 3,
      title: 'Chúng Ta Của Hiện Tại',
      artist: 'Sơn Tùng M-TP',
      album: 'Sky Tour',
      genre: 'V-Pop',
      duration: '3:58',
      plays: '1.8M',
    },
    {
      id: 4,
      rank: 4,
      title: 'Hãy Trao Cho Anh',
      artist: 'Sơn Tùng M-TP',
      album: 'Hãy Trao Cho Anh',
      genre: 'EDM',
      duration: '4:05',
      plays: '1.5M',
    },
    {
      id: 5,
      rank: 5,
      title: 'Nơi Này Có Anh',
      artist: 'Sơn Tùng M-TP',
      album: 'M-TP Album',
      genre: 'Ballad',
      duration: '4:32',
      plays: '1.2M',
    },
  ];

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          onChange={(e) => setSearchQuery(e.target.value)}
          className="songs-tab__search-input"
        />
      </div>

      {/* Songs Table */}
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
          {filteredSongs.map((song) => (
            <div key={song.id} className="songs-table__row">
              <div className="songs-table__cell songs-table__cell--rank">{song.rank}</div>
              <div className="songs-table__cell songs-table__cell--play">
                <button className="play-btn">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
              <div className="songs-table__cell songs-table__cell--title">{song.title}</div>
              <div className="songs-table__cell songs-table__cell--artist">{song.artist}</div>
              <div className="songs-table__cell songs-table__cell--album">{song.album}</div>
              <div className="songs-table__cell songs-table__cell--genre">
                <span className="genre-badge">{song.genre}</span>
              </div>
              <div className="songs-table__cell songs-table__cell--duration">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {song.duration}
              </div>
              <div className="songs-table__cell songs-table__cell--plays">{song.plays}</div>
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
    </div>
  );
};

export default SongsTab;
