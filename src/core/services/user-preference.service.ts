import api from '@/config/api.config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponse } from '@/core/types';

// ==================== Types ====================

export interface UserPreference {
  id: number;
  userId: number;
  audioQuality: 'Low' | 'Normal' | 'High' | 'Lossless';
  autoPlay: boolean;
  crossfade: boolean;
  crossfadeDuration: number;
  gaplessPlayback: boolean;
  normalizeVolume: boolean;
  explicitContentFilter: boolean;
  language: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPreferenceRequest {
  audioQuality?: 'Low' | 'Normal' | 'High' | 'Lossless';
  autoPlay?: boolean;
  crossfade?: boolean;
  crossfadeDuration?: number;
  gaplessPlayback?: boolean;
  normalizeVolume?: boolean;
  explicitContentFilter?: boolean;
  language?: string;
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

export interface UpdateUserPreferenceRequest {
  audioQuality?: 'Low' | 'Normal' | 'High' | 'Lossless';
  autoPlay?: boolean;
  crossfade?: boolean;
  crossfadeDuration?: number;
  gaplessPlayback?: boolean;
  normalizeVolume?: boolean;
  explicitContentFilter?: boolean;
  language?: string;
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

// ==================== Service ====================

export const userPreferenceService = {
  // Get user preferences
  getUserPreference: async (): Promise<UserPreference> => {
    return api.get<UserPreference>('/user-preferences');
  },

  // Create user preferences
  createUserPreference: async (data: CreateUserPreferenceRequest): Promise<UserPreference> => {
    return api.post<UserPreference>('/user-preferences', data);
  },

  // Update user preferences
  updateUserPreference: async (data: UpdateUserPreferenceRequest): Promise<UserPreference> => {
    return api.put<UserPreference>('/user-preferences', data);
  },

  // Upsert user preferences (create or update)
  upsertUserPreference: async (data: CreateUserPreferenceRequest): Promise<UserPreference> => {
    return api.put<UserPreference>('/user-preferences/upsert', data);
  },

  // Delete user preferences
  deleteUserPreference: async (): Promise<ApiResponse> => {
    return api.delete<ApiResponse>('/user-preferences');
  },
};

// ==================== React Query Hooks ====================

const QUERY_KEYS = {
  userPreferences: {
    all: ['user-preferences'] as const,
    detail: ['user-preferences', 'detail'] as const,
  },
};

export const useUserPreference = () => {
  return useQuery({
    queryKey: QUERY_KEYS.userPreferences.detail,
    queryFn: () => userPreferenceService.getUserPreference(),
    retry: false,
  });
};

export const useCreateUserPreference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserPreferenceRequest) => userPreferenceService.createUserPreference(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userPreferences.all });
    },
  });
};

export const useUpdateUserPreference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserPreferenceRequest) => userPreferenceService.updateUserPreference(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userPreferences.all });
    },
  });
};

export const useUpsertUserPreference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserPreferenceRequest) => userPreferenceService.upsertUserPreference(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userPreferences.all });
    },
  });
};

export const useDeleteUserPreference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userPreferenceService.deleteUserPreference(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userPreferences.all });
    },
  });
};
