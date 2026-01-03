import React, { useMemo } from "react";
import '@/styles/detail.css';
import { useRecentlyPlayed } from '@/core/services/listening-history.service';
import { useFollows, FollowItem } from '@/core/services/follow.service';
import { useProfileStore } from '@/store/profileStore';
import { useRecordLabel } from '@/core/services/label.service';
import { useNavigate } from 'react-router-dom';
import TrackItem, { Track } from '@/features/user/playlists/components/TrackItem';

import detailsBanner from "@/assets/details-banner.png";
import detailsProfileAvatar from "@/assets/details-profile-avatar.png";
// import detailsUsageGraph from "@/assets/details-usage-graph.png";
// import detailsDataDonut from "@/assets/details-data-donut.png";

interface ArtistCardProps {
  follow: FollowItem;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ follow }) => {
  // If it's a label, fetch label details
  const { data: labelData } = useRecordLabel(
    follow.targetType === 'Label' ? follow.targetId : undefined
  );

  const displayName = useMemo(() => {
    if (follow.targetType === 'Label' && labelData) {
      return labelData.labelName;
    }
    return follow.target.artistName;
  }, [follow, labelData]);

  const displayAvatar = useMemo(() => {
    if (follow.targetType === 'Label' && labelData) {
      return labelData.imageUrl || '/default-artist.jpg';
    }
    return follow.target.profileImage || '/default-artist.jpg';
  }, [follow, labelData]);

  return (
    <article className="details-singer-card">
      <div className="details-singer-card__avatar">
        <img src={displayAvatar} alt={displayName} />
      </div>
      <h3 className="details-singer-card__name">{displayName}</h3>
    </article>
  );
};

const DetailSection: React.FC = () => {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const userId = profile?.id;

  // Fetch recently played songs (limit 12 to split into 2 columns of 6)
  const { data: recentlyPlayedData, isLoading: isLoadingSongs } = useRecentlyPlayed(12);

  // Fetch followed artists
  const { data: followsData, isLoading: isLoadingFollows } = useFollows({
    userId: userId || 0,
  });

  // Convert API data to Track format for TrackItem
  const tracks: Track[] = (recentlyPlayedData?.data || []).map((song: { songId: number; title: string; artists: { name: string }[]; coverImageUrl?: string; playCount: number }) => ({
    id: song.songId,
    title: song.title,
    artist: song.artists.map((a: { name: string }) => a.name).join(', ') || 'Unknown Artist',
    coverImage: song.coverImageUrl,
  }));

  const handlePlayTrack = (trackId: number) => {
    navigate(`/player?trackId=${trackId}`);
  };
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
              src={profile?.profileImage || detailsProfileAvatar}
              alt={profile?.fullName || "User"}
              className="details-hero__avatar"
            />
          </div>
        </div>

        <div className="details-hero__text">
          <h1 className="details-hero__name">{profile?.fullName || 'User'}</h1>
          <p className="details-hero__handle">@{profile?.email?.split('@')[0] || 'user'}</p>
        </div>
      </header>

      {/* Your Activity */}
      <section className="details-section details-section--activity">
        <h2 className="details-section__title">Your Activity</h2>

      </section>

      {/* Songs */}
      <section className="details-section details-section--songs">
        <h2 className="details-section__title">
          Songs You&apos;ve Listened To A Lot This Month
        </h2>

        {isLoadingSongs ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
            Loading songs...
          </div>
        ) : tracks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
            No listening history yet. Start listening to see your favorite songs here!
          </div>
        ) : (
          <div className="details-song-list">
            {tracks.map((track) => (
              <TrackItem
                key={track.id}
                track={track}
                onPlayTrack={handlePlayTrack}
              />
            ))}
          </div>
        )}
      </section>

      {/* Singers */}
      <section className="details-section details-section--singers">
        <h2 className="details-section__title">
          Record Labels and Artists You Follow
        </h2>

        {isLoadingFollows ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
            Loading artists...
          </div>
        ) : !followsData?.data || followsData.data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
            You haven&apos;t followed any artists yet. Start following your favorite artists!
          </div>
        ) : (
          <div className="details-singers-grid">
            {(followsData?.data || []).map((follow: FollowItem) => (
              <ArtistCard key={follow.id} follow={follow} />
            ))}
          </div>
        )}
      </section>

      {/* Stats */}
      {/* <section className="details-section details-section--stats">
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
      </section> */}
    </section>
  );
};

export default DetailSection;
