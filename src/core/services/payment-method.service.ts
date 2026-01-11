import api from '@/config/api.config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponse } from '@/core/types';

// ==================== Types ====================

export interface PaymentMethod {
  id: number;
  methodName: string;
  methodType: 'BankTransfer' | 'CreditCard' | 'DebitCard' | 'EWallet' | 'QRCode' | 'Other';
  description?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  qrCodeUrl?: string;
  apiKey?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodListResponse {
  data: PaymentMethod[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentMethodStatsResponse {
  totalMethods: number;
  activeMethods: number;
  methodsByType: Record<string, number>;
  mostUsedMethod: {
    id: number;
    methodName: string;
    usageCount: number;
  };
}

export interface QueryPaymentMethodsParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  methodType?: string;
}

export interface CreatePaymentMethodRequest {
  methodName: string;
  methodType: 'BankTransfer' | 'CreditCard' | 'DebitCard' | 'EWallet' | 'QRCode' | 'Other';
  description?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  qrCodeUrl?: string;
  apiKey?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdatePaymentMethodRequest {
  methodName?: string;
  methodType?: 'BankTransfer' | 'CreditCard' | 'DebitCard' | 'EWallet' | 'QRCode' | 'Other';
  description?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  qrCodeUrl?: string;
  apiKey?: string;
  displayOrder?: number;
}

export interface UpdatePaymentMethodStatusRequest {
  isActive: boolean;
}

// ==================== Service ====================

export const paymentMethodService = {
  // Create payment method (Admin)
  createPaymentMethod: async (data: CreatePaymentMethodRequest): Promise<PaymentMethod> => {
    return api.post<PaymentMethod>('/payment-methods', data);
  },

  // Get all payment methods (Admin)
  getAllPaymentMethods: async (params?: QueryPaymentMethodsParams): Promise<PaymentMethodListResponse> => {
    return api.get<PaymentMethodListResponse>('/payment-methods', { params });
  },

  // Get payment method statistics (Admin)
  getStats: async (): Promise<PaymentMethodStatsResponse> => {
    return api.get<PaymentMethodStatsResponse>('/payment-methods/stats');
  },

  // Get payment method by ID (Admin)
  getById: async (id: number): Promise<PaymentMethod> => {
    return api.get<PaymentMethod>(`/payment-methods/${id}`);
  },

  // Update payment method (Admin)
  updatePaymentMethod: async (id: number, data: UpdatePaymentMethodRequest): Promise<PaymentMethod> => {
    return api.put<PaymentMethod>(`/payment-methods/${id}`, data);
  },

  // Update payment method status (Admin)
  updateStatus: async (id: number, data: UpdatePaymentMethodStatusRequest): Promise<PaymentMethod> => {
    return api.patch<PaymentMethod>(`/payment-methods/${id}/status`, data);
  },

  // Delete payment method (Admin)
  deletePaymentMethod: async (id: number): Promise<ApiResponse> => {
    return api.delete<ApiResponse>(`/payment-methods/${id}`);
  },
};

// ==================== React Query Hooks ====================

const QUERY_KEYS = {
  paymentMethods: {
    all: ['payment-methods'] as const,
    list: (params?: QueryPaymentMethodsParams) => ['payment-methods', 'list', params] as const,
    detail: (id: number) => ['payment-methods', 'detail', id] as const,
    stats: ['payment-methods', 'stats'] as const,
  },
};

export const usePaymentMethods = (params?: QueryPaymentMethodsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.paymentMethods.list(params),
    queryFn: () => paymentMethodService.getAllPaymentMethods(params),
  });
};

export const usePaymentMethodStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.paymentMethods.stats,
    queryFn: () => paymentMethodService.getStats(),
  });
};

export const usePaymentMethod = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.paymentMethods.detail(id),
    queryFn: () => paymentMethodService.getById(id),
    enabled: !!id && id > 0,
  });
};

export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentMethodRequest) => paymentMethodService.createPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.paymentMethods.all });
    },
  });
};

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePaymentMethodRequest }) =>
      paymentMethodService.updatePaymentMethod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.paymentMethods.all });
    },
  });
};

export const useUpdatePaymentMethodStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePaymentMethodStatusRequest }) =>
      paymentMethodService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.paymentMethods.all });
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => paymentMethodService.deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.paymentMethods.all });
    },
  });
};
