import React from 'react';

interface Song {
  id: number;
  rank: number;
  title: string;
  artist: string;
  streams: string;
  change: number;
  duration: string;
}

interface TopSongsTableProps {
  songs: Song[];
}

const TopSongsTable: React.FC<TopSongsTableProps> = ({ songs }) => {
  return (
    <div className="top-songs">
      <div className="top-songs__header">
        <h2 className="top-songs__title">Top Songs</h2>
        <button className="top-songs__view-all">View All</button>
      </div>
      <div className="top-songs__table">
        {songs.map((song) => (
          <div key={song.id} className="song-row">
            <div className="song-row__rank">{song.rank}</div>
            <button className="song-row__play">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="song-row__info">
              <div className="song-row__title">{song.title}</div>
              <div className="song-row__artist">{song.artist}</div>
            </div>
            <div className="song-row__streams">{song.streams}</div>
            <div className={`song-row__change ${song.change >= 0 ? 'song-row__change--positive' : 'song-row__change--negative'}`}>
              {song.change >= 0 ? '+' : ''}{song.change}%
            </div>
            <div className="song-row__duration">{song.duration}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSongsTable;
