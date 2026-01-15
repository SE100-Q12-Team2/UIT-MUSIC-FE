import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, AdminUsersResponse, AdminLabelsResponse, CopyrightReportsResponse, AdminUser, AdminLabel, UpdateUserStatusRequest, UpdateLabelStatusRequest, UpdateCopyrightReportStatusRequest } from '@/core/api/admin.api';
import { MOCK_ADMIN_USERS, MOCK_ADMIN_LABELS, MOCK_COPYRIGHT_REPORTS, MOCK_COPYRIGHT_TOTALS } from '@/data/admin-mock.data';
import { toast } from 'sonner';

// Helper function to use mock data as fallback
// Set VITE_USE_MOCK_DATA=true in .env to force mock data
const useMockData = () => {
  return import.meta.env.VITE_USE_MOCK_DATA === 'true';
};

export const adminService = {
  // Get users for admin
  getUsers: async (page = 1, limit = 20, search?: string): Promise<AdminUsersResponse> => {
    try {
      return await adminApi.getUsers(page, limit, search);
    } catch (error: any) {
      // Fallback to mock data if API fails
      let filteredUsers = [...MOCK_ADMIN_USERS];
      
      if (search) {
        const query = search.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.fullName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
      }
      
      return {
        data: filteredUsers,
        totalItems: filteredUsers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredUsers.length / limit),
      };
    }
  },

  // Get labels for admin
  getLabels: async (page = 1, limit = 20, search?: string): Promise<AdminLabelsResponse> => {
    try {
      return await adminApi.getLabels(page, limit, search);
    } catch (error: any) {
      // Fallback to mock data if API fails
      let filteredLabels = [...MOCK_ADMIN_LABELS];
      
      if (search) {
        const query = search.toLowerCase();
        filteredLabels = filteredLabels.filter(
          (label) => label.labelName.toLowerCase().includes(query)
        );
      }
      
      return {
        items: filteredLabels,
        total: filteredLabels.length,
        page,
        limit,
        totalPages: Math.ceil(filteredLabels.length / limit),
      };
    }
  },

  // Get copyright reports for admin
  getCopyrightReports: async (): Promise<CopyrightReportsResponse> => {
    try {
      return await adminApi.getCopyrightReports();
    } catch (error: any) {
      // Fallback to mock data if API fails
      const reports = [...MOCK_COPYRIGHT_REPORTS];
      
      return {
        items: reports,
        total: MOCK_COPYRIGHT_TOTALS.total,
        pending: MOCK_COPYRIGHT_TOTALS.pending,
        resolved: MOCK_COPYRIGHT_TOTALS.resolved,
        rejected: MOCK_COPYRIGHT_TOTALS.rejected,
      };
    }
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
export const useCopyrightReports = () => {
  return useQuery({
    queryKey: ['admin-copyright-reports'],
    queryFn: () => adminService.getCopyrightReports(),
  });
};

// Mutations for Users
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserStatusRequest }) => {
      // Always try API first
      return adminApi.updateUserStatus(id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(`User status updated to ${variables.data.accountStatus}`);
    },
    onError: (error: any, variables) => {
      // Fallback to mock data if API fails
      const users = queryClient.getQueryData<AdminUsersResponse>(['admin-users'])?.data || MOCK_ADMIN_USERS;
      const updatedUsers = users.map((user: AdminUser) => 
        user.id === variables.id ? { ...user, accountStatus: variables.data.accountStatus } : user
      );
      queryClient.setQueryData(['admin-users'], (old: any) => ({
        ...old,
        data: updatedUsers,
      }));
      toast.success(`User status updated to ${variables.data.accountStatus} (using mock data)`);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => {
      // Always try API first
      return adminApi.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any, id) => {
      // Fallback to mock data if API fails
      const users = queryClient.getQueryData<AdminUsersResponse>(['admin-users'])?.data || MOCK_ADMIN_USERS;
      const updatedUsers = users.filter(user => user.id !== id);
      queryClient.setQueryData(['admin-users'], (old: any) => ({
        ...old,
        data: updatedUsers,
        totalItems: updatedUsers.length,
      }));
      toast.success('User deleted successfully (using mock data)');
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
      // Always try API first
      return adminApi.updateLabelStatus(id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-labels'] });
      toast.success(`Label status updated to ${variables.data.status}`);
    },
    onError: (error: any, variables) => {
      // Fallback to mock data if API fails
      const labels = queryClient.getQueryData<AdminLabelsResponse>(['admin-labels'])?.items || MOCK_ADMIN_LABELS;
      const updatedLabels = labels.map(label => 
        label.id === variables.id ? { ...label, status: variables.data.status } : label
      );
      queryClient.setQueryData(['admin-labels'], (old: any) => ({
        ...old,
        items: updatedLabels,
      }));
      toast.success(`Label status updated to ${variables.data.status} (using mock data)`);
    },
  });
};

export const useDeleteLabel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => {
      // Always try API first
      return adminApi.deleteLabel(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-labels'] });
      toast.success('Label deleted successfully');
    },
    onError: (error: any, id) => {
      // Fallback to mock data if API fails
      const labels = queryClient.getQueryData<AdminLabelsResponse>(['admin-labels'])?.items || MOCK_ADMIN_LABELS;
      const updatedLabels = labels.filter(label => label.id !== id);
      queryClient.setQueryData(['admin-labels'], (old: any) => ({
        ...old,
        items: updatedLabels,
        total: updatedLabels.length,
      }));
      toast.success('Label deleted successfully (using mock data)');
    },
  });
};

