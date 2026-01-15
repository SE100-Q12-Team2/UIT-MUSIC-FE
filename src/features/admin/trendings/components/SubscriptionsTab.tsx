import React, { useState, useEffect } from 'react';
import { adminApi, SubscriptionStatsResponse, UpdateSubscriptionPlanRequest, SubscriptionPlanResponse } from '@/core/api/admin.api';
import { useSubscriptionPlans } from '@/core/services/subscription.service';
import '@/styles/loading.css';
import '@/styles/subscription.css';

const SubscriptionsTab: React.FC = () => {
  const [subscriptionStats, setSubscriptionStats] = useState<SubscriptionStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<{ id: number; name: string; price: number; durationMonths: number; features: [string, string, string]; isActive: boolean } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const { data: subscriptionPlansFromAPI, isLoading: plansLoading, refetch: refetchPlans } = useSubscriptionPlans({ isActive: 'true' });

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await adminApi.getSubscriptionStats();
      setSubscriptionStats(stats);
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

  const handleEditClick = (plan: any) => {
    // Parse features to array of 3 strings
    let featuresArray: [string, string, string] = ['', '', ''];
    if (Array.isArray(plan.features) && plan.features.length >= 3) {
      featuresArray = [plan.features[0] || '', plan.features[1] || '', plan.features[2] || ''];
    }
    
    setEditingPlan({
      id: plan.id,
      name: plan.name,
      price: parseFloat(plan.price.replace('$', '')),
      durationMonths: plan.period === '/mo' ? 1 : plan.period === '/yr' ? 12 : 0,
      features: featuresArray,
      isActive: true,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingPlan) return;
    
    setIsSaving(true);
    try {
      const featuresObj: { [key: string]: string } = {
        feature1: editingPlan.features[0],
        feature2: editingPlan.features[1],
        feature3: editingPlan.features[2],
      };

      const updateData: UpdateSubscriptionPlanRequest = {
        planName: editingPlan.name,
        durationMonths: editingPlan.durationMonths,
        price: editingPlan.price,
        features: featuresObj,
        isActive: editingPlan.isActive,
      };

      await adminApi.updateSubscriptionPlan(editingPlan.id, updateData);
      
      // Refresh data
      await Promise.all([
        fetchSubscriptionData(),
        refetchPlans(),
      ]);
      
      setIsEditModalOpen(false);
      setEditingPlan(null);
      showNotification('success', 'Subscription plan updated successfully!');
    } catch (err) {
      console.error('Error updating subscription plan:', err);
      showNotification('error', 'Failed to update subscription plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingPlan(null);
  };

  const handleCreateClick = () => {
    setEditingPlan({
      id: 0, // 0 indicates new plan
      name: '',
      price: 0,
      durationMonths: 1,
      features: ['', '', ''],
      isActive: true,
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveCreate = async () => {
    if (!editingPlan) return;
    
    setIsSaving(true);
    try {
      const featuresObj: { [key: string]: string } = {
        feature1: editingPlan.features[0],
        feature2: editingPlan.features[1],
        feature3: editingPlan.features[2],
      };

      const createData: UpdateSubscriptionPlanRequest = {
        planName: editingPlan.name,
        durationMonths: editingPlan.durationMonths,
        price: editingPlan.price,
        features: featuresObj,
        isActive: editingPlan.isActive,
      };

      await adminApi.createSubscriptionPlan(createData);
      
      // Refresh data
      await Promise.all([
        fetchSubscriptionData(),
        refetchPlans(),
      ]);
      
      setIsCreateModalOpen(false);
      setEditingPlan(null);
      showNotification('success', 'Subscription plan created successfully!');
    } catch (err) {
      console.error('Error creating subscription plan:', err);
      showNotification('error', 'Failed to create subscription plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
    setEditingPlan(null);
  };

  const handleDeleteClick = async (planId: number, planName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${planName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.deleteSubscriptionPlan(planId);
      
      // Refresh data
      await Promise.all([
        fetchSubscriptionData(),
        refetchPlans(),
      ]);
      
      showNotification('success', `Subscription plan "${planName}" deleted successfully!`);
    } catch (err: any) {
      console.error('Error deleting subscription plan:', err);
      
      // Handle specific error for active plans
      const errorMessage = err?.response?.data?.message;
      if (Array.isArray(errorMessage) && errorMessage.some((e: any) => e.message === 'Error.CannotDeleteActivePlan')) {
        showNotification('error', `Cannot delete "${planName}": This plan has active subscribers. Please deactivate it or wait for subscriptions to expire.`);
      } else if (typeof errorMessage === 'string' && errorMessage.includes('CannotDeleteActivePlan')) {
        showNotification('error', `Cannot delete "${planName}": This plan has active subscribers. Please deactivate it or wait for subscriptions to expire.`);
      } else {
        const errorMsg = typeof errorMessage === 'string' ? errorMessage : 'Failed to delete subscription plan. Please try again.';
        showNotification('error', errorMsg);
      }
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
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

  const stats = subscriptionStats ? [
    {
      id: 1,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      title: 'Total Plans',
      value: subscriptionStats.totalPlans.toString(),
      change: 0,
      iconColor: '#8B5CF6',
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
      title: 'Active Plans',
      value: subscriptionStats.activePlans.toString(),
      change: subscriptionStats.totalPlans > 0 ? 
        ((subscriptionStats.activePlans / subscriptionStats.totalPlans) * 100) : 0,
      iconColor: '#10B981',
    },
    {
      id: 3,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'Total Subscribers',
      value: formatNumber(subscriptionStats.totalSubscribers),
      change: 15.2,
      iconColor: '#3B82F6',
    },
    {
      id: 4,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: 'Average Price',
      value: formatCurrency(subscriptionStats.averagePrice),
      change: 5.8,
      iconColor: '#10B981',
    },
  ] : [];

  const subscriptionPlans = subscriptionPlansFromAPI && subscriptionStats ? subscriptionPlansFromAPI.map((plan) => {
    const isFree = plan.price === 0;
    // Parse features from string or array
    let features: string[] = [];
    if (plan.features) {
      if (typeof plan.features === 'string') {
        try {
          features = JSON.parse(plan.features);
        } catch {
          features = (plan.features as string).split(',').map((f: string) => f.trim());
        }
      } else if (Array.isArray(plan.features)) {
        features = plan.features;
      }
    }
    
    // Get subscriber count from stats
    const planDist = subscriptionStats.planDistribution.find(p => p.planId === plan.id);
    const subscriberCount = planDist?.subscriberCount || 0;
    
    // Determine bg class
    let bgClass = 'subscription-card--premium';
    if (isFree) bgClass = 'subscription-card--free';
    
    // Add badge for most popular (highest subscriber count)
    const maxSubscribers = Math.max(...subscriptionStats.planDistribution.map(p => p.subscriberCount));
    const badge = subscriberCount === maxSubscribers && subscriberCount > 0 ? 'Most Popular' : undefined;
    
    // Format price and period
    const priceFormatted = isFree ? '$0' : `$${plan.price.toFixed(2)}`;
    const period = isFree ? '' : plan.durationMonths >= 12 ? '/yr' : '/mo';
    
    return {
      id: plan.id,
      name: plan.planName || 'Unknown Plan',
      price: priceFormatted,
      period,
      badge,
      features: features.length > 0 ? features : [
        isFree ? 'Ad-supported' : 'Ad-free',
        isFree ? 'Standard quality' : 'HD quality',
        isFree ? 'Limited skips' : 'Offline mode',
      ],
      activeUsers: `${formatNumber(subscriberCount)} subscribers`,
      bgClass,
      rawPlan: plan,
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
        <button className="subscriptions-tab__add-btn" onClick={handleCreateClick}>
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
              <button 
                className="subscription-card__edit-btn"
                onClick={() => handleEditClick(plan)}
                disabled={plan.price === '$0'}
                style={{ opacity: plan.price === '$0' ? 0.5 : 1, cursor: plan.price === '$0' ? 'not-allowed' : 'pointer' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
              <button 
                className="subscription-card__delete-btn"
                onClick={() => handleDeleteClick(plan.id, plan.name)}
                disabled={plan.price === '$0'}
                style={{ opacity: plan.price === '$0' ? 0.5 : 1, cursor: plan.price === '$0' ? 'not-allowed' : 'pointer' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Subscription Modal */}
      {isEditModalOpen && editingPlan && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Subscription Plan</h2>
              <button className="modal-close-btn" onClick={handleCancelEdit}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Plan Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  placeholder="Enter plan name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Duration (months)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingPlan.durationMonths}
                    onChange={(e) => setEditingPlan({ ...editingPlan, durationMonths: parseInt(e.target.value) || 0 })}
                    placeholder="Enter duration"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Feature 1 <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={editingPlan.features[0]}
                  onChange={(e) => setEditingPlan({ ...editingPlan, features: [e.target.value, editingPlan.features[1], editingPlan.features[2]] })}
                  placeholder="Enter first feature"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Feature 2 <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={editingPlan.features[1]}
                  onChange={(e) => setEditingPlan({ ...editingPlan, features: [editingPlan.features[0], e.target.value, editingPlan.features[2]] })}
                  placeholder="Enter second feature"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Feature 3 <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={editingPlan.features[2]}
                  onChange={(e) => setEditingPlan({ ...editingPlan, features: [editingPlan.features[0], editingPlan.features[1], e.target.value] })}
                  placeholder="Enter third feature"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={editingPlan.isActive}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                  />
                  <span className="form-checkbox-label">Active</span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="modal-btn modal-btn--cancel" 
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn--save" 
                onClick={handleSaveEdit}
                disabled={isSaving || !editingPlan.name || !editingPlan.features[0] || !editingPlan.features[1] || !editingPlan.features[2]}
              >
                {isSaving ? (
                  <>
                    <div className="spinner" style={{ width: '14px', height: '14px', marginRight: '8px' }}></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Subscription Modal */}
      {isCreateModalOpen && editingPlan && (
        <div className="modal-overlay" onClick={handleCancelCreate}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create Subscription Plan</h2>
              <button className="modal-close-btn" onClick={handleCancelCreate}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Plan Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  placeholder="Enter plan name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Duration (months) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingPlan.durationMonths}
                    onChange={(e) => setEditingPlan({ ...editingPlan, durationMonths: parseInt(e.target.value) || 0 })}
                    placeholder="Enter duration"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price ($) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Feature 1 <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={editingPlan.features[0]}
                  onChange={(e) => setEditingPlan({ ...editingPlan, features: [e.target.value, editingPlan.features[1], editingPlan.features[2]] })}
                  placeholder="Enter first feature"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Feature 2 <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={editingPlan.features[1]}
                  onChange={(e) => setEditingPlan({ ...editingPlan, features: [editingPlan.features[0], e.target.value, editingPlan.features[2]] })}
                  placeholder="Enter second feature"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Feature 3 <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={editingPlan.features[2]}
                  onChange={(e) => setEditingPlan({ ...editingPlan, features: [editingPlan.features[0], editingPlan.features[1], e.target.value] })}
                  placeholder="Enter third feature"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={editingPlan.isActive}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                  />
                  <span className="form-checkbox-label">Active</span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="modal-btn modal-btn--cancel" 
                onClick={handleCancelCreate}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn--save" 
                onClick={handleSaveCreate}
                disabled={isSaving || !editingPlan.name || !editingPlan.features[0] || !editingPlan.features[1] || !editingPlan.features[2]}
              >
                {isSaving ? (
                  <>
                    <div className="spinner" style={{ width: '14px', height: '14px', marginRight: '8px' }}></div>
                    Creating...
                  </>
                ) : (
                  'Create Plan'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`notification-toast notification-toast--${notification.type}`}>
          <div className="notification-toast__icon">
            {notification.type === 'success' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </div>
          <div className="notification-toast__content">
            <p className="notification-toast__message">{notification.message}</p>
          </div>
          <button 
            className="notification-toast__close"
            onClick={() => setNotification(null)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsTab;
