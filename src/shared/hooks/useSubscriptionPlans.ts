import { useState, useEffect } from "react";
import { SubscriptionPlan } from "@/types/subscription.types";
import { fetchSubscriptionPlans } from "../../core/services/subscription.service";

interface UseSubscriptionPlansResult {
  plans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSubscriptionPlans = (): UseSubscriptionPlansResult => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSubscriptionPlans();
      setPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    loading,
    error,
    refetch: fetchPlans,
  };
};
