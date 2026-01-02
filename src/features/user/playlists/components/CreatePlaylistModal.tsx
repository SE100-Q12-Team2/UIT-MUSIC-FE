import React, { useState } from 'react';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { useCreatePlaylist, useAddTrackToPlaylist } from '@/core/services/playlist.service';
import '@/styles/create-playlist-modal.css';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistCreated?: (playlistId: number) => void;
  trackToAdd?: { playlistId?: number; songId?: number };
  trackId?: number; // Track ID to add to the newly created playlist
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onPlaylistCreated,
  trackToAdd,
  trackId,
}) => {
  const { user } = useAuth();
  const createPlaylistMutation = useCreatePlaylist();
  const addTrackMutation = useAddTrackToPlaylist();

  const [formData, setFormData] = useState({
    playlistName: '',
    description: '',
    isPublic: false,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prev) => [...prev, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.playlistName.trim()) {
      setError('Playlist name is required');
      return;
    }

    if (!user?.id) {
      setError('User not logged in');
      return;
    }

    try {
      const newPlaylist = await createPlaylistMutation.mutateAsync({
        userId: user.id,
        playlistName: formData.playlistName,
        description: formData.description,
        isPublic: formData.isPublic,
        tags: tags,
      });

      // If trackId is provided, add the track to the newly created playlist
      if (trackId) {
        await addTrackMutation.mutateAsync({
          playlistId: newPlaylist.id,
          trackId: trackId,
        });
      }

      onPlaylistCreated?.(newPlaylist.id);

      // Reset form
      setFormData({
        playlistName: '',
        description: '',
        isPublic: false,
      });
      setTags([]);
      setTagInput('');
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create playlist'
      );
    }
  };

  const isLoading = createPlaylistMutation.isPending || addTrackMutation.isPending;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-playlist-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-playlist-modal__header">
          <h2 className="create-playlist-modal__title">Create New Playlist</h2>
          <button
            className="create-playlist-modal__close"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="create-playlist-modal__content">
            {error && (
              <div className="create-playlist-modal__error">{error}</div>
            )}

            <div className="create-playlist-modal__field">
              <label className="create-playlist-modal__label">
                Playlist Name *
              </label>
              <input
                type="text"
                name="playlistName"
                value={formData.playlistName}
                onChange={handleChange}
                className="create-playlist-modal__input"
                placeholder="Enter playlist name"
                disabled={isLoading}
              />
            </div>

            <div className="create-playlist-modal__field">
              <label className="create-playlist-modal__label">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="create-playlist-modal__textarea"
                placeholder="Enter playlist description (optional)"
                disabled={isLoading}
                rows={4}
              />
            </div>

            <div className="create-playlist-modal__field">
              <label className="create-playlist-modal__label">Tags</label>
              <div className="create-playlist-modal__tag-input-wrapper">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  className="create-playlist-modal__tag-input"
                  placeholder="Enter a tag (optional)"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="create-playlist-modal__tag-add-btn"
                  disabled={isLoading || !tagInput.trim()}
                >
                  +
                </button>
              </div>
              {tags.length > 0 && (
                <div className="create-playlist-modal__tags-list">
                  {tags.map((tag) => (
                    <span key={tag} className="create-playlist-modal__tag">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="create-playlist-modal__tag-remove"
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="create-playlist-modal__field">
              <label className="create-playlist-modal__checkbox-label">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="create-playlist-modal__checkbox"
                />
                <span>Make this playlist public</span>
              </label>
            </div>
          </div>

          <div className="create-playlist-modal__footer">
            <button
              className="create-playlist-modal__cancel"
              onClick={onClose}
              type="button"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="create-playlist-modal__create"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
