import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaylistsWithTrackCounts } from '@/core/services/playlist.service';
import { Playlist } from '@/types/playlist.types';
import {
  CreatePlaylistModal,
  AddTracksSection,
} from '../components';
import '@/styles/user-playlists.css';

// Grid Section Component
const GridSection: React.FC<{
  title: string;
  items: Playlist[];
  renderItem: (item: Playlist, index: number) => React.ReactNode;
  actionButton?: React.ReactNode;
}> = ({ title, items, renderItem, actionButton }) => {
  return (
    <div className="user-playlist__section">
      <div className="user-playlist__section-header">
        <h2 className="user-playlist__section-title">{title}</h2>
        {actionButton && <div className="user-playlist__section-actions">{actionButton}</div>}
      </div>
      <div className="user-playlist__grid">
        {items.map((item, index) => renderItem(item, index))}
      </div>
    </div>
  );
};

// Playlist Card Component
const PlaylistCard: React.FC<{
  playlist: Playlist;
  onClick: () => void;
}> = ({ playlist, onClick }) => {
  return (
    <div className="playlist-card" onClick={onClick}>
      <div className="playlist-card__image-wrapper">
        <img
          src={playlist.coverImageUrl || '/placeholder-playlist.png'}
          alt={playlist.playlistName}
          className="playlist-card__image"
        />
        <div className="playlist-card__overlay">
          <button className="playlist-card__play-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="playlist-card__info">
        <h3 className="playlist-card__title">{playlist.playlistName}</h3>
        <p className="playlist-card__meta">{playlist.playlistSongs?.length || 0} Tracks</p>
      </div>
      <button className="playlist-card__favorite">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>
  );
};

const UserPlaylistsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);

  // Fetch playlists
  const { data: playlists = [] } = usePlaylistsWithTrackCounts();

  const handlePlaylistClick = (playlist: Playlist) => {
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <div className="user-playlists-page user-playlists-page--no-detail">
      <div className="user-playlists-page__main">
        <GridSection
          title="Your Playlists"
          items={playlists}
          renderItem={(playlist, index) => (
            <PlaylistCard
              key={`yours-${index}`}
              playlist={playlist}
              onClick={() => handlePlaylistClick(playlist)}
            />
          )}
          actionButton={
            <button
              className="user-playlist__create-btn"
              onClick={() => setShowCreatePlaylistModal(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Playlist
            </button>
          }
        />

        {/* Add Tracks Section - Same as Browser page */}
        <AddTracksSection />
      </div>

      {/* Create New Playlist Modal */}
      <CreatePlaylistModal
        isOpen={showCreatePlaylistModal}
        onClose={() => setShowCreatePlaylistModal(false)}
        onPlaylistCreated={(playlistId) => {
          console.log('Playlist created:', playlistId);
          setShowCreatePlaylistModal(false);
        }}
      />
    </div>
  );
};

export default UserPlaylistsPage;
