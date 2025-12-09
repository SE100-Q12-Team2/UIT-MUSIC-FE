import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/query.config';
import { AuthResponse, LoginRequest, MessageResponse, RegisterRequest, RegisterResponse, SendOTPRequest, UserProfile } from '@/types/auth.types';
import { authApi } from '@/core/api/auth.api';
import { cookieStorage } from '@/shared/utils/cookies';
import { ENV } from '@/config/env.config';


export const authService = {
  sendOTP: async (data: SendOTPRequest): Promise<MessageResponse> => {
    return authApi.sendOTP(data);
  },

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await authApi.login(credentials);

    if (!response.accessToken || !response.refreshToken) {
      throw new Error('Máy chủ không trả về thông tin xác thực hợp lệ.');
    }

    return response;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return authApi.register(data);
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await authApi.refreshToken({ refreshToken });
    return response;
  },

  logout: async (refreshToken: string): Promise<MessageResponse> => {
    return authApi.logout({ refreshToken });
  },

  getProfile: async (): Promise<UserProfile> => {
    return authApi.getProfile();
  },

  forgotPassword: async (email: string): Promise<MessageResponse> => {
    return authApi.forgotPassword({ email });
  },

  resetPassword: async (resetToken: string, newPassword: string, confirmNewPassword: string): Promise<MessageResponse> => {
    return authApi.resetPassword({ resetToken, newPassword, confirmNewPassword });
  },

  getGoogleLink: async () => {
    return authApi.getGoogleLink();
  },

  getFacebookLink: async () => {
    return authApi.getFacebookLink();
  },
};


export const useSendOTP = () => {
  return useMutation({
    mutationFn: (data: SendOTPRequest) => authService.sendOTP(data),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      cookieStorage.setItem('auth_token', data.accessToken, { days: 7, secure: ENV.IS_PRODUCTION });
      cookieStorage.setItem('refresh_token', data.refreshToken, { days: 30, secure: ENV.IS_PRODUCTION });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      cookieStorage.setItem('registered_user', JSON.stringify(data), { days: 1, secure: ENV.IS_PRODUCTION });
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => {
      const refreshToken = cookieStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      return authService.logout(refreshToken);
    },
    onSuccess: () => {
      cookieStorage.removeItem('auth_token');
      cookieStorage.removeItem('refresh_token');
      cookieStorage.removeItem('user');
      window.location.href = '/login';
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.auth.profile,
    queryFn: () => authService.getProfile(),
    enabled: !!cookieStorage.getItem('auth_token'),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ resetToken, newPassword, confirmNewPassword }: { 
      resetToken: string; 
      newPassword: string;
      confirmNewPassword: string;
    }) => authService.resetPassword(resetToken, newPassword, confirmNewPassword),
  });
};

export const useGoogleLink = () => {
  return useQuery({
    queryKey: ['google-link'],
    queryFn: () => authService.getGoogleLink(),
    enabled: false, 
  });
};

export const useFacebookLink = () => {
  return useQuery({
    queryKey: ['facebook-link'],
    queryFn: () => authService.getFacebookLink(),
    enabled: false,
  });
};
