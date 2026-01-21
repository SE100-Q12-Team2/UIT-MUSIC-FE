import React, { useState, useRef } from 'react';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { useCreatePlaylist, useAddTrackToPlaylist } from '@/core/services/playlist.service';
import { uploadService } from '@/core/services/upload.service';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    playlistName: '',
    description: '',
    isPublic: false,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

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

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setCoverImage(file);
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setCoverImagePreview(previewUrl);
    setError('');
  };

  const handleRemoveCoverImage = () => {
    if (coverImagePreview) {
      URL.revokeObjectURL(coverImagePreview);
    }
    setCoverImage(null);
    setCoverImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      let coverImageUrl: string | undefined;

      // Upload cover image if selected
      if (coverImage) {
        setIsUploading(true);
        try {
          const urlData = await uploadService.generateImageUploadUrl({
            resource: 'uploads',
            fileName: coverImage.name,
            contentType: coverImage.type,
          });

          await uploadService.uploadImageToS3(urlData.presignedUrl, coverImage);
          coverImageUrl = urlData.publicUrl;
        } catch (uploadError) {
          console.error('Failed to upload cover image:', uploadError);
          setError('Failed to upload cover image');
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const newPlaylist = await createPlaylistMutation.mutateAsync({
        userId: user.id,
        playlistName: formData.playlistName,
        description: formData.description,
        isPublic: formData.isPublic,
        tags: tags,
        coverImageUrl: coverImageUrl,
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
      handleRemoveCoverImage();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create playlist'
      );
    }
  };

  const isLoading = createPlaylistMutation.isPending || addTrackMutation.isPending || isUploading;

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

            {/* Cover Image Upload */}
            <div className="create-playlist-modal__field">
              <label className="create-playlist-modal__label">
                Cover Image
              </label>
              <div className="create-playlist-modal__cover-upload">
                {coverImagePreview ? (
                  <div className="create-playlist-modal__cover-preview">
                    <img src={coverImagePreview} alt="Cover preview" />
                    <button
                      type="button"
                      className="create-playlist-modal__cover-remove"
                      onClick={handleRemoveCoverImage}
                      disabled={isLoading}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="create-playlist-modal__cover-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Upload Cover</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageSelect}
                  style={{ display: 'none' }}
                  disabled={isLoading}
                />
              </div>
            </div>

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
              {isLoading ? (isUploading ? 'Uploading...' : 'Creating...') : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
