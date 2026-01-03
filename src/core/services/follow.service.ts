import { useQuery } from '@tanstack/react-query';
import api from '@/config/api.config';

export interface FollowTarget {
  id: number;
  artistName: string;
  biography: string | null;
  profileImage: string | null;
  hasPublicProfile: boolean;
}

export interface FollowItem {
  id: number;
  userId: number;
  targetType: 'Artist' | 'Label';
  targetId: number;
  followedAt: string;
  target: FollowTarget;
}

export interface FollowsResponse {
  data: FollowItem[];
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export interface FollowsQuery {
  userId: number;
}

const followService = {
  getFollows: async (query: FollowsQuery): Promise<FollowsResponse> => {
    return api.get<FollowsResponse>('/follows', { params: query });
  },
};

// React Query hook for user follows
export const useFollows = (query: FollowsQuery) => {
  return useQuery({
    queryKey: ['follows', query.userId],
    queryFn: () => followService.getFollows(query),
    enabled: !!query.userId && query.userId > 0,
  });
};

export default followService;
