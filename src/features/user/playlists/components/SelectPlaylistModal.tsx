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
  isLoading?: boolean;
}

const SelectPlaylistModal: React.FC<SelectPlaylistModalProps> = ({
  isOpen,
  playlists,
  onClose,
  onConfirm,
  sourcePlaylistId,
  isLoading = false,
}) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const addTrackMutation = useAddTrackToPlaylist();

  if (!isOpen) return null;

  // Filter out the source playlist (can't add a playlist to itself)
  const availablePlaylists = sourcePlaylistId
    ? playlists.filter((p) => p.id !== sourcePlaylistId)
    : playlists;

  const handleConfirm = async () => {
    if (selectedPlaylistId) {
      onConfirm?.(selectedPlaylistId);
      // Reset state
      setSelectedPlaylistId(null);
    }
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
                    onChange={() => setSelectedPlaylistId(playlist.id)}
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
