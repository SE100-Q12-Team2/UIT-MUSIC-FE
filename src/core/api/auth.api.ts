import api from '@/config/api.config';
import {
  AuthResponse,
  FacebookLinkResponse,
  ForgotPasswordRequest,
  GoogleLinkResponse,
  LoginRequest,
  LogoutRequest,
  MessageResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  SendOTPRequest,
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '@/types/auth.types';

export const authApi = {
  sendOTP: async (data: SendOTPRequest): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/otp', data);
    return response;
  },
  
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response;
  },

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response;
  },

  refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh-token', data);
    return response;
  },

  logout: async (data: LogoutRequest): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/logout', data);
    return response;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/forgot-password', data);
    return response;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/reset-password', data);
    return response;
  },

  getGoogleLink: async (): Promise<GoogleLinkResponse> => {
    const response = await api.get<GoogleLinkResponse>('/auth/google-link');
    return response;
  },

  getFacebookLink: async (): Promise<FacebookLinkResponse> => {
    const response = await api.get<FacebookLinkResponse>('/auth/facebook-link');
    return response;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/profile');
    return response;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await api.patch<UserProfile>('/profile', data);
    return response;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<MessageResponse> => {
    const response = await api.patch<MessageResponse>('/profile/change-password', data);
    return response;
  },
};
