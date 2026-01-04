import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import menuIcon from '@/assets/Menu.svg';
import '@/styles/track-menu.css';

interface TrackMenuProps {
  trackId: number;
  onAddToExisting: (trackId: number) => void;
  onAddToNew: (trackId: number) => void;
}

const TrackMenu: React.FC<TrackMenuProps> = ({
  trackId,
  onAddToExisting,
  onAddToNew,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.right - 200,
      });
    }
  }, [isOpen]);

  const handlePlayTrack = () => {
    navigate(`/player`);
    setIsOpen(false);
  };

  const handleAddToExisting = () => {
    onAddToExisting(trackId);
    setIsOpen(false);
  };

  const handleAddToNew = () => {
    onAddToNew(trackId);
    setIsOpen(false);
  };

  return (
    <div className="track-menu" ref={menuRef}>
      <button
        ref={triggerRef}
        className="track-menu__trigger"
        onClick={(e) => {
          e.stopPropagation();
          console.log('Track menu clicked, trackId:', trackId);
          setIsOpen(!isOpen);
        }}
        type="button"
        aria-label="Menu"
      >
        <img src={menuIcon} alt="" />
      </button>

      {isOpen && (
        <div className="track-menu__dropdown" style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}>
          <button
            className="track-menu__item"
            onClick={(e) => {
              e.stopPropagation();
              handlePlayTrack();
            }}
            type="button"
          >
            <span className="track-menu__item-text">Play Track</span>
          </button>
          <button
            className="track-menu__item"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToExisting();
            }}
            type="button"
          >
            <span className="track-menu__item-text">Add to Existing Playlist</span>
          </button>
          <button
            className="track-menu__item"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToNew();
            }}
            type="button"
          >
            <span className="track-menu__item-text">Add to New Playlist</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TrackMenu;
