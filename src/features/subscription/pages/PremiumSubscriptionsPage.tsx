import "@/styles/subscription.css";
import backgroundImg from "@/assets/background-subscription.jpg";
import { SubscriptionHeader, SubscriptionCardsGrid } from "../components";
import { useSubscriptionPlans } from "../../../shared/hooks/useSubscriptionPlans";
import Footer from "@/shared/components/ui/footer";

const PremiumSubscriptionsPage = () => {
  const { plans, loading, error } = useSubscriptionPlans();

  const handleSubscribe = (planId: number) => {
    // TODO: Implement subscription logic
    console.log("Subscribe to plan:", planId);
  };

  if (loading) {
    return (
      <div
        className="subscription-loading"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="subscription-loading__text">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="subscription-error"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="subscription-error__text">Error: {error}</div>
      </div>
    );
  }

  return (
    <div
      className="subscription-page"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="subscription-container">
        <SubscriptionHeader />
        <SubscriptionCardsGrid plans={plans} onSubscribe={handleSubscribe} />
      </div>
      <Footer />
    </div>
  );
};

export default PremiumSubscriptionsPage;
