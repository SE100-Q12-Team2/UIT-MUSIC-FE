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
  userId?: number | string; // optional, can be number or string
  targetType?: 'Artist' | 'Label'; // optional
  limit?: number; // optional, default: 20, max: 100
  page?: number; // optional, default: 1
  sort?: 'followedAt' | 'name'; // optional, default: 'followedAt'
  order?: 'asc' | 'desc'; // optional, default: 'desc'
}

const followService = {
  getFollows: async (query?: FollowsQuery): Promise<FollowsResponse> => {
    return api.get<FollowsResponse>('/follows', { params: query });
  },
};

// React Query hook for user follows
export const useFollows = (query?: FollowsQuery) => {
  return useQuery({
    queryKey: ['follows', query],
    queryFn: () => followService.getFollows(query),
    enabled: 
      // If no query provided, allow (API supports query without userId)
      !query || 
      // If query exists but userId is undefined (not provided), allow (API supports optional userId)
      query.userId === undefined ||
      // If userId is a valid number (> 0), allow
      (typeof query.userId === 'number' && query.userId > 0) || 
      // If userId is a valid non-empty string (not '0'), allow
      (typeof query.userId === 'string' && query.userId.trim() !== '' && query.userId !== '0'),
  });
};

export default followService;
