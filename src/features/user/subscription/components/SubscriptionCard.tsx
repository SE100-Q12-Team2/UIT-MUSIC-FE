import { Headphones, Download, AudioLines, Loader2 } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription.types";

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  onSubscribe?: (planId: number) => void;
  isSubscribing?: boolean;
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
  return price.toFixed(2);
};

// Extract features from plan
const getFeatures = (plan: SubscriptionPlan): string[] => {
  // Handle different response formats
  if (Array.isArray(plan.features)) {
    return plan.features as string[];
  }
  if (plan.features?.feature && Array.isArray(plan.features.feature)) {
    return plan.features.feature;
  }
  // Default features if none provided
  return [
    "Ad-free listening",
    "Offline downloads",
    "High-quality audio"
  ];
};

const SubscriptionCard = ({
  plan,
  onSubscribe,
  isSubscribing = false,
}: SubscriptionCardProps) => {
  const handleSubscribe = () => {
    if (!isSubscribing) {
      onSubscribe?.(plan.id);
    }
  };

  const features = getFeatures(plan);

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
        {features.map((feature, index) => (
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
        disabled={isSubscribing}
      >
        {isSubscribing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          "Subscribe"
        )}
      </button>
    </div>
  );
};

export default SubscriptionCard;
