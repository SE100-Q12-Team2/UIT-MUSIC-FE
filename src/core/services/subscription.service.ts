import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config/api.config';
import { SubscriptionPlan } from "@/types/subscription.types";

// ==================== Types ====================

export interface UserSubscription {
  id: number;
  userId: number;
  planId: number;
  plan?: SubscriptionPlan;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
  status: 'Active' | 'Cancelled' | 'Expired' | 'Pending';
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscriptionsResponse {
  items: UserSubscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserSubscriptionsQuery {
  page?: number;
  limit?: number;
  isActive?: string;
  planId?: number;
}

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  subscription?: UserSubscription;
  status: 'Active' | 'Cancelled' | 'Expired' | 'None';
}

export interface UpdateSubscriptionRequest {
  autoRenew?: boolean;
}

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
}

export interface TransactionsResponse {
  items: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionsQuery {
  page: number;
  limit: number;
}

export interface CreateTransactionRequest {
  subscriptionId?: number;
  amount: number;
  paymentMethodId: number;
  returnUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface SubscriptionPlanQuery {
  page?: number;
  limit?: number;
  isActive?: string;
  search?: string;
}

// ==================== Service ====================

export const subscriptionService = {
  // Subscription Plans
  getPlans: async (query?: SubscriptionPlanQuery): Promise<SubscriptionPlan[]> => {
    const response = await api.get<SubscriptionPlan[] | { data: SubscriptionPlan[] }>('/subscription-plans', { params: query });
    
    // Handle both direct array and object with data property
    const plans = Array.isArray(response) ? response : (response.data || []);
    
    // Sort by duration (Annual first, then Quarterly, then Monthly)
    return plans.sort(
      (a: SubscriptionPlan, b: SubscriptionPlan) => b.durationMonths - a.durationMonths
    );
  },

  getPlanById: async (id: number): Promise<SubscriptionPlan> => {
    return api.get<SubscriptionPlan>(`/subscription-plans/${id}`);
  },

  // User Subscriptions
  subscribe: async (planId: number, autoRenew: boolean = false): Promise<UserSubscription> => {
    return api.post<UserSubscription>('/user-subscriptions', { planId, autoRenew });
  },

  getMySubscriptions: async (query?: UserSubscriptionsQuery): Promise<UserSubscriptionsResponse> => {
    return api.get<UserSubscriptionsResponse>('/user-subscriptions', { params: query });
  },

  getActiveSubscription: async (): Promise<UserSubscription | null> => {
    try {
      return await api.get<UserSubscription>('/user-subscriptions/active');
    } catch (error: any) {
      // If no active subscription, return null
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getSubscriptionStatus: async (): Promise<SubscriptionStatus> => {
    return api.get<SubscriptionStatus>('/user-subscriptions/status');
  },

  getSubscriptionById: async (id: number): Promise<UserSubscription> => {
    return api.get<UserSubscription>(`/user-subscriptions/${id}`);
  },

  updateSubscription: async (id: number, data: UpdateSubscriptionRequest): Promise<UserSubscription> => {
    return api.patch<UserSubscription>(`/user-subscriptions/${id}`, data);
  },

  cancelSubscription: async (id: number): Promise<UserSubscription> => {
    return api.patch<UserSubscription>(`/user-subscriptions/${id}/cancel`);
  },

  renewSubscription: async (id: number): Promise<UserSubscription> => {
    return api.patch<UserSubscription>(`/user-subscriptions/${id}/renew`);
  },

  // Transactions
  createTransaction: async (data: CreateTransactionRequest): Promise<Transaction> => {
    return api.post<Transaction>('/transactions', data);
  },

  getMyTransactions: async (query: TransactionsQuery): Promise<TransactionsResponse> => {
    return api.get<TransactionsResponse>('/transactions/my-transactions', { params: query });
  },

  getTransactionById: async (id: number): Promise<Transaction> => {
    return api.get<Transaction>(`/transactions/${id}`);
  },
};

// Legacy export for backward compatibility
export const fetchSubscriptionPlans = subscriptionService.getPlans;
export const subscribeToPlan = subscriptionService.subscribe;

// ==================== React Query Hooks ====================

// Subscription Plans Hooks
export const useSubscriptionPlans = (query?: SubscriptionPlanQuery) => {
  return useQuery({
    queryKey: ['subscription-plans', query],
    queryFn: () => subscriptionService.getPlans(query),
  });
};

export const useSubscriptionPlan = (id: number | undefined) => {
  return useQuery({
    queryKey: ['subscription-plans', id],
    queryFn: () => subscriptionService.getPlanById(id!),
    enabled: !!id && id > 0,
  });
};

// User Subscriptions Hooks
export const useSubscribe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, autoRenew }: { planId: number; autoRenew?: boolean }) => 
      subscriptionService.subscribe(planId, autoRenew),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
      queryClient.invalidateQueries({ queryKey: ['active-subscription'] });
    },
  });
};

export const useMySubscriptions = (query?: UserSubscriptionsQuery) => {
  return useQuery({
    queryKey: ['user-subscriptions', query],
    queryFn: () => subscriptionService.getMySubscriptions(query),
  });
};

export const useActiveSubscription = () => {
  return useQuery({
    queryKey: ['active-subscription'],
    queryFn: () => subscriptionService.getActiveSubscription(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: ['subscription-status'],
    queryFn: () => subscriptionService.getSubscriptionStatus(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSubscription = (id: number | undefined) => {
  return useQuery({
    queryKey: ['user-subscriptions', id],
    queryFn: () => subscriptionService.getSubscriptionById(id!),
    enabled: !!id && id > 0,
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubscriptionRequest }) =>
      subscriptionService.updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
      queryClient.invalidateQueries({ queryKey: ['active-subscription'] });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => subscriptionService.cancelSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
      queryClient.invalidateQueries({ queryKey: ['active-subscription'] });
    },
  });
};

export const useRenewSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => subscriptionService.renewSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
      queryClient.invalidateQueries({ queryKey: ['active-subscription'] });
    },
  });
};

// Transactions Hooks
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => subscriptionService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useMyTransactions = (query: TransactionsQuery) => {
  return useQuery({
    queryKey: ['transactions', 'my-transactions', query],
    queryFn: () => subscriptionService.getMyTransactions(query),
  });
};

export const useTransaction = (id: number | undefined) => {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => subscriptionService.getTransactionById(id!),
    enabled: !!id && id > 0,
  });
};
