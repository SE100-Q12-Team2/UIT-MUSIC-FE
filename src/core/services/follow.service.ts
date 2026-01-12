import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config/api.config';

export interface FollowTarget {
  id: number;
  labelName: string;
  description: string | null;
  imageUrl: string | null;
  website: string | null;
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
  userId?: number; // will be converted to string for API
  targetType?: 'Artist' | 'Label'; // optional
  limit?: number; // optional, default: 20, max: 100
  page?: number; // optional, default: 1
  sort?: 'followedAt' | 'name'; // optional, default: 'followedAt'
  order?: 'asc' | 'desc'; // optional, default: 'desc'
}

export interface AddFollowRequest {
  userId: number;
  targetType: 'Artist' | 'Label';
  targetId: number;
}

export interface CheckFollowResponse {
  isFollowing: boolean;
  followedAt?: string;
}

const followService = {
  getFollows: async (query?: FollowsQuery): Promise<FollowsResponse> => {
    // Backend expects all query params as strings, it will transform them
    const queryParams = query ? {
      userId: query.userId?.toString(),
      targetType: query.targetType,
      limit: query.limit?.toString(),
      page: query.page?.toString(),
      sort: query.sort,
      order: query.order,
    } : undefined;
    return api.get<FollowsResponse>('/follows', { params: queryParams });
  },

  checkFollow: async (userId: number, targetType: 'Artist' | 'Label', targetId: number): Promise<CheckFollowResponse> => {
    return api.get<CheckFollowResponse>('/follows/check', { 
      params: { userId, targetType, targetId } 
    });
  },

  addFollow: async (data: AddFollowRequest): Promise<FollowItem> => {
    return api.post<FollowItem>('/follows', data);
  },

  removeFollow: async (userId: number, targetType: 'Artist' | 'Label', targetId: number): Promise<void> => {
    return api.delete<void>(`/follows/${userId}/${targetType}/${targetId}`);
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
      (typeof query.userId === 'number' && query.userId > 0),
  });
};

export const useCheckFollow = (userId: number | undefined, targetType: 'Artist' | 'Label' | undefined, targetId: number | undefined) => {
  return useQuery({
    queryKey: ['follows', 'check', userId, targetType, targetId],
    queryFn: () => {
      if (!userId || !targetType || !targetId) {
        return { isFollowing: false };
      }
      return followService.checkFollow(userId, targetType, targetId);
    },
    enabled: !!userId && !!targetType && !!targetId,
    staleTime: 1 * 60 * 1000, 
  });
};

export const useToggleFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, targetType, targetId, isFollowing }: AddFollowRequest & { isFollowing: boolean }) => {
      if (isFollowing) {
        await followService.removeFollow(userId, targetType, targetId);
        return { action: 'unfollow' };
      } else {
        await followService.addFollow({ userId, targetType, targetId });
        return { action: 'follow' };
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate all follow-related queries
      queryClient.invalidateQueries({ queryKey: ['follows'] });
      queryClient.invalidateQueries({ 
        queryKey: ['follows', 'check', variables.userId, variables.targetType, variables.targetId] 
      });
    },
  });
};

export default followService;
