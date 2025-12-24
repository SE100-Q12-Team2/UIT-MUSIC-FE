import React, { useState, useMemo } from 'react';
import { useTrendingSongs } from '@/core/services/song.service';
import { AddTracksSection } from '@/features/user/playlists/components';
import { AddTrack } from '@/features/user/playlists/components/AddTrackItem';
import '@/styles/browser.css';

// Import sample music icon
import sampleMusicIcon from '@/assets/sample-music-icon.png';

interface CarouselSong {
  id: number;
  title: string;
  artist: string;
  coverImage: string;
}

const BrowserPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);
  
  // Fetch trending songs from API for carousel
  const { data: trendingResponse, isLoading } = useTrendingSongs();

  // Convert trending songs to carousel format with infinite loop
  const carouselSongs: CarouselSong[] = useMemo(() => {
    if (!trendingResponse?.items || trendingResponse.items.length === 0) {
      return [];
    }

    const songs = trendingResponse.items.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.contributors?.[0]?.label?.labelName || song.label?.labelName || 'Unknown Artist',
      coverImage: song.album?.coverImage || sampleMusicIcon,
    }));

    // For infinite scrolling, duplicate songs at both ends
    // This ensures smooth transition when wrapping around
    if (songs.length > 0) {
      return [...songs, ...songs, ...songs]; // Triple the array for seamless infinite scroll
    }
    return songs;
  }, [trendingResponse]);

  // Start at middle set for infinite scroll
  const originalLength = trendingResponse?.items?.length || 0;
  const initialSlide = originalLength; // Start at second set (middle)

  // Initialize at middle set on first load
  React.useEffect(() => {
    if (originalLength > 0 && currentSlide === 0) {
      setCurrentSlide(initialSlide);
    }
  }, [originalLength, initialSlide, currentSlide]);

  const handlePlayClick = (e: React.MouseEvent, songId: number) => {
    e.stopPropagation();
    setPlayingSongId(playingSongId === songId ? null : songId);
    console.log('Play song:', songId);
  };

  const handleSlideClick = (index: number) => {
    // Smooth transition to clicked slide
    setCurrentSlide(index);
    
    // Handle infinite loop wrapping
    setTimeout(() => {
      if (originalLength > 0) {
        // If we're in the first set, jump to middle set
        if (index < originalLength) {
          setCurrentSlide(index + originalLength);
        }
        // If we're in the last set, jump to middle set
        else if (index >= originalLength * 2) {
          setCurrentSlide(index - originalLength);
        }
      }
    }, 500); // Wait for transition to complete
  };

  const handleTrackClick = (track: AddTrack) => {
    console.log('Track clicked:', track);
  };

  const handleFavoriteToggle = (trackId: number) => {
    console.log('Toggle favorite:', trackId);
  };

  const handleMoreClick = (trackId: number) => {
    console.log('More clicked:', trackId);
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
                          >
                            {playingSongId === song.id ? (
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
                        <h3 className="browser-carousel__title">{song.title}</h3>
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
        onFavoriteToggle={handleFavoriteToggle}
        onMoreClick={handleMoreClick}
      />
    </div>
  );
};

export default BrowserPage;
