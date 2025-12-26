import React, { useState } from 'react';

interface Genre {
  id: number;
  name: string;
  description: string;
  songCount: number;
  status: 'Active' | 'Inactive';
}

const GenresTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const genres: Genre[] = [
    {
      id: 1,
      name: 'V-Pop',
      description: 'Vietnamese Pop music',
      songCount: 12840,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Ballad',
      description: 'Romantic and Ballad songs',
      songCount: 8920,
      status: 'Active',
    },
    {
      id: 3,
      name: 'R&B',
      description: 'Rhythm and Blues',
      songCount: 5435,
      status: 'Active',
    },
    {
      id: 4,
      name: 'EDM',
      description: 'Electronic Dance Music',
      songCount: 4460,
      status: 'Active',
    },
    {
      id: 5,
      name: 'Hip-Hop',
      description: 'Rap and Hip-Hop beats',
      songCount: 3920,
      status: 'Active',
    },
    {
      id: 6,
      name: 'Rock',
      description: 'Rock and Alternative',
      songCount: 2840,
      status: 'Active',
    },
    {
      id: 7,
      name: 'Jazz',
      description: 'Classic and Contemporary Jazz',
      songCount: 1980,
      status: 'Active',
    },
    {
      id: 8,
      name: 'Classical',
      description: 'Classical and Orchestra',
      songCount: 1320,
      status: 'Active',
    },
    {
      id: 9,
      name: 'Folk',
      description: 'Traditional Vietnamese Folk',
      songCount: 1240,
      status: 'Active',
    },
  ];

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="genres-tab">
      {/* Header */}
      <div className="genres-tab__header">
        <div className="genres-tab__search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="genres-tab__search-input"
          />
        </div>
        <button className="genres-tab__add-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Genre
        </button>
      </div>

      {/* Genres Grid */}
      <div className="genres-grid">
        {filteredGenres.map((genre) => (
          <div key={genre.id} className="genre-card">
            <div className="genre-card__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div className="genre-card__content">
              <div className="genre-card__header">
                <h3 className="genre-card__name">{genre.name}</h3>
                <span className={`genre-card__status genre-card__status--${genre.status.toLowerCase()}`}>
                  {genre.status}
                </span>
              </div>
              <p className="genre-card__description">{genre.description}</p>
              <div className="genre-card__count">
                {genre.songCount.toLocaleString()} songs
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGenres.length === 0 && (
        <div className="genres-tab__empty">
          <p>No genres found</p>
        </div>
      )}
    </div>
  );
};

export default GenresTab;
