

import api from '@/config/api.config';
import type { ApiResponse } from '@/core/types/common.types';
import { RecommendationMix, RecommendationSong } from '@/types/recommendation.types';

export const recommendationApi = {
  // GET /recommendations/personalized
  getPersonalized: async (limit?: number): Promise<RecommendationSong[]> => {
    const res = await api.get<ApiResponse<RecommendationSong[]>>('/recommendations/personalized', { params: { limit } });
    return res.data
  },

  // GET /recommendations/similar/:songId
  getSimilar: async (songId: number, limit?: number): Promise<RecommendationSong[]> => {
    const res = await api.get<ApiResponse<RecommendationSong[]>>(`/recommendations/similar/${songId}`, { params: { limit } });
    return res.data
  },

  // GET /recommendations/for-you
  getDiscoverWeekly: async (): Promise<RecommendationSong[]> => {
    const res = await api.get<ApiResponse<RecommendationSong[]>>('/recommendations/for-you');
    return res.data
  },

  // GET /recommendations/daily-mix
  getDailyMix: async (): Promise<{ mixes: RecommendationMix[] }> => {
    const res = await api.get<ApiResponse<{ mixes: RecommendationMix[] }>>('/recommendations/daily-mix');
    return res.data
  },
};
