import api from '@/config/api.config';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ApiResponse } from '@/core/types';

// ==================== Types ====================

export interface DashboardOverview {
  totalUsers: number;
  activeUsers: number;
  totalSongs: number;
  totalPlays: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  newSongsThisMonth: number;
  revenueThisMonth: number;
  topGenres: {
    genre: string;
    count: number;
  }[];
  recentActivity: {
    date: string;
    users: number;
    plays: number;
    revenue: number;
  }[];
}

export interface DailyStats {
  date: string;
  newUsers: number;
  activeUsers: number;
  totalPlays: number;
  newSongs: number;
  revenue: number;
}

export interface DailyStatsListResponse {
  data: DailyStats[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TrendingSong {
  id: number;
  title: string;
  artist: string;
  album?: string;
  playCount: number;
  likes: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TrendingSongsResponse {
  songs: TrendingSong[];
  period: string;
  generatedAt: string;
}

export interface RevenueStats {
  totalRevenue: number;
  subscriptionRevenue: number;
  transactionRevenue: number;
  revenueByMonth: {
    month: string;
    revenue: number;
    subscriptions: number;
    transactions: number;
  }[];
  revenueByPlan: {
    plan: string;
    revenue: number;
    count: number;
  }[];
}

export interface UserEngagementStats {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  averageListeningTime: number;
  topActivities: {
    activity: string;
    count: number;
  }[];
}

export interface QueryDailyStatsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface QueryTrendingSongsParams {
  limit?: number;
  period?: 'day' | 'week' | 'month';
}

export interface QueryRevenueStatsParams {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export interface QueryUserEngagementParams {
  startDate?: string;
  endDate?: string;
}

export interface RecordStatisticRequest {
  type: string;
  value: number;
  metadata?: Record<string, unknown>;
}

// ==================== Service ====================

export const statisticsService = {
  // Get dashboard overview (Admin)
  getDashboardOverview: async (): Promise<DashboardOverview> => {
    return api.get<DashboardOverview>('/statistics/dashboard');
  },

  // Get daily statistics (Admin)
  getDailyStats: async (params?: QueryDailyStatsParams): Promise<DailyStatsListResponse> => {
    return api.get<DailyStatsListResponse>('/statistics/daily', { params });
  },

  // Get trending songs (Admin)
  getTrendingSongs: async (params?: QueryTrendingSongsParams): Promise<TrendingSongsResponse> => {
    return api.get<TrendingSongsResponse>('/statistics/trending', { params });
  },

  // Get revenue statistics (Admin)
  getRevenueStats: async (params?: QueryRevenueStatsParams): Promise<RevenueStats> => {
    return api.get<RevenueStats>('/statistics/revenue', { params });
  },

  // Get user engagement statistics (Admin)
  getUserEngagementStats: async (params?: QueryUserEngagementParams): Promise<UserEngagementStats> => {
    return api.get<UserEngagementStats>('/statistics/user-engagement', { params });
  },

  // Record statistic (Backend use)
  recordStatistic: async (data: RecordStatisticRequest): Promise<ApiResponse> => {
    return api.post<ApiResponse>('/statistics/record', data);
  },
};

// ==================== React Query Hooks ====================

const QUERY_KEYS = {
  statistics: {
    all: ['statistics'] as const,
    dashboard: ['statistics', 'dashboard'] as const,
    daily: (params?: QueryDailyStatsParams) => ['statistics', 'daily', params] as const,
    trending: (params?: QueryTrendingSongsParams) => ['statistics', 'trending', params] as const,
    revenue: (params?: QueryRevenueStatsParams) => ['statistics', 'revenue', params] as const,
    userEngagement: (params?: QueryUserEngagementParams) => ['statistics', 'user-engagement', params] as const,
  },
};

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: QUERY_KEYS.statistics.dashboard,
    queryFn: () => statisticsService.getDashboardOverview(),
  });
};

export const useDailyStats = (params?: QueryDailyStatsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.statistics.daily(params),
    queryFn: () => statisticsService.getDailyStats(params),
  });
};

export const useTrendingSongsStats = (params?: QueryTrendingSongsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.statistics.trending(params),
    queryFn: () => statisticsService.getTrendingSongs(params),
  });
};

export const useRevenueStats = (params?: QueryRevenueStatsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.statistics.revenue(params),
    queryFn: () => statisticsService.getRevenueStats(params),
  });
};

export const useUserEngagementStats = (params?: QueryUserEngagementParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.statistics.userEngagement(params),
    queryFn: () => statisticsService.getUserEngagementStats(params),
  });
};

export const useRecordStatistic = () => {
  return useMutation({
    mutationFn: (data: RecordStatisticRequest) => statisticsService.recordStatistic(data),
  });
};
