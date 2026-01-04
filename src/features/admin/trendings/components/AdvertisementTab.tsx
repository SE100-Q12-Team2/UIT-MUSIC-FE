import React from 'react';

const AdvertisementTab: React.FC = () => {
  const stats = [
    {
      id: 1,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      title: 'Active Campaigns',
      value: '12',
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
      value: '2.4M',
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
      value: '3.8%',
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
      value: '$18,420',
      change: 12.3,
      iconColor: '#10B981',
    },
  ];

  const campaigns = [
    {
      id: 1,
      name: 'Summer Music Festival 2024',
      impressions: '840K impressions',
      clicks: '33K clicks',
      status: 'Active',
      statusClass: 'campaign-status--active',
    },
    {
      id: 2,
      name: 'New Album Release - Sơn Tùng',
      impressions: '520K impressions',
      clicks: '19K clicks',
      status: 'Active',
      statusClass: 'campaign-status--active',
    },
    {
      id: 3,
      name: 'Premium Upgrade Promotion',
      impressions: '680K impressions',
      clicks: '4K clicks',
      status: 'Active',
      statusClass: 'campaign-status--active',
    },
    {
      id: 4,
      name: 'Spotify Alternative Campaign',
      impressions: '380K impressions',
      clicks: '14K clicks',
      status: 'Paused',
      statusClass: 'campaign-status--paused',
    },
  ];

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
              {stat.change >= 0 ? '+' : ''}{stat.change}%
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
      </div>
    </div>
  );
};

export default AdvertisementTab;
