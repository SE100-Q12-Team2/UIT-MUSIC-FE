import "@/styles/subscription.css";
import backgroundImg from "@/assets/background-subscription.jpg";
import { SubscriptionHeader, SubscriptionCardsGrid } from "../components";
import { PaymentModal } from "../components/PaymentModal";
import { usePageBackground } from "@/shared/hooks/usePageBackground";
import { useSubscriptionPlans } from "@/core/services/subscription.service";
import { SubscriptionPlan } from "@/types/subscription.types";
import { useState } from "react";


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
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  usePageBackground(backgroundImg);

  const handleSubscribe = (planId: number) => {
    const plan = plans?.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setIsPaymentModalOpen(true);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    setSelectedPlan(null);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPlan(null);
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
        <SubscriptionCardsGrid plans={plans || []} onSubscribe={handleSubscribe} isSubscribing={false} />
      </div>
      
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          isOpen={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

