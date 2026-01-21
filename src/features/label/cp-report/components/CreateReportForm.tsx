import React, { useState, useEffect, useRef } from 'react';
import { useCreateReport } from '@/core/services/copyright-report.service';
import { useSearch, SearchResult } from '@/core/services/search.service';
import { uploadService } from '@/core/services/upload.service';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { toast } from 'sonner';

interface CreateReportFormProps {
  onSuccess?: () => void;
}

interface UploadedEvidence {
  file: File;
  publicUrl: string;
  preview: string;
}

const CreateReportForm: React.FC<CreateReportFormProps> = ({ onSuccess }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<{ id: number; title: string; artist?: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [description, setDescription] = useState('');
  const [evidenceImages, setEvidenceImages] = useState<UploadedEvidence[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const { mutate: createReport, isPending } = useCreateReport();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search songs using the global search API
  const { data: searchResult, isLoading: isSearching } = useSearch({
    query: debouncedQuery,
    type: 'songs',
    limit: 50,
    page: 1,
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
    if (!e.target.value) {
      setSelectedSong(null);
    }
  };

  const handleSelectSong = (song: any) => {
    setSelectedSong({
      id: song.id,
      title: song.title,
      artist: song.artistName || song.artist?.name || 'Unknown Artist',
    });
    setSearchQuery(song.title);
    setShowDropdown(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: UploadedEvidence[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} không phải là file ảnh`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} vượt quá 10MB`);
          continue;
        }

        // Get presigned URL
        const urlData = await uploadService.generateImageUploadUrl({
          resource: 'uploads',
          fileName: file.name,
          contentType: file.type,
        });

        // Upload to S3
        await uploadService.uploadImageToS3(urlData.presignedUrl, file);

        // Create preview URL
        const preview = URL.createObjectURL(file);

        newImages.push({
          file,
          publicUrl: urlData.publicUrl,
          preview,
        });
      }

      setEvidenceImages((prev) => [...prev, ...newImages]);
      if (newImages.length > 0) {
        toast.success(`Đã tải lên ${newImages.length} ảnh thành công`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error?.message || 'Không thể tải ảnh lên');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setEvidenceImages((prev) => {
      const newImages = [...prev];
      // Revoke preview URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSong) {
      toast.error('Vui lòng chọn bài hát');
      return;
    }

    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả báo cáo');
      return;
    }

    if (description.trim().length < 10) {
      toast.error('Mô tả báo cáo phải có ít nhất 10 ký tự');
      return;
    }

    if (description.trim().length > 2000) {
      toast.error('Mô tả báo cáo không được vượt quá 2000 ký tự');
      return;
    }

    // Include evidence URLs in the report
    const evidenceUrls = evidenceImages.map((img) => img.publicUrl);
    const reportReasonWithEvidence = evidenceUrls.length > 0
      ? `${description}\n\n[Evidence Images]\n${evidenceUrls.join('\n')}`
      : description;

    createReport(
      {
        songId: selectedSong.id,
        reportReason: reportReasonWithEvidence,
      },
      {
        onSuccess: () => {
          toast.success('Báo cáo đã được gửi thành công');
          setSelectedSong(null);
          setSearchQuery('');
          setDescription('');
          // Cleanup preview URLs
          evidenceImages.forEach((img) => URL.revokeObjectURL(img.preview));
          setEvidenceImages([]);
          onSuccess?.();
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error?.message || 'Không thể gửi báo cáo';
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleCancel = () => {
    setSelectedSong(null);
    setSearchQuery('');
    setDescription('');
    evidenceImages.forEach((img) => URL.revokeObjectURL(img.preview));
    setEvidenceImages([]);
  };

  const songs = searchResult?.songs?.items || [];

  return (
    <div className="create-report-form">
      <div className="create-report-form__warning">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>
          Báo cáo sai thông tin có thể dẫn tới việc bị đình chỉ tài khoản. Vui lòng đảm bảo các thông tin đầy đủ và chính xác để chúng tôi có thể xử lý nhanh hơn.
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="create-report-form__content">
          <h3 className="create-report-form__title">Report Content</h3>

          {/* Song Search Field */}
          <div className="create-report-form__field" ref={dropdownRef}>
            <label htmlFor="searchSong" className="create-report-form__label">
              Search Song
            </label>
            <div className="create-report-form__search-wrapper">
              <input
                id="searchSong"
                type="text"
                className="create-report-form__input"
                placeholder="Nhập tên bài hát để tìm kiếm..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                disabled={isPending}
                autoComplete="off"
              />
              {isSearching && (
                <span className="create-report-form__search-loading">Đang tìm...</span>
              )}
            </div>

            {/* Dropdown Results */}
            {showDropdown && debouncedQuery && songs.length > 0 && (
              <div className="create-report-form__dropdown">
                {songs.map((song: any) => (
                  <div
                    key={song.id}
                    className={`create-report-form__dropdown-item ${selectedSong?.id === song.id ? 'create-report-form__dropdown-item--selected' : ''}`}
                    onClick={() => handleSelectSong(song)}
                  >
                    <div className="create-report-form__dropdown-item-info">
                      <span className="create-report-form__dropdown-item-title">{song.title}</span>
                      <span className="create-report-form__dropdown-item-artist">
                        {song.artistName || song.artist?.name || 'Unknown Artist'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {showDropdown && debouncedQuery && !isSearching && songs.length === 0 && (
              <div className="create-report-form__dropdown">
                <div className="create-report-form__dropdown-empty">
                  Không tìm thấy bài hát nào
                </div>
              </div>
            )}

            {/* Selected Song Display */}
            {selectedSong && (
              <div className="create-report-form__selected-song">
                <span>Đã chọn: <strong>{selectedSong.title}</strong> - {selectedSong.artist}</span>
                <button
                  type="button"
                  className="create-report-form__clear-btn"
                  onClick={() => {
                    setSelectedSong(null);
                    setSearchQuery('');
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Description Field */}
          <div className="create-report-form__field">
            <label htmlFor="description" className="create-report-form__label">
              Description
            </label>
            <textarea
              id="description"
              className="create-report-form__textarea"
              placeholder="Nhập mô tả chi tiết về vi phạm bản quyền (tối thiểu 10 ký tự)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              rows={8}
              maxLength={2000}
            />
            <div style={{ textAlign: 'right', fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
              {description.length}/2000
            </div>
          </div>

          {/* Evidence Section */}
          <div className="create-report-form__field">
            <label className="create-report-form__label">
              Evidence
            </label>
            <p className="create-report-form__field-hint">
              Tải lên ảnh chứng minh quyền sở hữu hoặc vi phạm bản quyền (tối đa 10MB/ảnh)
            </p>

            {/* Upload Button */}
            <div className="create-report-form__evidence-upload">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={isPending || isUploading}
              />
              <button
                type="button"
                className="create-report-form__upload-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending || isUploading}
              >
                {isUploading ? (
                  <>
                    <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Đang tải lên...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Chọn ảnh từ máy
                  </>
                )}
              </button>
            </div>

            {/* Uploaded Images Preview */}
            {evidenceImages.length > 0 && (
              <div className="create-report-form__evidence-preview">
                {evidenceImages.map((img, index) => (
                  <div key={index} className="create-report-form__evidence-item">
                    <img src={img.preview} alt={`Evidence ${index + 1}`} />
                    <button
                      type="button"
                      className="create-report-form__evidence-remove"
                      onClick={() => handleRemoveImage(index)}
                      disabled={isPending}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="create-report-form__actions">
          <button
            type="button"
            className="create-report-form__button create-report-form__button--cancel"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="create-report-form__button create-report-form__button--submit"
            disabled={isPending || !selectedSong || !description.trim()}
          >
            {isPending ? 'Đang gửi...' : 'Send Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReportForm;
