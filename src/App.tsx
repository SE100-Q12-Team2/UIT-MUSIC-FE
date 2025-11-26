import Header from '@/components/common/HomeHeader';
import PlayerBar from '@/components/common/PlayerBar';
import RightSidebar from '@/components/common/RightSidebar';
import Sidebar from '@/components/common/Sidebar';
import Home from '@/pages/HomePage';
import React from 'react';


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