import { SubscriptionPlan } from "@/types/subscription.types";

// API configuration - easy to update when auth is implemented
const API_CONFIG = {
  baseUrl: "http://localhost:3000",
  endpoints: {
    subscriptionPlans: "/subscription-plans",
  },
};

// Token management - will be replaced with auth context/store
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
  // Temporary hardcoded token for testing
};

// Helper function to create headers
const createHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

// Fetch subscription plans
export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.subscriptionPlans}`,
    {
      headers: createHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch subscription plans");
  }

  const data = await response.json();
  
  // Sort by duration (Annual first, then Quarterly, then Monthly)
  return data.data.sort(
    (a: SubscriptionPlan, b: SubscriptionPlan) => b.durationMonths - a.durationMonths
  );
};

// Subscribe to a plan
export const subscribeToPlan = async (planId: number): Promise<void> => {
  
};
