import React from 'react';
import { Heart, LayoutGrid, Music, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { QUEUE_LIST } from '@/data/home.data';

const RightSidebar: React.FC = () => {
  return (
    <div className={cn(
        "w-80 h-full bg-vio-900 border-l border-white/5 hidden lg:flex flex-col p-6 overflow-y-auto pb-24 scrollbar-hide"
    )}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">I Don't Care</h2>
        <LayoutGrid size={18} className="text-gray-400 cursor-pointer hover:text-white" />
      </div>

      {/* Now Playing Featured Card */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-6 group">
        <img src="https://picsum.photos/id/111/400/400" alt="Now Playing" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
            <h3 className="text-2xl font-bold text-white mb-1">idfc</h3>
            <p className="text-gray-300">Blackbear</p>
            
            <div className="mt-4 space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-3">
                    <Music size={16} />
                    <span>24 Tracks</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs border border-gray-600 px-1 rounded">8</span>
                    <span>01:38:58</span>
                </div>
                 <div className="flex items-center gap-3">
                    <User size={16} />
                    <span>Rayan</span>
                </div>
            </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="flex flex-col gap-2">
        {QUEUE_LIST.map((track) => (
          <div key={track.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 overflow-hidden">
               <img src={track.coverUrl} className="w-10 h-10 rounded bg-gray-800 object-cover" alt="cover" />
               <div className="flex flex-col overflow-hidden">
                   <span className="text-sm font-medium text-white truncate w-32">{track.title}</span>
                   <span className="text-xs text-gray-500 truncate">{track.artist}</span>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
                <Heart size={14} className="text-gray-600 group-hover:text-white cursor-pointer" />
                <LayoutGrid size={14} className="text-gray-600 group-hover:text-white cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default RightSidebar;