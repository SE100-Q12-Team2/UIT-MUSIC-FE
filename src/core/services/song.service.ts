import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/query.config';
import api from '@/config/api.config';

// Artist info embedded in song
export interface SongArtist {
  id: number;
  artistName: string;
  profileImage: string;
}

// Song artist with role
export interface SongArtistWithRole {
  artistId: number;
  songId: number;
  role: 'MainArtist' | 'FeaturedArtist' | 'Composer' | 'Producer';
  artist: SongArtist;
}

// Album info
export interface SongAlbum {
  id: number;
  albumTitle: string;
  coverImage: string;
}

// Genre info
export interface SongGenre {
  id: number;
  genreName: string;
}

// Label info
export interface SongLabel {
  id: number;
  labelName: string;
}

// Asset info
export interface SongAsset {
  id: number;
  bucket: string;
  keyMaster: string;
}

// Song detail from API GET /songs
export interface Song {
  id: number;
  title: string;
  description: string;
  duration: number;
  language: string;
  lyrics: string;
  albumId: number;
  genreId: number;
  labelId: number;
  uploadDate: string;
  isActive: boolean;
  copyrightStatus: 'Clear' | 'Pending' | 'Disputed';
  playCount: number;
  isFavorite: boolean;
  songArtists: SongArtistWithRole[];
  album: SongAlbum;
  genre: SongGenre;
  label: SongLabel;
  asset?: SongAsset;
}

// Contributor info for trending songs
export interface TrendingSongContributor {
  songId: number;
  labelId: number;
  role: string;
  label: SongLabel;
}

// Trending song from API GET /songs/trending
export interface TrendingSong {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  language: string | null;
  lyrics: string | null;
  albumId: number;
  genreId: number;
  labelId: number;
  uploadDate: string;
  isActive: boolean;
  copyrightStatus: 'Clear' | 'Disputed' | 'Violation';
  playCount: number;
  contributors: TrendingSongContributor[];
  album: SongAlbum;
  genre: SongGenre;
  label: SongLabel;
  asset?: SongAsset;
  favorites: any[];
}

export interface SongFilters {
  page?: number;
  limit?: number;
  order?: 'latest' | 'oldest' | 'popular';
}

export interface SongsResponse {
  items: Song[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TrendingSongsResponse {
  items: TrendingSong[];
}

export const songService = {
  getSongs: async (filters?: SongFilters): Promise<SongsResponse> => {
    return api.get<SongsResponse>('/songs', { params: filters });
  },

  getTrendingSongs: async (): Promise<TrendingSongsResponse> => {
    return api.get<TrendingSongsResponse>('/songs/trending');
  },

  getSongById: async (id: number): Promise<Song> => {
    return api.get<Song>(`/songs/${id}`);
  },

  searchSongs: async (query: string): Promise<Song[]> => {
    return api.get<Song[]>('/songs/search', { params: { q: query } });
  },

  createSong: async (data: Partial<Song>): Promise<Song> => {
    return api.post<Song>('/songs', data);
  },

  updateSong: async (id: number, data: Partial<Song>): Promise<Song> => {
    return api.put<Song>(`/songs/${id}`, data);
  },

  deleteSong: async (id: number): Promise<void> => {
    return api.delete<void>(`/songs/${id}`);
  },
};

export const useSongs = (filters?: SongFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.songs.list(filters),
    queryFn: () => songService.getSongs(filters),
    enabled: true,
  });
};

export const useTrendingSongs = () => {
  return useQuery({
    queryKey: ['songs', 'trending'],
    queryFn: () => songService.getTrendingSongs(),
    enabled: true,
  });
};

export const useSong = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.songs.detail(id),
    queryFn: () => songService.getSongById(id),
    enabled: !!id && id > 0,
  });
};

// Hook to fetch multiple songs by IDs
export const useSongsByIds = (songIds: number[]) => {
  return useQuery({
    queryKey: ['songs', 'byIds', songIds],
    queryFn: async () => {
      const songs = await Promise.all(
        songIds.map((id) => songService.getSongById(id))
      );
      return songs;
    },
    enabled: songIds.length > 0,
  });
};

export const useSearchSongs = (query: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.songs.search(query),
    queryFn: () => songService.searchSongs(query),
    enabled: query.length > 0,
  });
};

export const useCreateSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Song>) => {
      return songService.createSong(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.songs.all });
      queryClient.invalidateQueries({ queryKey: ['label-songs'] });
    },
  });
};

export const useUpdateSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Song> }) => {
      return songService.updateSong(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.songs.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.songs.all });
      queryClient.invalidateQueries({ queryKey: ['label-songs'] });
    },
  });
};

export const useDeleteSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return songService.deleteSong(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.songs.all });
      queryClient.invalidateQueries({ queryKey: ['label-songs'] });
    },
  });
};
