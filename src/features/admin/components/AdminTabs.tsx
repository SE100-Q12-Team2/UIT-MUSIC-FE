import React from 'react';

export type AdminTab = 'users' | 'labels' | 'reports' | 'analytics' | 'subscriptions' | 'advertisement' | 'songs' | 'albums' | 'genres';

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  tabs?: { id: AdminTab; label: string }[];
}

const defaultTabs: { id: AdminTab; label: string }[] = [
  { id: 'users', label: 'Users' },
  { id: 'labels', label: 'Labels' },
  { id: 'reports', label: 'Copyright Reports' },
];

const analyticsTabs: { id: AdminTab; label: string }[] = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'advertisement', label: 'Advertisement' },
];

const resourceTabs: { id: AdminTab; label: string }[] = [
  { id: 'songs', label: 'Songs' },
  { id: 'albums', label: 'Albums' },
  { id: 'genres', label: 'Genres' },
];

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange, tabs }) => {
  const tabsList = tabs || defaultTabs;
  
  return (
    <div className="settings-tabs">
      {tabsList.map((tab) => (
        <button
          key={tab.id}
          className={`settings-tabs__item ${activeTab === tab.id ? 'settings-tabs__item--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export { analyticsTabs, resourceTabs };
export default AdminTabs;

