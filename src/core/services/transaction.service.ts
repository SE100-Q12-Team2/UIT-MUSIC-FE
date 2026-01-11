import api from '@/config/api.config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ==================== Types ====================

export interface Transaction {
  id: number;
  userId: number;
  subscriptionId?: number;
  amount: number;
  paymentMethodId: number;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  qrCode?: string;
  returnUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: {
    id: number;
    methodName: string;
    methodType: string;
  };
}

export interface TransactionListResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionStatsResponse {
  totalRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  refundedTransactions: number;
  averageTransactionAmount: number;
}

export interface QueryTransactionsParams {
  page?: number;
  limit?: number;
  status?: string;
  userId?: number;
  startDate?: string;
  endDate?: string;
}

export interface CreateTransactionRequest {
  subscriptionId?: number;
  amount: number;
  paymentMethodId: number;
  returnUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface RefundTransactionRequest {
  reason?: string;
}

export interface SepayPaymentQRResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: number;
    qrCode: string;
    amount: number;
    description: string;
    accountNumber: string;
    accountName: string;
    expiresAt: string;
  };
}

// ==================== Service ====================

export const transactionService = {
  // Create transaction
  createTransaction: async (data: CreateTransactionRequest): Promise<SepayPaymentQRResponse> => {
    return api.post<SepayPaymentQRResponse>('/transactions', data);
  },

  // Get all transactions (Admin only)
  getAllTransactions: async (params?: QueryTransactionsParams): Promise<TransactionListResponse> => {
    return api.get<TransactionListResponse>('/transactions', { params });
  },

  // Get transaction stats (Admin only)
  getStats: async (): Promise<TransactionStatsResponse> => {
    return api.get<TransactionStatsResponse>('/transactions/stats');
  },

  // Get my transactions
  getMyTransactions: async (params?: QueryTransactionsParams): Promise<TransactionListResponse> => {
    return api.get<TransactionListResponse>('/transactions/my-transactions', { params });
  },

  // Get transaction by ID
  getById: async (id: number): Promise<Transaction> => {
    return api.get<Transaction>(`/transactions/${id}`);
  },

  // Refund transaction (Admin only)
  refundTransaction: async (id: number, data?: RefundTransactionRequest): Promise<Transaction> => {
    return api.post<Transaction>(`/transactions/${id}/refund`, data);
  },

  // Sepay webhook (backend only, not used in FE)
  // sepayWebhook: async (data: any): Promise<any> => {
  //   return api.post<any>('/transactions/sepay-webhook', data);
  // },
};

// ==================== React Query Hooks ====================

const QUERY_KEYS = {
  transactions: {
    all: ['transactions'] as const,
    list: (params?: QueryTransactionsParams) => ['transactions', 'list', params] as const,
    myTransactions: (params?: QueryTransactionsParams) => ['transactions', 'my', params] as const,
    detail: (id: number) => ['transactions', 'detail', id] as const,
    stats: ['transactions', 'stats'] as const,
  },
};

export const useTransactions = (params?: QueryTransactionsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.transactions.list(params),
    queryFn: () => transactionService.getAllTransactions(params),
  });
};

export const useMyTransactions = (params?: QueryTransactionsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.transactions.myTransactions(params),
    queryFn: () => transactionService.getMyTransactions(params),
  });
};

export const useTransactionStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.transactions.stats,
    queryFn: () => transactionService.getStats(),
  });
};

export const useTransaction = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.transactions.detail(id),
    queryFn: () => transactionService.getById(id),
    enabled: !!id && id > 0,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => transactionService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
    },
  });
};

export const useRefundTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: RefundTransactionRequest }) =>
      transactionService.refundTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
    },
  });
};
