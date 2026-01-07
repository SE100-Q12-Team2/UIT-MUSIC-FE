import { useMemo } from 'react';
import { useRecentlyPlayed } from '@/core/services/listening-history.service';
import { usePersonalizedRecommendations, useDailyMix, useDiscoverWeekly } from '@/core/services/recommendation.service';
import { RecommendationSong, RecommendationMix } from '@/types/recommendation.types';
import { RecentlyPlayedSong } from '@/types/listening-history.api';

// UI types
export interface BannerData {
  id: string;
  title: string;
  coverUrl: string;
  accent: string;
}

export interface PlaylistData {
  id: string;
  title: string;
  subtitle?: string;
  coverUrl: string;
  [key: string]: unknown;
}

export interface SongData {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  coverUrl: string;
  isLiked?: boolean;
}

const transformSongToUI = (song: RecommendationSong): SongData => {
  const artists = song.contributors?.map((contributor) => contributor.label.artistName).join(', ') || 'Unknown Artist';
  const durationInSeconds = song.duration || 0;
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  return {
    id: song.id.toString(),
    title: song.title,
    artist: artists,
    album: song.album?.albumTitle,
    duration,
    coverUrl: song.album?.coverImage || `https://picsum.photos/id/${song.id}/300/300`,
    isLiked: song.isFavorite || false,
  };
};

const transformMixToPlaylist = (mix: RecommendationMix): PlaylistData => {
  let coverUrl = '';
  
  const songWithCover = mix.songs.find(song => song.album?.coverImage);
  
  if (songWithCover?.album?.coverImage) {
    coverUrl = songWithCover.album.coverImage;
  } else {
    coverUrl = `https://picsum.photos/seed/${mix.id}/300/300`;
  }
  
  return {
    id: mix.id,
    title: mix.title,
    subtitle: `${mix.songs.length} Tracks`,
    coverUrl,
  };
};

const transformRecentlyPlayedToBanner = (song: RecentlyPlayedSong, index: number): BannerData => {
  const accents = ['from-blue-900 to-black', 'from-purple-900 to-black', 'from-orange-900 to-black'];
  const titles = ['Recently Listened', 'Most Listened', 'Liked Tracks'];
  
  return {
    id: song.songId.toString(),
    title: titles[index] || 'Your Music',
    coverUrl: song.coverImageUrl || `https://picsum.photos/id/${song.songId}/600/300`,
    accent: accents[index % accents.length],
  };
};


export function useHomeData() {
  const { data: recentlyPlayedData, isLoading: recentlyPlayedLoading } = useRecentlyPlayed(3);
  const { data: personalizedData, isLoading: personalizedLoading } = usePersonalizedRecommendations(30);
  const { data: dailyMixData, isLoading: dailyMixLoading } = useDailyMix();
  const { data: discoverWeeklyData, isLoading: discoverWeeklyLoading } = useDiscoverWeekly();

  const recentlyPlayedBanners = useMemo(() => {
    if (!recentlyPlayedData?.data) {
      return [];
    }
    try {
      return recentlyPlayedData.data.slice(0, 3).map((song: RecentlyPlayedSong, idx: number) => 
        transformRecentlyPlayedToBanner(song, idx)
      );
    } catch (error) {
      console.error('❌ Error transforming recently played:', error);
      return [];
    }
  }, [recentlyPlayedData]);

  const tailoredPlaylists = useMemo(() => {
    if (!dailyMixData?.mixes) {
      return [];
    }
    try {
      const playlists = dailyMixData.mixes.slice(0, 5).map(transformMixToPlaylist);
      return playlists;
    } catch (error) {
      console.error('❌ Error transforming daily mix:', error);
      return [];
    }
  }, [dailyMixData]);

  const personalSpace = useMemo(() => {
    if (!personalizedData || !Array.isArray(personalizedData)) {
      return [];
    }
    try {
      const spaces = personalizedData.slice(0, 5).map(song => {
        // Get album cover with fallback
        const albumCover = song.album?.coverImage;
        const fallbackUrl = `https://picsum.photos/seed/song-${song.id}/300/300`;
        
        return {
          id: song.id.toString(),
          title: song.title,
          subtitle: `${song.playCount || 0} Plays`,
          coverUrl: albumCover || fallbackUrl,
        };
      });
      return spaces;
    } catch (error) {
      console.error('❌ Error transforming personalized data:', error);
      return [];
    }
  }, [personalizedData]);

  const dailyPickSongs = useMemo(() => {
    if (!discoverWeeklyData || !Array.isArray(discoverWeeklyData)) {
      return [];
    }
    try {
      return discoverWeeklyData.slice(0, 5).map(transformSongToUI);
    } catch (error) {
      console.error('❌ Error transforming discover weekly:', error);
      return [];
    }
  }, [discoverWeeklyData]);

  const isLoading = recentlyPlayedLoading || personalizedLoading || dailyMixLoading || discoverWeeklyLoading;

  return {
    recentlyPlayedBanners,
    tailoredPlaylists,
    personalSpace,
    dailyPickSongs,
    isLoading,
    loadingStates: {
      recentlyPlayed: recentlyPlayedLoading,
      personalized: personalizedLoading,
      dailyMix: dailyMixLoading,
      discoverWeekly: discoverWeeklyLoading,
    },
    raw: {
      recentlyPlayed: recentlyPlayedData,
      personalized: personalizedData,
      dailyMix: dailyMixData,
      discoverWeekly: discoverWeeklyData,
    }
  };
}
