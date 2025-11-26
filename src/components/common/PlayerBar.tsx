import React from 'react';
import { Pause, SkipBack, SkipForward, Repeat, Shuffle, Mic2, List, Volume2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const PlayerBar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-[#0E0E1F] border-t border-white/5 px-6 flex items-center justify-between z-50">
      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-[25%]">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary relative group cursor-pointer">
            <img src="https://picsum.photos/id/180/100/100" className="w-full h-full object-cover opacity-80" alt="Cover" />
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                <Maximize2 size={16} className="text-white"/>
             </div>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-white hover:underline cursor-pointer">Ma Meilleure Ennemie</h4>
            <p className="text-xs text-muted-foreground hover:underline cursor-pointer">Stromae & Pomme</p>
        </div>
      </div>

      {/* Center: Controls & Progress */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-[600px]">
        {/* Buttons */}
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white h-8 w-8">
                <Shuffle size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:text-gray-300">
                <SkipBack size={22} fill="currentColor" />
            </Button>
            <Button variant="default" size="icon" className="rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 transition-transform">
                <Pause size={18} fill="currentColor" />
            </Button>
             <Button variant="ghost" size="icon" className="text-white hover:text-gray-300">
                <SkipForward size={22} fill="currentColor" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white h-8 w-8">
                <Repeat size={18} />
            </Button>
        </div>
        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3 text-xs text-muted-foreground font-medium">
            <span>01:29</span>
            <Slider defaultValue={[35]} max={100} className="flex-1 h-1" />
            <span>02:28</span>
        </div>
      </div>

      {/* Right: Extra Controls */}
      <div className="flex items-center justify-end gap-2 w-[25%] text-muted-foreground">
         <Button variant="ghost" size="icon" className="hover:text-white h-8 w-8">
            <Mic2 size={18} />
         </Button>
         <Button variant="ghost" size="icon" className="hover:text-white h-8 w-8">
            <List size={18} />
         </Button>
         <div className="flex items-center gap-2 group w-24">
            <Volume2 size={18} className="hover:text-white" />
            <Slider defaultValue={[70]} max={100} className="h-1" />
         </div>
      </div>
    </div>
  );
};

export default PlayerBar;