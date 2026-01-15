import React, { useState, useEffect } from 'react';
import { adminApi, EngagementStatsResponse, DailyStatsResponse } from '@/core/api/admin.api';
import StreamingChart from './StreamingChart';
import '@/styles/loading.css';

const AnalyticsTab: React.FC = () => {
  const [engagementStats, setEngagementStats] = useState<EngagementStatsResponse | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
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

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getDateRange();
      const [engagement, daily] = await Promise.all([
        adminApi.getEngagementStats(startDate, endDate),
        adminApi.getDailyStats(startDate, endDate),
      ]);
      setEngagementStats(engagement);
      setDailyStats(daily);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error fetching analytics:', err);
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

  const formatTime = (seconds?: number | null): string => {
    if (!seconds) return '0 min';
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h`;
    }
    return `${minutes} min`;
  };

  const calculateSkipRate = (): string => {
    if (!dailyStats?.summary) return '0%';
    // Estimate skip rate based on plays vs unique listeners ratio
    const ratio = dailyStats.summary.totalPlays / dailyStats.summary.totalUniqueListeners;
    const skipRate = Math.max(0, Math.min(100, (1 - (ratio / 10)) * 100));
    return `${skipRate.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="analytics-tab">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-tab">
        <div className="admin-home__error">
          <p>{error}</p>
          <button onClick={fetchAnalyticsData} className="admin-home__retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = engagementStats && dailyStats ? [
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
      value: formatNumber(dailyStats.summary.totalPlays),
      change: dailyStats.summary.avgDailyPlays > 0 ? 
        ((dailyStats.summary.totalPlays / dailyStats.summary.avgDailyPlays - 30) / 30 * 100) : 0,
      iconColor: '#10B981',
    },
    {
      id: 2,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <circle cx="23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'Active Users',
      value: formatNumber(engagementStats.activeUsers),
      change: engagementStats.totalUsers > 0 ? 
        ((engagementStats.activeUsers / engagementStats.totalUsers) * 100) : 0,
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
      value: formatTime(engagementStats.avgPlayTimePerUser),
      change: engagementStats.avgSessionsPerUser,
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
      value: calculateSkipRate(),
      change: -2.1,
      iconColor: '#F59E0B',
    },
  ] : [];

  const topGenres = engagementStats?.topGenres ? (() => {
    const totalPlays = engagementStats.topGenres.reduce((sum, g) => sum + g.playCount, 0);
    return engagementStats.topGenres.slice(0, 4).map((genre) => ({
      id: genre.genreId,
      name: genre.genreName,
      streams: formatNumber(genre.playCount),
      percentage: totalPlays > 0 ? Math.round((genre.playCount / totalPlays) * 100) : 0,
    }));
  })() : [];

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
            </div>
          </div>
        ))}
      </div>

      {/* Streaming Overview */}
      <div className="analytics-tab__overview">
        <h2 className="analytics-tab__section-title">Streaming Overview</h2>
        <StreamingChart data={dailyStats?.data || []} />
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
