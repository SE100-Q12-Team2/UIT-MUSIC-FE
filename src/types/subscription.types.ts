export interface SubscriptionPlan {
  id: number;
  planName: string;
  durationMonths: number;
  price: number;
  features?: {
    feature?: string[];
  };
  isActive: boolean;
  createdAt: string;
}

export interface SubscriptionPlansResponse {
  data: SubscriptionPlan[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}
