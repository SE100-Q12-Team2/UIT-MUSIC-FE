import { Headphones, Download, AudioLines } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription.types";

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  onSubscribe?: (planId: number) => void;
}

// Map feature text to icons
const getFeatureIcon = (feature: string) => {
  const lowerFeature = feature.toLowerCase();
  
  if (lowerFeature.includes("ad-free") || lowerFeature.includes("listening")) {
    return <Headphones className="plan-feature__icon" />;
  }
  if (lowerFeature.includes("download")) {
    return <Download className="plan-feature__icon" />;
  }
  if (lowerFeature.includes("audio") || lowerFeature.includes("quality")) {
    return <AudioLines className="plan-feature__icon" />;
  }
  
  return <Headphones className="plan-feature__icon" />;
};

// Get tagline based on plan name
const getTagline = (planName: string): string => {
  const taglines: Record<string, string> = {
    "Annual Subscription": "Your Musical Journey Awaits",
    "Monthly Subscription": "Unlock The Rhythm",
    "Quarterly Subscription": "Amplify Your Tunes",
  };
  return taglines[planName] || "Start Your Journey";
};

// Format price for display
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

const SubscriptionCard = ({
  plan,
  onSubscribe,
}: SubscriptionCardProps) => {
  const handleSubscribe = () => {
    onSubscribe?.(plan.id);
  };

  return (
    <div className="subscription-card">
      {/* Plan Name */}
      <div className="plan-name">
        {plan.planName}
      </div>

      {/* Tagline */}
      <h3 className="plan-tagline">
        {getTagline(plan.planName)}
      </h3>

      {/* Price */}
      <div className="plan-price">
        <span className="plan-price__currency">$</span>
        <span className="plan-price__amount">
          {formatPrice(plan.price)}
        </span>
      </div>

      {/* Features */}
      <ul className="plan-features">
        {plan.features.feature?.map((feature, index) => (
          <li key={index} className="plan-feature">
            {getFeatureIcon(feature)}
            <span className="plan-feature__text">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Subscribe Button */}
      <button
        className="subscribe-btn"
        onClick={handleSubscribe}
      >
        Subscribe
      </button>
    </div>
  );
};

export default SubscriptionCard;
