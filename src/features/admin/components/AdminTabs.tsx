import React from 'react';

export type AdminTab = 'users' | 'labels' | 'reports';

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const tabs: { id: AdminTab; label: string }[] = [
  { id: 'users', label: 'Users' },
  { id: 'labels', label: 'Labels' },
  { id: 'reports', label: 'Copyright Reports' },
];

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="settings-tabs">
      {tabs.map((tab) => (
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

export default AdminTabs;

