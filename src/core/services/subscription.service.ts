import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/config/api.config';
import { SubscriptionPlan } from "@/types/subscription.types";

export const subscriptionService = {
  // Fetch subscription plans
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await api.get<SubscriptionPlan[] | { data: SubscriptionPlan[] }>('/subscription-plans');
    
    // Handle both direct array and object with data property
    const plans = Array.isArray(response) ? response : (response.data || []);
    
    // Sort by duration (Annual first, then Quarterly, then Monthly)
    return plans.sort(
      (a: SubscriptionPlan, b: SubscriptionPlan) => b.durationMonths - a.durationMonths
    );
  },

  // Subscribe to a plan
  subscribe: async (planId: number): Promise<void> => {
    return api.post<void>('/subscriptions', { planId });
  },
};

// Legacy export for backward compatibility
export const fetchSubscriptionPlans = subscriptionService.getPlans;
export const subscribeToPlan = subscriptionService.subscribe;

// React Query hooks
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionService.getPlans(),
  });
};

export const useSubscribe = () => {
  return useMutation({
    mutationFn: (planId: number) => subscriptionService.subscribe(planId),
  });
};
