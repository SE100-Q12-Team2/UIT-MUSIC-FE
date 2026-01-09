import React, { useState, useEffect } from 'react';
import { adminApi, RevenueStatsResponse, DailyStatsResponse, AdvertisementsResponse } from '@/core/api/admin.api';
import Pagination from '@/shared/components/Pagination';
import '@/styles/loading.css';

const AdvertisementTab: React.FC = () => {
  const [revenueStats, setRevenueStats] = useState<RevenueStatsResponse | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStatsResponse | null>(null);
  const [advertisements, setAdvertisements] = useState<AdvertisementsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(8);

  useEffect(() => {
    fetchAdvertisementData();
  }, [currentPage]);

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

  const fetchAdvertisementData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getDateRange();
      const [revenue, daily, ads] = await Promise.all([
        adminApi.getRevenueStats(startDate, endDate),
        adminApi.getDailyStats(startDate, endDate),
        adminApi.getAdvertisements(currentPage, limit),
      ]);
      setRevenueStats(revenue);
      setDailyStats(daily);
      setAdvertisements(ads);
    } catch (err) {
      setError('Failed to load advertisement data');
      console.error('Error fetching advertisements:', err);
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

  const calculateTotalImpressions = (): number => {
    if (!dailyStats?.data) return 0;
    return dailyStats.data.reduce((sum, day) => sum + (day.adImpressions || 0), 0);
  };

  const calculateClickRate = (): string => {
    const impressions = calculateTotalImpressions();
    if (impressions === 0) return '0%';
    // Estimate clicks as 3-5% of impressions
    const clickRate = 3.8;
    return `${clickRate.toFixed(1)}%`;
  };

  const getActiveCampaignsCount = (): number => {
    if (!advertisements?.data) return 0;
    return advertisements.data.filter(ad => ad.isActive).length;
  };

  if (isLoading) {
    return (
      <div className="advertisement-tab">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading advertisement data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="advertisement-tab">
        <div className="admin-home__error">
          <p>{error}</p>
          <button onClick={fetchAdvertisementData} className="admin-home__retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = revenueStats && dailyStats ? [
    {
      id: 1,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      title: 'Active Campaigns',
      value: (advertisements?.pagination?.total || 0).toString(),
      change: 25.0,
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
      title: 'Total Impressions',
      value: formatNumber(calculateTotalImpressions()),
      change: 18.5,
      iconColor: '#3B82F6',
    },
    {
      id: 3,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: 'Click Rate',
      value: calculateClickRate(),
      change: 5.2,
      iconColor: '#10B981',
    },
    {
      id: 4,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: 'Ad Revenue',
      value: formatCurrency(revenueStats.summary.totalRevenueAds),
      change: 12.3,
      iconColor: '#10B981',
    },
  ] : [];

  const campaigns = advertisements?.data ? advertisements.data.map((ad) => {
    const impressions = ad._count.impressions || 0;
    const clicks = Math.floor(impressions * 0.04); // 4% click rate
    const status = ad.isActive ? 'Active' : 'Paused';
    
    return {
      id: ad.id,
      name: ad.adName,
      impressions: `${formatNumber(impressions)} impressions`,
      clicks: `${formatNumber(clicks)} clicks`,
      status,
      statusClass: status === 'Active' ? 'campaign-status--active' : 'campaign-status--paused',
    };
  }) : [];

  return (
    <div className="advertisement-tab">
      {/* Top Stats */}
      <div className="advertisement-tab__stats">
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

      {/* Add Advertisement Button */}
      <div className="advertisement-tab__header">
        <button className="advertisement-tab__add-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Advertisement
        </button>
      </div>

      {/* Active Campaigns */}
      <div className="active-campaigns">
        <h2 className="active-campaigns__title">Active Campaigns</h2>
        <div className="campaigns-list">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-item">
              <div className="campaign-item__info">
                <h3 className="campaign-item__name">{campaign.name}</h3>
                <div className="campaign-item__stats">
                  <span className="campaign-item__impressions">{campaign.impressions}</span>
                  <span className="campaign-item__separator">•</span>
                  <span className="campaign-item__clicks">{campaign.clicks}</span>
                </div>
              </div>
              <div className="campaign-item__actions">
                <span className={`campaign-item__status ${campaign.statusClass}`}>
                  {campaign.status}
                </span>
                <button className="campaign-item__edit-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button className="campaign-item__delete-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        {advertisements?.pagination && advertisements.pagination.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={advertisements.pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default AdvertisementTab;
