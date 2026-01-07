import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import menuIcon from '@/assets/Menu.svg';
import '@/styles/playlist-menu.css';

interface PlaylistMenuProps {
  playlistId: number;
  onAddToExisting: () => void;
  onAddToNew: () => void;
}

const PlaylistMenu: React.FC<PlaylistMenuProps> = ({
  playlistId,
  onAddToExisting,
  onAddToNew,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePlayPlaylist = () => {
    navigate(`/player`);
    setIsOpen(false);
  };

  const handleAddToExisting = () => {
    onAddToExisting();
    setIsOpen(false);
  };

  const handleAddToNew = () => {
    onAddToNew();
    setIsOpen(false);
  };

  return (
    <div className="playlist-menu" ref={menuRef}>
      <button
        className="playlist-menu__trigger"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        type="button"
        aria-label="Menu"
      >
        <img src={menuIcon} alt="" />
      </button>

      {isOpen && (
        <div className="playlist-menu__dropdown">
          <button
            className="playlist-menu__item"
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPlaylist();
            }}
            type="button"
          >
            <span className="playlist-menu__item-text">Play Playlist</span>
          </button>
          <button
            className="playlist-menu__item"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToExisting();
            }}
            type="button"
          >
            <span className="playlist-menu__item-text">Add to Existing Playlist</span>
          </button>
          <button
            className="playlist-menu__item"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToNew();
            }}
            type="button"
          >
            <span className="playlist-menu__item-text">Add to New Playlist</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaylistMenu;
