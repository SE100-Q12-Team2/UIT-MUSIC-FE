import React, { useState } from 'react';
import { Outlet } from 'react-router';
import AppHeader from '@/shared/components/ui/AppHeader';
import Sidebar from '@/shared/components/ui/Sidebar';
import Footer from '@/shared/components/ui/footer';
import { useBackground } from '@/contexts/BackgroundContext';
import '@/styles/main-layout.css';

const MainLayout: React.FC = () => {
  const { backgroundImage } = useBackground();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div 
      className="main-layout"
      style={backgroundImage ? { 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      } : undefined}
    >
      <AppHeader />
      <div className="main-layout__body">
        <Sidebar 
          onExpandChange={setIsSidebarExpanded}
        />
        <main className={`main-layout__content ${isSidebarExpanded ? 'main-layout__content--sidebar-expanded' : ''}`}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
