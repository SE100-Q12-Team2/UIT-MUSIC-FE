import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, AdminUsersResponse, AdminLabelsResponse, CopyrightReportsResponse, AdminUser, AdminLabel, UpdateUserStatusRequest, UpdateLabelStatusRequest, UpdateCopyrightReportStatusRequest } from '@/core/api/admin.api';
import { toast } from 'sonner';

export const adminService = {
  // Get users for admin
  getUsers: async (page = 1, limit = 20, search?: string): Promise<AdminUsersResponse> => {
    return await adminApi.getUsers(page, limit, search);
  },

  // Get labels for admin
  getLabels: async (page = 1, limit = 20, search?: string): Promise<AdminLabelsResponse> => {
    return await adminApi.getLabels(page, limit, search);
  },

  // Get copyright reports for admin
  getCopyrightReports: async (page = 1, limit = 20, status?: string): Promise<CopyrightReportsResponse> => {
    return await adminApi.getCopyrightReports(page, limit, status);
  },
};

// React Query hook for admin users
export const useAdminUsers = (page = 1, limit = 20, search?: string) => {
  return useQuery({
    queryKey: ['admin-users', page, limit, search],
    queryFn: () => adminService.getUsers(page, limit, search),
  });
};

// React Query hook for single user
export const useAdminUser = (id: number) => {
  return useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminApi.getUserById(id),
    enabled: !!id,
  });
};

// React Query hook for user detail
export const useAdminUserDetail = (id: number) => {
  return useQuery({
    queryKey: ['admin-user-detail', id],
    queryFn: () => adminApi.getUserDetailById(id),
    enabled: !!id,
  });
};

// React Query hook for admin labels
export const useAdminLabels = (page = 1, limit = 20, search?: string) => {
  return useQuery({
    queryKey: ['admin-labels', page, limit, search],
    queryFn: () => adminService.getLabels(page, limit, search),
  });
};

// React Query hook for copyright reports
export const useCopyrightReports = (page = 1, limit = 20, status?: string) => {
  return useQuery({
    queryKey: ['admin-copyright-reports', page, limit, status],
    queryFn: () => adminService.getCopyrightReports(page, limit, status),
  });
};

// React Query hook for copyright report statistics
export const useCopyrightReportStats = () => {
  return useQuery({
    queryKey: ['admin-copyright-report-stats'],
    queryFn: () => adminApi.getCopyrightReportStats(),
  });
};

// React Query hook for single copyright report
export const useCopyrightReport = (id: number) => {
  return useQuery({
    queryKey: ['admin-copyright-report', id],
    queryFn: () => adminApi.getCopyrightReportById(id),
    enabled: !!id,
  });
};

// Mutations for Users
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserStatusRequest }) => {
      return adminApi.updateUserStatus(id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(`User status updated to ${variables.data.accountStatus}`);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update user status';
      toast.error(errorMessage);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => {
      return adminApi.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to delete user';
      toast.error(errorMessage);
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      fullName: string;
      roleId: number;
      dateOfBirth?: string;
      gender?: 'Male' | 'Female' | 'Other';
    }) => {
      return adminApi.createUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create user';
      toast.error(errorMessage);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: number; 
      data: {
        fullName?: string;
        dateOfBirth?: string;
        gender?: 'Male' | 'Female' | 'Other';
        profileImage?: string;
      }
    }) => {
      return adminApi.updateUser(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-detail'] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update user';
      toast.error(errorMessage);
    },
  });
};

// Mutations for Labels
export const useUpdateLabelStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLabelStatusRequest }) => {
      return adminApi.updateLabelStatus(id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-labels'] });
      toast.success(`Label status updated to ${variables.data.status}`);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update label status';
      toast.error(errorMessage);
    },
  });
};

export const useDeleteLabel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => {
      return adminApi.deleteLabel(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-labels'] });
      toast.success('Label deleted successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to delete label';
      toast.error(errorMessage);
    },
  });
};

// Mutations for Copyright Reports
export const useUpdateCopyrightReportStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCopyrightReportStatusRequest }) => {
      return adminApi.updateCopyrightReportStatus(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-copyright-reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin-copyright-report-stats'] });
      toast.success('Copyright report status updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update copyright report status');
    },
  });
};

export const useDeleteCopyrightReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => {
      return adminApi.deleteCopyrightReport(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-copyright-reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin-copyright-report-stats'] });
      toast.success('Copyright report deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to delete copyright report');
    },
  });
};

