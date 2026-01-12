import React, { useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, 
  Volume2, VolumeX, List, Maximize2, Minimize2,
  Heart, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Slider } from '@/shared/components/ui/slider';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { formatTime } from '@/shared/utils/formatTime';
import { cn } from '@/lib/utils';

const MusicPlayer: React.FC = () => {
  const [imageError, setImageError] = useState(false);
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
          "fixed bottom-0 left-0 right-0 bg-vio-900/95 backdrop-blur-lg border-t border-white/10 shadow-2xl z-50 transition-all duration-300",
          isExpanded ? "h-0 overflow-hidden" : "h-[90px]"
        )}
      >
        <div className="h-full px-6 flex items-center justify-between max-w-[1920px] mx-auto">
          {/* Left: Track Info */}
          <div className="flex items-center gap-4 w-[25%] min-w-[250px]">
            <div 
              className="w-16 h-16 rounded-lg overflow-hidden bg-vio-900/50 relative group cursor-pointer shrink-0"
              onClick={toggleExpanded}
            >
              <img 
                src={imageError ? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentSong.title)}&background=7c3aed&color=fff&size=100` : (currentSong.album?.coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentSong.title)}&background=7c3aed&color=fff&size=100`)}
                className="w-full h-full object-cover" 
                alt={currentSong.title}
                onError={() => setImageError(true)}
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                <Maximize2 size={18} className="text-white"/>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white hover:underline cursor-pointer truncate">
                {currentSong.title}
              </h4>
              <p className="text-xs text-gray-400 hover:underline cursor-pointer truncate">
                {currentSong.contributors?.map((c: { label?: { artistName?: string; labelName?: string | null } }) => c.label?.artistName || c.label?.labelName || '').filter(Boolean).join(', ') || 'Unknown Artist'}
              </p>
            </div>
          </div>

          {/* Center: Controls & Progress */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-[700px] px-6">
            {/* Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-9 w-9", isShuffled ? "text-vio-accent" : "text-gray-400 hover:text-white")}
                onClick={toggleShuffle}
              >
                <Shuffle size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-gray-300 h-9 w-9"
                onClick={previous}
              >
                <SkipBack size={22} fill="currentColor" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                className="rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 transition-transform h-11 w-11"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-gray-300 h-9 w-9"
                onClick={next}
              >
                <SkipForward size={22} fill="currentColor" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-9 w-9", isRepeated ? "text-vio-accent" : "text-gray-400 hover:text-white")}
                onClick={toggleRepeat}
              >
                <Repeat size={18} />
              </Button>
            </div>
            {/* Progress Bar */}
            <div className="w-full flex items-center gap-3 text-xs text-gray-400 font-medium">
              <span className="min-w-[40px] text-right">{formatTime(currentTime)}</span>
              <Slider 
                value={[progress]} 
                max={100} 
                className="flex-1 h-1.5 cursor-pointer"
                onValueChange={(value) => {
                  const newTime = (value[0] / 100) * duration;
                  setCurrentTime(newTime);
                }}
              />
              <span className="min-w-[40px] text-left">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Extra Controls */}
          <div className="flex items-center justify-end gap-3 w-[25%] text-gray-400">
            <Button variant="ghost" size="icon" className="hover:text-white h-9 w-9">
              <List size={18} />
            </Button>
            <div className="flex items-center gap-2 group w-28">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:text-white"
                onClick={() => setVolume(volume > 0 ? 0 : 1)}
              >
                {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>
              <Slider 
                value={[volume * 100]} 
                max={100} 
                className="h-1.5 cursor-pointer"
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
              <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-2xl bg-vio-900/50">
                <img 
                  src={imageError ? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentSong.title)}&background=7c3aed&color=fff&size=400` : (currentSong.album?.coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentSong.title)}&background=7c3aed&color=fff&size=400`)}
                  className="w-full h-full object-cover" 
                  alt={currentSong.title}
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              </div>

              {/* Song Info */}
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">{currentSong.title}</h3>
                <p className="text-lg text-gray-400">
                  {currentSong.contributors?.map((c: { label?: { artistName?: string; labelName?: string | null } }) => c.label?.artistName || c.label?.labelName || '').filter(Boolean).join(', ') || 'Unknown Artist'}
                </p>
                {currentSong.album && (
                  <p className="text-sm text-gray-500 mt-1">{currentSong.album.albumTitle}</p>
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

