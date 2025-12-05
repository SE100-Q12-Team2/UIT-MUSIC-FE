import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/query.config';
import api from '@/config/api.config';
import { AuthUser } from '@/contexts/AuthContext';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isAdmin?: boolean;
  };
  token: string;
  refreshToken?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  favoriteGenres?: string[];
  createdAt?: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);

    if (!response.accessToken || !response.refreshToken) {
      throw new Error('Máy chủ không trả về thông tin xác thực hợp lệ.');
    }

    return response;
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/refresh', { refreshToken });
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/api/auth/register', data);
  },

  logout: async (): Promise<void> => {
    return api.post<void>('/api/auth/logout');
  },

  getProfile: async (): Promise<UserProfile> => {
    return api.get<UserProfile>('/api/auth/profile');
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    return api.put<UserProfile>('/api/auth/profile', data);
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    return api.post<void>('/api/auth/change-password', { oldPassword, newPassword });
  },

  forgotPassword: async (email: string): Promise<void> => {
    return api.post<void>('/api/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    return api.post<void>('/api/auth/reset-password', { token, newPassword });
  },
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.accessToken);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.auth.profile,
    queryFn: () => authService.getProfile(),
    enabled: !!localStorage.getItem('auth_token'),
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => authService.updateProfile(data),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      authService.changePassword(oldPassword, newPassword),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authService.resetPassword(token, newPassword),
  });
};
