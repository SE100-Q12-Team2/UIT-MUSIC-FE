import {
  usePlaylists,
  usePlaylistTracks,
} from '@/core/services/playlist.service';
import { formatTime, getTotalDuration } from '@/shared/utils/formatTime';
import { useProfileStore } from '@/store/profileStore';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Play } from 'lucide-react';
import { useMemo } from 'react';
import type { Song } from '@/core/services/song.service';

interface HomePlayerSidebarProps {
  isPlayerVisible: boolean;
  setIsPlayerVisible: (visible: boolean) => void;
}

export default function HomePlayerSidebar({
  isPlayerVisible,
  setIsPlayerVisible,
}: HomePlayerSidebarProps) {
  const { data: playlists, isLoading: playlistsLoading } = usePlaylists();
  const playlist = playlists && playlists.length > 0 ? playlists[0] : null;
  const { data: tracks, isLoading: tracksLoading } = usePlaylistTracks(
    playlist?.id || 0
  );
  const profile = useProfileStore((state) => state.profile);
  const { play, currentSong } = useMusicPlayer();

  // Convert playlist tracks to Song format for music player
  const songs: Song[] = useMemo(() => {
    if (!tracks) return [];
    
    return tracks.map((track) => ({
      id: track.song.id,
      title: track.song.title,
      description: null,
      duration: track.song.duration,
      language: null,
      lyrics: null,
      albumId: track.song.album?.id || null,
      genreId: track.song.genre?.id || null,
      labelId: null,
      uploadDate: new Date().toISOString(),
      isActive: true,
      copyrightStatus: 'Clear' as const,
      playCount: track.song.playCount || 0,
      contributors: [],
      album: track.song.album ? {
        id: track.song.album.id,
        albumTitle: track.song.album.albumTitle,
        coverImage: track.song.album.coverImage || playlist?.coverImageUrl || '',
      } : {
        id: 0,
        albumTitle: '',
        coverImage: playlist?.coverImageUrl || '',
      },
      genre: track.song.genre || {
        id: 0,
        genreName: '',
      },
      label: {
        id: 0,
        labelName: '',
      },
      asset: undefined,
      favorites: [],
      songArtists: track.song.songArtists?.map((sa) => ({
        artistId: sa.artist.id,
        songId: track.song.id,
        role: 'MainArtist' as const,
        artist: {
          id: sa.artist.id,
          artistName: sa.artist.artistName,
          profileImage: sa.artist.profileImage || '',
        },
      })),
    })) as Song[];
  }, [tracks, playlist]);

  // Handle play song
  const handlePlaySong = (song: Song, index: number) => {
    // Play the clicked song with the full playlist
    play(song, songs);
  };

  return (
    <aside
      className={`
        hidden lg:flex flex-col
        h-screen
        bg-[#1f2937]
        border-l border-white/10
        sticky top-0 right-0
        transition-all duration-300
        rounded-md
        ${
          isPlayerVisible
            ? 'w-[360px] min-w-[360px] opacity-100'
            : 'w-0 min-w-0 opacity-0 pointer-events-none'
        }
      `}
    >
      <div className="p-4 flex flex-col gap-4 h-full min-h-0">
        {/* ================= Header ================= */}
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg truncate">
            {playlist?.playlistName || 'No Playlist'}
          </h3>
          <button
            onClick={() => setIsPlayerVisible(false)}
            className="text-gray-400 hover:text-white"
            title="Close player"
          >
            •••
          </button>
        </div>

        {/* ================= Playlist Info ================= */}
        <div className="flex gap-4">
          <img
            src={
              playlist?.coverImageUrl ||
              'https://i.scdn.co/image/ab67616d0000b273e0f4e8f7a7e6f8a6c5b6f5a5'
            }
            alt="cover"
            className="w-28 h-28 rounded-lg object-cover shadow-lg"
          />

          <div className="flex flex-col justify-between text-sm text-gray-300">
            <div className="flex items-center gap-2">
              🎵 <span>{tracks ? tracks.length : 0} Tracks</span>
            </div>
            <div className="flex items-center gap-2">
              🕠 <span>{formatTime(getTotalDuration(tracks))}</span>
            </div>
            <div className="flex items-center gap-2">
              👤 <span>{profile?.fullName || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* ================= Song List (SCROLL HERE) ================= */}
        <div className="flex-1 min-h-0 overflow-y-auto mt-2 pr-1">
          {tracksLoading || playlistsLoading ? (
            <div className="text-gray-400 text-center mt-8">Loading...</div>
          ) : !tracks || tracks.length === 0 ? (
            <div className="text-gray-400 text-center mt-8">
              No songs in playlist.
            </div>
          ) : (
            tracks.map((track, index) => {
              const song = songs[index];
              const isPlaying = currentSong?.id === song?.id;
              
              return (
                <div
                  key={track.id}
                  className={`
                    flex items-center gap-3 p-2 mb-2 rounded-lg
                    border border-white/10
                    hover:bg-white/10 transition
                    cursor-pointer
                    ${isPlaying ? 'bg-violet-600/20 border-violet-500' : ''}
                  `}
                  onClick={() => song && handlePlaySong(song, index)}
                >
                  <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={
                        track.song.album?.coverImage ||
                        playlist?.coverImageUrl ||
                        'https://i.scdn.co/image/ab67616d0000b273e0f4e8f7a7e6f8a6c5b6f5a5'
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {isPlaying ? (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-3 h-3 flex gap-0.5 items-end">
                          <div className="w-1 bg-violet-500 animate-pulse" style={{ height: '60%' }} />
                          <div className="w-1 bg-violet-500 animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
                          <div className="w-1 bg-violet-500 animate-pulse" style={{ height: '80%', animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play size={16} fill="white" className="text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`text-sm truncate flex items-center gap-2 ${isPlaying ? 'text-violet-400 font-medium' : 'text-white'}`}>
                      {track.song.title}
                      <span className="text-xs text-gray-400 ml-2">
                        {formatTime(track.song.duration)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {track.song.songArtists && track.song.songArtists.length > 0
                        ? track.song.songArtists
                            .map((a) => a.artist.artistName)
                            .join(', ')
                        : 'Unknown Artist'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <button 
                      className="hover:text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Add to favorites
                      }}
                    >
                      ♡
                    </button>
                    <button 
                      className="hover:text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Show menu
                      }}
                    >
                      •••
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}
