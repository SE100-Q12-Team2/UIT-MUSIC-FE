import React, { useState } from 'react';
import { Music, User, Clock, Calendar, FileText, Type } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { useCreateSong } from '@/core/services/song.service';
import { toast } from 'sonner';
import '@/styles/create-song-form.css';

interface CreateSongFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateSongForm: React.FC<CreateSongFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    artist: '',
    duration: '3:00',
    publishDate: '',
    description: '',
    songFile: null as File | null,
  });

  const createSongMutation = useCreateSong();

  const handleInputChange = (field: string, value: string | File) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange('songFile', file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.artist) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      // TODO: Convert duration from "MM:SS" to seconds
      const [minutes, seconds] = formData.duration.split(':').map(Number);
      const durationInSeconds = minutes * 60 + seconds;

      await createSongMutation.mutateAsync({
        title: formData.title,
        // genreId: will need to be resolved from genre name
        // artistId: will need to be resolved from artist name
        duration: durationInSeconds,
        uploadDate: formData.publishDate || new Date().toISOString(),
        description: formData.description,
        // TODO: Upload song file and get asset info
      });

      toast.success('Song created successfully');
      onSuccess?.();
      
      // Reset form
      setFormData({
        title: '',
        genre: '',
        artist: '',
        duration: '3:00',
        publishDate: '',
        description: '',
        songFile: null,
      });
    } catch (error: any) {
      const errorMsg = error?.message || error?.response?.data?.message || 'Failed to create song';
      toast.error('Failed to create song', { description: errorMsg });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('publishDate', e.target.value);
  };

  return (
    <form className="create-song-form" onSubmit={handleSubmit}>
      <div className="create-song-form__fields">
        {/* Row 1: Song Name - Artist */}
        <div className="create-song-form__row">
          <div className="create-song-form__field">
            <Label htmlFor="songTitle" className="create-song-form__label">
              Song Title
            </Label>
            <div className="create-song-form__input-wrapper">
              <div className="create-song-form__field-icon">
                <Type size={20} />
              </div>
              <Input
                id="songTitle"
                type="text"
                placeholder="Tên bài hát"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="create-song-form__input"
                required
              />
            </div>
          </div>

          <div className="create-song-form__field">
            <Label htmlFor="artist" className="create-song-form__label">
              Artist
            </Label>
            <div className="create-song-form__input-wrapper">
              <div className="create-song-form__field-icon">
                <User size={20} />
              </div>
              <Input
                id="artist"
                type="text"
                placeholder="Chọn nghệ sĩ"
                value={formData.artist}
                onChange={(e) => handleInputChange('artist', e.target.value)}
                className="create-song-form__input"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 2: Genre - Duration */}
        <div className="create-song-form__row">
          <div className="create-song-form__field">
            <Label htmlFor="genre" className="create-song-form__label">
              Genre
            </Label>
            <div className="create-song-form__input-wrapper">
              <div className="create-song-form__field-icon">
                <Music size={20} />
              </div>
              <Input
                id="genre"
                type="text"
                placeholder="Genre"
                value={formData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="create-song-form__input"
              />
            </div>
          </div>

          <div className="create-song-form__field">
            <Label htmlFor="duration" className="create-song-form__label">
              Duration
            </Label>
            <div className="create-song-form__input-wrapper">
              <div className="create-song-form__field-icon">
                <Clock size={20} />
              </div>
              <Input
                id="duration"
                type="text"
                placeholder="3:00"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="create-song-form__input"
                pattern="[0-9]+:[0-5][0-9]"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Song's File - Date */}
        <div className="create-song-form__row">
          <div className="create-song-form__field">
            <Label htmlFor="songFile" className="create-song-form__label">
              Song's File
            </Label>
            <div className="create-song-form__input-wrapper">
              <div className="create-song-form__field-icon">
                <Music size={20} />
              </div>
              <Input
                id="songFile"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="create-song-form__file-input"
              />
              <label htmlFor="songFile" className="create-song-form__file-label">
                {formData.songFile ? formData.songFile.name : 'Chọn file nhạc'}
              </label>
            </div>
          </div>

          <div className="create-song-form__field">
            <Label htmlFor="publishDate" className="create-song-form__label">
              Publish Date
            </Label>
            <div className="create-song-form__input-wrapper">
              <div className="create-song-form__field-icon">
                <Calendar size={20} />
              </div>
              <Input
                id="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={handleDateChange}
                className="create-song-form__input create-song-form__input--date"
              />
            </div>
          </div>
        </div>

        {/* Row 4: Description (full width) */}
        <div className="create-song-form__field create-song-form__field--full create-song-form__field--textarea">
          <Label htmlFor="description" className="create-song-form__label">
            Description
          </Label>
          <div className="create-song-form__input-wrapper">
            <div className="create-song-form__field-icon">
              <FileText size={20} />
            </div>
            <Textarea
              id="description"
              placeholder="Song's Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="create-song-form__textarea"
              rows={6}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="create-song-form__actions">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="create-song-form__cancel-btn"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="create-song-form__submit-btn"
          disabled={createSongMutation.isPending}
        >
          {createSongMutation.isPending ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default CreateSongForm;

