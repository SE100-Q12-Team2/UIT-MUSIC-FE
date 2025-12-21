import React from 'react';
import { FeaturedCard, FeaturedItem, BrowseTrack } from '../components';
import '@/styles/browser.css';

// Import sample music icon
import sampleMusicIcon from '@/assets/sample-music-icon.png';

// Mock featured item
const featuredItem: FeaturedItem = {
  id: 1,
  title: 'Ma Meilleure Ennemie',
  artist: 'Singer',
  coverImage: sampleMusicIcon,
};

// Mock tracks for column 1
const tracksColumn1: BrowseTrack[] = [
  {
    id: 1,
    title: 'Chihiro',
    artist: 'Billie Eilish',
    album: 'Hit Me Hard and soft',
    duration: 228,
    coverImage: sampleMusicIcon,
  },
  {
    id: 2,
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bi...',
    album: 'STAY',
    duration: 228,
    coverImage: sampleMusicIcon,
  },
  {
    id: 3,
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    duration: 228,
    coverImage: sampleMusicIcon,
  },
];

// Mock tracks for column 2
const tracksColumn2: BrowseTrack[] = [
  {
    id: 4,
    title: 'Artisty',
    artist: 'Jacob Lee',
    album: 'Conscious Sessions',
    duration: 228,
    coverImage: sampleMusicIcon,
  },
  {
    id: 5,
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 228,
    coverImage: sampleMusicIcon,
  },
  {
    id: 6,
    title: 'Flowers',
    artist: 'Miley Cyrus',
    album: 'Endless Summer Vacati...',
    duration: 228,
    coverImage: sampleMusicIcon,
  },
];

// Mock tracks for column 3
const tracksColumn3: BrowseTrack[] = [
  {
    id: 7,
    title: 'Ma Meilleure En',
    artist: 'Stromae & Pomme',
    album: '',
    duration: 228,
    coverImage: sampleMusicIcon,
  },
  {
    id: 8,
    title: 'First Class',
    artist: 'Jack Harlow',
    album: '',
    duration: 228,
    coverImage: sampleMusicIcon,
  },
  {
    id: 9,
    title: 'About Damn Time',
    artist: 'Lizzo',
    album: '',
    duration: 228,
    coverImage: sampleMusicIcon,
  },
];

const BrowserPage: React.FC = () => {
  const handleFeaturedClick = (item: FeaturedItem) => {
    console.log('Featured clicked:', item);
  };

  const handleFeaturedPlay = (item: FeaturedItem) => {
    console.log('Play featured:', item);
  };

  const handleTrackClick = (track: BrowseTrack) => {
    console.log('Track clicked:', track);
  };

  const handleTrackMore = (track: BrowseTrack) => {
    console.log('Track more:', track);
  };

  return (
    <div className="browser-page">
      {/* Featured Section */}
      <div className="browser-page__featured">
        <FeaturedCard
          item={featuredItem}
          onClick={handleFeaturedClick}
          onPlay={handleFeaturedPlay}
        />
      </div>

      {/* Add Tracks Section */}
      <div className="browser-page__tracks-section">
        <div className="browser-page__tracks-header">
          <h2 className="browser-page__tracks-title">Add Tracks To Your Playlists</h2>
          <button className="browser-page__see-all">See All</button>
        </div>
        <div className="browser-page__tracks-grid">
          {/* Column 1 */}
          <div className="browser-page__tracks-column">
            {tracksColumn1.map((track) => (
              <div key={track.id} className="browse-track-item" onClick={() => handleTrackClick(track)}>
                <img
                  src={track.coverImage}
                  alt={track.title}
                  className="browse-track-item__image"
                />
                <div className="browse-track-item__info">
                  <span className="browse-track-item__title">{track.title}</span>
                  <span className="browse-track-item__artist">{track.artist}</span>
                </div>
                <div className="browse-track-item__album">{track.album}</div>
                <div className="browse-track-item__duration">3:48</div>
                <button 
                  className="browse-track-item__more"
                  onClick={(e) => { e.stopPropagation(); handleTrackMore(track); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <circle cx="12" cy="5" r="1"/>
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="12" cy="19" r="1"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="browser-page__tracks-column">
            {tracksColumn2.map((track) => (
              <div key={track.id} className="browse-track-item" onClick={() => handleTrackClick(track)}>
                <img
                  src={track.coverImage}
                  alt={track.title}
                  className="browse-track-item__image"
                />
                <div className="browse-track-item__info">
                  <span className="browse-track-item__title">{track.title}</span>
                  <span className="browse-track-item__artist">{track.artist}</span>
                </div>
                <div className="browse-track-item__album">{track.album}</div>
                <div className="browse-track-item__duration">3:48</div>
                <button 
                  className="browse-track-item__more"
                  onClick={(e) => { e.stopPropagation(); handleTrackMore(track); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <circle cx="12" cy="5" r="1"/>
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="12" cy="19" r="1"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="browser-page__tracks-column">
            {tracksColumn3.map((track) => (
              <div key={track.id} className="browse-track-item" onClick={() => handleTrackClick(track)}>
                <img
                  src={track.coverImage}
                  alt={track.title}
                  className="browse-track-item__image"
                />
                <div className="browse-track-item__info">
                  <span className="browse-track-item__title">{track.title}</span>
                  <span className="browse-track-item__artist">{track.artist}</span>
                </div>
                <div className="browse-track-item__album">{track.album}</div>
                <div className="browse-track-item__duration">3:48</div>
                <button 
                  className="browse-track-item__more"
                  onClick={(e) => { e.stopPropagation(); handleTrackMore(track); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <circle cx="12" cy="5" r="1"/>
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="12" cy="19" r="1"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserPage;
