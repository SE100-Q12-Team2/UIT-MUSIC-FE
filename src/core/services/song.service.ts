import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/query.config';
import api from '@/config/api.config';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverUrl?: string;
  audioUrl?: string;
  genre?: string;
  releaseDate?: string;
}

export interface SongFilters {
  genre?: string;
  artist?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SongsResponse {
  songs: Song[];
  total: number;
  page: number;
  totalPages: number;
}

export const songService = {
  getSongs: async (filters?: SongFilters): Promise<SongsResponse> => {
    return api.get<SongsResponse>('/api/songs', { params: filters });
  },

  getSongById: async (id: string): Promise<Song> => {
    return api.get<Song>(`/api/songs/${id}`);
  },

  searchSongs: async (query: string): Promise<Song[]> => {
    return api.get<Song[]>('/api/songs/search', { params: { q: query } });
  },

  createSong: async (data: Partial<Song>): Promise<Song> => {
    return api.post<Song>('/api/songs', data);
  },

  updateSong: async (id: string, data: Partial<Song>): Promise<Song> => {
    return api.put<Song>(`/api/songs/${id}`, data);
  },

  deleteSong: async (id: string): Promise<void> => {
    return api.delete<void>(`/api/songs/${id}`);
  },
};

export const useSongs = (filters?: SongFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.songs.list(filters),
    queryFn: () => songService.getSongs(filters),
    enabled: true,
  });
};

export const useSong = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.songs.detail(id),
    queryFn: () => songService.getSongById(id),
    enabled: !!id,
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
    mutationFn: (data: Partial<Song>) => songService.createSong(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.songs.all });
    },
  });
};

export const useUpdateSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Song> }) =>
      songService.updateSong(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.songs.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.songs.all });
    },
  });
};

export const useDeleteSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => songService.deleteSong(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.songs.all });
    },
  });
};
