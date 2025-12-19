import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/query.config';
import api from '@/config/api.config';

// Artist info embedded in song
export interface SongArtist {
  id: number;
  artistName: string;
  profileImage: string | null;
}

// Song detail from API GET /songs/{id}
export interface Song {
  id: number;
  title: string;
  artistId: number;
  genreId: number;
  albumId: number | null;
  duration: number;
  releaseDate: string;
  filePath: string;
  thumbnailPath: string;
  lyricsFilePath: string | null;
  playCount: number;
  likeCount: number;
  createdById: number;
  updatedById: number | null;
  createdAt: string;
  updatedAt: string;
  artist: SongArtist;
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
    return api.get<SongsResponse>('/songs', { params: filters });
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
    mutationFn: (data: Partial<Song>) => songService.createSong(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.songs.all });
    },
  });
};

export const useUpdateSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Song> }) =>
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
    mutationFn: (id: number) => songService.deleteSong(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.songs.all });
    },
  });
};
