import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/query.config';
import api from '@/config/api.config';
import { Song, SongFilters, SongsResponse, TrendingSongsQuery, TrendingSongsResponse, TrendingSong } from '@/types/song.types';

export type { Song, TrendingSong };


export const songService = {
  getSongs: async (filters?: SongFilters): Promise<SongsResponse> => {
    return api.get<SongsResponse>('/songs', { params: filters });
  },

  getTrendingSongs: async (query?: TrendingSongsQuery): Promise<TrendingSongsResponse> => {
    return api.get<TrendingSongsResponse>('/songs/trending', { params: query });
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

export const useTrendingSongs = (query?: TrendingSongsQuery) => {
  return useQuery({
    queryKey: ['songs', 'trending', query],
    queryFn: () => songService.getTrendingSongs(query),
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
  // Create a stable key by sorting and joining
  const sortedIds = [...songIds].sort((a, b) => a - b);
  const idsKey = sortedIds.join(',');
  
  return useQuery({
    queryKey: ['songs', 'byIds', idsKey],
    queryFn: async () => {
      if (songIds.length === 0) {
        return [];
      }
      const songs = await Promise.all(
        songIds.map((id) => songService.getSongById(id))
      );
      return songs;
    },
    enabled: songIds.length > 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
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
