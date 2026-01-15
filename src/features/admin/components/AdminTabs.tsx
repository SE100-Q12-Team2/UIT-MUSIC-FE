import { AdminTab, AdminTabsProps } from '@/features/admin/types';
import React from 'react';

const defaultTabs: { id: AdminTab; label: string }[] = [
  { id: 'users', label: 'Users' },
  { id: 'labels', label: 'Labels' },
  { id: 'reports', label: 'Copyright Reports' },
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

export default AdminTabs;

