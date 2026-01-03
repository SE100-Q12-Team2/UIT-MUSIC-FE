import React from "react";
import '@/styles/detail.css';

import detailsBanner from "@/assets/details-banner.png";
import detailsProfileAvatar from "@/assets/details-profile-avatar.png";

import detailsSinger1 from "@/assets/details-singer-1.png";
import detailsSinger2 from "@/assets/details-singer-2.png";
import detailsSinger3 from "@/assets/details-singer-3.png";
import detailsSinger4 from "@/assets/details-singer-4.png";
import detailsSinger5 from "@/assets/details-singer-5.png";

import detailsUsageGraph from "@/assets/details-usage-graph.png";
import detailsDataDonut from "@/assets/details-data-donut.png";

import menuIcon from "@/assets/menu.svg";
import { useListeningStats } from '@/core/services/listening-history.service';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import LoadingSpinner from '@/shared/components/common/LoadingSpinner';

interface SongItem {
  id: number;
  index: number;
  title: string;
  artist: string;
  album: string; // "Hit Me Hard and soft"
  duration: string; // "3:48"
  thumbnail: string;
}

interface SingerItem {
  id: number;
  name: string;
  avatar: string;
}

const leftSongs: SongItem[] = [
  {
    id: 1,
    index: 1,
    title: "Chihiro",
    artist: "Billie Eilish",
    album: "Hit Me Hard and soft",
    duration: "3:48",
    thumbnail: detailsSinger1,
  },
  {
    id: 2,
    index: 2,
    title: "Chihiro",
    artist: "Billie Eilish",
    album: "Hit Me Hard and soft",
    duration: "3:48",
    thumbnail: detailsSinger2,
  },
  {
    id: 3,
    index: 3,
    title: "Chihiro",
    artist: "Billie Eilish",
    album: "Hit Me Hard and soft",
    duration: "3:48",
    thumbnail: detailsSinger3,
  },
];

const rightSongs: SongItem[] = [
  {
    id: 4,
    index: 4,
    title: "Chihiro",
    artist: "Billie Eilish",
    album: "Hit Me Hard and soft",
    duration: "3:48",
    thumbnail: detailsSinger4,
  },
  {
    id: 5,
    index: 5,
    title: "Chihiro",
    artist: "Billie Eilish",
    album: "Hit Me Hard and soft",
    duration: "3:48",
    thumbnail: detailsSinger5,
  },
  {
    id: 6,
    index: 6,
    title: "Chihiro",
    artist: "Billie Eilish",
    album: "Hit Me Hard and soft",
    duration: "3:48",
    thumbnail: detailsProfileAvatar,
  },
];

const singers: SingerItem[] = [
  { id: 1, name: "Justin", avatar: detailsSinger1 },
  { id: 2, name: "Shikani sae", avatar: detailsSinger2 },
  { id: 3, name: "Haidin", avatar: detailsSinger3 },
  { id: 4, name: "Emilia", avatar: detailsSinger4 },
  { id: 5, name: "Adrian Brin", avatar: detailsSinger5 },
];

const DetailSection: React.FC = () => {
  const { user } = useAuth();
  const { data: statsData, isLoading: statsLoading } = useListeningStats({ period: 'monthly' });

  // Transform API top songs to UI format
  const apiTopSongs = statsData?.data?.topSongs?.slice(0, 6) || [];
  const transformedTopSongs = apiTopSongs.map((song, idx) => ({
    id: song.songId,
    index: idx + 1,
    title: song.songTitle,
    artist: 'Unknown Artist', // API doesn't return artist name in topSongs
    album: 'Unknown Album',
    duration: `${Math.floor(song.totalDuration / 60)}:${(song.totalDuration % 60).toString().padStart(2, '0')}`,
    thumbnail: `https://picsum.photos/id/${song.songId}/300/300`,
  }));

  // Transform API top artists to UI format
  const apiTopArtists = statsData?.data?.topArtists?.slice(0, 5) || [];
  const transformedTopArtists = apiTopArtists.map((artist, idx) => ({
    id: artist.artistId,
    name: artist.artistName,
    avatar: `https://picsum.photos/id/${artist.artistId}/300/300`,
  }));

  // Use API data if available, otherwise fallback to mock data
  const displaySongs = transformedTopSongs.length > 0 ? transformedTopSongs : [...leftSongs, ...rightSongs];
  const displayArtists = transformedTopArtists.length > 0 ? transformedTopArtists : singers;

  // Split songs into two columns
  const leftColumnSongs = displaySongs.slice(0, Math.ceil(displaySongs.length / 2));
  const rightColumnSongs = displaySongs.slice(Math.ceil(displaySongs.length / 2));

  const displayName = user?.fullName || 'User';
  const username = user?.email?.split('@')[0] || 'user';
  const avatarUrl = user?.profileImage || detailsProfileAvatar;

  if (statsLoading) {
    return (
      <section className="details-page">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  return (
    <section className="details-page">
      {/* HERO: banner + avatar + tên */}
      <header className="details-hero">
        <div className="details-hero__banner-wrapper">
          <img
            src={detailsBanner}
            alt="Profile banner"
            className="details-hero__banner"
          />

          {/* Avatar: chỉ giữ hình tròn, bỏ khung trắng bên ngoài */}
          <div className="details-hero__avatar-wrapper">
            <img
              src={avatarUrl}
              alt={displayName}
              className="details-hero__avatar"
            />
          </div>
        </div>

        <div className="details-hero__text">
          <h1 className="details-hero__name">{displayName}</h1>
          <p className="details-hero__handle">@{username}</p>
        </div>
      </header>

      {/* Your Activity */}
      <section className="details-section details-section--activity">
        <h2 className="details-section__title">Your Activity</h2>
        <p className="details-section__subtitle">
          We&apos;d Love To Hear From You. Please Fill Out This Form.
        </p>
      </section>

      {/* Songs */}
      <section className="details-section details-section--songs">
        <h2 className="details-section__title">
          Songs You&apos;ve Listened To A Lot This Month
        </h2>

        <div className="details-song-grid">
          {/* Cột trái */}
          <div className="details-song-column">
            {leftColumnSongs.map((song) => (
              <article key={song.id} className="details-song-card">
                <div className="details-song-card__left">
                  <span className="details-song-card__index">{song.index}</span>

                  <div className="details-song-card__thumb">
                    <img src={song.thumbnail} alt={song.title} />
                  </div>

                  <div className="details-song-card__meta">
                    <div className="details-song-card__title">{song.title}</div>
                    <div className="details-song-card__artist">
                      {song.artist}
                    </div>
                  </div>
                </div>

                {/* Center: tên album "Hit Me Hard and soft" */}
                <div className="details-song-card__center">
                  <span className="details-song-card__album">{song.album}</span>
                </div>

                {/* Right: duration + menu icon */}
                <div className="details-song-card__right">
                  <span className="details-song-card__duration">
                    {song.duration}
                  </span>
                  <div className="details-song-card__more">
                    <img
                      src={menuIcon}
                      alt="More options"
                      className="details-song-card__more-icon"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Cột phải */}
          <div className="details-song-column">
            {rightColumnSongs.map((song) => (
              <article key={song.id} className="details-song-card">
                <div className="details-song-card__left">
                  <span className="details-song-card__index">{song.index}</span>

                  <div className="details-song-card__thumb">
                    <img src={song.thumbnail} alt={song.title} />
                  </div>

                  <div className="details-song-card__meta">
                    <div className="details-song-card__title">{song.title}</div>
                    <div className="details-song-card__artist">
                      {song.artist}
                    </div>
                  </div>
                </div>

                <div className="details-song-card__center">
                  <span className="details-song-card__album">{song.album}</span>
                </div>

                <div className="details-song-card__right">
                  <span className="details-song-card__duration">
                    {song.duration}
                  </span>
                  <div className="details-song-card__more">
                    <img
                      src={menuIcon}
                      alt="More options"
                      className="details-song-card__more-icon"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Singers */}
      <section className="details-section details-section--singers">
        <h2 className="details-section__title">
          Singers Who Were Very Popular With You
        </h2>

        <div className="details-singers-grid">
          {displayArtists.map((singer) => (
            <article key={singer.id} className="details-singer-card">
              <div className="details-singer-card__avatar">
                <img src={singer.avatar} alt={singer.name} />
              </div>
              <h3 className="details-singer-card__name">{singer.name}</h3>
            </article>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="details-section details-section--stats">
        <div className="details-stats">
          <div className="details-stats__usage">
            <h2 className="details-section__title">Your Usage VioTune Rate</h2>

            <div className="details-stats__legend">
              <span className="details-stats__legend-dot details-stats__legend-dot--music" />
              <span>Music</span>
              <span className="details-stats__legend-dot details-stats__legend-dot--music-video" />
              <span>Music Video</span>
              <span className="details-stats__legend-dot details-stats__legend-dot--web" />
              <span>Web browsing</span>
            </div>

            <div className="details-stats__graph">
              <img
                src={detailsUsageGraph}
                alt="Usage graph"
                className="details-stats__graph-image"
              />
            </div>
          </div>

          <div className="details-stats__data">
            <h2 className="details-section__title">Data Available To You</h2>

            <div className="details-stats__donut">
              <img
                src={detailsDataDonut}
                alt="Data available donut chart"
                className="details-stats__donut-image"
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default DetailSection;
