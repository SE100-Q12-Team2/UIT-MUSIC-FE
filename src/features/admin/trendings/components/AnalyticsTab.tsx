import React from 'react';

const AnalyticsTab: React.FC = () => {
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
      title: 'Total Streams',
      value: '8.4M',
      change: 15.3,
      iconColor: '#10B981',
    },
    {
      id: 2,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'Active Users',
      value: '42,384',
      change: 8.7,
      iconColor: '#3B82F6',
    },
    {
      id: 3,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: 'Avg. Session',
      value: '24 min',
      change: 13.2,
      iconColor: '#8B5CF6',
    },
    {
      id: 4,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: 'Skip Rate',
      value: '12.5%',
      change: -2.1,
      iconColor: '#F59E0B',
    },
  ];

  const topGenres = [
    { id: 1, name: 'V-Pop', streams: '3.8M', percentage: 45 },
    { id: 2, name: 'Ballad', streams: '2.4M', percentage: 28 },
    { id: 3, name: 'R&B', streams: '1.3M', percentage: 15 },
    { id: 4, name: 'EDM', streams: '900K', percentage: 11 },
  ];

  return (
    <div className="analytics-tab">
      {/* Top Stats */}
      <div className="analytics-tab__stats">
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

      {/* Streaming Overview */}
      <div className="analytics-tab__overview">
        <h2 className="analytics-tab__section-title">Streaming Overview</h2>
        <div className="analytics-chart-placeholder">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <p>Chart visualization area</p>
        </div>
      </div>

      {/* Top Genres */}
      <div className="analytics-tab__genres">
        <h2 className="analytics-tab__section-title">Top Genres</h2>
        <div className="genre-list">
          {topGenres.map((genre) => (
            <div key={genre.id} className="genre-item">
              <div className="genre-item__info">
                <div className="genre-item__name">{genre.name}</div>
                <div className="genre-item__streams">{genre.streams}</div>
              </div>
              <div className="genre-item__bar-container">
                <div 
                  className="genre-item__bar" 
                  style={{ width: `${genre.percentage}%` }}
                />
              </div>
              <div className="genre-item__percentage">{genre.percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
