import React from 'react';
import { Play, Heart, MoreHorizontal, Clock } from 'lucide-react';
import { useFavorites } from '@/core/services/favorite.service';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Button } from '@/shared/components/ui/button';
import { formatTime } from '@/shared/utils/formatTime';
import { Song } from '@/core/services/song.service';

const FavoritePage: React.FC = () => {
  const { data, isLoading } = useFavorites();
  const { play } = useMusicPlayer();

  // Use API data only
  const songs = data?.songs || [];

  const handlePlay = (song: Song, allSongs: Song[]) => {
    play(song, allSongs);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-gradient-to-b from-vio-900 via-[#0a0a16] to-[#05050a]">
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-56 h-56 rounded-lg overflow-hidden shadow-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Heart size={80} fill="white" className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-2">Playlist</p>
            <h1 className="text-5xl font-bold text-white mb-4">Liked Songs</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{songs.length} songs</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            size="lg"
            className="rounded-full bg-vio-accent hover:bg-vio-accent/80 text-white h-14 w-14"
            onClick={() => songs.length > 0 && handlePlay(songs[0], songs)}
          >
            <Play size={24} fill="currentColor" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <MoreHorizontal size={24} />
          </Button>
        </div>

        {/* Songs List */}
        <div className="bg-[#13132b]/30 rounded-xl border border-white/5 overflow-hidden">
          <div className="grid grid-cols-[16px_1fr_1fr_1fr_auto] gap-4 px-6 py-3 text-sm text-gray-400 border-b border-white/5">
            <div>#</div>
            <div>Title</div>
            <div>Album</div>
            <div>Date Added</div>
            <div className="flex justify-center">
              <Clock size={16} />
            </div>
          </div>
          {songs.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              No liked songs yet. Start liking songs to see them here!
            </div>
          ) : (
            songs.map((song, index) => (
              <div
                key={song.id}
                className="grid grid-cols-[16px_1fr_1fr_1fr_auto] gap-4 px-6 py-3 hover:bg-white/5 transition-colors group cursor-pointer"
                onClick={() => handlePlay(song, songs)}
              >
                <div className="flex items-center text-gray-400 group-hover:hidden">
                  {index + 1}
                </div>
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded overflow-hidden bg-vio-800 flex-shrink-0 hidden group-hover:flex items-center justify-center">
                    <Play size={16} fill="white" className="text-white" />
                  </div>
                  <img
                    src={song.album?.coverImage || 'https://via.placeholder.com/100'}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover flex-shrink-0 group-hover:hidden"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-medium truncate">{song.title}</div>
                    <div className="text-sm text-gray-400 truncate">
                      {song.songArtists?.map((sa) => sa.artist?.artistName).join(', ') || 'Unknown Artist'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-gray-400 truncate">{song.album?.albumTitle || '-'}</div>
                <div className="flex items-center text-gray-400">
                  {song.favoritedAt ? new Date(song.favoritedAt).toLocaleDateString() : '-'}
                </div>
                <div className="flex items-center justify-center text-gray-400">
                  {formatTime(song.duration)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritePage;

