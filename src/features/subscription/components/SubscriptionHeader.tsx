interface SubscriptionHeaderProps {
  title?: string;
  subtitle?: string;
}

const SubscriptionHeader = ({
  title = "Unlock Your Music Potential",
  subtitle = "Enjoy Unlimited Streaming With Premium Access",
}: SubscriptionHeaderProps) => {
  return (
    <div className="subscription-header">
      <h1 className="subscription-title">{title}</h1>
      <p className="subscription-subtitle">{subtitle}</p>
    </div>
  );
};

export default SubscriptionHeader;
