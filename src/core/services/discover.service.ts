import { useQuery } from '@tanstack/react-query';
import api from '@/config/api.config';
import { Song } from './song.service';

export interface Genre {
  id: string;
  name: string;
  coverUrl?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  followers?: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  trackCount?: number;
  releaseDate?: string;
}

export interface DiscoverResponse {
  featuredSongs: Song[];
  trendingSongs: Song[];
  newReleases: Album[];
  topArtists: Artist[];
  genres: Genre[];
  recentlyPlayed: Song[];
  recommendedPlaylists: Array<{
    id: string;
    name: string;
    coverUrl?: string;
    trackCount: number;
  }>;
}

export const discoverService = {
  getDiscover: async (): Promise<DiscoverResponse> => {
    return api.get<DiscoverResponse>('/discover');
  },

  getTrending: async (): Promise<Song[]> => {
    return api.get<Song[]>('/discover/trending');
  },

  getNewReleases: async (): Promise<Album[]> => {
    return api.get<Album[]>('/discover/new-releases');
  },

  getTopArtists: async (): Promise<Artist[]> => {
    return api.get<Artist[]>('/discover/top-artists');
  },

  getGenres: async (): Promise<Genre[]> => {
    return api.get<Genre[]>('/discover/genres');
  },

  getRecentlyPlayed: async (): Promise<Song[]> => {
    return api.get<Song[]>('/discover/recently-played');
  },
};

export const useDiscover = () => {
  return useQuery({
    queryKey: ['discover'],
    queryFn: () => discoverService.getDiscover(),
    enabled: true,
  });
};

export const useTrending = () => {
  return useQuery({
    queryKey: ['discover', 'trending'],
    queryFn: () => discoverService.getTrending(),
    enabled: true,
  });
};

export const useNewReleases = () => {
  return useQuery({
    queryKey: ['discover', 'new-releases'],
    queryFn: () => discoverService.getNewReleases(),
    enabled: true,
  });
};

export const useTopArtists = () => {
  return useQuery({
    queryKey: ['discover', 'top-artists'],
    queryFn: () => discoverService.getTopArtists(),
    enabled: true,
  });
};

export const useGenres = () => {
  return useQuery({
    queryKey: ['discover', 'genres'],
    queryFn: () => discoverService.getGenres(),
    enabled: true,
  });
};

export const useRecentlyPlayed = () => {
  return useQuery({
    queryKey: ['discover', 'recently-played'],
    queryFn: () => discoverService.getRecentlyPlayed(),
    enabled: true,
  });
};

