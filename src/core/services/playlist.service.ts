import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/query.config';
import api from '@/config/api.config';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  trackCount: number;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  isPublic?: boolean;
}

export interface PlaylistFilters {
  userId?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PlaylistsResponse {
  playlists: Playlist[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PlaylistDetail extends Playlist {
  songs: Array<{
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    coverUrl?: string;
    audioUrl?: string;
  }>;
}

export const playlistService = {
  getPlaylists: async (filters?: PlaylistFilters): Promise<PlaylistsResponse> => {
    return api.get<PlaylistsResponse>('/playlists', { params: filters });
  },

  getPlaylistById: async (id: string): Promise<PlaylistDetail> => {
    return api.get<PlaylistDetail>(`/playlists/${id}`);
  },

  createPlaylist: async (data: Partial<Playlist>): Promise<Playlist> => {
    return api.post<Playlist>('/playlists', data);
  },

  updatePlaylist: async (id: string, data: Partial<Playlist>): Promise<Playlist> => {
    return api.patch<Playlist>(`/playlists/${id}`, data);
  },

  deletePlaylist: async (id: string): Promise<void> => {
    return api.delete<void>(`/playlists/${id}`);
  },

  addSongToPlaylist: async (playlistId: string, songId: string): Promise<void> => {
    return api.post<void>(`/playlists/${playlistId}/songs`, { songId });
  },

  removeSongFromPlaylist: async (playlistId: string, songId: string): Promise<void> => {
    return api.delete<void>(`/playlists/${playlistId}/songs/${songId}`);
  },
};

export const usePlaylists = (filters?: PlaylistFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.playlists.list(filters),
    queryFn: () => playlistService.getPlaylists(filters),
    enabled: true,
  });
};

export const usePlaylist = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.playlists.detail(id),
    queryFn: () => playlistService.getPlaylistById(id),
    enabled: !!id,
  });
};

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Playlist>) => playlistService.createPlaylist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists.all });
    },
  });
};

export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Playlist> }) =>
      playlistService.updatePlaylist(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists.all });
    },
  });
};

export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => playlistService.deletePlaylist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists.all });
    },
  });
};

export const useAddSongToPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, songId }: { playlistId: string; songId: string }) =>
      playlistService.addSongToPlaylist(playlistId, songId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists.detail(variables.playlistId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists.all });
    },
  });
};

export const useRemoveSongFromPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, songId }: { playlistId: string; songId: string }) =>
      playlistService.removeSongFromPlaylist(playlistId, songId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists.detail(variables.playlistId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists.all });
    },
  });
};

