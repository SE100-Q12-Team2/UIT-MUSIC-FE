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

export interface FavoriteSongsResponse {
  success: boolean;
  data: {
    userId: number;
    songIds: number[];
  };
  message: string;
  meta: {
    timestamp: string;
  };
}

// Actual response from API (without wrapper)
export interface FavoriteSongsData {
  userId: number;
  songIds: number[];
}

// Check favorite response
export interface CheckFavoriteResponse {
  success: boolean;
  data: {
    isFavorite: boolean;
    likedAt?: string;
  };
  message: string;
  meta: {
    timestamp: string;
  };
}

export const favoriteService = {
  getFavorites: async (): Promise<FavoritesResponse> => {
    return api.get<FavoritesResponse>('/favorites');
  },

  getFavoriteSongs: async (userId: number): Promise<FavoriteSongsData> => {
    return api.get<FavoriteSongsData>(`/favorites/songs/${userId}`);
  },

  checkFavorite: async (userId: number, songId: number): Promise<CheckFavoriteResponse> => {
    return api.get<CheckFavoriteResponse>('/favorites/check', { 
      params: { userId, songId } 
    });
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

// React Query hook for user's favorite songs
export const useFavoriteSongs = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['favorites', 'songs', userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID not available');
      return favoriteService.getFavoriteSongs(userId);
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
};

// React Query hook to check if a song is favorited
export const useCheckFavorite = (userId: number | undefined, songId: number | undefined) => {
  return useQuery({
    queryKey: ['favorites', 'check', userId, songId],
    queryFn: async () => {
      if (!userId || !songId) {
        return { isFavorite: false, likedAt: undefined };
      }
      try {
        const result = await favoriteService.checkFavorite(userId, songId);
        return result.data || { isFavorite: false, likedAt: undefined };
      } catch (error) {
        // If API fails or returns error, assume not favorited
        console.warn('Failed to check favorite status:', error);
        return { isFavorite: false, likedAt: undefined };
      }
    },
    enabled: !!userId && !!songId,
    staleTime: 1 * 60 * 1000, // Cache for 1 minute
    // Ensure query data is never undefined
    placeholderData: { isFavorite: false, likedAt: undefined },
  });
};

