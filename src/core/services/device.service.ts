import api from '@/config/api.config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponse } from '@/core/types';

// ==================== Types ====================

export interface Device {
  id: number;
  userId: number;
  deviceName: string;
  deviceType: 'Web' | 'Mobile' | 'Desktop' | 'Tablet';
  browser?: string;
  os?: string;
  ipAddress?: string;
  lastActive: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceListResponse {
  data: Device[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DeviceStatsResponse {
  totalDevices: number;
  activeDevices: number;
  devicesByType: Record<string, number>;
  recentDevices: Device[];
}

export interface QueryDevicesParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  deviceType?: string;
}

// ==================== Service ====================

export const deviceService = {
  // Get user devices
  getUserDevices: async (params?: QueryDevicesParams): Promise<DeviceListResponse> => {
    return api.get<DeviceListResponse>('/devices', { params });
  },

  // Get device stats
  getDeviceStats: async (): Promise<DeviceStatsResponse> => {
    return api.get<DeviceStatsResponse>('/devices/stats');
  },

  // Get device by ID
  getDeviceById: async (id: number): Promise<Device> => {
    return api.get<Device>(`/devices/${id}`);
  },

  // Revoke device (logout from that device)
  revokeDevice: async (id: number): Promise<ApiResponse> => {
    return api.delete<ApiResponse>(`/devices/${id}/revoke`);
  },

  // Revoke all devices except current
  revokeAllDevices: async (): Promise<ApiResponse> => {
    return api.delete<ApiResponse>('/devices/revoke-all');
  },
};

// ==================== React Query Hooks ====================

const QUERY_KEYS = {
  devices: {
    all: ['devices'] as const,
    list: (params?: QueryDevicesParams) => ['devices', 'list', params] as const,
    detail: (id: number) => ['devices', 'detail', id] as const,
    stats: ['devices', 'stats'] as const,
  },
};

export const useDevices = (params?: QueryDevicesParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.devices.list(params),
    queryFn: () => deviceService.getUserDevices(params),
  });
};

export const useDeviceStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.devices.stats,
    queryFn: () => deviceService.getDeviceStats(),
  });
};

export const useDevice = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.devices.detail(id),
    queryFn: () => deviceService.getDeviceById(id),
    enabled: !!id && id > 0,
  });
};

export const useRevokeDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deviceService.revokeDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.devices.all });
    },
  });
};

export const useRevokeAllDevices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deviceService.revokeAllDevices(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.devices.all });
    },
  });
};
