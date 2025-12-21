import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

const Header: React.FC = () => {
  return (
    <header className="h-[70px] flex items-center justify-between px-8 py-4 sticky top-0 z-30 bg-vio-900/90 backdrop-blur-lg border-b border-white/5">
      
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input 
            placeholder="Search" 
            className="pl-10 bg-secondary/50 border-white/10 text-white rounded-full focus-visible:ring-primary/50"
        />
      </div>

      <div className="hidden md:block lg:hidden text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
        VioTune
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full">
            <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full">
            <Settings size={20} />
        </Button>
        
        <div className="ml-2 p-[2px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
            <Avatar className="h-8 w-8 border-2 border-black cursor-pointer">
                <AvatarImage src="https://picsum.photos/id/64/100/100" alt="Profile" />
                <AvatarFallback>US</AvatarFallback>
            </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;