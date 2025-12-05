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
  fullName: string;
  email: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  createdAt?: string;
  updatedAt?: string;
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
    return api.post<AuthResponse>('/auth/register', data);
  },

  logout: async (refreshToken: string): Promise<void> => {
    return api.post<void>('/auth/logout', { refreshToken });
  },

  getProfile: async (): Promise<UserProfile> => {
    return api.get<UserProfile>('/profile');
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    return api.patch<UserProfile>('/profile', data);
  },

  changePassword: async (password: string, newPassword: string, confirmPassword: string): Promise<void> => {
    return api.patch<void>('/profile/change-password', { password, newPassword, confirmPassword });
  },

  forgotPassword: async (email: string): Promise<void> => {
    return api.post<void>('/auth/forgot-password', { email });
  },

  resendOtp: async (email: string, type: string = 'FORGOT_PASSWORD'): Promise<void> => {
    return api.post<void>('/auth/otp', { email, type });
  },

  resetPassword: async (resetToken: string, newPassword: string, confirmNewPassword: string): Promise<void> => {
    return api.post<void>('/auth/reset-password', { resetToken, newPassword, confirmNewPassword });
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
    mutationFn: () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      return authService.logout(refreshToken);
    },
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
    mutationFn: ({ password, newPassword, confirmPassword }: { password: string; newPassword: string; confirmPassword: string }) =>
      authService.changePassword(password, newPassword, confirmPassword),
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
