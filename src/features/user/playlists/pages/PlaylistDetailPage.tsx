import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { Play, Heart, MoreHorizontal, Clock } from 'lucide-react';
import { usePlaylist, usePlaylists } from '@/core/services/playlist.service';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Button } from '@/shared/components/ui/button';
import { formatTime } from '@/shared/utils/formatTime';
import { Song } from '@/core/services/song.service';
import { PlaylistDetail } from '@/core/services/playlist.service';
import { Playlist } from '@/types/playlist.types';

const PlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { play } = useMusicPlayer();
  
  const { data: playlistsData, isLoading: playlistsLoading } = usePlaylists();
  const { data: playlistData, isLoading: playlistLoading } = usePlaylist(id || '');

  const isLoading = id ? playlistLoading : playlistsLoading;
  
  // Use API data only - usePlaylists returns Playlist[] directly
  const playlist: PlaylistDetail | null = id ? (playlistData as PlaylistDetail | null) : null;
  const playlists = playlistsData || [];

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

  // Playlist Detail View
  if (id && playlist) {
    const songs: Song[] = (playlist.songs || []) as Song[];
    
    return (
      <div className="min-h-screen pb-32 bg-gradient-to-b from-vio-900 via-[#0a0a16] to-[#05050a]">
        {/* Header */}
        <div className="relative h-80 bg-gradient-to-b from-vio-800/50 to-transparent px-8 pt-20 pb-8">
          <div className="flex items-end gap-6">
            <div className="w-56 h-56 rounded-lg overflow-hidden shadow-2xl bg-vio-800">
              <img 
                src={playlist.coverUrl || playlist.coverImageUrl || 'https://via.placeholder.com/400'} 
                alt={playlist.name || playlist.playlistName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm text-gray-400 mb-2">Playlist</p>
              <h1 className="text-5xl font-bold text-white mb-4">{playlist.name || playlist.playlistName}</h1>
              {playlist.description && (
                <p className="text-gray-300 mb-4">{playlist.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{playlist.trackCount || songs.length} songs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="px-8 py-6 flex items-center gap-4">
          <Button
            size="lg"
            className="rounded-full bg-vio-accent hover:bg-vio-accent/80 text-white h-14 w-14"
            onClick={() => songs.length > 0 && handlePlay(songs[0], songs)}
          >
            <Play size={24} fill="currentColor" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Heart size={24} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <MoreHorizontal size={24} />
          </Button>
        </div>

        {/* Songs List */}
        <div className="px-8 pb-8">
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
            {songs.map((song: Song, index: number) => (
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
                    <div 
                      className="text-white font-medium truncate cursor-pointer hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/songs/${song.id}`);
                      }}
                    >
                      {song.title}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                      {song.contributors?.map((c) => c.label?.artistName || c.label?.labelName).filter(Boolean).join(', ') || 'Unknown Artist'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-gray-400 truncate">{song.album?.albumTitle || '-'}</div>
                <div className="flex items-center text-gray-400">-</div>
                <div className="flex items-center justify-center text-gray-400">
                  {formatTime(song.duration)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Playlists List View
  return (
    <div className="min-h-screen pb-32 bg-gradient-to-b from-vio-900 via-[#0a0a16] to-[#05050a]">
      <div className="px-8 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-white mb-6">Your Playlists</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {playlists.map((playlist: Playlist) => (
            <div
              key={playlist.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/playlists/${playlist.id}`)}
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-vio-800 mb-3">
                <img
                  src={playlist.coverImageUrl || 'https://via.placeholder.com/300'}
                  alt={playlist.playlistName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-vio-accent flex items-center justify-center">
                    <Play size={24} fill="white" className="text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-white font-medium truncate">{playlist.playlistName}</h3>
              <p className="text-sm text-gray-400">Playlist</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;

