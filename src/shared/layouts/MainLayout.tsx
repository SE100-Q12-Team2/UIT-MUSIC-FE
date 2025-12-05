import React from 'react';
import { Outlet } from 'react-router';
import AppHeader from '@/shared/components/ui/AppHeader';
import Footer from '@/shared/components/ui/footer';
import { useBackground } from '@/contexts/BackgroundContext';
import '@/styles/main-layout.css';

const MainLayout: React.FC = () => {
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
      <AppHeader />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
