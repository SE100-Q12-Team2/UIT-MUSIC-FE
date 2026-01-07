import { SubscriptionPlan } from "@/types/subscription.types";
import SubscriptionCard from "./SubscriptionCard";

interface SubscriptionCardsGridProps {
  plans: SubscriptionPlan[];
  onSubscribe?: (planId: number) => void;
  isSubscribing?: boolean;
}

const SubscriptionCardsGrid = ({ plans, onSubscribe, isSubscribing }: SubscriptionCardsGridProps) => {
  return (
    <div className="subscription-cards">
      {plans.map((plan) => (
        <SubscriptionCard
          key={plan.id}
          plan={plan}
          onSubscribe={onSubscribe}
          isSubscribing={isSubscribing}
        />
      ))}
    </div>
  );
};

export default SubscriptionCardsGrid;
