import api from '@/config/api.config';
import { ApiResponse } from '@/core/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ==================== Types ====================

export interface SongRating {
  id: number;
  userId: number;
  songId: number;
  rating: number; // 1-5
  review?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    fullName: string;
    profileImage?: string;
  };
}

export interface SongRatingStats {
  songId: number;
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
}

export interface UserRatingStats {
  totalRatings: number;
  averageRating: number;
  recentRatings: SongRating[];
}

export interface QueryUserRatingsParams {
  page?: number;
  limit?: number;
  sortBy?: 'recent' | 'rating';
}

export interface CreateRatingRequest {
  songId: number;
  rating: number; // 1-5
  review?: string;
}

export interface UpdateRatingRequest {
  rating?: number;
  review?: string;
}

export interface PaginatedRatingsResponse {
  data: SongRating[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== Service ====================

export const ratingService = {
  // Rate a song (create or update)
  rateSong: async (songId: number, data: CreateRatingRequest): Promise<SongRating> => {
    return api.post<SongRating>(`/ratings/songs/${songId}`, data);
  },

  // Update rating
  updateRating: async (songId: number, data: UpdateRatingRequest): Promise<SongRating> => {
    return api.post<SongRating>(`/ratings/songs/${songId}/update`, data);
  },

  // Delete rating
  deleteRating: async (songId: number): Promise<ApiResponse> => {
    return api.delete<ApiResponse>(`/ratings/songs/${songId}`);
  },

  // Get my rating for a song
  getMyRating: async (songId: number): Promise<SongRating | null> => {
    try {
      return await api.get<SongRating>(`/ratings/songs/${songId}/me`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Get song rating stats
  getSongRatingStats: async (songId: number): Promise<SongRatingStats> => {
    return api.get<SongRatingStats>(`/ratings/songs/${songId}`);
  },

  // Get all ratings for a song
  getSongRatings: async (songId: number, params?: QueryUserRatingsParams): Promise<PaginatedRatingsResponse> => {
    return api.get<PaginatedRatingsResponse>(`/ratings/songs/${songId}/ratings`, { params });
  },

  // Get my ratings
  getMyRatings: async (params?: QueryUserRatingsParams): Promise<PaginatedRatingsResponse> => {
    return api.get<PaginatedRatingsResponse>('/ratings/me', { params });
  },

  // Get user rating stats
  getMyStats: async (): Promise<UserRatingStats> => {
    return api.get<UserRatingStats>('/ratings/me/stats');
  },
};

// ==================== React Query Hooks ====================

const QUERY_KEYS = {
  ratings: {
    all: ['ratings'] as const,
    myRatings: (params?: QueryUserRatingsParams) => ['ratings', 'my', params] as const,
    myRating: (songId: number) => ['ratings', 'my', songId] as const,
    myStats: ['ratings', 'my', 'stats'] as const,
    songStats: (songId: number) => ['ratings', 'song', songId, 'stats'] as const,
    songRatings: (songId: number, params?: QueryUserRatingsParams) => ['ratings', 'song', songId, params] as const,
  },
};

// Get my rating for a specific song
export const useMyRating = (songId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.ratings.myRating(songId),
    queryFn: () => ratingService.getMyRating(songId),
    enabled: !!songId && songId > 0,
  });
};

// Get song rating stats
export const useSongRatingStats = (songId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.ratings.songStats(songId),
    queryFn: () => ratingService.getSongRatingStats(songId),
    enabled: !!songId && songId > 0,
  });
};

// Get all ratings for a song
export const useSongRatings = (songId: number, params?: QueryUserRatingsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.ratings.songRatings(songId, params),
    queryFn: () => ratingService.getSongRatings(songId, params),
    enabled: !!songId && songId > 0,
  });
};

// Get my ratings
export const useMyRatings = (params?: QueryUserRatingsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.ratings.myRatings(params),
    queryFn: () => ratingService.getMyRatings(params),
  });
};

// Get my rating stats
export const useMyRatingStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ratings.myStats,
    queryFn: () => ratingService.getMyStats(),
  });
};

// Rate a song (create or update)
export const useRateSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ songId, data }: { songId: number; data: CreateRatingRequest }) =>
      ratingService.rateSong(songId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ratings.myRating(variables.songId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ratings.songStats(variables.songId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ratings.myRatings() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ratings.myStats });
    },
  });
};

// Update rating
export const useUpdateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ songId, data }: { songId: number; data: UpdateRatingRequest }) =>
      ratingService.updateRating(songId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ratings.myRating(variables.songId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ratings.songStats(variables.songId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ratings.myRatings() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ratings.myStats });
    },
  });
};

// Delete rating
export const useDeleteRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (songId: number) => ratingService.deleteRating(songId),
    onSuccess: (_, songId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ratings.myRating(songId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ratings.songStats(songId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ratings.myRatings() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ratings.myStats });
    },
  });
};
