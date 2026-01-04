import React, { useState } from 'react';
import AdminTabs, { AdminTab, resourceTabs } from '../../components/AdminTabs';
import { SongsTab, AlbumsTab, GenresTab } from '../components';
import '@/styles/resource-screen.css';

type ResourceTabType = 'songs' | 'albums' | 'genres';

const ResourceScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ResourceTabType>('songs');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'songs':
        return <SongsTab />;
      case 'albums':
        return <AlbumsTab />;
      case 'genres':
        return <GenresTab />;
      default:
        return <SongsTab />;
    }
  };

  return (
    <div className="resource-screen">
      {/* Tabs Navigation */}
      <AdminTabs
        activeTab={activeTab as AdminTab}
        onTabChange={(tab) => setActiveTab(tab as ResourceTabType)}
        tabs={resourceTabs}
      />

      {/* Tab Content */}
      <div className="resource-screen__content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ResourceScreen;
