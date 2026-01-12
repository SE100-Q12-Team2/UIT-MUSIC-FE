import { useMemo } from 'react';
import { useRecentlyPlayed } from '@/core/services/listening-history.service';
import { usePersonalizedRecommendations, useDailyMix, useDiscoverWeekly } from '@/core/services/recommendation.service';
import { useTrendingSongs } from '@/core/services/song.service';
import { useGenres } from '@/core/services/genre.service';
import { useFollows } from '@/core/services/follow.service';
import { useAlbums } from '@/core/services/album.service';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { RecommendationSong, RecommendationMix } from '@/types/recommendation.types';
import { RecentlyPlayedSong } from '@/types/listening-history.api';
import { TrendingSong } from '@/core/services/song.service';
import { Genre } from '@/core/services/genre.service';
import { FollowItem } from '@/core/services/follow.service';
import { Album } from '@/core/services/album.service';

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

export interface GenreData {
  id: string;
  title: string;
  coverUrl: string;
}

export interface ArtistData {
  id: string;
  name: string;
  imageUrl: string;
}

export interface AlbumData {
  id: string;
  title: string;
  subtitle: string;
  coverUrl: string;
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
  let albumId = '';
  
  const firstSong = mix.songs[0];
  if (firstSong?.album) {
    albumId = firstSong.album.id.toString();
    coverUrl = firstSong.album.coverImage || `https://picsum.photos/seed/${mix.id}/300/300`;
  } else {
    albumId = mix.id;
    coverUrl = `https://picsum.photos/seed/${mix.id}/300/300`;
  }
  
  return {
    id: albumId,
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

const transformTrendingSongToUI = (song: TrendingSong): SongData => {
  // TrendingSong contributors have label with labelName, not artistName
  const artists = song.contributors?.map((contributor: any) => contributor.label.labelName).join(', ') || 'Unknown Artist';
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
    isLiked: song.favorites && song.favorites.length > 0,
  };
};

const transformGenreToUI = (genre: Genre): GenreData => {
  return {
    id: genre.id.toString(),
    title: genre.genreName,
    coverUrl: `https://picsum.photos/seed/genre-${genre.id}/400/150`,
  };
};

const transformFollowToArtist = (follow: FollowItem): ArtistData => {
  return {
    id: follow.target.id.toString(),
    name: follow.target.artistName,
    imageUrl: follow.target.profileImage || `https://picsum.photos/seed/artist-${follow.target.id}/300/300`,
  };
};

const transformAlbumToUI = (album: Album): AlbumData => {
  return {
    id: album.id.toString(),
    title: album.albumTitle,
    subtitle: `${album.totalTracks} Tracks`,
    coverUrl: album.coverImage || `https://picsum.photos/seed/album-${album.id}/300/300`,
  };
};


export function useHomeData() {
  const { user } = useAuth();
  const { data: recentlyPlayedData, isLoading: recentlyPlayedLoading } = useRecentlyPlayed(3);
  const { data: personalizedData, isLoading: personalizedLoading } = usePersonalizedRecommendations(30);
  const { data: dailyMixData, isLoading: dailyMixLoading } = useDailyMix();
  const { data: discoverWeeklyData, isLoading: discoverWeeklyLoading } = useDiscoverWeekly();
  const { data: trendingSongsData, isLoading: trendingSongsLoading } = useTrendingSongs({ limit: 20 });
  const { data: genresData, isLoading: genresLoading } = useGenres({ page: 1, limit: 20 });
  const { data: followsData, isLoading: followsLoading } = useFollows({ 
    userId: user?.id, 
    targetType: 'Artist',
    limit: 20 
  });
  const { data: albumsData, isLoading: albumsLoading } = useAlbums({ page: 1, limit: 20, order: 'latest' });

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
        const albumCover = song.album?.coverImage;
        const fallbackUrl = `https://picsum.photos/seed/song-${song.id}/300/300`;
        
        return {
          id: song.album?.id.toString() || song.id.toString(),
          title: song.album?.albumTitle || song.title,
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

  const trendingSongs = useMemo(() => {
    if (!trendingSongsData?.items || !Array.isArray(trendingSongsData.items)) {
      return [];
    }
    try {
      return trendingSongsData.items.slice(0, 5).map(transformTrendingSongToUI);
    } catch (error) {
      console.error('❌ Error transforming trending songs:', error);
      return [];
    }
  }, [trendingSongsData]);

  const genres = useMemo(() => {
    if (!genresData?.items || !Array.isArray(genresData.items)) {
      return [];
    }
    try {
      return genresData.items.slice(0, 3).map(transformGenreToUI);
    } catch (error) {
      console.error('❌ Error transforming genres:', error);
      return [];
    }
  }, [genresData]);

  const followedArtists = useMemo(() => {
    if (!followsData?.data || !Array.isArray(followsData.data)) {
      return [];
    }
    try {
      // Filter only Artist type follows
      const artistFollows = followsData.data.filter(follow => follow.targetType === 'Artist');
      return artistFollows.slice(0, 5).map(transformFollowToArtist);
    } catch (error) {
      console.error('❌ Error transforming followed artists:', error);
      return [];
    }
  }, [followsData]);

  const recentAlbums = useMemo(() => {
    if (!albumsData?.items || !Array.isArray(albumsData.items)) {
      return [];
    }
    try {
      return albumsData.items.slice(0, 4).map(transformAlbumToUI);
    } catch (error) {
      console.error('❌ Error transforming albums:', error);
      return [];
    }
  }, [albumsData]);

  const isLoading = recentlyPlayedLoading || personalizedLoading || dailyMixLoading || discoverWeeklyLoading || 
                    trendingSongsLoading || genresLoading || followsLoading || albumsLoading;

  return {
    recentlyPlayedBanners,
    tailoredPlaylists,
    personalSpace,
    dailyPickSongs,
    trendingSongs,
    genres,
    followedArtists,
    recentAlbums,
    isLoading,
    loadingStates: {
      recentlyPlayed: recentlyPlayedLoading,
      personalized: personalizedLoading,
      dailyMix: dailyMixLoading,
      discoverWeekly: discoverWeeklyLoading,
      trendingSongs: trendingSongsLoading,
      genres: genresLoading,
      follows: followsLoading,
      albums: albumsLoading,
    },
    raw: {
      recentlyPlayed: recentlyPlayedData,
      personalized: personalizedData,
      dailyMix: dailyMixData,
      discoverWeekly: discoverWeeklyData,
      trendingSongs: trendingSongsData,
      genres: genresData,
      follows: followsData,
      albums: albumsData,
    }
  };
}
