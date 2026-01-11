'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

// Removed mock data imports - now using real API data

import { Button } from '@/shared/components/ui/button';
import { BannerData, useHomeData } from '@/features/user/home/hooks/useHomeData';
import { BannersSectionSkeleton, MusicCardGridSkeleton, SongListSkeleton } from '@/features/user/home/components/SkeletonLoaders';
import MusicCard from '@/features/user/home/components/MusicCard';
import EmptyState from '@/features/user/home/components/EmptyState';
import HomePlayerSidebar from '@/features/user/home/components/HomePlayerSidebar';
import HomeFloatingButtonToggle from '@/features/user/home/components/FloatingToggleButton';
import HomeMiniPlayer from '@/features/user/home/components/HomeMiniPlayer';
import SongRow from '@/features/user/home/components/SongRow';
import { SectionProps } from '@/features/user/home/types/home.types';
import { AdDisplay } from '@/shared/components/AdDisplay';


/* ---------------- Section ---------------- */
const Section = ({ title, actionText = 'See All', children }: SectionProps) => (
  <div className="px-8 py-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
        {title}
      </h2>
      <Button
        variant="link"
        className="text-gray-400 hover:text-white uppercase font-medium tracking-wider text-xs h-auto p-0"
      >
        {actionText}
      </Button>
    </div>
    {children}
  </div>
);

/* ---------------- Home ---------------- */

const Home = () => {
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const {
    recentlyPlayedBanners,
    tailoredPlaylists,
    personalSpace,
    dailyPickSongs,
    trendingSongs,
    genres,
    followedArtists,
    recentAlbums,
    loadingStates,
  } = useHomeData();

  return (
    <div className="w-full min-h-screen flex bg-linear-to-b from-vio-900 via-[#0a0a16] to-[#05050a] overflow-x-hidden">
      {/* ================= Main Content ================= */}
      <div
        className={`flex flex-col pb-0 transition-all duration-300 ${
          isPlayerVisible ? 'flex-1' : 'w-full'
        }`}
      >
        {/* Recently Played */}
        {loadingStates.recentlyPlayed ? (
          <BannersSectionSkeleton />
        ) : recentlyPlayedBanners.length > 0 ? (
          <section className="px-8 pt-6 pb-8">
            <div className="flex gap-6">
              {recentlyPlayedBanners.map((banner: BannerData) => (
                <div
                  key={banner.id}
                  className="relative h-[88px] w-[256px] rounded-xl overflow-hidden group cursor-pointer shrink-0"
                >
                  <img
                    src={banner.coverUrl}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    alt={banner.title}
                  />
                  <div
                    className={`absolute inset-0 bg-linear-to-b ${banner.accent} opacity-80 mix-blend-multiply`}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {banner.title}
                    </h3>
                    <div className="w-8 h-1 bg-white/50 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Advertisement Banner */}
        <div className="px-8 pb-6">
          <AdDisplay placement="Homepage" />
        </div>

        <Section title="Playlists Tailored For You">
          {loadingStates.dailyMix ? (
            <MusicCardGridSkeleton count={5} />
          ) : tailoredPlaylists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {tailoredPlaylists.map((item) => (
                <MusicCard 
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  coverUrl={item.coverUrl}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="sparkles"
              title="No Daily Mixes Yet"
              description="Start listening to music to get personalized daily mixes tailored just for you"
            />
          )}
        </Section>

        <Section title="Your Personal Music Space">
          {loadingStates.personalized ? (
            <MusicCardGridSkeleton count={5} />
          ) : personalSpace.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {personalSpace.map((item) => (
                <MusicCard 
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  coverUrl={item.coverUrl}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="music"
              title="Your Music Space is Empty"
              description="Discover and listen to music to build your personal collection"
            />
          )}
        </Section>

        <Section title="Updates From Followed Artists">
          {loadingStates.albums ? (
            <MusicCardGridSkeleton count={4} />
          ) : recentAlbums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentAlbums.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-[#13132b]/50 p-4 rounded-lg hover:bg-[#13132b] transition-colors group cursor-pointer border border-white/5"
                >
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded shadow-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.subtitle}
                    </p>
                  </div>
                  <Heart
                    className="text-muted-foreground group-hover:text-white transition-colors"
                    size={20}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="music"
              title="No Albums Yet"
              description="Follow artists to see their latest album updates"
            />
          )}
        </Section>

        <Section title="Daily Pick">
          {loadingStates.discoverWeekly ? (
            <SongListSkeleton count={5} />
          ) : dailyPickSongs.length > 0 ? (
            <div className="bg-[#13132b]/30 rounded-xl border border-white/5 overflow-hidden">
              {dailyPickSongs.map((song, idx) => (
                <div
                  key={song.id}
                  className={
                    idx !== dailyPickSongs.length - 1
                      ? 'border-b border-white/5'
                      : ''
                  }
                >
                  <SongRow song={song} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="list"
              title="No Daily Picks Available"
              description="Check back tomorrow for fresh music recommendations picked just for you"
            />
          )}
        </Section>

        {/* Artists You Follow */}
        <Section title="Artists You Follow">
          {loadingStates.follows ? (
            <div className="flex gap-6 overflow-x-auto pb-2">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gray-700 animate-pulse" />
                  <div className="w-20 h-4 bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : followedArtists.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-2">
              {followedArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
                >
                  <div className="relative">
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="w-32 h-32 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-vio-500 transition-all"
                    />
                  </div>
                  <span className="text-sm text-white font-medium capitalize">
                    {artist.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="users"
              title="No Followed Artists"
              description="Follow artists to see them here and get updates on their latest releases"
            />
          )}
        </Section>

        {/* Discover Series */}
        <Section title="Discover The Magic Of Series Musics With Viotune">
          {loadingStates.dailyMix ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="shrink-0 w-40">
                  <div className="w-40 h-40 bg-gray-700 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          ) : tailoredPlaylists.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {tailoredPlaylists.map((item) => (
                <div key={item.id} className="shrink-0 w-40">
                  <MusicCard 
                    id={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    coverUrl={item.coverUrl}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="sparkles"
              title="No Playlists Available"
              description="Start listening to music to discover personalized playlists"
            />
          )}
        </Section>

        {/* Since You Enjoy Till Dusk */}
        <Section title="Since You Enjoy Till Dusk">
          {loadingStates.personalized ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="shrink-0 w-40">
                  <div className="w-40 h-40 bg-gray-700 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          ) : personalSpace.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {personalSpace.map((item) => (
                <div key={item.id} className="shrink-0 w-40">
                  <MusicCard 
                    id={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    coverUrl={item.coverUrl}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="music"
              title="No Recommendations Yet"
              description="Start listening to music to get personalized recommendations"
            />
          )}
        </Section>

        {/* Albums You Were Listening To */}
        <Section title="Albums You Were Listening To">
          {loadingStates.albums ? (
            <MusicCardGridSkeleton count={4} />
          ) : recentAlbums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentAlbums.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-[#13132b]/50 p-4 rounded-lg hover:bg-[#13132b] transition-colors group cursor-pointer border border-white/5"
                >
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded shadow-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.subtitle}
                    </p>
                  </div>
                  <Heart
                    className="text-muted-foreground group-hover:text-white transition-colors"
                    size={20}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="disc"
              title="No Albums Yet"
              description="Explore albums to see them here"
            />
          )}
        </Section>

        {/* Genres You Interested In */}
        <Section title="Genres You Interested In">
          {loadingStates.genres ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="relative h-32 rounded-xl overflow-hidden bg-gray-700 animate-pulse" />
              ))}
            </div>
          ) : genres.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {genres.map((genre) => (
                <div
                  key={genre.id}
                  className="relative h-32 rounded-xl overflow-hidden group cursor-pointer"
                >
                  <img
                    src={genre.coverUrl}
                    alt={genre.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">{genre.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="music"
              title="No Genres Available"
              description="Genres will appear here once available"
            />
          )}
        </Section>

        {/* More Artists You'll Love */}
        <Section title="More Artists You'll Love">
          {loadingStates.follows ? (
            <div className="flex gap-6 overflow-x-auto pb-2">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gray-700 animate-pulse" />
                  <div className="w-20 h-4 bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : followedArtists.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-2">
              {followedArtists.map((artist) => (
                <div
                  key={`more-${artist.id}`}
                  className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
                >
                  <div className="relative">
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="w-32 h-32 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-vio-500 transition-all"
                    />
                  </div>
                  <span className="text-sm text-white font-medium capitalize">
                    {artist.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="users"
              title="No Artists Yet"
              description="Follow artists to discover more music you'll love"
            />
          )}
        </Section>

        {/* Trending Now */}
        <Section title="Trending Now">
          {loadingStates.trendingSongs ? (
            <SongListSkeleton count={5} />
          ) : trendingSongs.length > 0 ? (
            <div className="bg-[#13132b]/30 rounded-xl border border-white/5 overflow-hidden">
              {trendingSongs.map((song, idx) => (
                <div
                  key={`trending-${song.id}`}
                  className={
                    idx !== trendingSongs.length - 1
                      ? 'border-b border-white/5'
                      : ''
                  }
                >
                  <SongRow song={song} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="trending-up"
              title="No Trending Songs"
              description="Trending songs will appear here"
            />
          )}
        </Section>

        {/* You Recently Seen */}
        <Section title="You Recently Seen">
          {loadingStates.dailyMix ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="shrink-0 w-40">
                  <div className="w-40 h-40 bg-gray-700 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          ) : tailoredPlaylists.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {tailoredPlaylists.map((item) => (
                <div key={`recent-${item.id}`} className="shrink-0 w-40">
                  <MusicCard 
                    id={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    coverUrl={item.coverUrl}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="clock"
              title="No Recent Activity"
              description="Start exploring music to see your recent activity here"
            />
          )}
        </Section>
      </div>

      <HomePlayerSidebar
        isPlayerVisible={isPlayerVisible}
        setIsPlayerVisible={setIsPlayerVisible}
      />

      {/* ================= Floating Toggle Button ================= */}
      {!isPlayerVisible && (
        <HomeFloatingButtonToggle setIsPlayerVisible={setIsPlayerVisible} />
      )}

      {/* ================= Mini Player ================= */}
      {!isPlayerVisible && (
        <HomeMiniPlayer
          isPlaying={isPlaying}
          setIsPlayerVisible={setIsPlayerVisible}
          setIsPlaying={setIsPlaying}
        />
      )}
    </div>
  );
};

export default Home;
