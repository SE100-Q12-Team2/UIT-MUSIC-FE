import React, { useState } from 'react';
import SettingsTabs, { SettingsTab } from '@/features/user/settings/components/SettingsTabs';
import ProfileContent from '@/features/user/settings/components/ProfileContent';
import DetailsContent from '@/features/user/settings/components/DetailsContent';
import ContactContent from '@/features/user/settings/components/ContactContent';
import FAQContent from '@/features/user/settings/components/FAQContent';


import { usePageBackground } from '@/shared/hooks/usePageBackground';
import backgroundSettings from '@/assets/background-settings.png';
import '@/styles/settings.css';
import '@/styles/profile.css';
import '@/styles/contact.css';
import '@/styles/faq.css';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  usePageBackground(backgroundSettings);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileContent />;
      case 'details':
        return <DetailsContent />;
      case 'contact':
        return <ContactContent />;
      case 'faq':
        return <FAQContent />;
      default:
        return <ProfileContent />;
    }
  };

  return (
    <div className="settings-page">
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="settings-page__content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsPage;
