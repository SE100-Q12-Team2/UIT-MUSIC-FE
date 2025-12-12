import { createContext } from 'react';

// Simplified user type for authentication
export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  profileImage?: string | null;
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  roleId: number;
  role?: {
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

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, confirmPassword: string, code: string) => Promise<void>;
  sendOTP: (email: string, type: 'REGISTER' | 'FORGOT_PASSWORD') => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

