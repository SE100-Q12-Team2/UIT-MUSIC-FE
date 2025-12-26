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
};

