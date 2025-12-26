import React, { useState } from 'react';
import { SongsTab, AlbumsTab, GenresTab } from '../components';
import '@/styles/resource-screen.css';

type ResourceTabType = 'songs' | 'albums' | 'genres';

const ResourceScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ResourceTabType>('songs');

  const tabs = [
    { id: 'songs' as ResourceTabType, label: 'Songs' },
    { id: 'albums' as ResourceTabType, label: 'Albums' },
    { id: 'genres' as ResourceTabType, label: 'Genres' },
  ];

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
      <div className="resource-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`resource-tabs__item ${activeTab === tab.id ? 'resource-tabs__item--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="resource-screen__content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ResourceScreen;
