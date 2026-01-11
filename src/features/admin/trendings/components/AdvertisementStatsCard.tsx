import React from 'react';

interface AdvertisementStatsCardProps {
  iconType: 'campaign' | 'impression' | 'click' | 'revenue';
  title: string;
  value: string;
  change: number;
  iconColor: string;
}

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'campaign':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case 'impression':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    case 'click':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case 'revenue':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    default:
      return null;
  }
};

export const AdvertisementStatsCard: React.FC<AdvertisementStatsCardProps> = ({
  iconType,
  title,
  value,
  change,
  iconColor,
}) => {
  return (
    <div className="analytics-stat-card">
      <div className="analytics-stat-card__icon" style={{ color: iconColor }}>
        {getIcon(iconType)}
      </div>
      <div className="analytics-stat-card__content">
        <div className="analytics-stat-card__value">{value}</div>
        <div className="analytics-stat-card__title">{title}</div>
      </div>
      <div className={`analytics-stat-card__change ${change >= 0 ? 'analytics-stat-card__change--positive' : 'analytics-stat-card__change--negative'}`}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={change >= 0 ? "M12 19V5M5 12l7-7 7 7" : "M12 5v14M19 12l-7 7-7-7"} />
        </svg>
      </div>
    </div>
  );
};
