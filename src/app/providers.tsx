import { ReactNode, useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthContext, AuthUser } from '@/contexts/AuthContext';
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
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
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
    } catch (error) {
      console.error('Login failed:', error);
      const message =
        (error as { message?: string })?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: AuthUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        avatar: 'https://via.placeholder.com/150'
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Register failed:', error);
      throw new Error('Đăng ký thất bại. Vui lòng thử lại.');
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
        {children}
      </AuthProvider>
      {ENV.IS_DEVELOPMENT && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
