import React from 'react';
import { Play } from 'lucide-react';
import { useDiscover, useTrending, useNewReleases, useTopArtists, useGenres } from '@/core/services/discover.service';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Song } from '@/core/services/song.service';

const DiscoverPage: React.FC = () => {
  const { data: discoverData, isLoading: discoverLoading } = useDiscover();
  const { data: trendingData, isLoading: trendingLoading } = useTrending();
  const { data: newReleasesData, isLoading: newReleasesLoading } = useNewReleases();
  const { data: topArtistsData, isLoading: topArtistsLoading } = useTopArtists();
  const { data: genresData, isLoading: genresLoading } = useGenres();
  const { play } = useMusicPlayer();

  const isLoading = discoverLoading || trendingLoading || newReleasesLoading || topArtistsLoading || genresLoading;

  const handlePlay = (song: Song, allSongs?: Song[]) => {
    play(song, allSongs || [song]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Use API data only
  const featuredSongs = discoverData?.featuredSongs || trendingData || [];
  const newReleases = discoverData?.newReleases || newReleasesData || [];
  const topArtists = discoverData?.topArtists || topArtistsData || [];
  const genres = discoverData?.genres || genresData || [];

  return (
    <div className="min-h-screen pb-32 bg-gradient-to-b from-vio-900 via-[#0a0a16] to-[#05050a]">
      <div className="px-8 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-white mb-8">Discover</h1>

        {/* Featured Songs */}
        {featuredSongs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Featured Songs</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {featuredSongs.slice(0, 10).map((song) => (
                <div
                  key={song.id}
                  className="group cursor-pointer"
                  onClick={() => handlePlay(song)}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-vio-800 mb-3">
                    <img
                      src={song.album?.coverImage || 'https://via.placeholder.com/300'}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-vio-accent flex items-center justify-center">
                        <Play size={24} fill="white" className="text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-white font-medium truncate">{song.title}</h3>
                  <p className="text-sm text-gray-400 truncate">
                    {song.songArtists?.map((sa) => sa.artist?.artistName).join(', ') || 'Unknown Artist'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* New Releases */}
        {newReleases.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">New Releases</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {newReleases.slice(0, 10).map((album) => (
                <div key={album.id} className="group cursor-pointer">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-vio-800 mb-3">
                    <img
                      src={album.coverUrl || 'https://via.placeholder.com/300'}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-vio-accent flex items-center justify-center">
                        <Play size={24} fill="white" className="text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-white font-medium truncate">{album.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{album.artist}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top Artists */}
        {topArtists.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Top Artists</h2>
            <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
              {topArtists.slice(0, 10).map((artist) => (
                <div key={artist.id} className="flex flex-col items-center gap-3 min-w-[100px] group cursor-pointer">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-vio-accent transition-all relative">
                    <img
                      src={artist.imageUrl || 'https://via.placeholder.com/100'}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={24} fill="white" className="text-white" />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white capitalize">
                    {artist.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Genres */}
        {genres.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Genres</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {genres.map((genre) => (
                <div
                  key={genre.id}
                  className="relative h-28 rounded-lg overflow-hidden cursor-pointer group"
                >
                  <img
                    src={genre.coverUrl || 'https://via.placeholder.com/400'}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={genre.name}
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                  <span className="absolute bottom-3 left-4 text-xl font-bold text-white">
                    {genre.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;

