/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Song } from '@/core/services/song.service';
import { toast } from 'sonner';

// Extended Song type with optional audioUrl for compatibility
interface SongWithAudioUrl extends Song {
  audioUrl?: string;
}

interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  isExpanded: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Song[];
  currentIndex: number;
  isShuffled: boolean;
  isRepeated: boolean;
  play: (song: Song, queue?: Song[]) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  togglePlayPause: () => void;
  toggleExpanded: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  setFetchPlaybackUrl: (callback: (songId: number) => Promise<string | null>) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  }
  return context;
};

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export const MusicPlayerProvider: React.FC<MusicPlayerProviderProps> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const fetchPlaybackUrlCallbackRef = useRef<((songId: number) => Promise<string | null>) | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const next = React.useCallback(async () => {
    if (queue.length === 0) return;

    let nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      nextIndex = isRepeated ? 0 : currentIndex;
    }

    if (nextIndex !== currentIndex && queue[nextIndex]) {
      setCurrentIndex(nextIndex);
      const song = queue[nextIndex];
      if (audioRef.current) {
        setCurrentSong(song);
        const songWithAudio = song as SongWithAudioUrl;
        let audioUrl = songWithAudio.audioUrl;
        
        if (!audioUrl && fetchPlaybackUrlCallbackRef.current) {
          try {
            const fetchedUrl = await fetchPlaybackUrlCallbackRef.current(song.id);
            if (fetchedUrl) {
              audioUrl = fetchedUrl;
            }
          } catch (error) {
            console.error('Error fetching playback URL:', error);
          }
        }
        
        // Fallback to asset.keyMaster if still no URL
        if (!audioUrl && song.asset?.keyMaster) {
          audioUrl = `${import.meta.env.VITE_API_BASE_URL || ''}/files/${song.asset.keyMaster}`;
        }        
        if (!audioUrl) {
          console.error('No audio URL available for song:', song.id);
          return;
        }
        
        audioRef.current.src = audioUrl;
        audioRef.current.volume = volume;
        audioRef.current.play().then(() => setIsPlaying(true)).catch((error) => {
          console.error('Error playing next song:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [queue, currentIndex, isRepeated, volume]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeated) {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeated, next, setCurrentTime, setDuration]);

  const play = (song: Song, newQueue?: Song[]) => {
    // Ensure audioRef is initialized
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    
    if (newQueue) {
      setQueue(newQueue);
      const index = newQueue.findIndex(s => s.id === song.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }
    setCurrentSong(song);
    
    // Support both audioUrl (extended) and asset.keyMaster (from API)
    const songWithAudio = song as SongWithAudioUrl;
    
    let audioUrl = songWithAudio.audioUrl;
    
    if (!audioUrl && song.asset?.keyMaster) {
      const s3Bucket = song.asset.bucket || import.meta.env.VITE_S3_BUCKET_NAME;
      const s3Region = import.meta.env.VITE_S3_REGION || 'ap-southeast-1';
      audioUrl = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${song.asset.keyMaster}`;
    }
    
    if (!audioUrl) {
      console.error('❌ No audio URL available for song:', song.title);
      toast.error('Audio file not available');
      return;
    }
    
    console.log('🎵 Playing audio from:', audioUrl);
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.volume = volume;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
          console.error('Audio URL:', audioUrl);
          toast.error('Failed to play audio');
        });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };


  const previous = React.useCallback(async () => {
    if (queue.length === 0) return;

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = isRepeated ? queue.length - 1 : 0;
    }

    if (prevIndex !== currentIndex && queue[prevIndex]) {
      setCurrentIndex(prevIndex);
      const song = queue[prevIndex];
      if (audioRef.current) {
        setCurrentSong(song);
        const songWithAudio = song as SongWithAudioUrl;
        let audioUrl = songWithAudio.audioUrl;
        
        if (!audioUrl && fetchPlaybackUrlCallbackRef.current) {
          try {
            const fetchedUrl = await fetchPlaybackUrlCallbackRef.current(song.id);
            if (fetchedUrl) {
              audioUrl = fetchedUrl;
            }
          } catch (error) {
            console.error('Error fetching playback URL:', error);
          }
        }
        
        // Fallback to asset.keyMaster if still no URL
        if (!audioUrl && song.asset?.keyMaster) {
          audioUrl = `${import.meta.env.VITE_API_BASE_URL || ''}/files/${song.asset.keyMaster}`;
        }
        
        
        if (!audioUrl) {
          console.error('No audio URL available for song:', song.id);
          return;
        }
        
        audioRef.current.src = audioUrl;
        audioRef.current.volume = volume;
        audioRef.current.play().then(() => setIsPlaying(true)).catch((error) => {
          console.error('Error playing previous song:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [queue, currentIndex, isRepeated, volume]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSetVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSetCurrentTime = (time: number) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setIsRepeated(!isRepeated);
  };

  const addToQueue = (song: Song) => {
    setQueue(prev => [...prev, song]);
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(0);
  };

  const setFetchPlaybackUrl = (callback: (songId: number) => Promise<string | null>) => {
    fetchPlaybackUrlCallbackRef.current = callback;
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        isExpanded,
        currentTime,
        duration,
        volume,
        queue,
        currentIndex,
        isShuffled,
        isRepeated,
        play,
        pause,
        resume,
        togglePlayPause,
        next,
        previous,
        toggleExpanded,
        setVolume: handleSetVolume,
        setCurrentTime: handleSetCurrentTime,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        setFetchPlaybackUrl,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

