import { ReactNode, useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthContext, AuthUser } from '@/contexts/AuthContext';
import { MusicPlayerProvider } from '@/contexts/MusicPlayerContext';
import { queryClient } from '@/config/query.config';
import { ENV } from '@/config/env.config';
import { authService } from '@/core/services/auth.service';

const buildFallbackUser = (email: string): AuthUser => {
  const generatedId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Date.now().toString();

  const guessedName = email?.split('@')?.[0] || 'User';

  return {
    id: generatedId,
    name: guessedName,
    email,
  };
};

const persistSession = (tokens: { accessToken: string; refreshToken: string }, user: AuthUser) => {
  localStorage.setItem('auth_token', tokens.accessToken);
  localStorage.setItem('refresh_token', tokens.refreshToken);
  localStorage.setItem('user', JSON.stringify(user));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
        } else if (ENV.IS_DEVELOPMENT) {
          // Tạm thời bypass login trong development mode để xem giao diện
          const mockUser: AuthUser = {
            id: 'dev-user-123',
            name: 'Dev User',
            email: 'dev@uit-music.local',
            avatar: 'https://ui-avatars.com/api/?name=Dev+User&background=728AAB&color=fff&size=200',
          };
          localStorage.setItem('auth_token', 'dev-mock-token');
          localStorage.setItem('refresh_token', 'dev-mock-refresh-token');
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          console.log('🔓 Development mode: Auto-logged in as mock user');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await authService.login({ email, password });
      const sessionUser = response.user ?? buildFallbackUser(email);

      persistSession({ accessToken: response.accessToken, refreshToken: response.refreshToken }, sessionUser);
      setUser(sessionUser);
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Trích xuất thông báo lỗi từ API response
      let message = 'Đăng nhập thất bại. Vui lòng thử lại.';
      
      if (error?.message) {
        message = error.message;
      } else if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.response?.data?.description) {
        message = error.response.data.description;
      } else if (typeof error === 'string') {
        message = error;
      }
      
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await authService.register({ name, email, password });
      const sessionUser: AuthUser = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.avatar,
        isAdmin: response.user.isAdmin,
      };

      persistSession(
        { accessToken: response.token, refreshToken: response.refreshToken || '' },
        sessionUser
      );
      setUser(sessionUser);
    } catch (error: any) {
      console.error('Register failed:', error);
      
      // Trích xuất thông báo lỗi từ API response
      let message = 'Đăng ký thất bại. Vui lòng thử lại.';
      
      if (error?.message) {
        message = error.message;
      } else if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.response?.data?.description) {
        message = error.response.data.description;
      } else if (typeof error === 'string') {
        message = error;
      }
      
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedData: Partial<AuthUser>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
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
        <MusicPlayerProvider>
          {children}
        </MusicPlayerProvider>
      </AuthProvider>
      {ENV.IS_DEVELOPMENT && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
