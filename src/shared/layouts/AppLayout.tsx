import React from 'react';
import { Outlet } from 'react-router';
import Footer from '@/shared/components/ui/footer';
import AppSidebar from '@/shared/components/layout/AppSidebar';
import AppHeader from '@/shared/components/layout/AppHeader';
import { useBackground } from '@/contexts/BackgroundContext';
import '@/styles/main-layout.css';

const AppLayout: React.FC = () => {
  const { backgroundImage } = useBackground();

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
      {/* Top Header - Fixed */}
      <AppHeader />

      {/* Main Content Area with Floating Sidebar */}
      <div className="main-layout__container">
        {/* Floating Sidebar - Fixed position, below header */}
        <AppSidebar />

        {/* Page Content */}
        <main className="main-layout__main">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AppLayout;

