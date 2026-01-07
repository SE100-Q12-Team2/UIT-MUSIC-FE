import { useState, useMemo, useEffect } from 'react';
import { TrendingSong } from '@/core/services/song.service';
import sampleMusicIcon from '@/assets/sample-music-icon.png';

export interface CarouselSong {
  id: number;
  title: string;
  artist: string;
  coverImage: string;
}

interface UseCarouselProps {
  trendingSongs: TrendingSong[] | undefined;
  currentSongId: number | null;
  isPlaying: boolean;
  onSlideChange?: (index: number) => void;
}

export const useCarousel = ({ 
  trendingSongs, 
  currentSongId,
  onSlideChange 
}: UseCarouselProps) => {
  const originalLength = trendingSongs?.length || 0;
  const initialSlide = originalLength; // Start at second set (middle)
  
  // Initialize state directly with correct value
  const [currentSlide, setCurrentSlide] = useState(() => 
    originalLength > 0 ? initialSlide : 0
  );

  // Convert trending songs to carousel format with infinite loop
  const carouselSongs: CarouselSong[] = useMemo(() => {
    if (!trendingSongs || trendingSongs.length === 0) {
      return [];
    }

    const songs = trendingSongs.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.contributors?.[0]?.label?.labelName || song.label?.labelName || 'Unknown Artist',
      coverImage: song.album?.coverImage || sampleMusicIcon,
    }));

    // Triple the array for seamless infinite scroll
    if (songs.length > 0) {
      return [...songs, ...songs, ...songs];
    }
    return songs;
  }, [trendingSongs]);

  // Sync carousel with current playing song - use a ref to track previous songId
  useEffect(() => {
    if (currentSongId && trendingSongs && originalLength > 0) {
      const songIndex = trendingSongs.findIndex(s => s.id === currentSongId);
      if (songIndex !== -1) {
        // Update to middle set + song index for seamless infinite scroll
        // This is intentional UI sync behavior, not data loading
        setCurrentSlide(originalLength + songIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongId]);

  const handleSlideClick = (index: number) => {
    if (onSlideChange) {
      onSlideChange(index);
    }
    
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

  return {
    carouselSongs,
    currentSlide,
    originalLength,
    handleSlideClick,
  };
};
