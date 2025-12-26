import React from 'react';

interface BottomStat {
  id: number;
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  progress?: number;
  trendIcon?: React.ReactNode;
}

interface BottomStatsProps {
  stats: BottomStat[];
}

const BottomStats: React.FC<BottomStatsProps> = ({ stats }) => {
  return (
    <div className="bottom-stats">
      {stats.map((stat) => (
        <div key={stat.id} className="bottom-stat-card">
          <div className="bottom-stat-card__header">
            <div className="bottom-stat-card__icon">{stat.icon}</div>
            {stat.trendIcon && (
              <div className="bottom-stat-card__trend">{stat.trendIcon}</div>
            )}
          </div>
          <div className="bottom-stat-card__value">{stat.value}</div>
          <div className="bottom-stat-card__title">{stat.title}</div>
          {stat.progress !== undefined && (
            <div className="bottom-stat-card__progress">
              <div 
                className="bottom-stat-card__progress-bar" 
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          )}
          {stat.subtitle && (
            <div className="bottom-stat-card__subtitle">{stat.subtitle}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BottomStats;
