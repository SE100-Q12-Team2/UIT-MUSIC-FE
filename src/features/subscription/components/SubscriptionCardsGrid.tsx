import { SubscriptionPlan } from "@/types/subscription.types";
import SubscriptionCard from "./SubscriptionCard";

interface SubscriptionCardsGridProps {
  plans: SubscriptionPlan[];
  onSubscribe?: (planId: number) => void;
}

const SubscriptionCardsGrid = ({ plans, onSubscribe }: SubscriptionCardsGridProps) => {
  return (
    <div className="subscription-cards">
      {plans.map((plan) => (
        <SubscriptionCard
          key={plan.id}
          plan={plan}
          
          onSubscribe={onSubscribe}
        />
      ))}
    </div>
  );
};

export default SubscriptionCardsGrid;
