import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ENV } from './env.config';

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
  status?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

type FailedRequest = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const redirectToLogin = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: ENV.API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (ENV.IS_DEVELOPMENT) {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
          params: config.params,
        });
      }

      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (ENV.IS_DEVELOPMENT) {
        console.log('✅ API Response:', {
          url: response.config.url,
          status: response.status,
          data: response.data,
        });
      }

      return response;
    },
    (error: AxiosError<ApiError>) => {
      if (ENV.IS_DEVELOPMENT) {
        console.error('❌ API Error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
        });
      }

      const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
      const status = error.response?.status;

      if (status === 401 && originalRequest) {
        const isAuthEndpoint = (originalRequest.url || '').includes('/auth/');
        const refreshToken = localStorage.getItem('refresh_token');

        if (isAuthEndpoint || !refreshToken) {
          redirectToLogin();
          return Promise.reject(error);
        }

        if (originalRequest._retry) {
          redirectToLogin();
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (!originalRequest.headers) {
                originalRequest.headers = {};
              }
              originalRequest.headers.Authorization = token ? `Bearer ${token}` : '';
              return instance(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            const refreshResponse = await axios.post(
              `${ENV.API_BASE_URL.replace(/\/$/, '')}/auth/refresh`,
              { refreshToken },
              { headers: { 'Content-Type': 'application/json' } }
            );

            const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data as {
              accessToken: string;
              refreshToken?: string;
            };

            if (!accessToken) {
              throw new Error('Invalid refresh response');
            }

            localStorage.setItem('auth_token', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('refresh_token', newRefreshToken);
            }

            instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            processQueue(null, accessToken);

            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            resolve(instance(originalRequest));
          } catch (refreshError) {
            processQueue(refreshError, null);
            redirectToLogin();
            reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        });
      }

      if (status === 403) {
        console.error('Access forbidden');
      }

      if (!error.response) {
        console.error('Network error or server is down');
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiClient = createApiClient();

export const apiRequest = async <T = unknown>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.request<ApiResponse<T>>(config);
    return (response.data.data || response.data) as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        errors: error.response?.data?.errors,
      };
      throw apiError;
    }
    throw error;
  }
};

export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'GET', url }),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'POST', url, data }),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'PUT', url, data }),

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'PATCH', url, data }),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'DELETE', url }),
};

export default api;
