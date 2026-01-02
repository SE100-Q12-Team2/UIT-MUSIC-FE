import React, { useMemo, useRef, useEffect } from 'react';
import { Heart, Play, Trash2 } from 'lucide-react';
import menuIcon from '@/assets/Menu.svg';
import { useAlbumDetails } from '@/core/services/album.service';
import { useCheckFavorite, useToggleFavorite } from '@/core/services/favorite.service';
import { useProfileStore } from '@/store/profileStore';

export interface Track {
  id: number;
  title: string;
  artist: string;
  coverImage?: string;
  albumId?: number;
  album?: string;
  duration?: number;
  isFavorite?: boolean;
  playlistId?: number;
}

// Helper to format duration - unused but kept for potential future use
// const formatDuration = (seconds?: number): string => {
//   if (!seconds) return '';
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   return `${mins}:${secs.toString().padStart(2, '0')}`;
// };

interface TrackItemProps {
  track: Track;
  onRemoveFromPlaylist?: (trackId: number, playlistId: number) => void;
  onPlayTrack?: (trackId: number) => void;
  onClick?: (track: Track) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({
  track,
  onRemoveFromPlaylist,
  onPlayTrack,
  onClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const profileId = useProfileStore((state) => state.profile?.id);
  
  // Fetch album cover if not provided but albumId available
  const { data: album } = useAlbumDetails(
    !track.coverImage && track.albumId ? track.albumId : undefined
  );

  // Fetch real favorite status from API
  const { data: favoriteStatus } = useCheckFavorite(profileId, track.id);
  const isFavorite = favoriteStatus?.isFavorite ?? false;
  
  // Toggle favorite mutation
  const toggleFavoriteMutation = useToggleFavorite();

  // Use provided cover image or fetched album cover or default
  const coverImage = useMemo(() => {
    if (track.coverImage) return track.coverImage;
    if (album?.coverImage) return album.coverImage;
    return '/default-track.jpg';
  }, [track.coverImage, album?.coverImage]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate dropdown position when menu opens
  useEffect(() => {
    if (isMenuOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.right - 200,
      });
    }
  }, [isMenuOpen]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profileId) return;
    toggleFavoriteMutation.mutate({
      userId: profileId,
      songId: track.id,
      isFavorited: isFavorite,
    });
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handlePlayTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayTrack?.(track.id);
    setIsMenuOpen(false);
  };

  const handleRemoveFromPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (track.playlistId) {
      onRemoveFromPlaylist?.(track.id, track.playlistId);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="track-item" onClick={() => onClick?.(track)}>
      <img
        src={coverImage}
        alt={track.title}
        className="track-item__image"
      />
      <div className="track-item__info">
        <span className="track-item__title">{track.title}</span>
        <span className="track-item__artist">{track.artist}</span>
      </div>
      <div className="track-item__actions">
        <button
          className={`track-item__favorite ${isFavorite ? 'track-item__favorite--active' : ''}`}
          onClick={handleFavoriteClick}
        >
          <Heart 
            size={16} 
            fill={isFavorite ? '#fff' : 'none'}
            stroke="#fff"
          />
        </button>
        <div className="track-menu" ref={menuRef}>
          <button 
            ref={triggerRef}
            className="track-item__more" 
            onClick={handleMoreClick}
          >
            <img src={menuIcon} alt="More options" style={{ width: '18px', height: '18px' }} />
          </button>
          {isMenuOpen && (
            <div className="track-menu__dropdown" style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px`, position: 'fixed' }}>
              <button
                className="track-menu__item"
                onClick={handlePlayTrack}
              >
                <Play size={16} />
                <span>Play track</span>
              </button>
              {track.playlistId && (
                <button
                  className="track-menu__item track-menu__item--danger"
                  onClick={handleRemoveFromPlaylist}
                >
                  <Trash2 size={16} />
                  <span>Delete from playlist</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackItem;
