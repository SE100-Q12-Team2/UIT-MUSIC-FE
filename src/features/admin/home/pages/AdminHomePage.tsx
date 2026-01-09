import React, { useState, useEffect } from 'react';
import { StatCard, TopSongsTable, RecentActivity, BottomStats } from '../components';
import { adminApi, DashboardStatsResponse, TrendingStatsResponse, EngagementStatsResponse } from '@/core/api/admin.api';
import '@/styles/admin-home.css';
import '@/styles/loading.css';

const AdminHomePage: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsResponse | null>(null);
  const [trendingStats, setTrendingStats] = useState<TrendingStatsResponse | null>(null);
  const [engagementStats, setEngagementStats] = useState<EngagementStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0]; // YYYY-MM-DD
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  const fetchAllStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getDateRange();
      const [dashboard, trending, engagement] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getTrendingStats('Daily'),
        adminApi.getEngagementStats(startDate, endDate),
      ]);
      setDashboardStats(dashboard);
      setTrendingStats(trending);
      setEngagementStats(engagement);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard stats:', err);
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

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPlayTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h`;
    }
    return `${minutes} min`;
  };

  // Build stats from API data
  const topStats = dashboardStats ? [
    {
      id: 1,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'Total Users',
      value: formatNumber(dashboardStats.users.total),
      change: dashboardStats.users.newToday > 0 ? ((dashboardStats.users.newToday / dashboardStats.users.total) * 100) : 0,
      iconColor: '#60A5FA',
    },
    {
      id: 2,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ),
      title: 'Active Listeners',
      value: formatNumber(dashboardStats.users.active),
      change: dashboardStats.users.active > 0 ? ((dashboardStats.users.active / dashboardStats.users.total) * 100) : 0,
      iconColor: '#34D399',
    },
    {
      id: 3,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      ),
      title: 'Total Streams',
      value: formatNumber(dashboardStats.engagement.totalPlays),
      change: dashboardStats.engagement.avgPlaysPerUser,
      iconColor: '#10B981',
    },
    {
      id: 4,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: 'Avg Play Time',
      value: formatPlayTime(engagementStats?.avgPlayTimePerUser || 0),
      change: engagementStats?.avgSessionsPerUser || 0,
      iconColor: '#FBBF24',
    },
  ] : [];

  // Build top songs from trending API
  const topSongs = trendingStats?.songs?.slice(0, 5).map((item, index) => ({
    id: item.id,
    rank: item.rankPosition || index + 1,
    title: item.song?.title || 'Unknown Title',
    artist: item.song?.artists?.map(a => a.artistName).join(', ') || 'Unknown Artist',
    streams: formatNumber(item.playCount || 0),
    change: Math.floor(Math.random() * 20) + 1, // API doesn't provide change, using placeholder
    duration: formatDuration(item.song?.duration || 0),
  })) || [];

  // Recent activities - using content stats from dashboard
  const recentActivities = dashboardStats ? [
    {
      id: 1,
      title: 'New users today',
      description: `${dashboardStats.users.newToday} new registrations`,
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Total songs available',
      description: `${formatNumber(dashboardStats.content.totalSongs)} songs in library`,
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 3,
      title: 'Premium subscribers',
      description: `${formatNumber(dashboardStats.users.premium)} active premium users`,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 4,
      title: 'Monthly revenue',
      description: `$${dashboardStats.revenue.totalMonth.toLocaleString()}`,
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ] : [];

  // Bottom stats from engagement and dashboard
  const bottomStats = dashboardStats && engagementStats ? [
    {
      id: 1,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'User Retention Rate',
      value: `${((engagementStats.activeUsers / engagementStats.totalUsers) * 100).toFixed(1)}%`,
      progress: (engagementStats.activeUsers / engagementStats.totalUsers) * 100,
      subtitle: `${formatNumber(engagementStats.activeUsers)} active users`,
      trendIcon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
    {
      id: 2,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      title: 'Premium Users',
      value: formatNumber(engagementStats.premiumUsers),
      subtitle: `${formatNumber(engagementStats.freeUsers)} free users`,
      trendIcon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
    {
      id: 3,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: 'Content Library',
      value: formatNumber(dashboardStats.content.totalSongs),
      subtitle: `${formatNumber(dashboardStats.content.totalAlbums)} albums, ${formatNumber(dashboardStats.content.totalArtists)} artists`,
      trendIcon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
  ] : [];

  if (isLoading) {
    return (
      <div className="admin-home">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-home">
        <div className="admin-home__error">
          <p>{error}</p>
          <button onClick={fetchAllStats} className="admin-home__retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-home">
      {/* Top Stats */}
      <div className="admin-home__top-stats">
        {topStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="admin-home__content">
        <div className="admin-home__left">
          <TopSongsTable songs={topSongs} />
        </div>
        <div className="admin-home__right">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>

      {/* Bottom Stats */}
      <BottomStats stats={bottomStats} />
    </div>
  );
};

export default AdminHomePage;

