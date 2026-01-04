import "@/styles/subscription.css";
import backgroundImg from "@/assets/background-subscription.jpg";
import { SubscriptionHeader, SubscriptionCardsGrid } from "../components";
import { useSubscriptionPlans } from "@/shared/hooks/useSubscriptionPlans";
import { usePageBackground } from "@/shared/hooks/usePageBackground";
import { useSubscribe } from "@/core/services/subscription.service";
import { toast } from "sonner";

const LoadingState = () => (
  <div className="subscription-loading">
    <div className="subscription-loading__text">Loading...</div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="subscription-error">
    <div className="subscription-error__text">Error: {error}</div>
  </div>
);

export default function PremiumSubscriptionsPage() {
  const { plans, loading, error } = useSubscriptionPlans();
  const subscribeMutation = useSubscribe();
  usePageBackground(backgroundImg);

  const handleSubscribe = async (planId: number) => {
    try {
      await subscribeMutation.mutateAsync(planId);
      toast.success("Subscription successful! Welcome to Premium.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to subscribe. Please try again.");
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="subscription-page">
      <div className="subscription-container">
        <SubscriptionHeader />
        <SubscriptionCardsGrid plans={plans} onSubscribe={handleSubscribe} />
      </div>
    </div>
  );
};

