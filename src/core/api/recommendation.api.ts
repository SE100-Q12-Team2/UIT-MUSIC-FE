

import api from '@/config/api.config';
import { RecommendationMix, RecommendationSong } from '@/types/recommendation.types';

export const recommendationApi = {
  // GET /recommendations/personalized
  // Note: limit is required according to api-json.json, but we'll make it optional with default for backward compatibility
  getPersonalized: async (limit: number = 30): Promise<RecommendationSong[]> => {
    return api.get<RecommendationSong[]>('/recommendations/personalized', { params: { limit } });
  },

  // GET /recommendations/similar/:songId
  getSimilar: async (songId: number, limit?: number): Promise<RecommendationSong[]> => {
    return api.get<RecommendationSong[]>(`/recommendations/similar/${songId}`, { params: { limit } });
  },

  // GET /recommendations/for-you
  getDiscoverWeekly: async (): Promise<RecommendationSong[]> => {
    return api.get<RecommendationSong[]>('/recommendations/for-you');
  },

  // GET /recommendations/daily-mix
  getDailyMix: async (): Promise<{ mixes: RecommendationMix[] }> => {
    return api.get<{ mixes: RecommendationMix[] }>('/recommendations/daily-mix');
  },
};
