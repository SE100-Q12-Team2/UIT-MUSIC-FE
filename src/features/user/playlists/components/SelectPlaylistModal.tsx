import React, { useState } from 'react';
import { Playlist } from '@/types/playlist.types';
import { useAddTrackToPlaylist } from '@/core/services/playlist.service';
import '@/styles/select-playlist-modal.css';

interface SelectPlaylistModalProps {
  isOpen: boolean;
  playlists: Playlist[];
  onClose: () => void;
  onConfirm?: (playlistId: number) => void;
  sourcePlaylistId?: number; // The playlist we're adding tracks from
  trackId?: number; // Track ID to add to the selected playlist
  isLoading?: boolean;
  onCreateNew?: () => void; 
}

const SelectPlaylistModal: React.FC<SelectPlaylistModalProps> = ({
  isOpen,
  playlists,
  onClose,
  onConfirm,
  sourcePlaylistId,
  trackId,
  isLoading = false,
  onCreateNew,
}) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const addTrackMutation = useAddTrackToPlaylist();

  if (!isOpen) return null;

  // Filter out the source playlist (can't add a playlist to itself)
  const availablePlaylists = sourcePlaylistId
    ? playlists.filter((p) => p.id !== sourcePlaylistId)
    : playlists;

  const handleConfirm = async () => {
    if (selectedPlaylistId && trackId) {
      try {
        // Call API to add track to playlist
        await addTrackMutation.mutateAsync({
          playlistId: selectedPlaylistId,
          trackId: trackId,
        });
        onConfirm?.(selectedPlaylistId);
        // Reset state
        setSelectedPlaylistId(null);
      } catch (error) {
        console.error('Failed to add track to playlist:', error);
      }
    }
  };

  const handlePlaylistSelect = (playlistId: number) => {
    // Toggle: if already selected, unselect it; otherwise select it
    setSelectedPlaylistId((prev) => (prev === playlistId ? null : playlistId));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="select-playlist-modal" onClick={(e) => e.stopPropagation()}>
        <div className="select-playlist-modal__header">
          <h2 className="select-playlist-modal__title">Add to Playlist</h2>
          <button
            className="select-playlist-modal__close"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="select-playlist-modal__content">
          {availablePlaylists.length > 0 ? (
            <div className="select-playlist-modal__list">
              {availablePlaylists.map((playlist) => (
                <label key={playlist.id} className="select-playlist-modal__item">
                  <input
                    type="radio"
                    name="playlist"
                    value={playlist.id}
                    checked={selectedPlaylistId === playlist.id}
                    onChange={() => handlePlaylistSelect(playlist.id)}
                    className="select-playlist-modal__radio"
                  />
                  <span className="select-playlist-modal__item-text">
                    {playlist.playlistName}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="select-playlist-modal__empty">
              No playlists available
            </div>
          )}
        </div>

        <div className="select-playlist-modal__footer">
          <button
            className="select-playlist-modal__cancel"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          {onCreateNew && (
            <button
              className="select-playlist-modal__cancel"
              onClick={() => {
                onClose();
                onCreateNew();
              }}
              type="button"
            >
              Create New
            </button>
          )}
          <button
            className="select-playlist-modal__confirm"
            onClick={handleConfirm}
            disabled={!selectedPlaylistId || addTrackMutation.isPending || isLoading}
            type="button"
          >
            {addTrackMutation.isPending ? 'Adding...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectPlaylistModal;
