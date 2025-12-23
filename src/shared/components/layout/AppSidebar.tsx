import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, Heart, ListMusic, Search, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  path?: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'home', icon: <Home size={22} />, path: '/home', label: 'Home' },
  { id: 'likes', icon: <Heart size={22} />, path: '/likes', label: 'Likes' },
  { id: 'playlists', icon: <ListMusic size={22} />, path: '/playlists', label: 'Playlists' },
  { id: 'discover', icon: <Search size={22} />, path: '/discover', label: 'Discover' },
  { id: 'player', icon: <Music size={22} />, path: '/player', label: 'Player' },
];

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="fixed left-4 top-[86px] bottom-4 w-[72px] flex flex-col items-center py-6 bg-vio-800/30 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl z-20">
      {/* Navigation Items - Vertical Icons Only */}
      <div className="flex flex-col gap-6 w-full items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.path && navigate(item.path)}
            className={cn(
              "relative flex items-center justify-center rounded-xl h-12 w-12 transition-all duration-200",
              isActive(item.path)
                ? "text-white bg-vio-accent/20 hover:bg-vio-accent/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
            title={item.label}
          >
            {isActive(item.path) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-vio-accent rounded-r-full" />
            )}
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AppSidebar;

