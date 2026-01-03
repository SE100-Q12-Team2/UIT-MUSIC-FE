import { recommendationApi } from '@/core/api/recommendation.api';
import { RecommendationMix, RecommendationSong } from '@/types/recommendation.types';
import { useQuery } from '@tanstack/react-query';

export function usePersonalizedRecommendations(limit: number = 30) {
  return useQuery<RecommendationSong[]>({
    queryKey: ['recommendations', 'personalized', limit],
    queryFn: () => recommendationApi.getPersonalized(limit),
  });
}

export function useSimilarSongs(songId: number, limit?: number) {
  return useQuery<RecommendationSong[]>({
    queryKey: ['recommendations', 'similar', songId, limit],
    queryFn: () => recommendationApi.getSimilar(songId, limit),
    enabled: !!songId,
  });
}

export function useDiscoverWeekly() {
  return useQuery<RecommendationSong[]>({
    queryKey: ['recommendations', 'discover-weekly'],
    queryFn: async () => {
      try {
        const result = await recommendationApi.getDiscoverWeekly();
        return result || [];
      } catch (error) {
        console.warn('Failed to fetch recommendations:', error);
        return [];
      }
    },
    // Ensure query data is never undefined
    placeholderData: [],
  });
}

export function useDailyMix() {
  return useQuery<{ mixes: RecommendationMix[] }>({
    queryKey: ['recommendations', 'daily-mix'],
    queryFn: () => recommendationApi.getDailyMix(),
  });
}
