'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

import {
  ARTIST_UPDATES,
  DAILY_PICK_SONGS,
  PERSONAL_SPACE,
  RECENTLY_PLAYED_BANNERS,
  TAILORED_PLAYLISTS,
} from '@/data/home.data';

import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import SongRow from '@/features/user/home/components/SongRow';
import { SectionProps } from '@/features/user/home/types/home.types';
import HomePlayerSidebar from '@/features/home/components/HomePlayerSidebar';
import HomeFloatingButtonToggle from '@/features/home/components/FloatingToggleButton';
import HomeMiniPlayer from '@/features/home/components/HomeMiniPlayer';
import { useRecentlyPlayed } from '@/core/services/listening-history.service';
import { usePersonalizedRecommendations, useDailyMix, useDiscoverWeekly } from '@/core/services/recommendation.service';
import { RecommendationSong, RecommendationMix } from '@/types/recommendation.types';
import { RecentlyPlayedSong } from '@/types/listening-history.api';
import LoadingSpinner from '@/shared/components/common/LoadingSpinner';

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

/* ---------------- Helper Functions ---------------- */

// Transform API song to UI song format
const transformSongToUI = (song: RecommendationSong): { id: string; title: string; artist: string; album?: string; duration: string; coverUrl: string; isLiked?: boolean } => {
  const artists = song.songArtists?.map(sa => sa.artist.artistName).join(', ') || 'Unknown Artist';
  const durationInSeconds = song.duration || 0;
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  return {
    id: song.id.toString(),
    title: song.title,
    artist: artists,
    album: song.album?.albumTitle,
    duration,
    coverUrl: song.album?.coverImage || `https://picsum.photos/id/${song.id}/300/300`,
    isLiked: song.isFavorite || false,
  };
};

// Transform API playlist/mix to UI playlist format
const transformMixToPlaylist = (mix: RecommendationMix): { id: string; title: string; subtitle?: string; coverUrl: string } => {
  const firstSong = mix.songs[0];
  return {
    id: mix.id,
    title: mix.title,
    subtitle: `${mix.songs.length} Tracks`,
    coverUrl: firstSong?.album?.coverImage || `https://picsum.photos/id/${mix.id}/300/300`,
  };
};

// Transform recently played to banner format
const transformRecentlyPlayedToBanner = (song: RecentlyPlayedSong, index: number) => {
  const accents = ['from-blue-900 to-black', 'from-purple-900 to-black', 'from-orange-900 to-black'];
  return {
    id: song.songId.toString(),
    title: index === 0 ? 'Recently Listened' : index === 1 ? 'Most Listened' : 'Liked Tracks',
    coverUrl: song.coverImageUrl || `https://picsum.photos/id/${song.songId}/600/300`,
    accent: accents[index % accents.length],
  };
};

/* ---------------- Home ---------------- */

const Home = () => {
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // API calls with fallback to mock data
  const { data: recentlyPlayedData, isLoading: recentlyPlayedLoading } = useRecentlyPlayed(3);
  const { data: personalizedData, isLoading: personalizedLoading } = usePersonalizedRecommendations(30); // limit is required, default 30
  const { data: dailyMixData, isLoading: dailyMixLoading } = useDailyMix();
  const { data: discoverWeeklyData, isLoading: discoverWeeklyLoading } = useDiscoverWeekly();

  // Transform API data with fallback to mock data
  const recentlyPlayedBanners = recentlyPlayedData?.data?.data?.slice(0, 3).map((song, idx) => transformRecentlyPlayedToBanner(song, idx)) || RECENTLY_PLAYED_BANNERS;
  const tailoredPlaylists = dailyMixData?.mixes?.slice(0, 5).map(transformMixToPlaylist) || TAILORED_PLAYLISTS;
  const personalSpace = personalizedData?.slice(0, 5).map(song => ({
    id: song.id.toString(),
    title: song.title,
    subtitle: `${song.playCount || 0} Plays`,
    coverUrl: song.album?.coverImage || `https://picsum.photos/id/${song.id}/300/300`,
  })) || PERSONAL_SPACE;
  const dailyPickSongs = discoverWeeklyData?.slice(0, 5).map(transformSongToUI) || DAILY_PICK_SONGS;

  const isLoading = recentlyPlayedLoading || personalizedLoading || dailyMixLoading || discoverWeeklyLoading;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-linear-to-b from-vio-900 via-[#0a0a16] to-[#05050a]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex bg-linear-to-b from-vio-900 via-[#0a0a16] to-[#05050a] overflow-x-hidden">
      {/* ================= Main Content ================= */}
      <div
        className={`flex flex-col pb-0 transition-all duration-300 ${
          isPlayerVisible ? 'flex-1' : 'w-full'
        }`}
      >
        {/* Recently Played */}
        <section className="px-8 pt-6 pb-8">
          <div className="flex gap-6">
            {RECENTLY_PLAYED_BANNERS.map((banner) => (
              <div
                key={banner.id}
                className="relative h-[88px] w-[256px] rounded-xl overflow-hidden group cursor-pointer flex-shrink-0"
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

        <Section title="Playlists Tailored For You">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {TAILORED_PLAYLISTS.map((item) => (
              <Card key={item.id} data={item} />
            ))}
          </div>
        </Section>

        <Section title="Your Personal Music Space">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {PERSONAL_SPACE.map((item) => (
              <Card key={item.id} data={item} />
            ))}
          </div>
        </Section>

        <Section title="Updates From Followed Artists">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ARTIST_UPDATES.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-[#13132b]/50 p-4 rounded-lg hover:bg-[#13132b] transition-colors group cursor-pointer border border-white/5"
              >
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="w-16 h-16 rounded shadow-lg"
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
        </Section>

        <Section title="Daily Pick">
          <div className="bg-[#13132b]/30 rounded-xl border border-white/5 overflow-hidden">
            {DAILY_PICK_SONGS.map((song, idx) => (
              <div
                key={song.id}
                className={
                  idx !== DAILY_PICK_SONGS.length - 1
                    ? 'border-b border-white/5'
                    : ''
                }
              >
                <SongRow song={song} />
              </div>
            ))}
          </div>
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
