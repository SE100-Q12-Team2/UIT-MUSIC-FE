import React from 'react';

export type SettingsTab = 'profile' | 'details' | 'contact' | 'faq';

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const tabs: { id: SettingsTab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'details', label: 'Details' },
  { id: 'contact', label: 'Contact Us' },
  { id: 'faq', label: 'FAQ' },
];

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onTabChange }) => {
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

export default SettingsTabs;
