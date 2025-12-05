import React from 'react';
import { useNavigate } from 'react-router';
import { Search, Bell, Settings } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useAuth } from '@/shared/hooks/useAuth';
import logoWithName from '@/assets/logo-w-name.svg';

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const displayName = (user as any)?.fullName || user?.name || 'User';
  const avatarUrl = (user as any)?.profileImage || user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=728AAB&color=fff&size=200`;
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-[70px] flex items-center justify-between px-8 py-4 fixed top-0 left-0 right-0 z-30 bg-vio-900/90 backdrop-blur-lg border-b border-white/5">
      {/* Left: Logo and Search */}
      <div className="flex items-center gap-6 flex-1">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/home')}
        >
          <img src={logoWithName} alt="VioTune" className="h-8 w-auto" />
        </div>
        
        <div className="relative w-96 hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search"
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-full focus-visible:ring-primary/50 h-10"
          />
        </div>
      </div>

      {/* Right: Actions and User */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-white rounded-full"
          title="Notifications"
        >
          <Bell size={20} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-white rounded-full"
          onClick={() => navigate('/settings')}
          title="Settings"
        >
          <Settings size={20} />
        </Button>
        
        <div className="ml-2 p-[2px] rounded-full bg-linear-to-br from-indigo-500 to-purple-600 cursor-pointer" onClick={() => navigate('/settings')}>
          <Avatar className="h-8 w-8 border-2 border-black">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-vio-accent text-white text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

