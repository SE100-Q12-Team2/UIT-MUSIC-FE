import api from '@/config/api.config';

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  accountStatus: 'Active' | 'Inactive' | 'Banned' | 'Suspended';
  profileImage: string | null;
  role: {
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
  createdAt: string;
}

export interface AdminUsersResponse {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminLabel {
  id: number;
  labelName: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  albumCount: number;
  songCount: number;
  createdAt: string;
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
  status: 'Active' | 'Inactive' | 'Suspended';
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

export const adminApi = {
  // Get all users for admin
  getUsers: async (page = 1, limit = 20, search?: string): Promise<AdminUsersResponse> => {
    return api.get<AdminUsersResponse>('/admin/users', {
      params: { page, limit, search },
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

  // Get all labels for admin
  getLabels: async (page = 1, limit = 20, search?: string): Promise<AdminLabelsResponse> => {
    return api.get<AdminLabelsResponse>('/admin/labels', {
      params: { page, limit, search },
    });
  },

  // Get label by ID
  getLabelById: async (id: number): Promise<AdminLabel> => {
    return api.get<AdminLabel>(`/admin/labels/${id}`);
  },

  // Update label status
  updateLabelStatus: async (id: number, data: UpdateLabelStatusRequest): Promise<AdminLabel> => {
    return api.patch<AdminLabel>(`/admin/labels/${id}/status`, data);
  },

  // Delete label
  deleteLabel: async (id: number): Promise<void> => {
    return api.delete(`/admin/labels/${id}`);
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
};

