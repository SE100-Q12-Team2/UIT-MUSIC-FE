export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  code: string;
}

export interface SendOTPRequest {
  email: string;
  type: 'REGISTER' | 'FORGOT_PASSWORD' | 'LOGIN' | 'DISABLED_2FA';
}

export interface ForgotPasswordRequest {
  email: string;
  type: 'FORGOT_PASSWORD';
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  fullName: string;
  dateOfBirth: string | null;
  gender: string | null;
  roleId: number;
  profileImage: string | null;
  accountStatus: string;
  createdAt: string;
  updatedAt: string;
  createdById: number | null;
  updatedById: number | null;
}

export interface MessageResponse {
  message: string;
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  dateOfBirth: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  roleId: number;
  profileImage: string | null;
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  createdAt: string;
  updatedAt: string;
  role: {
    id: number;
    name: string;
    permissions: Array<{
      name: string;
      path: string;
      method: string;
      module: string;
    }>;
  };
}

export interface GoogleLinkResponse {
  url: string;
}

export interface FacebookLinkResponse {
  url: string;
}