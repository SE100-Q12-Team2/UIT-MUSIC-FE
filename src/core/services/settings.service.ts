import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config/api.config';
import { QUERY_KEYS } from '@/config/query.config';

// ==================== Types ====================

export interface UserPreferences {
  id?: number;
  userId?: number;
  preferredGenres?: number[];
  preferredLanguages?: string[];
  explicitContent?: boolean;
  autoPlay?: boolean;
  highQualityStreaming?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPreferencesRequest {
  preferredGenres?: number[];
  preferredLanguages?: string[];
  explicitContent?: boolean;
  autoPlay?: boolean;
  highQualityStreaming?: boolean;
}

export interface UpdateUserPreferencesRequest {
  preferredGenres?: number[];
  preferredLanguages?: string[];
  explicitContent?: boolean;
  autoPlay?: boolean;
  highQualityStreaming?: boolean;
}

export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Device {
  id: number;
  userId: number;
  deviceName: string;
  deviceType: string;
  deviceInfo?: string;
  isActive: boolean;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DevicesResponse {
  items: Device[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DevicesQuery {
  page?: number;
  limit?: number;
  isActive?: string;
  sortBy?: 'lastActive' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface DeviceStats {
  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;
}

// ==================== Service ====================

export const settingsService = {
  // User Preferences
  getUserPreferences: async (): Promise<UserPreferences> => {
    return api.get<UserPreferences>('/user-preferences');
  },

  createUserPreferences: async (data: CreateUserPreferencesRequest): Promise<UserPreferences> => {
    return api.post<UserPreferences>('/user-preferences', data);
  },

  updateUserPreferences: async (data: UpdateUserPreferencesRequest): Promise<UserPreferences> => {
    return api.put<UserPreferences>('/user-preferences', data);
  },

  upsertUserPreferences: async (data: UpdateUserPreferencesRequest): Promise<UserPreferences> => {
    return api.put<UserPreferences>('/user-preferences/upsert', data);
  },

  deleteUserPreferences: async (): Promise<void> => {
    return api.delete<void>('/user-preferences');
  },

  // Change Password
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return api.patch<void>('/profile/change-password', data);
  },

  // Devices
  getDevices: async (query?: DevicesQuery): Promise<DevicesResponse> => {
    return api.get<DevicesResponse>('/devices', { params: query });
  },

  getDeviceStats: async (): Promise<DeviceStats> => {
    return api.get<DeviceStats>('/devices/stats');
  },

  getDeviceById: async (id: number): Promise<Device> => {
    return api.get<Device>(`/devices/${id}`);
  },

  revokeDevice: async (id: number): Promise<void> => {
    return api.delete<void>(`/devices/${id}/revoke`);
  },

  revokeAllDevices: async (): Promise<void> => {
    return api.post<void>('/devices/revoke-all');
  },

  deleteDevice: async (id: number): Promise<void> => {
    return api.delete<void>(`/devices/${id}`);
  },
};

// ==================== React Query Hooks ====================

// User Preferences Hooks
export const useUserPreferences = () => {
  return useQuery({
    queryKey: ['user-preferences'],
    queryFn: () => settingsService.getUserPreferences(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateUserPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserPreferencesRequest) => settingsService.createUserPreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    },
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserPreferencesRequest) => settingsService.updateUserPreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    },
  });
};

export const useUpsertUserPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserPreferencesRequest) => settingsService.upsertUserPreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    },
  });
};

export const useDeleteUserPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => settingsService.deleteUserPreferences(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
    },
  });
};

// Change Password Hook
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => settingsService.changePassword(data),
  });
};

// Devices Hooks
export const useDevices = (query?: DevicesQuery) => {
  return useQuery({
    queryKey: ['devices', query],
    queryFn: () => settingsService.getDevices(query),
  });
};

export const useDeviceStats = () => {
  return useQuery({
    queryKey: ['devices', 'stats'],
    queryFn: () => settingsService.getDeviceStats(),
  });
};

export const useDevice = (id: number | undefined) => {
  return useQuery({
    queryKey: ['devices', id],
    queryFn: () => settingsService.getDeviceById(id!),
    enabled: !!id && id > 0,
  });
};

export const useRevokeDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => settingsService.revokeDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['devices', 'stats'] });
    },
  });
};

export const useRevokeAllDevices = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => settingsService.revokeAllDevices(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['devices', 'stats'] });
    },
  });
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => settingsService.deleteDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['devices', 'stats'] });
    },
  });
};

export default settingsService;

