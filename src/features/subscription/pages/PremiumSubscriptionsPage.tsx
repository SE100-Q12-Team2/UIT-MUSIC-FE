import "@/styles/subscription.css";
import backgroundImg from "@/assets/background-subscription.jpg";
import { SubscriptionHeader, SubscriptionCardsGrid } from "../components";
import { useSubscriptionPlans } from "@/shared/hooks/useSubscriptionPlans";
import { usePageBackground } from "@/shared/hooks/usePageBackground";

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

export const PremiumSubscriptionsPage = () => {
  const { plans, loading, error } = useSubscriptionPlans();
  usePageBackground(backgroundImg);

  const handleSubscribe = (planId: number) => {
    console.log("Subscribe to plan:", planId);
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

