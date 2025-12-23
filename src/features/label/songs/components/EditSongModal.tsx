import React, { useState, useEffect } from 'react';
import { X, Type, User, Music, Calendar, Clock, FileText } from 'lucide-react';
import { LabelSong } from '@/types/label.types';
import { useUpdateSong } from '@/core/services/song.service';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { formatTime } from '@/shared/utils/formatTime';
import { toast } from 'sonner';
import '@/styles/edit-song-modal.css';

interface EditSongModalProps {
  song: LabelSong | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditSongModal: React.FC<EditSongModalProps> = ({ song, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    publishDate: '',
    duration: '',
    description: '',
  });

  const updateSongMutation = useUpdateSong();

  // Initialize form data when song changes
  useEffect(() => {
    if (song) {
      const publishDate = song.uploadDate ? new Date(song.uploadDate).toISOString().split('T')[0] : '';
      // This setState in effect is necessary to sync form state with the song prop
      // when the modal opens with a different song. Using a key prop would reset
      // user input, so we sync state here instead.
      // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          title: song.title,
          artist: song.songArtists.map((sa) => sa.artist.artistName).join(', '),
          genre: song.genre.genreName,
          publishDate: publishDate,
          duration: formatTime(song.duration),
          description: song.description || '',
        });
    }
  }, [song]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!song) return;

    try {
      // Convert duration from "MM:SS" to seconds
      const [minutes, seconds] = formData.duration.split(':').map(Number);
      const durationInSeconds = minutes * 60 + seconds;

      await updateSongMutation.mutateAsync({
        id: song.id,
        data: {
          title: formData.title,
          description: formData.description,
          duration: durationInSeconds,
          uploadDate: formData.publishDate ? new Date(formData.publishDate).toISOString() : song.uploadDate,
          // TODO: Update genre and artist if needed
        },
      });

      toast.success('Song updated successfully');
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const errorObj = error as { message?: string; response?: { data?: { message?: string } } };
      const errorMsg = errorObj?.message || errorObj?.response?.data?.message || 'Failed to update song';
      toast.error('Failed to update song', { description: errorMsg });
    }
  };

  if (!isOpen || !song) return null;

  // Mock data for statistics (should come from API)
  const listeningCount = song.playCount;
  const favouriteCount = 890000;
  const rating = 4.9;

  return (
    <div className="edit-song-modal-overlay" onClick={onClose}>
      <div className="edit-song-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="edit-song-modal__header">
          <h2 className="edit-song-modal__title">Edit Song</h2>
          <button
            className="edit-song-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form className="edit-song-modal__content" onSubmit={handleSubmit}>
          {/* Editable Fields */}
          <div className="edit-song-modal__fields">
            {/* Row 1: Song Name - Artist */}
            <div className="edit-song-modal__row">
              <div className="edit-song-modal__field">
                <Label htmlFor="edit-title" className="edit-song-modal__label">
                  Song Name
                </Label>
                <div className="edit-song-modal__input-wrapper">
                  <div className="edit-song-modal__field-icon">
                    <Type size={20} />
                  </div>
                  <Input
                    id="edit-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="edit-song-modal__input"
                    required
                  />
                </div>
              </div>

              <div className="edit-song-modal__field">
                <Label htmlFor="edit-artist" className="edit-song-modal__label">
                  Artist
                </Label>
                <div className="edit-song-modal__input-wrapper">
                  <div className="edit-song-modal__field-icon">
                    <User size={20} />
                  </div>
                  <Input
                    id="edit-artist"
                    type="text"
                    value={formData.artist}
                    onChange={(e) => handleInputChange('artist', e.target.value)}
                    className="edit-song-modal__input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Genre, Date, Duration */}
            <div className="edit-song-modal__row edit-song-modal__row--three">
              <div className="edit-song-modal__field">
                <Label htmlFor="edit-genre" className="edit-song-modal__label">
                  Genre
                </Label>
                <div className="edit-song-modal__input-wrapper">
                  <div className="edit-song-modal__field-icon">
                    <Music size={20} />
                  </div>
                  <Input
                    id="edit-genre"
                    type="text"
                    value={formData.genre}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                    className="edit-song-modal__input"
                  />
                </div>
              </div>

              <div className="edit-song-modal__field">
                <Label htmlFor="edit-publishDate" className="edit-song-modal__label">
                  Publish Date
                </Label>
                <div className="edit-song-modal__input-wrapper">
                  <div className="edit-song-modal__field-icon">
                    <Calendar size={20} />
                  </div>
                  <Input
                    id="edit-publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => handleInputChange('publishDate', e.target.value)}
                    className="edit-song-modal__input"
                  />
                </div>
              </div>

              <div className="edit-song-modal__field">
                <Label htmlFor="edit-duration" className="edit-song-modal__label">
                  Duration
                </Label>
                <div className="edit-song-modal__input-wrapper">
                  <div className="edit-song-modal__field-icon">
                    <Clock size={20} />
                  </div>
                  <Input
                    id="edit-duration"
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="edit-song-modal__input"
                    pattern="[0-9]+:[0-5][0-9]"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Description (full width) */}
            <div className="edit-song-modal__field edit-song-modal__field--full edit-song-modal__field--textarea">
              <Label htmlFor="edit-description" className="edit-song-modal__label">
                Description
              </Label>
              <div className="edit-song-modal__input-wrapper">
                <div className="edit-song-modal__field-icon">
                  <FileText size={20} />
                </div>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Song Description...."
                  className="edit-song-modal__textarea"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Statistics Section (Non-Editable) */}
          <div className="edit-song-modal__section">
            <h4 className="edit-song-modal__section-title">Statistic (Non Editable)</h4>
            <div className="edit-song-modal__stats">
              <div className="edit-song-modal__stat-field">
                <label className="edit-song-modal__stat-label">Listening Count</label>
                <Input
                  type="text"
                  value={listeningCount.toLocaleString()}
                  className="edit-song-modal__stat-input"
                  disabled
                />
              </div>
              <div className="edit-song-modal__stat-field">
                <label className="edit-song-modal__stat-label">Favourite Count</label>
                <Input
                  type="text"
                  value={favouriteCount.toLocaleString()}
                  className="edit-song-modal__stat-input"
                  disabled
                />
              </div>
              <div className="edit-song-modal__stat-field">
                <label className="edit-song-modal__stat-label">Rating</label>
                <Input
                  type="text"
                  value={rating.toString()}
                  className="edit-song-modal__stat-input"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="edit-song-modal__actions">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="edit-song-modal__cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="edit-song-modal__update-btn"
              disabled={updateSongMutation.isPending}
            >
              {updateSongMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSongModal;

