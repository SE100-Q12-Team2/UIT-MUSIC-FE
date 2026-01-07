import { useQuery } from '@tanstack/react-query';
import api from '@/config/api.config';
import { Song } from './song.service';

export interface HomeSummary {
  recentlyPlayed: Song[];
  topSongs: Song[];
  favorites: Song[];
}

const homeService = {
  getHomeSummary: async (userId: number): Promise<HomeSummary> => {
    return api.get<HomeSummary>('/favorites/home-summary', { 
      params: { userId } 
    });
  },
};

export const useHomeSummary = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['home', 'summary', userId],
    queryFn: () => homeService.getHomeSummary(userId!),
    enabled: !!userId && userId > 0,
  });
};

export default homeService;

