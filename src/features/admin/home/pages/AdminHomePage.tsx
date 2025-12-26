import React from 'react';
import { StatCard, TopSongsTable, RecentActivity, BottomStats } from '../components';
import '@/styles/admin-home.css';

const AdminHomePage: React.FC = () => {
  // Mock data - Replace with real API calls
  const topStats = [
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
      value: '125,847',
      change: 12.5,
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
      value: '42,384',
      change: 8.2,
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
      value: '8.4M',
      change: 15.3,
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
      title: 'Avg Session Time',
      value: '24 min',
      change: -2.1,
      iconColor: '#FBBF24',
    },
  ];

  const topSongs = [
    {
      id: 1,
      rank: 1,
      title: 'Lạc Trôi',
      artist: 'Sơn Tùng M-TP',
      streams: '2.4M',
      change: 18,
      duration: '3:45',
    },
    {
      id: 2,
      rank: 2,
      title: 'Em Của Ngày Hôm Qua',
      artist: 'Sơn Tùng M-TP',
      streams: '2.1M',
      change: 12,
      duration: '4:12',
    },
    {
      id: 3,
      rank: 3,
      title: 'Chúng Ta Của Hiện Tại',
      artist: 'Sơn Tùng M-TP',
      streams: '1.8M',
      change: 5,
      duration: '3:58',
    },
    {
      id: 4,
      rank: 4,
      title: 'Hãy Trao Cho Anh',
      artist: 'Sơn Tùng M-TP',
      streams: '1.5M',
      change: 15,
      duration: '4:05',
    },
    {
      id: 5,
      rank: 5,
      title: 'Nơi Này Có Anh',
      artist: 'Sơn Tùng M-TP',
      streams: '1.2M',
      change: 7,
      duration: '4:32',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Người dùng mới đăng ký',
      description: 'nguyen.van.a@gmail.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: 2,
      title: 'Album mới được upload',
      description: 'HÍT, Sức Khỏe 2025',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 3,
      title: 'Báo cáo bản quyền mới',
      description: 'Cần xem xét',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 4,
      title: 'Bài hát đạt milestone',
      description: 'Lạc Trôi - 1M streams',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ];

  const bottomStats = [
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
      value: '89.5%',
      progress: 89.5,
      subtitle: '+2.5% from last month',
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
      title: 'Total Favorites',
      value: '1.2M',
      subtitle: '+24.5% from last month',
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
      title: 'New Uploads Today',
      value: '234',
      subtitle: '+12 songs yesterday',
      trendIcon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
  ];

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

