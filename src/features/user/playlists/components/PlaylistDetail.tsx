import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Music, Clock, User, X } from 'lucide-react';
import TrackItem, { Track } from './TrackItem';

interface PlaylistDetailProps {
  title: string;
  coverImage: string;
  trackCount: number;
  duration: string;
  author: string;
  tracks: Track[];
  onTrackClick?: (track: Track) => void;
  onRemoveFromPlaylist?: (trackId: number, playlistId: number) => void;
  onPlayTrack?: (trackId: number) => void;
  onClose?: () => void;
}

const PlaylistDetail: React.FC<PlaylistDetailProps> = ({
  title,
  coverImage,
  trackCount,
  duration,
  author,
  tracks,
  onTrackClick,
  onRemoveFromPlaylist,
  onPlayTrack,
  onClose,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCloseDetail = () => {
    setShowMenu(false);
    onClose?.();
  };

  return (
    <div className="playlist-detail">
      <div className="playlist-detail__header">
        <h2 className="playlist-detail__title">{title}</h2>
        <div className="playlist-detail__menu-wrapper" ref={menuRef}>
          <button 
            className="playlist-detail__more"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreHorizontal size={20} stroke="#fff" />
          </button>
          {showMenu && (
            <div className="playlist-detail__dropdown">
              <button 
                className="playlist-detail__dropdown-item"
                onClick={handleCloseDetail}
              >
                <X size={16} />
                <span>Close Detail</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="playlist-detail__cover">
        <img
          src={coverImage || '/default-playlist.jpg'}
          alt={title}
          className="playlist-detail__cover-image"
        />
      </div>

      <div className="playlist-detail__meta">
        <div className="playlist-detail__meta-item">
          <Music size={14} />
          <span>{trackCount} Tracks</span>
        </div>
        <div className="playlist-detail__meta-item">
          <Clock size={14} />
          <span>{duration}</span>
        </div>
        <div className="playlist-detail__meta-item">
          <User size={14} />
          <span>{author}</span>
        </div>
      </div>

      <div className="playlist-detail__tracks">
        {tracks.map((track) => (
          <TrackItem
            key={track.id}
            track={track}
            onClick={onTrackClick}
            onRemoveFromPlaylist={onRemoveFromPlaylist}
            onPlayTrack={onPlayTrack}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetail;
