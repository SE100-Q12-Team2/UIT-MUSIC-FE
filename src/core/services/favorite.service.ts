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

  checkFavorite: async (userId: number, songId: number): Promise<{ isFavorite: boolean; likedAt?: string }> => {
    return api.get<{ isFavorite: boolean; likedAt?: string }>('/favorites/check', { 
      params: { userId, songId } 
    });
  },

  addToFavorites: async (userId: number, songId: number): Promise<void> => {
    return api.post<void>('/favorites', { userId, songId });
  },

  removeFromFavorites: async (userId: number, songId: number): Promise<void> => {
    return api.delete<void>(`/favorites/${userId}/${songId}`);
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
    mutationFn: ({ userId, songId }: { userId: number; songId: number }) => 
      favoriteService.addToFavorites(userId, songId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.favorites });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, songId }: { userId: number; songId: number }) => 
      favoriteService.removeFromFavorites(userId, songId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.favorites });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

// Hook to toggle favorite status
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      songId, 
      isFavorited 
    }: { 
      userId: number; 
      songId: number; 
      isFavorited: boolean;
    }) => {
      if (isFavorited) {
        await favoriteService.removeFromFavorites(userId, songId);
        return { action: 'remove' };
      } else {
        await favoriteService.addToFavorites(userId, songId);
        return { action: 'add' };
      }
    },
    onSuccess: (data, variables) => {
      // Always invalidate the check query for this specific song
      queryClient.invalidateQueries({ 
        queryKey: ['favorites', 'check', variables.userId, variables.songId] 
      });
      
      // Only refetch the full list when ADDING a favorite (not when removing)
      if (data.action === 'add') {
        queryClient.invalidateQueries({ queryKey: ['favorites', 'songs', variables.userId] });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.favorites });
      }
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
        // result is already unwrapped by api.get, it's { isFavorite, likedAt }
        return result || { isFavorite: false, likedAt: undefined };
      } catch (error) {
        // If API fails or returns error, assume not favorited
        return { isFavorite: false, likedAt: undefined };
      }
    },
    enabled: !!userId && !!songId,
    staleTime: 1 * 60 * 1000, // Cache for 1 minute
    // Ensure query data is never undefined
    placeholderData: { isFavorite: false, likedAt: undefined },
  });
};

