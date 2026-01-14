import React from 'react';
import { useNavigate } from 'react-router';
import { useTrendingSongs } from '@/core/services/song.service';
import { AddTracksSection } from '@/features/user/playlists/components';
import { AddTrack } from '@/features/user/playlists/components/AddTrackItem';
import { useCarousel, usePlaybackHandler } from '../hooks';
import '@/styles/browser.css';
import '@/styles/playlists.css';

const BrowserPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: trendingResponse, isLoading } = useTrendingSongs();

  const {
    playingSongId,
    isLoadingPlayback,
    currentSong,
    isPlaying,
    handlePlay,
    handlePause,
  } = usePlaybackHandler({ trendingSongs: trendingResponse?.items });

  const {
    carouselSongs,
    currentSlide,
    originalLength,
    handleSlideClick,
  } = useCarousel({
    trendingSongs: trendingResponse?.items,
    currentSongId: currentSong?.id || null,
    isPlaying,
    onSlideChange: () => {
      if (isPlaying) {
        handlePause();
      }
    },
  });

  const handlePlayClick = async (e: React.MouseEvent, songId: number) => {
    e.stopPropagation();
    await handlePlay(songId);
  };

  const handleTrackClick = (track: AddTrack) => {
    console.log('Track clicked:', track);
  };

  const handlePlayTrack = async (trackId: number) => {
    await handlePlay(trackId);
  };

  const handleFavoriteToggle = (trackId: number) => {
    console.log('Toggle favorite:', trackId);
  };

  if (isLoading) {
    return (
      <div className="browser-page">
        <div className="browser-page__loading">Loading tracks...</div>
      </div>
    );
  }

  return (
    <div className="browser-page">
      {/* Carousel Section */}
      {carouselSongs.length > 0 && originalLength > 0 && (
        <div className="browser-carousel">
          <div className="browser-carousel__container">
            <div className="browser-carousel__track">
              {carouselSongs.map((song, index) => {
                const offset = index - currentSlide;
                const isActive = index === currentSlide;
                const absOffset = Math.abs(offset);
                
                // Show more slides on each side (up to 4 on each side for stacking)
                if (absOffset > 4) return null;
                
                // Calculate stacked positioning
                let translateX = 0;
                let translateY = 0;
                let scale = 1;
                let rotateZ = 0;
                
                if (isActive) {
                  // Center card - no transformation
                  translateX = 0;
                  translateY = 0;
                  scale = 1;
                } else if (offset > 0) {
                  // Right side - stack to the right
                  translateX = 200 + (absOffset - 1) * 30;
                  translateY = (absOffset - 1) * 10;
                  scale = 1 - absOffset * 0.08;
                  rotateZ = absOffset * 3;
                } else {
                  // Left side - stack to the left
                  translateX = -200 - (absOffset - 1) * 30;
                  translateY = (absOffset - 1) * 10;
                  scale = 1 - absOffset * 0.08;
                  rotateZ = -absOffset * 3;
                }
                
                return (
                  <div 
                    key={`${song.id}-${index}`}
                    className={`browser-carousel__slide ${isActive ? 'browser-carousel__slide--active' : ''}`}
                    style={{
                      transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotateZ(${rotateZ}deg)`,
                      opacity: absOffset > 3 ? 0.2 : isActive ? 1 : 0.7 - absOffset * 0.15,
                      zIndex: isActive ? 100 : 100 - absOffset,
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onClick={() => !isActive && handleSlideClick(index)}
                  >
                    <div className={`browser-carousel__card ${!isActive ? 'browser-carousel__card--clickable' : ''}`}>
                      <div className="browser-carousel__image-wrapper">
                        <img 
                          src={song.coverImage} 
                          alt={song.title}
                          className="browser-carousel__image"
                        />
                        {isActive && (
                          <button 
                            className="browser-carousel__play"
                            onClick={(e) => handlePlayClick(e, song.id)}
                            disabled={isLoadingPlayback}
                            style={{ opacity: isLoadingPlayback ? 0.6 : 1 }}
                          >
                            {isLoadingPlayback && playingSongId === song.id ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000" className="spinner">
                                <circle cx="12" cy="12" r="10" stroke="#000" strokeWidth="2" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round">
                                  <animateTransform 
                                    attributeName="transform" 
                                    type="rotate" 
                                    from="0 12 12" 
                                    to="360 12 12" 
                                    dur="1s" 
                                    repeatCount="indefinite"
                                  />
                                </circle>
                              </svg>
                            ) : currentSong?.id === song.id && isPlaying ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                                <rect x="6" y="4" width="4" height="16" rx="1"/>
                                <rect x="14" y="4" width="4" height="16" rx="1"/>
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                      <div className="browser-carousel__info">
                        <h3 
                          className="browser-carousel__title cursor-pointer hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/songs/${song.id}`);
                          }}
                        >
                          {song.title}
                        </h3>
                        <p className="browser-carousel__artist">{song.artist}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Tracks Section - Use component from playlist page */}
      <AddTracksSection 
        onTrackClick={handleTrackClick}
        onPlayTrack={handlePlayTrack}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </div>
  );
};

export default BrowserPage;
