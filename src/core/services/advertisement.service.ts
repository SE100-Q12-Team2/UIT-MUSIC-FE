import api from '@/config/api.config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponse } from '@/core/types';

// ==================== Types ====================

export interface Advertisement {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  targetUrl?: string;
  adType: 'Banner' | 'Video' | 'Audio' | 'Interstitial';
  placement: 'Homepage' | 'Player' | 'Sidebar' | 'PreRoll' | 'MidRoll' | 'PostRoll';
  status: 'Active' | 'Paused' | 'Completed' | 'Draft';
  startDate: string;
  endDate: string;
  budget?: number;
  impressions: number;
  clicks: number;
  ctr: number; // Click-through rate
  createdAt: string;
  updatedAt: string;
}

export interface AdvertisementListResponse {
  data: Advertisement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdvertisementStatsResponse {
  totalImpressions: number;
  totalClicks: number;
  averageCtr: number;
  activeAds: number;
  totalBudget: number;
  spentBudget: number;
}

export interface QueryAdvertisementsParams {
  page?: number;
  limit?: number;
  status?: string;
  adType?: string;
  placement?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetActiveAdsParams {
  placement?: string;
  limit?: number;
}

export interface CreateAdvertisementRequest {
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  targetUrl?: string;
  adType: 'Banner' | 'Video' | 'Audio' | 'Interstitial';
  placement: 'Homepage' | 'Player' | 'Sidebar' | 'PreRoll' | 'MidRoll' | 'PostRoll';
  status?: 'Active' | 'Paused' | 'Completed' | 'Draft';
  startDate: string;
  endDate: string;
  budget?: number;
  targetAudience?: Record<string, unknown>;
}

export interface UpdateAdvertisementRequest {
  title?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  targetUrl?: string;
  adType?: 'Banner' | 'Video' | 'Audio' | 'Interstitial';
  placement?: 'Homepage' | 'Player' | 'Sidebar' | 'PreRoll' | 'MidRoll' | 'PostRoll';
  startDate?: string;
  endDate?: string;
  budget?: number;
  targetAudience?: Record<string, unknown>;
}

export interface UpdateAdStatusRequest {
  status: 'Active' | 'Paused' | 'Completed' | 'Draft';
}

export interface CreateAdImpressionRequest {
  userId?: number;
  metadata?: Record<string, unknown>;
}

export interface TrackAdClickRequest {
  userId?: number;
  metadata?: Record<string, unknown>;
}

// ==================== Service ====================

export const advertisementService = {
  // ========== Admin Endpoints ==========
  
  // Create advertisement (Admin)
  createAdvertisement: async (data: CreateAdvertisementRequest): Promise<Advertisement> => {
    return api.post<Advertisement>('/advertisements', data);
  },

  // Get all advertisements (Admin)
  getAllAdvertisements: async (params?: QueryAdvertisementsParams): Promise<AdvertisementListResponse> => {
    return api.get<AdvertisementListResponse>('/advertisements', { params });
  },

  // Get overall ad statistics (Admin)
  getOverallStats: async (startDate?: string, endDate?: string): Promise<AdvertisementStatsResponse> => {
    return api.get<AdvertisementStatsResponse>('/advertisements/stats', {
      params: { startDate, endDate },
    });
  },

  // Get advertisement by ID (Admin)
  getById: async (id: number): Promise<Advertisement> => {
    return api.get<Advertisement>(`/advertisements/${id}`);
  },

  // Get ad performance stats (Admin)
  getAdStats: async (id: number, startDate?: string, endDate?: string): Promise<AdvertisementStatsResponse> => {
    return api.get<AdvertisementStatsResponse>(`/advertisements/${id}/stats`, {
      params: { startDate, endDate },
    });
  },

  // Update advertisement (Admin)
  updateAdvertisement: async (id: number, data: UpdateAdvertisementRequest): Promise<Advertisement> => {
    return api.put<Advertisement>(`/advertisements/${id}`, data);
  },

  // Update ad status (Admin)
  updateAdStatus: async (id: number, data: UpdateAdStatusRequest): Promise<Advertisement> => {
    return api.patch<Advertisement>(`/advertisements/${id}/status`, data);
  },

  // Delete advertisement (Admin)
  deleteAdvertisement: async (id: number): Promise<ApiResponse> => {
    return api.delete<ApiResponse>(`/advertisements/${id}`);
  },

  // ========== Public Endpoints ==========

  // Get active ads (Public)
  getActiveAds: async (params?: GetActiveAdsParams): Promise<Advertisement[]> => {
    const response = await api.get<Advertisement[] | { data: Advertisement[] }>('/advertisements/active', { params });
    return Array.isArray(response) ? response : response.data || [];
  },

  // Track ad impression (Public)
  trackImpression: async (id: number, data?: CreateAdImpressionRequest): Promise<ApiResponse> => {
    return api.post<ApiResponse>(`/advertisements/${id}/impression`, data);
  },

  // Track ad click (Public)
  trackClick: async (id: number, data?: TrackAdClickRequest): Promise<ApiResponse> => {
    return api.post<ApiResponse>(`/advertisements/${id}/click`, data);
  },
};

// ==================== React Query Hooks ====================

const QUERY_KEYS = {
  advertisements: {
    all: ['advertisements'] as const,
    list: (params?: QueryAdvertisementsParams) => ['advertisements', 'list', params] as const,
    detail: (id: number) => ['advertisements', 'detail', id] as const,
    stats: ['advertisements', 'stats'] as const,
    adStats: (id: number, startDate?: string, endDate?: string) =>
      ['advertisements', 'stats', id, startDate, endDate] as const,
    active: (params?: GetActiveAdsParams) => ['advertisements', 'active', params] as const,
  },
};

// Admin hooks
export const useAdvertisements = (params?: QueryAdvertisementsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.advertisements.list(params),
    queryFn: () => advertisementService.getAllAdvertisements(params),
  });
};

export const useAdvertisementStats = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.advertisements.stats,
    queryFn: () => advertisementService.getOverallStats(startDate, endDate),
  });
};

export const useAdvertisement = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.advertisements.detail(id),
    queryFn: () => advertisementService.getById(id),
    enabled: !!id && id > 0,
  });
};

export const useAdStats = (id: number, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.advertisements.adStats(id, startDate, endDate),
    queryFn: () => advertisementService.getAdStats(id, startDate, endDate),
    enabled: !!id && id > 0,
  });
};

// Public hooks
export const useActiveAds = (params?: GetActiveAdsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.advertisements.active(params),
    queryFn: () => advertisementService.getActiveAds(params),
  });
};

// Mutations
export const useCreateAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdvertisementRequest) => advertisementService.createAdvertisement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.advertisements.all });
    },
  });
};

export const useUpdateAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAdvertisementRequest }) =>
      advertisementService.updateAdvertisement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.advertisements.all });
    },
  });
};

export const useUpdateAdStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAdStatusRequest }) =>
      advertisementService.updateAdStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.advertisements.all });
    },
  });
};

export const useDeleteAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => advertisementService.deleteAdvertisement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.advertisements.all });
    },
  });
};

export const useTrackImpression = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: CreateAdImpressionRequest }) =>
      advertisementService.trackImpression(id, data),
  });
};

export const useTrackClick = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: TrackAdClickRequest }) =>
      advertisementService.trackClick(id, data),
  });
};
