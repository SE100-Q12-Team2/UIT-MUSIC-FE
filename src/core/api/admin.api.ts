import api from '@/config/api.config';

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  accountStatus: 'Active' | 'Inactive' | 'Banned' | 'Suspended';
  roleId: number;
  createdById?: number;
  updatedById?: number;
  createdAt: string;
  updatedAt?: string;
  profileImage?: string | null;
  role?: {
    id: number;
    name: string;
  };
  subscriptions?: {
    id: number;
    plan: {
      id: number;
      name: string;
    };
  }[];
}

export interface AdminUsersResponse {
  data: AdminUser[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminLabel {
  id: number;
  userId: number;
  labelName: string;
  description?: string;
  website?: string;
  contactEmail?: string;
  hasPublicProfile: boolean;
  createdAt: string;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
  _count: {
    albums: number;
    songs: number;
  };
  status: 'Active' | 'Inactive' | 'Suspended' | 'Banned';
}

export interface AdminLabelsResponse {
  items: AdminLabel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CopyrightReport {
  id: number;
  songTitle: string;
  reportedBy: string;
  reason: string;
  status: 'Pending' | 'Under Review' | 'Resolved' | 'Rejected';
  createdAt: string;
}

export interface CopyrightReportsResponse {
  items: CopyrightReport[];
  total: number;
  pending: number;
  resolved: number;
  rejected: number;
}

export interface UpdateUserStatusRequest {
  accountStatus: 'Active' | 'Inactive' | 'Banned' | 'Suspended';
}

export interface UpdateLabelStatusRequest {
  status: 'Active' | 'Inactive' | 'Suspended' | 'Banned';
}

export interface UpdateCopyrightReportStatusRequest {
  status: 'Pending' | 'Under Review' | 'Resolved' | 'Rejected';
}

// Statistics API types
export interface DashboardStatsResponse {
  users: {
    total: number;
    active: number;
    premium: number;
    newToday: number;
  };
  content: {
    totalSongs: number;
    totalAlbums: number;
    totalArtists: number;
    totalPlaylists: number;
  };
  engagement: {
    totalPlays: number;
    totalPlayTime: number;
    avgPlaysPerUser: number;
  };
  revenue: {
    todaySubscription: number;
    todayAds: number;
    monthSubscription: number;
    monthAds: number;
    totalMonth: number;
  };
}

export interface DailyStatItem {
  statDate: string;
  totalPlays: number;
  uniqueListeners: number;
  premiumUsersCount: number;
  newRegistrations: number;
  adImpressions: number;
  revenueSubscription: number;
  revenueAds: number;
  createdAt: string;
}

export interface DailyStatsResponse {
  data: DailyStatItem[];
  summary: {
    totalPlays: number;
    totalUniqueListeners: number;
    totalRevenue: number;
    avgDailyPlays: number;
  };
}

export interface TopGenre {
  genreId: number;
  genreName: string;
  playCount: number;
}

export interface EngagementStatsResponse {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  freeUsers: number;
  avgSessionsPerUser: number;
  avgPlayTimePerUser: number;
  topGenres: TopGenre[];
}

export interface RevenueDataItem {
  period: string;
  revenueSubscription: number;
  revenueAds: number;
  totalRevenue: number;
  newSubscriptions: number;
}

export interface RevenueStatsResponse {
  data: RevenueDataItem[];
  summary: {
    totalRevenueSubscription: number;
    totalRevenueAds: number;
    totalRevenue: number;
    totalNewSubscriptions: number;
  };
}

export interface TrendingSongArtist {
  artistId: number;
  artistName: string;
  role: string;
}

export interface TrendingSong {
  id: number;
  songId: number;
  periodType: string;
  periodStart: string;
  periodEnd: string;
  playCount: number;
  rankPosition: number;
  song: {
    id: number;
    title: string;
    duration: number;
    coverImage: string;
    artists: TrendingSongArtist[];
  };
}

export interface TrendingStatsResponse {
  periodType: string;
  periodStart: string;
  periodEnd: string;
  songs: TrendingSong[];
}

// Songs API types
export interface SongArtist {
  artistId: number;
  songId: number;
  role: string;
  artist: {
    id: number;
    artistName: string;
    profileImage: string;
  };
}

export interface AdminSong {
  id: number;
  title: string;
  description: string;
  duration: number;
  language: string;
  lyrics: string;
  albumId: number;
  genreId: number;
  labelId: number;
  uploadDate: string;
  isActive: boolean;
  copyrightStatus: string;
  playCount: number;
  isFavorite: boolean;
  songArtists: SongArtist[];
  album: {
    id: number;
    albumTitle: string;
    coverImage: string;
  } | null;
  genre: {
    id: number;
    genreName: string;
  } | null;
  label: {
    id: number;
    labelName: string;
  } | null;
  asset: {
    id: number;
    bucket: string;
    keyMaster: string;
  } | null;
}

export interface AdminSongsResponse {
  items: AdminSong[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Albums API types
export interface AlbumSong {
  id: number;
  title: string;
  duration: number;
  playCount: number;
  uploadDate: string;
  songArtists: {
    role: string;
    artist: {
      id: number;
      artistName: string;
      profileImage: string;
    };
  }[];
}

export interface AdminAlbum {
  id: number;
  albumTitle: string;
  albumDescription: string;
  coverImage: string;
  releaseDate: string;
  labelId: number;
  totalTracks: number;
  createdAt: string;
  updatedAt: string;
  label: {
    id: number;
    labelName: string;
    hasPublicProfile: boolean;
  } | null;
  songs: AlbumSong[];
  _count: {
    songs: number;
  };
}

export interface AdminAlbumsResponse {
  items: AdminAlbum[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Genres API types
export interface AdminGenre {
  id: number;
  genreName: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminGenresResponse {
  data: AdminGenre[];
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

// Advertisements API types
export interface Advertisement {
  id: number;
  adName: string;
  adType: 'Audio' | 'Video' | 'Banner';
  filePath: string;
  duration: number;
  targetAudience: {
    ageRange: {
      min: number;
      max: number;
    };
    gender: 'Male' | 'Female' | 'All';
    subscriptionType: 'Free' | 'Premium' | 'All';
    genres: number[];
    countries: string[];
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    impressions: number;
  };
}

export interface AdvertisementsResponse {
  data: Advertisement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateAdvertisementRequest {
  adName: string;
  adType: 'Audio' | 'Video' | 'Banner';
  filePath?: string;
  duration?: number;
  targetAudience?: {
    ageRange?: {
      min?: number;
      max?: number;
    };
    gender?: 'Male' | 'Female' | 'Other' | 'All';
    subscriptionType?: 'Free' | 'Premium' | 'All';
    genres?: number[];
    countries?: string[];
  };
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export interface UpdateAdvertisementRequest {
  adName?: string;
  adType?: 'Audio' | 'Video' | 'Banner';
  filePath?: string;
  duration?: number;
  targetAudience?: {
    ageRange?: {
      min?: number;
      max?: number;
    };
    gender?: 'Male' | 'Female' | 'Other' | 'All';
    subscriptionType?: 'Free' | 'Premium' | 'All';
    genres?: number[];
    countries?: string[];
  };
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

// Subscription Stats API types
export interface PlanDistribution {
  planId: number;
  planName: string;
  subscriberCount: number;
  percentage: number;
}

export interface SubscriptionStatsResponse {
  totalPlans: number;
  activePlans: number;
  inactivePlans: number;
  totalSubscribers: number;
  averagePrice: number;
  planDistribution: PlanDistribution[];
}

export interface UpdateSubscriptionPlanRequest {
  planName?: string;
  durationMonths?: number;
  price?: number;
  features?: {
    [key: string]: string;
  };
  isActive?: boolean;
}

export interface SubscriptionPlanResponse {
  id: number;
  name?: string;
  planName: string;
  durationMonths: number;
  price: number;
  features?: string | string[];
  isActive: boolean;
  createdAt: string;
}

export const adminApi = {
  // Get all users
  getUsers: async (
    page = 1,
    limit = 20,
    search?: string,
    role?: 'Admin' | 'Listener' | 'Label',
    status?: 'Active' | 'Inactive' | 'Banned' | 'Suspended'
  ): Promise<AdminUsersResponse> => {
    return api.get<AdminUsersResponse>('/users', {
      params: { page, limit, search, role, status },
    });
  },

  // Get user by ID
  getUserById: async (id: number): Promise<AdminUser> => {
    return api.get<AdminUser>(`/admin/users/${id}`);
  },

  // Update user status
  updateUserStatus: async (id: number, data: UpdateUserStatusRequest): Promise<AdminUser> => {
    return api.patch<AdminUser>(`/admin/users/${id}/status`, data);
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    return api.delete(`/admin/users/${id}`);
  },

  // Get label by user ID
  getLabelByUserId: async (userId: number): Promise<AdminLabel> => {
    return api.get<AdminLabel>(`/record-labels/user/${userId}`);
  },

  // Get all labels for admin (fetch all users with Label role)
  getLabels: async (page = 1, limit = 100, search?: string): Promise<AdminLabelsResponse> => {
    const usersResponse = await api.get<AdminUsersResponse>('/users', {
      params: { page, limit, search, role: 'Label' },
    });
    
    // Fetch label details for each user
    const labelsWithDetails = await Promise.all(
      usersResponse.data.map(async (user) => {
        try {
          const label = await adminApi.getLabelByUserId(user.id);
          // Add status from user account status
          return {
            ...label,
            status: user.accountStatus,
          };
        } catch (error) {
          // If label not found, return null
          return null;
        }
      })
    );
    
    // Filter out null values
    const validLabels = labelsWithDetails.filter((label): label is AdminLabel => label !== null);
    
    return {
      items: validLabels,
      total: usersResponse.totalItems,
      page: usersResponse.page,
      limit: usersResponse.limit,
      totalPages: usersResponse.totalPages,
    };
  },

  // Get label by ID (using userId)
  getLabelById: async (userId: number): Promise<AdminLabel> => {
    return adminApi.getLabelByUserId(userId);
  },

  // Update label status (updates the user's account status)
  updateLabelStatus: async (userId: number, data: UpdateLabelStatusRequest): Promise<AdminLabel> => {
    // Update user account status
    await api.patch(`/admin/users/${userId}/status`, {
      accountStatus: data.status,
    });
    // Return the updated label
    return adminApi.getLabelByUserId(userId);
  },

  // Delete label (deletes the user account)
  deleteLabel: async (userId: number): Promise<void> => {
    return api.delete(`/admin/users/${userId}`);
  },

  // Get copyright reports for admin
  getCopyrightReports: async (): Promise<CopyrightReportsResponse> => {
    return api.get<CopyrightReportsResponse>('/admin/copyright-reports');
  },

  // Update copyright report status
  updateCopyrightReportStatus: async (id: number, data: UpdateCopyrightReportStatusRequest): Promise<CopyrightReport> => {
    return api.patch<CopyrightReport>(`/admin/copyright-reports/${id}/status`, data);
  },

  // Get all songs for admin
  getSongs: async (page = 1, limit = 10, search?: string): Promise<AdminSongsResponse> => {
    return api.get<AdminSongsResponse>('/songs', {
      params: { page, limit, search },
    });
  },

  // Get all albums for admin
  getAlbums: async (page = 1, limit = 12, search?: string): Promise<AdminAlbumsResponse> => {
    return api.get<AdminAlbumsResponse>('/albums', {
      params: { page, limit, search },
    });
  },

  // Get all genres for admin
  getGenres: async (page = 1, limit = 12, search?: string): Promise<AdminGenresResponse> => {
    return api.get<AdminGenresResponse>('/genres', {
      params: { page, limit, search },
    });
  },

  // Create a new genre
  createGenre: async (data: { genreName: string; description?: string | null }): Promise<AdminGenre> => {
    return api.post<AdminGenre>('/genres', data);
  },

  // Statistics APIs
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    return api.get<DashboardStatsResponse>('/statistics/dashboard');
  },

  getDailyStats: async (startDate?: string, endDate?: string): Promise<DailyStatsResponse> => {
    return api.get<DailyStatsResponse>('/statistics/daily', {
      params: { startDate, endDate },
    });
  },

  getEngagementStats: async (startDate?: string, endDate?: string): Promise<EngagementStatsResponse> => {
    return api.get<EngagementStatsResponse>('/statistics/engagement', {
      params: { startDate, endDate },
    });
  },

  getRevenueStats: async (startDate?: string, endDate?: string): Promise<RevenueStatsResponse> => {
    return api.get<RevenueStatsResponse>('/statistics/revenue', {
      params: { startDate, endDate },
    });
  },

  getTrendingStats: async (periodType: 'Daily' | 'Weekly' | 'Monthly' = 'Daily'): Promise<TrendingStatsResponse> => {
    return api.get<TrendingStatsResponse>('/statistics/trending', {
      params: { periodType },
    });
  },

  // Get advertisements for admin
  getAdvertisements: async (page = 1, limit = 10): Promise<AdvertisementsResponse> => {
    return api.get<AdvertisementsResponse>('/advertisements', {
      params: { page, limit },
    });
  },

  // Create advertisement
  createAdvertisement: async (data: CreateAdvertisementRequest): Promise<Advertisement> => {
    return api.post<Advertisement>('/advertisements', data);
  },

  // Update advertisement
  updateAdvertisement: async (id: number, data: UpdateAdvertisementRequest): Promise<Advertisement> => {
    return api.put<Advertisement>(`/advertisements/${id}`, data);
  },

  // Delete advertisement
  deleteAdvertisement: async (id: number): Promise<void> => {
    return api.delete(`/advertisements/${id}`);
  },

  // Get subscription plans stats
  getSubscriptionStats: async (): Promise<SubscriptionStatsResponse> => {
    return api.get<SubscriptionStatsResponse>('/subscription-plans/stats');
  },

  // Update subscription plan
  updateSubscriptionPlan: async (id: number, data: UpdateSubscriptionPlanRequest): Promise<SubscriptionPlanResponse> => {
    return api.patch<SubscriptionPlanResponse>(`/subscription-plans/${id}`, data);
  },

  // Create subscription plan
  createSubscriptionPlan: async (data: UpdateSubscriptionPlanRequest): Promise<SubscriptionPlanResponse> => {
    return api.post<SubscriptionPlanResponse>('/subscription-plans', data);
  },

  // Delete subscription plan
  deleteSubscriptionPlan: async (id: number): Promise<void> => {
    return api.delete(`/subscription-plans/${id}`);
  },
};

