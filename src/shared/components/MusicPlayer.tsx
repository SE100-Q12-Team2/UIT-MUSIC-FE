import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, 
  Volume2, VolumeX, Mic2, List, Maximize2, Minimize2,
  Heart, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Slider } from '@/shared/components/ui/slider';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { formatTime } from '@/shared/utils/formatTime';
import { cn } from '@/lib/utils';

const MusicPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    isExpanded,
    currentTime,
    duration,
    volume,
    isShuffled,
    isRepeated,
    togglePlayPause,
    next,
    previous,
    toggleExpanded,
    setVolume,
    setCurrentTime,
    toggleShuffle,
    toggleRepeat,
  } = useMusicPlayer();

  if (!currentSong) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Collapsed Player Bar */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-[#0E0E1F] border-t border-white/5 z-50 transition-all duration-300",
          isExpanded ? "h-0 overflow-hidden" : "h-[90px]"
        )}
      >
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left: Track Info */}
          <div className="flex items-center gap-4 w-[25%] min-w-[200px]">
            <div 
              className="w-14 h-14 rounded-lg overflow-hidden bg-secondary relative group cursor-pointer"
              onClick={toggleExpanded}
            >
              <img 
                src={currentSong.coverUrl || 'https://via.placeholder.com/100'} 
                className="w-full h-full object-cover opacity-80" 
                alt={currentSong.title}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                <Maximize2 size={16} className="text-white"/>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white hover:underline cursor-pointer truncate">
                {currentSong.title}
              </h4>
              <p className="text-xs text-muted-foreground hover:underline cursor-pointer truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Center: Controls & Progress */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-[600px] px-4">
            {/* Buttons */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-8 w-8", isShuffled ? "text-vio-accent" : "text-muted-foreground hover:text-white")}
                onClick={toggleShuffle}
              >
                <Shuffle size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-gray-300"
                onClick={previous}
              >
                <SkipBack size={22} fill="currentColor" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                className="rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 transition-transform h-10 w-10"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-gray-300"
                onClick={next}
              >
                <SkipForward size={22} fill="currentColor" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-8 w-8", isRepeated ? "text-vio-accent" : "text-muted-foreground hover:text-white")}
                onClick={toggleRepeat}
              >
                <Repeat size={18} />
              </Button>
            </div>
            {/* Progress Bar */}
            <div className="w-full flex items-center gap-3 text-xs text-muted-foreground font-medium">
              <span>{formatTime(currentTime)}</span>
              <Slider 
                value={[progress]} 
                max={100} 
                className="flex-1 h-1 cursor-pointer"
                onValueChange={(value) => {
                  const newTime = (value[0] / 100) * duration;
                  setCurrentTime(newTime);
                }}
              />
              <span>{formatTime(duration)}</span>
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
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-white"
                onClick={() => setVolume(volume > 0 ? 0 : 1)}
              >
                {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>
              <Slider 
                value={[volume * 100]} 
                max={100} 
                className="h-1 cursor-pointer"
                onValueChange={(value) => setVolume(value[0] / 100)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Player View */}
      {isExpanded && (
        <div className="fixed inset-0 bg-[#0a0a16] z-[60] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-white/5">
            <h2 className="text-xl font-bold text-white">Now Playing</h2>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-gray-300"
              onClick={toggleExpanded}
            >
              <Minimize2 size={20} />
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-8 py-12">
            <div className="max-w-4xl w-full flex flex-col items-center gap-8">
              {/* Album Art */}
              <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={currentSong.coverUrl || 'https://via.placeholder.com/400'} 
                  className="w-full h-full object-cover" 
                  alt={currentSong.title}
                />
              </div>

              {/* Song Info */}
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">{currentSong.title}</h3>
                <p className="text-lg text-gray-400">{currentSong.artist}</p>
                {currentSong.album && (
                  <p className="text-sm text-gray-500 mt-1">{currentSong.album}</p>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-2xl">
                <Slider 
                  value={[progress]} 
                  max={100} 
                  className="w-full h-2 cursor-pointer mb-2"
                  onValueChange={(value) => {
                    const newTime = (value[0] / 100) * duration;
                    setCurrentTime(newTime);
                  }}
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-12 w-12", isShuffled ? "text-vio-accent" : "text-gray-400 hover:text-white")}
                  onClick={toggleShuffle}
                >
                  <Shuffle size={24} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:text-gray-300 h-12 w-12"
                  onClick={previous}
                >
                  <SkipBack size={28} fill="currentColor" />
                </Button>
                <Button 
                  variant="default" 
                  size="icon" 
                  className="rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 transition-transform h-16 w-16"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:text-gray-300 h-12 w-12"
                  onClick={next}
                >
                  <SkipForward size={28} fill="currentColor" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-12 w-12", isRepeated ? "text-vio-accent" : "text-gray-400 hover:text-white")}
                  onClick={toggleRepeat}
                >
                  <Repeat size={24} />
                </Button>
              </div>

              {/* Additional Actions */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Heart size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <MoreHorizontal size={20} />
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setVolume(volume > 0 ? 0 : 1)}
                  >
                    {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>
                  <Slider 
                    value={[volume * 100]} 
                    max={100} 
                    className="w-32 cursor-pointer"
                    onValueChange={(value) => setVolume(value[0] / 100)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;

