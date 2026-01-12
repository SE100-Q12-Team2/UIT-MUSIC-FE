import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { useRecordLabel, useLabelAlbums, useLabelSongs } from '@/core/services/label.service';
import { useCheckFollow, useToggleFollow } from '@/core/services/follow.service';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { useCheckFavorite, useToggleFavorite } from '@/core/services/favorite.service';
import { Song } from '@/core/services/song.service';
import { toast } from 'sonner';
import '@/styles/artist-detail.css';

const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const artistId = id ? parseInt(id) : undefined;

  const { data: artist, isLoading: loadingArtist } = useRecordLabel(artistId);
  const { data: albumsData } = useLabelAlbums(artistId, 1, 20);
  const { data: songsData, isLoading: loadingSongs } = useLabelSongs(artistId, 1, 50);

  const { data: followStatus } = useCheckFollow(user?.id, 'Label', artistId);
  const isFollowing = followStatus?.isFollowing || false;
  const toggleFollow = useToggleFollow();

  const { play, currentSong, isPlaying } = useMusicPlayer();

  const [showAllSongs, setShowAllSongs] = useState(false);

  const handleToggleFollow = async () => {
    if (!user?.id || !artistId) {
      toast.error('Please login to follow');
      return;
    }

    try {
      await toggleFollow.mutateAsync({
        userId: user.id,
        targetType: 'Label',
        targetId: artistId,
        isFollowing,
      });
      toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
    } catch (error) {
      console.error('Failed to toggle follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  const handlePlayArtist = () => {
    if (songsData?.items && songsData.items.length > 0) {
      // Convert LabelSong to Song type for play function
      play(songsData.items[0] as unknown as Song);
    }
  };

  const handleAlbumClick = (albumId: number) => {
    navigate(`/album/${albumId}`);
  };

  const displayedSongs = useMemo(() => {
    if (!songsData?.items) return [];
    return showAllSongs ? songsData.items : songsData.items.slice(0, 5);
  }, [songsData, showAllSongs]);

  // Calculate monthly listeners (using play counts)
  const monthlyListeners = useMemo(() => {
    if (!songsData?.items) return 0;
    const totalPlays = songsData.items.reduce((sum, song) => sum + (song.playCount || 0), 0);
    return Math.floor(totalPlays * 0.3);
  }, [songsData]);

  if (loadingArtist) {
    return (
      <div className="artist-detail-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="artist-detail-error">
        <h2>Artist not found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="artist-detail-page">
      {/* Hero Section */}
      <div 
        className="artist-hero"
        style={{
          backgroundImage: artist.imageUrl 
            ? `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%), url(${artist.imageUrl})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div className="artist-hero__content">
          <div className="artist-hero__badge">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            Verified Artist
          </div>
          <h1 className="artist-hero__name">{artist.labelName}</h1>
          <p className="artist-hero__stats">
            {monthlyListeners.toLocaleString()} monthly listeners
          </p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="artist-controls">
        <button 
          className="artist-controls__play"
          onClick={handlePlayArtist}
          disabled={!songsData?.items || songsData.items.length === 0}
        >
          <Play size={24} fill="currentColor" />
        </button>
        <button 
          className={`artist-controls__follow ${isFollowing ? 'is-following' : ''}`}
          onClick={handleToggleFollow}
          disabled={toggleFollow.isPending}
        >
          {toggleFollow.isPending ? 'Loading...' : (isFollowing ? 'Following' : 'Follow')}
        </button>
        <button className="artist-controls__more">
          <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Popular Section */}
      <section className="artist-section artist-popular">
        <h2 className="artist-section__title">Popular</h2>
        <div className="artist-popular__list">
          {loadingSongs ? (
            <div className="artist-loading">Loading songs...</div>
          ) : displayedSongs.length > 0 ? (
            displayedSongs.map((song, index) => (
              <SongRow 
                key={song.id}
                song={song}
                index={index + 1}
                isActive={currentSong?.id === song.id && isPlaying}
                onPlay={() => play(song as unknown as Song)}
              />
            ))
          ) : (
            <div className="artist-empty">No songs available</div>
          )}
        </div>
        {songsData?.items && songsData.items.length > 5 && (
          <button 
            className="artist-popular__see-more"
            onClick={() => setShowAllSongs(!showAllSongs)}
          >
            {showAllSongs ? 'Show less' : 'See more'}
          </button>
        )}
      </section>

      {/* Albums Section */}
      {albumsData?.items && albumsData.items.length > 0 && (
        <section className="artist-section artist-albums">
          <div className="artist-section__header">
            <h2 className="artist-section__title">Discography</h2>
          </div>
          <div className="artist-albums__grid">
            {albumsData.items.slice(0, 6).map((album) => (
              <div 
                key={album.id}
                className="artist-album-card"
                onClick={() => handleAlbumClick(album.id)}
              >
                <div className="artist-album-card__cover">
                  <img 
                    src={album.coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(album.albumTitle)}&size=300&background=random`}
                    alt={album.albumTitle}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(album.albumTitle)}&size=300&background=random`;
                    }}
                  />
                  <button className="artist-album-card__play">
                    <Play size={20} fill="currentColor" />
                  </button>
                </div>
                <div className="artist-album-card__info">
                  <h3 className="artist-album-card__title">{album.albumTitle}</h3>
                  <p className="artist-album-card__meta">
                    {album.releaseDate ? new Date(album.releaseDate).getFullYear() : 'Album'} • {album.totalTracks} tracks
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="artist-section artist-about">
        <h2 className="artist-section__title">About</h2>
        <div className="artist-about__content">
          {artist.imageUrl && (
            <div className="artist-about__image">
              <img src={artist.imageUrl} alt={artist.labelName} />
            </div>
          )}
          <div className="artist-about__text">
            <p className="artist-about__listeners">
              <strong>{monthlyListeners.toLocaleString()}</strong> monthly listeners
            </p>
            {artist.description && (
              <p className="artist-about__bio">{artist.description}</p>
            )}
            {artist.website && (
              <a 
                href={artist.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="artist-about__link"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// Song Row Component
import { LabelSong } from '@/types/label.types';

interface SongRowProps {
  song: LabelSong;
  index: number;
  isActive: boolean;
  onPlay: () => void;
}

const SongRow: React.FC<SongRowProps> = ({ song, index, isActive, onPlay }) => {
  const { user } = useAuth();
  const { data: favoriteStatus } = useCheckFavorite(user?.id, song.id);
  const toggleFavorite = useToggleFavorite();
  const isFavorited = favoriteStatus?.isFavorite || false;

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      await toggleFavorite.mutateAsync({
        userId: user.id,
        songId: song.id,
        isFavorited,
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`artist-song-row ${isActive ? 'is-active' : ''}`}>
      <div className="artist-song-row__index">
        {isActive ? (
          <div className="artist-song-row__playing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <span>{index}</span>
        )}
      </div>
      <div className="artist-song-row__info" onClick={onPlay}>
        <div className="artist-song-row__cover">
          <img 
            src={song.album?.coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(song.title)}&size=48&background=random`}
            alt={song.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(song.title)}&size=48&background=random`;
            }}
          />
          {!isActive && (
            <div className="artist-song-row__play-overlay">
              <Play size={16} fill="currentColor" />
            </div>
          )}
        </div>
        <div className="artist-song-row__text">
          <div className="artist-song-row__title">{song.title}</div>
        </div>
      </div>
      <div className="artist-song-row__plays">
        {song.playCount?.toLocaleString() || 0}
      </div>
      <div className="artist-song-row__actions">
        <button
          className={`artist-song-row__favorite ${isFavorited ? 'is-favorited' : ''}`}
          onClick={handleToggleFavorite}
        >
          <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
        <div className="artist-song-row__duration">
          {formatDuration(song.duration)}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailPage;
