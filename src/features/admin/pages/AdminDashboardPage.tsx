import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import AdminUsersPage from '@/features/admin/users/pages/AdminUsersPage';
import AdminLabelsPage from '@/features/admin/labels/pages/AdminLabelsPage';
import AdminCopyrightReportsPage from '@/features/admin/copyright-reports/pages/AdminCopyrightReportsPage';
import AdminTabs, { AdminTab } from '@/features/admin/components/AdminTabs';
import '@/styles/settings.css';

const AdminDashboardPage: React.FC = () => {
  const location = useLocation();
  
  // Determine active tab from URL query or hash
  const getActiveTabFromPath = (pathname: string): AdminTab => {
    const hash = location.hash || '';
    if (hash.includes('#labels') || pathname.includes('labels')) return 'labels';
    if (hash.includes('#reports') || pathname.includes('reports')) return 'reports';
    return 'users'; // default
  };
  
  const [activeTab, setActiveTab] = useState<AdminTab>(getActiveTabFromPath(location.pathname));

  // Sync tab with URL
  useEffect(() => {
    const tab = getActiveTabFromPath(location.pathname);
    setActiveTab(tab);
  }, [location.pathname, location.hash]);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <AdminUsersPage />;
      case 'labels':
        return <AdminLabelsPage />;
      case 'reports':
        return <AdminCopyrightReportsPage />;
      default:
        return <AdminUsersPage />;
    }
  };

  return (
    <div className="settings-page">
      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="settings-page__content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

