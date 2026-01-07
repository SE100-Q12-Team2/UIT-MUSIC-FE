import "@/styles/subscription.css";
import backgroundImg from "@/assets/background-subscription.jpg";
import { SubscriptionHeader, SubscriptionCardsGrid } from "../components";
import { usePageBackground } from "@/shared/hooks/usePageBackground";
import { useSubscriptionPlans, useSubscribe } from "@/core/services/subscription.service";
import { handleSubscriptionError } from "@/features/user/subscription/utils";
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
  const { data: plans, isLoading, isError, error } = useSubscriptionPlans();

  const subscribeMutation = useSubscribe();
  usePageBackground(backgroundImg);

  const handleSubscribe = async (planId: number) => {
    try {
      await subscribeMutation.mutateAsync(planId);
      toast.success("Subscription successful! Welcome to Premium.");
    } catch (error: any) {
      handleSubscriptionError(error);
    }
  };

  if (isLoading) return <LoadingState />;
  if (isError) {
    const errorMessage = typeof error === 'string'
      ? error
      : error?.message && typeof error.message === 'string'
        ? error.message
        : "Failed to load subscription plans";
    return <ErrorState error={errorMessage} />;
  }

  return (
    <div className="subscription-page">
      <div className="subscription-container">
        <SubscriptionHeader />
        <SubscriptionCardsGrid plans={plans || []} onSubscribe={handleSubscribe} isSubscribing={subscribeMutation.isPending} />
      </div>
    </div>
  );
};

