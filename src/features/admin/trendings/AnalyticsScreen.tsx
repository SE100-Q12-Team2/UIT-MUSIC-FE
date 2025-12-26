import React, { useState } from 'react';
import AdminTabs, { AdminTab, analyticsTabs } from '../components/AdminTabs';
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
      <AdminTabs 
        activeTab={activeTab as AdminTab} 
        onTabChange={(tab) => setActiveTab(tab as AnalyticsTabType)} 
        tabs={analyticsTabs}
      />
      
      <div className="analytics-screen__content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AnalyticsScreen;
