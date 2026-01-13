import React, { useMemo, useCallback, useEffect } from "react";
import '@/styles/detail.css';
import { useRecentlyPlayed } from '@/core/services/listening-history.service';
import { useFollows, FollowItem } from '@/core/services/follow.service';
import { useProfileStore } from '@/store/profileStore';
import { useRecordLabel } from '@/core/services/label.service';
import { useNavigate } from 'react-router-dom';
import TrackItem, { Track } from '@/features/user/playlists/components/TrackItem';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Song } from '@/core/services/song.service';
import { useGetPlaybackUrl } from '@/core/services/playback.service';
import { toast } from 'sonner';

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
    return follow.target.labelName;
  }, [follow, labelData]);

  const displayAvatar = useMemo(() => {
    if (follow.targetType === 'Label' && labelData) {
      return labelData.imageUrl || '/default-artist.jpg';
    }
    return follow.target.imageUrl || '/default-artist.jpg';
  }, [follow, labelData]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/artist/${follow.targetId}`);
  };

  return (
    <article className="details-singer-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="details-singer-card__avatar">
        <img src={displayAvatar} alt={displayName} />
      </div>
      <h3 className="details-singer-card__name">{displayName}</h3>
    </article>
  );
};

interface RecentlyPlayedSong {
  songId: number;
  title: string;
  artists: { name: string }[];
  coverImageUrl?: string;
  playCount: number;
  duration?: number;
  uploadDate?: string;
  albumId?: number;
  album?: { id: number; albumTitle: string; coverImage?: string } | null;
  genre?: { id: number; genreName: string } | null;
  label?: { id: number; labelName: string } | null;
  asset?: { id: number; bucket: string; keyMaster: string } | null;
}

const DetailSection: React.FC = () => {
  const profile = useProfileStore((state) => state.profile);
  const userId = profile?.id;
  const { play, setFetchPlaybackUrl } = useMusicPlayer();
  const { mutateAsync: getPlaybackUrl } = useGetPlaybackUrl();

  // Fetch recently played songs (limit 12 to split into 2 columns of 6)
  const { data: recentlyPlayedData, isLoading: isLoadingSongs } = useRecentlyPlayed(12);

  // Fetch followed artists
  const { data: followsData, isLoading: isLoadingFollows } = useFollows({
    userId: userId || 0,
  });

  const fetchPlaybackUrlForSong = useCallback(async (songId: number): Promise<string | null> => {
    try {
      const response = await getPlaybackUrl({ 
        songId, 
        options: { quality: 'hls' } 
      });
      
      if (response.ok && response.url) {
        return response.url;
      }
      return null;
    } catch (error) {
      console.error('Error fetching playback URL:', error);
      return null;
    }
  }, [getPlaybackUrl]);

  useEffect(() => {
    setFetchPlaybackUrl(fetchPlaybackUrlForSong);
  }, [fetchPlaybackUrlForSong, setFetchPlaybackUrl]);

  // Convert API data to Track format for TrackItem
  const tracks: Track[] = (recentlyPlayedData?.data || []).map((song: RecentlyPlayedSong) => ({
    id: song.songId,
    title: song.title,
    artist: song.artists.map((a: { name: string }) => a.name).join(', ') || 'Unknown Artist',
    coverImage: song.coverImageUrl,
  }));

  const songs: Song[] = useMemo(() => {
    return (recentlyPlayedData?.data || []).map((song: RecentlyPlayedSong) => ({
      id: song.songId,
      title: song.title,
      description: null,
      duration: song.duration || 0,
      language: null,
      lyrics: null,
      albumId: song.albumId || null,
      genreId: null,
      labelId: null,
      uploadDate: song.uploadDate || new Date().toISOString(),
      isActive: true,
      copyrightStatus: 'Clear',
      playCount: song.playCount || 0,
      contributors: [],
      album: song.album || null,
      genre: song.genre || { id: 0, genreName: '' },
      label: song.label || { id: 0, labelName: '' },
      favorites: [],
      asset: song.asset || null,
    } as Song));
  }, [recentlyPlayedData]);

  const handlePlayTrack = async (trackId: number) => {
    try {
      const songToPlay = songs.find(s => s.id === trackId);
      if (!songToPlay) {
        toast.error('Song not found');
        return;
      }

      const playbackResponse = await getPlaybackUrl({ 
        songId: trackId, 
        options: { quality: 'hls' } 
      });
      
      if (!playbackResponse.ok || !playbackResponse.url) {
        toast.error('Failed to load song');
        console.error('Failed to get playback URL:', playbackResponse.reason);
        return;
      }

      const songWithAudio = {
        ...songToPlay,
        audioUrl: playbackResponse.url
      };

      const songsWithAudio = await Promise.all(
        songs.map(async (s) => {
          if (s.id === trackId) {
            return songWithAudio;
          }
          return s;
        })
      );

      play(songWithAudio as Song, songsWithAudio);
    } catch (error) {
      console.error('Error playing song:', error);
      toast.error('Failed to play song');
    }
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
