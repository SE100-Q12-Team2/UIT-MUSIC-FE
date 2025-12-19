import { ReactNode, useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthContext, AuthUser } from '@/contexts/AuthContext';
import { queryClient } from '@/config/query.config';
import { ENV } from '@/config/env.config';
import { authService } from '@/core/services/auth.service';
import { cookieStorage } from '@/shared/utils/cookies';
import { useProfileStore } from '@/store/profileStore';

const persistSession = (tokens: { accessToken: string; refreshToken: string }) => {
  cookieStorage.setItem('auth_token', tokens.accessToken, { days: 7, secure: ENV.IS_PRODUCTION });
  cookieStorage.setItem('refresh_token', tokens.refreshToken, { days: 30, secure: ENV.IS_PRODUCTION });
};

const persistUser = (user: AuthUser) => {
  cookieStorage.setItem('user', JSON.stringify(user), { days: 30, secure: ENV.IS_PRODUCTION });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const setProfile = useProfileStore((state) => state.setProfile);
  const clearProfile = useProfileStore((state) => state.clearProfile);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = cookieStorage.getItem('auth_token');
        const savedUser = cookieStorage.getItem('user');
        
        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser) as AuthUser;
          setUser(parsedUser);
          
          try {
            const profile = await authService.getProfile();
            const freshUser: AuthUser = {
              id: profile.id,
              email: profile.email,
              fullName: profile.fullName,
              profileImage: profile.profileImage,
              accountStatus: profile.accountStatus,
              roleId: profile.roleId,
              role: profile.role,
            };
            setUser(freshUser);
            persistUser(freshUser);
            // Sync to profileStore
            setProfile(profile);
          } catch (error) {
            console.error('Failed to fetch fresh profile:', error);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        cookieStorage.removeItem('auth_token');
        cookieStorage.removeItem('refresh_token');
        cookieStorage.removeItem('user');
        clearProfile();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setProfile, clearProfile]);

  const sendOTP = async (email: string, type: 'REGISTER' | 'FORGOT_PASSWORD') => {
    try {
      setIsLoading(true);
      await authService.sendOTP({ email, type });
    } catch (error) {
      console.error('Send OTP failed:', error);
      const message = (error as { message?: string })?.message || 'Gửi OTP thất bại. Vui lòng thử lại.';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await authService.login({ email, password });
      persistSession({ accessToken: response.accessToken, refreshToken: response.refreshToken });
      
      const profile = await authService.getProfile();
      const sessionUser: AuthUser = {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        profileImage: profile.profileImage,
        accountStatus: profile.accountStatus,
        roleId: profile.roleId,
        role: profile.role,
      };
      
      persistUser(sessionUser);
      setUser(sessionUser);
      // Sync to profileStore for other services
      setProfile(profile);
    } catch (error) {
      console.error('Login failed:', error);
      const message =
        (error as { message?: string })?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    fullName: string, 
    email: string, 
    password: string, 
    confirmPassword: string, 
    code: string
  ) => {
    try {
      setIsLoading(true);
      
      const response = await authService.register({ 
        fullName, 
        email, 
        password, 
        confirmPassword,
        code 
      });
      
      cookieStorage.setItem('registered_email', email, { days: 1, secure: ENV.IS_PRODUCTION });
      
      console.log('Registration successful:', response);
    } catch (error) {
      console.error('Register failed:', error);
      const message =
        (error as { message?: string })?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    cookieStorage.removeItem('auth_token');
    cookieStorage.removeItem('refresh_token');
    cookieStorage.removeItem('user');
    setUser(null);
    clearProfile();
  };

  const updateUser = (updatedData: Partial<AuthUser>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      cookieStorage.setItem('user', JSON.stringify(newUser), { days: 30, secure: ENV.IS_PRODUCTION });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        sendOTP,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
      {ENV.IS_DEVELOPMENT && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
