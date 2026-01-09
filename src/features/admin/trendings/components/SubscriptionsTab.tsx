import React, { useState, useEffect } from 'react';
import { adminApi, EngagementStatsResponse, RevenueStatsResponse } from '@/core/api/admin.api';
import { useSubscriptionPlans } from '@/core/services/subscription.service';
import '@/styles/loading.css';

const SubscriptionsTab: React.FC = () => {
  const [engagementStats, setEngagementStats] = useState<EngagementStatsResponse | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { data: subscriptionPlansFromAPI, isLoading: plansLoading } = useSubscriptionPlans({ isActive: 'true' });

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  const fetchSubscriptionData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getDateRange();
      const [engagement, revenue] = await Promise.all([
        adminApi.getEngagementStats(startDate, endDate),
        adminApi.getRevenueStats(startDate, endDate),
      ]);
      setEngagementStats(engagement);
      setRevenueStats(revenue);
    } catch (err) {
      setError('Failed to load subscription data');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num?: number | null): string => {
    if (num === null || num === undefined || Number.isNaN(num)) {
      return '0';
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const formatCurrency = (amount?: number | null): string => {
    if (!amount) return '$0';
    return `$${formatNumber(amount)}`;
  };

  const calculateConversionRate = (): string => {
    if (!engagementStats) return '0%';
    const rate = engagementStats.totalUsers > 0 
      ? (engagementStats.premiumUsers / engagementStats.totalUsers) * 100 
      : 0;
    return `${rate.toFixed(1)}%`;
  };

  if (isLoading || plansLoading) {
    return (
      <div className="subscriptions-tab">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading subscription data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subscriptions-tab">
        <div className="admin-home__error">
          <p>{error}</p>
          <button onClick={fetchSubscriptionData} className="admin-home__retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = engagementStats && revenueStats ? [
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
      value: formatNumber(engagementStats.freeUsers),
      change: engagementStats.totalUsers > 0 ? 
        ((engagementStats.freeUsers / engagementStats.totalUsers) * 100) : 0,
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
      value: formatNumber(engagementStats.premiumUsers),
      change: engagementStats.totalUsers > 0 ? 
        ((engagementStats.premiumUsers / engagementStats.totalUsers) * 100) : 0,
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
      value: formatCurrency(revenueStats.summary.totalRevenueSubscription),
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
      value: calculateConversionRate(),
      change: 5.8,
      iconColor: '#8B5CF6',
    },
  ] : [];

  const subscriptionPlans = subscriptionPlansFromAPI && engagementStats ? subscriptionPlansFromAPI.map((plan, index) => {
    const isFree = plan.price === 0;
    const isPremium = !isFree;
    
    // Parse features from string or array
    let features: string[] = [];
    if (typeof plan.features === 'string') {
      try {
        features = JSON.parse(plan.features);
      } catch {
        features = plan.features.split(',').map(f => f.trim());
      }
    } else if (Array.isArray(plan.features)) {
      features = plan.features;
    }
    
    // Calculate active users based on plan type
    let activeUsers = '';
    if (isFree) {
      activeUsers = `${formatNumber(engagementStats.freeUsers)} active users`;
    } else {
      activeUsers = `${formatNumber(Math.floor(engagementStats.premiumUsers * 1))} active users`;
    }
    
    // Determine bg class
    let bgClass = 'subscription-card--premium';
    if (isFree) bgClass = 'subscription-card--free';
    
    // Add badge for most popular (usually monthly premium)
    const badge = isPremium ? 'Most Popular' : undefined;
    
    // Format price and period
    const priceFormatted = isFree ? '$0' : `$${plan.price.toFixed(2)}`;
    const period = isFree ? '' : plan.durationMonths >= 12 ? '/yr' : '/mo';
    
    return {
      id: plan.id,
      name: plan.name,
      price: priceFormatted,
      period,
      badge,
      features: features.length > 0 ? features : [
        isFree ? 'Ad-supported' : 'Ad-free',
        isFree ? 'Standard quality' : 'HD quality',
        isFree ? 'Limited skips' : 'Offline mode',
      ],
      activeUsers,
      bgClass,
    };
  }).sort((a, b) => {
    // Sort: Free first, then Premium, then Annual
    if (a.price === '$0') return -1;
    if (b.price === '$0') return 1;
    if (a.period === '/mo') return -1;
    if (b.period === '/mo') return 1;
    return 0;
  }) : [];

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
