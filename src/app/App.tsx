import Home from '@/features/home/pages/HomePage';
import Header from '@/features/home/components/HomeHeader';
import PlayerBar from '@/features/home/components/PlayerBar';
import RightSidebar from '@/features/home/components/RightSidebar';
import React from 'react';
import Sidebar from '@/features/home/components/Sidebar';


const App: React.FC = () => {
  return (
    <div className="flex h-full w-full bg-black overflow-hidden font-sans text-white selection:bg-indigo-500/30">
      
      <Sidebar />

      <div className="flex flex-1 flex-col relative min-w-0">
        <Header />
        
        <Home />
        
      </div>

      <RightSidebar />

      <PlayerBar />

    </div>
  );
};

export default App;