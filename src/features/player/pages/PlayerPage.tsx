import React from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { formatTime } from '@/shared/utils/formatTime';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Heart, MoreHorizontal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Slider } from '@/shared/components/ui/slider';

const PlayerPage: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffled,
    isRepeated,
    togglePlayPause,
    next,
    previous,
    setVolume,
    setCurrentTime,
    toggleShuffle,
    toggleRepeat,
  } = useMusicPlayer();

  if (!currentSong) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-vio-900 via-[#0a0a16] to-[#05050a]">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">No song is currently playing</p>
          <p className="text-gray-500 text-sm">Select a song to start playing</p>
        </div>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-vio-900 via-[#0a0a16] to-[#05050a] flex items-center justify-center px-8 py-12">
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
            className={`h-12 w-12 ${isShuffled ? 'text-vio-accent' : 'text-gray-400 hover:text-white'}`}
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
            className={`h-12 w-12 ${isRepeated ? 'text-vio-accent' : 'text-gray-400 hover:text-white'}`}
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
  );
};

export default PlayerPage;

