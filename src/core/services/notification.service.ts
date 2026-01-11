import api from '@/config/api.config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponse } from '@/core/types';

// ==================== Types ====================

export interface Notification {
  id: number;
  userId: number;
  type: 'System' | 'Song' | 'Playlist' | 'Album' | 'Follow' | 'Subscription' | 'Copyright';
  title: string;
  message: string;
  imageUrl?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

export interface NotificationStatsResponse {
  total: number;
  read: number;
  unread: number;
  byType: Record<string, number>;
}

export interface QueryNotificationsParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
}

export interface CreateNotificationRequest {
  userId: number;
  type: 'System' | 'Song' | 'Playlist' | 'Album' | 'Follow' | 'Subscription' | 'Copyright';
  title: string;
  message: string;
  imageUrl?: string;
  actionUrl?: string;
}

export interface CreateBulkNotificationRequest {
  userIds?: number[];
  type: 'System' | 'Song' | 'Playlist' | 'Album' | 'Follow' | 'Subscription' | 'Copyright';
  title: string;
  message: string;
  imageUrl?: string;
  actionUrl?: string;
}

export interface MarkMultipleAsReadRequest {
  notificationIds: number[];
}

// ==================== Service ====================

export const notificationService = {
  // Get user notifications
  getNotifications: async (params?: QueryNotificationsParams): Promise<NotificationListResponse> => {
    return api.get<NotificationListResponse>('/notifications', { params });
  },

  // Get notification stats
  getStats: async (): Promise<NotificationStatsResponse> => {
    return api.get<NotificationStatsResponse>('/notifications/stats');
  },

  // Get notification by ID
  getById: async (id: number): Promise<Notification> => {
    return api.get<Notification>(`/notifications/${id}`);
  },

  // Mark as read
  markAsRead: async (id: number): Promise<Notification> => {
    return api.patch<Notification>(`/notifications/${id}/read`);
  },

  // Mark all as read
  markAllAsRead: async (): Promise<ApiResponse> => {
    return api.patch<ApiResponse>('/notifications/read-all');
  },

  // Mark multiple as read
  markMultipleAsRead: async (data: MarkMultipleAsReadRequest): Promise<ApiResponse> => {
    return api.patch<ApiResponse>('/notifications/mark-multiple-read', data);
  },

  // Delete notification
  delete: async (id: number): Promise<ApiResponse> => {
    return api.delete<ApiResponse>(`/notifications/${id}`);
  },

  // Delete all notifications
  deleteAll: async (): Promise<ApiResponse> => {
    return api.delete<ApiResponse>('/notifications/all');
  },

  // Create notification (Admin only)
  create: async (data: CreateNotificationRequest): Promise<Notification> => {
    return api.post<Notification>('/notifications', data);
  },

  // Create bulk notifications (Admin only)
  createBulk: async (data: CreateBulkNotificationRequest): Promise<ApiResponse> => {
    return api.post<ApiResponse>('/notifications/bulk', data);
  },
};

// ==================== React Query Hooks ====================

const QUERY_KEYS = {
  notifications: {
    all: ['notifications'] as const,
    list: (params?: QueryNotificationsParams) => ['notifications', 'list', params] as const,
    detail: (id: number) => ['notifications', 'detail', id] as const,
    stats: ['notifications', 'stats'] as const,
  },
};

export const useNotifications = (params?: QueryNotificationsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.notifications.list(params),
    queryFn: () => notificationService.getNotifications(params),
  });
};

export const useNotificationStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.notifications.stats,
    queryFn: () => notificationService.getStats(),
  });
};

export const useNotification = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.notifications.detail(id),
    queryFn: () => notificationService.getById(id),
    enabled: !!id && id > 0,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
  });
};

export const useMarkMultipleAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkMultipleAsReadRequest) => notificationService.markMultipleAsRead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.deleteAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationRequest) => notificationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
  });
};

export const useCreateBulkNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBulkNotificationRequest) => notificationService.createBulk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
    },
  });
};
