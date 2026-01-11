import { useState, useCallback, useEffect } from 'react';
import { TrendingSong, Song } from '@/core/services/song.service';
import { useGetPlaybackUrl } from '@/core/services/playback.service';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

// Extended Song type with optional audioUrl for compatibility
interface SongWithAudioUrl extends Song {
  audioUrl?: string;
}

interface UsePlaybackHandlerProps {
  trendingSongs: TrendingSong[] | undefined;
}

export const usePlaybackHandler = ({ trendingSongs }: UsePlaybackHandlerProps) => {
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);
  const { play, pause, currentSong, isPlaying, setFetchPlaybackUrl } = useMusicPlayer();
  const { mutateAsync: getPlaybackUrl, isPending: isLoadingPlayback } = useGetPlaybackUrl();

  // Set up the playback URL fetcher callback for next/previous functionality
  const fetchPlaybackUrlForSong = useCallback(async (songId: number): Promise<string | null> => {
    try {
      const response = await getPlaybackUrl({ 
        songId, 
        options: { quality: 'hls' } 
      });
      
      if (response.ok && response.url) {
        return response.url;
      }
      return null;
    } catch (error) {
      console.error('Error fetching playback URL:', error);
      return null;
    }
  }, [getPlaybackUrl]);

  useEffect(() => {
    setFetchPlaybackUrl(fetchPlaybackUrlForSong);
  }, [fetchPlaybackUrlForSong, setFetchPlaybackUrl]);

  // Convert TrendingSong to Song with all required fields
  const convertToSong = useCallback((song: TrendingSong, audioUrl: string): SongWithAudioUrl => {
    return {
      ...song,
      description: song.description || '',
      language: song.language || '',
      lyrics: song.lyrics || '',
      copyrightStatus: song.copyrightStatus as any,
      audioUrl,
      contributors: song.contributors?.map((c: any) => ({
        labelId: c.labelId,
        songId: song.id,
        role: c.role,
        label: {
          id: c.label.id,
          artistName: c.label.labelName,
          labelName: c.label.labelName,
        },
      })) || [],
      // contributors already exists in song, no need to recreate
    };
  }, []);

  // Create queue from trending songs
  const createQueue = useCallback((currentSongId: number, audioUrl: string): SongWithAudioUrl[] => {
    return trendingSongs?.map(s => ({
      ...s,
      description: s.description || '',
      language: s.language || '',
      lyrics: s.lyrics || '',
      copyrightStatus: s.copyrightStatus as any,
      audioUrl: s.id === currentSongId ? audioUrl : undefined,
      contributors: s.contributors?.map((c: any) => ({
        labelId: c.labelId,
        songId: s.id,
        role: c.role,
        label: {
          id: c.label.id,
          artistName: c.label.labelName,
          labelName: c.label.labelName,
        },
      })) || [],
    })) || [];
  }, [trendingSongs]);

  const handlePlay = useCallback(async (songId: number) => {
    if (currentSong?.id === songId && isPlaying) {
      pause();
      setPlayingSongId(null);
      return;
    }
    
    setPlayingSongId(songId);
    
    try {
      const song = trendingSongs?.find(s => s.id === songId);
      if (!song) {
        console.error('Song not found');
        setPlayingSongId(null);
        return;
      }
      
      const playbackResponse = await getPlaybackUrl({ 
        songId, 
        options: { quality: 'hls' } 
      });
      
      if (!playbackResponse.ok || !playbackResponse.url) {
        console.error('Failed to get playback URL:', playbackResponse.reason);
        setPlayingSongId(null);
        return;
      }
      
      const songWithAudio = convertToSong(song, playbackResponse.url);
      const queueSongs = createQueue(songId, playbackResponse.url);
      
      play(songWithAudio, queueSongs);
    } catch (error) {
      console.error('Error playing song:', error);
      setPlayingSongId(null);
    }
  }, [currentSong, isPlaying, trendingSongs, getPlaybackUrl, convertToSong, createQueue, play, pause]);

  const handlePause = useCallback(() => {
    pause();
    setPlayingSongId(null);
  }, [pause]);

  return {
    playingSongId,
    isLoadingPlayback,
    currentSong,
    isPlaying,
    handlePlay,
    handlePause,
  };
};
