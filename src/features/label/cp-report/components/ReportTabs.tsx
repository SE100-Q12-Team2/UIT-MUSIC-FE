import React from 'react';

export type ReportTab = 'history' | 'create';

interface ReportTabsProps {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
}

const tabs: { id: ReportTab; label: string }[] = [
  { id: 'history', label: 'Report History' },
  { id: 'create', label: 'New Report' },
];

const ReportTabs: React.FC<ReportTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="report-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`report-tabs__item ${activeTab === tab.id ? 'report-tabs__item--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ReportTabs;
