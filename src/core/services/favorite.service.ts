import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/query.config';
import api from '@/config/api.config';
import { Song } from './song.service';

export interface FavoriteSong extends Song {
  favoritedAt?: string;
}

export interface FavoritesResponse {
  songs: FavoriteSong[];
  total: number;
}

export const favoriteService = {
  getFavorites: async (): Promise<FavoritesResponse> => {
    return api.get<FavoritesResponse>('/favorites');
  },

  addToFavorites: async (songId: string): Promise<void> => {
    return api.post<void>('/favorites', { songId });
  },

  removeFromFavorites: async (songId: string): Promise<void> => {
    return api.delete<void>(`/favorites/${songId}`);
  },

  isFavorite: async (songId: string): Promise<boolean> => {
    try {
      const response = await api.get<{ isFavorite: boolean }>(`/favorites/${songId}/check`);
      return response.isFavorite;
    } catch {
      return false;
    }
  },
};

export const useFavorites = () => {
  return useQuery({
    queryKey: QUERY_KEYS.user.favorites,
    queryFn: () => favoriteService.getFavorites(),
    enabled: true,
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (songId: string) => favoriteService.addToFavorites(songId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.favorites });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (songId: string) => favoriteService.removeFromFavorites(songId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.favorites });
    },
  });
};

