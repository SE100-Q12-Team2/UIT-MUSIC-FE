import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change: number;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, iconColor }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{ color: iconColor }}>
        {icon}
      </div>
      <div className="stat-card__content">
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__title">{title}</div>
      </div>
      <div className={`stat-card__change ${isPositive ? 'stat-card__change--positive' : 'stat-card__change--negative'}`}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={isPositive ? "M12 19V5M5 12l7-7 7 7" : "M12 5v14M19 12l-7 7-7-7"} />
        </svg>
        {isPositive ? '+' : ''}{Math.floor(change)}%
      </div>
    </div>
  );
};

export default StatCard;
