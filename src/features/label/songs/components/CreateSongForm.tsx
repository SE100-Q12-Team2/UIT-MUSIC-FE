import React, { useState } from 'react';
import { Music, User, Clock, Calendar, FileText, Type } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { useCreateSong } from '@/core/services/song.service';
import { useGenres } from '@/core/services/genre.service';
import { useRecordLabels, useLabelAlbums } from '@/core/services/label.service';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { useUploadAudio } from '@/core/services/upload.service';
import { toast } from 'sonner';
import '@/styles/create-song-form.css';

interface CreateSongFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateSongForm: React.FC<CreateSongFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    genreId: '',
    albumId: '',
    duration: '3:00',
    publishDate: '',
    description: '',
    language: 'Vietnamese',
    songFile: null as File | null,
  });

  const createSongMutation = useCreateSong();
  const uploadAudioMutation = useUploadAudio();
  const { data: genresResponse } = useGenres({ limit: 100 });
  const { data: labels = [] } = useRecordLabels(user?.id);
  const label = labels[0];
  const { data: albumsResponse } = useLabelAlbums(label?.id, 1, 100);

  console.log("genresResponse", genresResponse)

  const genres = genresResponse?.data || [];
  const albums = albumsResponse?.items || [];
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

    if (!formData.title.trim()) {
      toast.error('Song title is required');
      return;
    }

    if (!label) {
      toast.error('No label found for your account');
      return;
    }

    if (!label.id) {
      toast.error('Label ID is missing. Please contact support.');
      console.error('❌ Label object:', label);
      return;
    }

    console.log('✅ Label info:', {
      id: label.id,
      name: label.labelName,
      type: label.labelType,
    });

    try {
      const [minutes, seconds] = formData.duration.split(':').map(Number);
      const durationInSeconds = minutes * 60 + seconds;

      if (isNaN(durationInSeconds) || durationInSeconds <= 0) {
        toast.error('Invalid duration format. Use MM:SS format');
        return;
      }

      toast.info('Creating song...');

      console.log('🎵 Creating song with data:', {
        title: formData.title.trim(),
        duration: durationInSeconds,
        labelId: label.id,
        labelName: label.labelName,
        genreId: formData.genreId ? Number(formData.genreId) : undefined,
      });

      const createdSong = await createSongMutation.mutateAsync({
        title: formData.title.trim(),
        duration: durationInSeconds,
        description: formData.description.trim() || undefined,
        language: formData.language,
        genreId: formData.genreId ? Number(formData.genreId) : undefined,
        albumId: formData.albumId ? Number(formData.albumId) : undefined,
        // Artist is the label itself
        artists: [
          {
            artistId: label.id,
            role: 'MainArtist' as const,
          },
        ],
      } as any);

      if (formData.songFile && createdSong.id) {
        toast.info('Uploading audio file...');
        
        try {
          await uploadAudioMutation.mutateAsync({
            file: formData.songFile,
            songId: createdSong.id,
          });
          
          toast.success(`Song "${formData.title}" created and audio uploaded successfully!`);
        } catch (uploadError) {
          console.error('❌ Audio upload error:', uploadError);
          toast.warning(`Song created but audio upload failed. You can upload audio later.`);
        }
      } else {
        toast.success(`Song "${formData.title}" created successfully!`);
      }

      onSuccess?.();
      
      // Reset form
      setFormData({
        title: '',
        genreId: '',
        albumId: '',
        duration: '3:00',
        publishDate: '',
        description: '',
        language: 'Vietnamese',
        songFile: null,
      });
    } catch (error: unknown) {
      console.error('❌ Create song error:', error);
      const errorObj = error as { message?: string; response?: { data?: { message?: string } } };
      const errorMsg = errorObj?.message || errorObj?.response?.data?.message || 'Failed to create song';
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
                value={label?.labelName || 'Loading...'}
                disabled
                className="create-song-form__input"
                title="Artist will be your label"
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">Your label will be set as the main artist</p>
          </div>
        </div>

        {/* Row 2: Genre - Album */}
        <div className="create-song-form__row">
          <div className="create-song-form__field">
            <Label htmlFor="genre" className="create-song-form__label">
              Genre
            </Label>
            <div className="create-song-form__input-wrapper">
              <div className="create-song-form__field-icon">
                <Music size={20} />
              </div>
              <select
                id="genre"
                value={formData.genreId}
                onChange={(e) => handleInputChange('genreId', e.target.value)}
                className="create-song-form__input"
              >
                <option value="">Select genre (optional)</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.genreName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="create-song-form__field">
            <Label htmlFor="album" className="create-song-form__label">
              Album
            </Label>
            <div className="create-song-form__input-wrapper">
              <div className="create-song-form__field-icon">
                <Music size={20} />
              </div>
              <select
                id="album"
                value={formData.albumId}
                onChange={(e) => handleInputChange('albumId', e.target.value)}
                className="create-song-form__input"
              >
                <option value="">Select album (optional)</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.albumTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 3: Duration - Publish Date */}
        <div className="create-song-form__row">
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

        {/* Row 4: Song's File */}
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
        </div>

        {/* Row 5: Description (full width) */}
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
          disabled={createSongMutation.isPending || uploadAudioMutation.isPending}
        >
          {createSongMutation.isPending 
            ? 'Creating song...' 
            : uploadAudioMutation.isPending 
            ? 'Uploading audio...' 
            : 'Create Song'}
        </Button>
      </div>
    </form>
  );
};

export default CreateSongForm;

