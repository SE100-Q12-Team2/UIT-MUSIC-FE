import React from 'react';
import { Home, Heart, Library, MessageSquare, ListMusic, Music2, Disc } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const Sidebar: React.FC = () => {
  return (
    <div className="w-[72px] h-full flex flex-col items-center py-6 bg-vio-800/30 backdrop-blur-md border-r border-white/5 z-20 pb-24">
      {/* Logo Placeholder */}
      <div className="mb-10 p-2 bg-white/10 rounded-xl">
        <Home size={24} className="text-white" />
      </div>

      {/* Nav Items */}
      <div className="flex-1 flex flex-col gap-6 w-full items-center">
        <NavItem icon={<Heart size={22} />} active={false} />
        <NavItem icon={<ListMusic size={22} />} active={true} />
        <NavItem icon={<Music2 size={22} />} active={false} />
        <NavItem icon={<Disc size={22} />} active={false} />
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-6 w-full items-center mt-auto">
        <NavItem icon={<Library size={22} />} active={false} />
        <NavItem icon={<MessageSquare size={22} />} active={false} />
      </div>
    </div>
  );
};

const NavItem = ({ icon, active }: { icon: React.ReactNode; active: boolean }) => (
  <Button 
    variant="ghost" 
    size="icon" 
    className={cn(
        "relative rounded-xl h-12 w-12 transition-all duration-200",
        active ? 'text-white bg-vio-accent/20 hover:bg-vio-accent/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
    )}
  >
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-vio-accent rounded-r-full" />}
    {icon}
  </Button>
);

export default Sidebar;