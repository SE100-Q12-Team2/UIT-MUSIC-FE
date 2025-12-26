import React, { useState } from 'react';
import AdminTabs, { AdminTab } from '../components/AdminTabs';
import { AnalyticsTab, SubscriptionsTab, AdvertisementTab } from './components';
import '@/styles/analytics-screen.css';

type AnalyticsTabType = 'analytics' | 'subscriptions' | 'advertisement';

const AnalyticsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalyticsTabType>('analytics');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsTab />;
      case 'subscriptions':
        return <SubscriptionsTab />;
      case 'advertisement':
        return <AdvertisementTab />;
      default:
        return <AnalyticsTab />;
    }
  };

  return (
    <div className="analytics-screen">
      <div className="analytics-screen__header">
        <h1 className="analytics-screen__title">Analytics & Insights</h1>
      </div>
      
      <AdminTabs 
        activeTab={activeTab as AdminTab} 
        onTabChange={(tab) => setActiveTab(tab as AnalyticsTabType)} 
      />
      
      <div className="analytics-screen__content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AnalyticsScreen;
