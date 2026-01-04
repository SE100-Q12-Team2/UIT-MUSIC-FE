import React from 'react';

const SubscriptionsTab: React.FC = () => {
  const stats = [
    {
      id: 1,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ),
      title: 'Free Users',
      value: '98,547',
      change: 15.3,
      iconColor: '#10B981',
    },
    {
      id: 2,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ),
      title: 'Premium Users',
      value: '27,300',
      change: 8.7,
      iconColor: '#3B82F6',
    },
    {
      id: 3,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: 'Monthly Revenue',
      value: '$52,480',
      change: 12.5,
      iconColor: '#10B981',
    },
    {
      id: 4,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: 'Conversion Rate',
      value: '21.7%',
      change: 5.8,
      iconColor: '#8B5CF6',
    },
  ];

  const subscriptionPlans = [
    {
      id: 1,
      name: 'Free',
      price: '$0',
      period: '',
      features: [
        'Ad-supported',
        'Standard quality',
        'Limited skips',
      ],
      activeUsers: '98,547 active users',
      bgClass: 'subscription-card--free',
    },
    {
      id: 2,
      name: 'Premium',
      price: '$4.99',
      period: '/mo',
      badge: 'Most Popular',
      features: [
        'Ad-free',
        'HD quality',
        'Offline mode',
      ],
      activeUsers: '19,100 active users',
      bgClass: 'subscription-card--premium',
    },
    {
      id: 3,
      name: 'Annual',
      price: '$49.99',
      period: '/yr',
      features: [
        'All Premium',
        'Family sharing',
        'Early access',
      ],
      activeUsers: '8,200 active users',
      bgClass: 'subscription-card--annual',
    },
  ];

  return (
    <div className="subscriptions-tab">
      {/* Top Stats */}
      <div className="subscriptions-tab__stats">
        {stats.map((stat) => (
          <div key={stat.id} className="analytics-stat-card">
            <div className="analytics-stat-card__icon" style={{ color: stat.iconColor }}>
              {stat.icon}
            </div>
            <div className="analytics-stat-card__content">
              <div className="analytics-stat-card__value">{stat.value}</div>
              <div className="analytics-stat-card__title">{stat.title}</div>
            </div>
            <div className={`analytics-stat-card__change ${stat.change >= 0 ? 'analytics-stat-card__change--positive' : 'analytics-stat-card__change--negative'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={stat.change >= 0 ? "M12 19V5M5 12l7-7 7 7" : "M12 5v14M19 12l-7 7-7-7"} />
              </svg>
              {stat.change >= 0 ? '+' : ''}{stat.change}%
            </div>
          </div>
        ))}
      </div>

      {/* Add Subscription Button */}
      <div className="subscriptions-tab__header">
        <button className="subscriptions-tab__add-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Subscription
        </button>
      </div>

      {/* Subscription Plans */}
      <div className="subscription-plans">
        {subscriptionPlans.map((plan) => (
          <div key={plan.id} className={`subscription-card ${plan.bgClass}`}>
            {plan.badge && (
              <div className="subscription-card__badge">{plan.badge}</div>
            )}
            <div className="subscription-card__header">
              <h3 className="subscription-card__name">{plan.name}</h3>
              <div className="subscription-card__price">
                <span className="subscription-card__price-value">{plan.price}</span>
                <span className="subscription-card__price-period">{plan.period}</span>
              </div>
            </div>
            <ul className="subscription-card__features">
              {plan.features.map((feature, index) => (
                <li key={index} className="subscription-card__feature">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="subscription-card__users">{plan.activeUsers}</div>
            <div className="subscription-card__actions">
              <button className="subscription-card__edit-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
              <button className="subscription-card__delete-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsTab;
