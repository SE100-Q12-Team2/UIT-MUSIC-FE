import React, { useState } from 'react';
import { useCreateReport, useReportedSongIds } from '@/core/services/copyright-report.service';
import { useLabelSongs, useRecordLabels } from '@/core/services/label.service';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { toast } from 'sonner';

interface CreateReportFormProps {
  onSuccess?: () => void;
}

const CreateReportForm: React.FC<CreateReportFormProps> = ({ onSuccess }) => {
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [description, setDescription] = useState('');

  const { user } = useAuth();
  const { data: labels = [], isLoading: isLoadingLabels } = useRecordLabels(user?.id);
  const label = labels[0];

  const { data: songsData, isLoading: isLoadingSongs } = useLabelSongs(label?.id, 1, 100);
  const { data: reportedSongIds = [], isLoading: isLoadingReportedIds } = useReportedSongIds();
  const { mutate: createReport, isPending } = useCreateReport();

  const availableSongs = (songsData?.items || []).filter(
    (song) => !reportedSongIds.includes(song.id)
  );

  if (isLoadingLabels) {
    return (
      <div className="create-report-form">
        <div className="create-report-form__loading">Đang tải thông tin label...</div>
      </div>
    );
  }

  if (!label) {
    return (
      <div className="create-report-form">
        <div className="create-report-form__error">
          <p>Không tìm thấy thông tin label của bạn.</p>
          <p>Vui lòng đảm bảo bạn đã tạo label trước khi tạo báo cáo.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSongId) {
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

    createReport(
      {
        songId: selectedSongId,
        reportReason: description,
      },
      {
        onSuccess: () => {
          toast.success('Báo cáo đã được gửi thành công');
          setSelectedSongId(null);
          setDescription('');
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
    setSelectedSongId(null);
    setDescription('');
  };

  return (
    <div className="create-report-form">
      <div className="create-report-form__warning">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>
          Báo cáo sai thông tin có thể dẫn tới việc bị đình chỉ tài khoản. Vui lòng đảm bảo các thông tin đầy đủ và chính xác để chúng tôi có thể xử lý nhanh hơn.
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="create-report-form__content">
          <h3 className="create-report-form__title">Report Content</h3>

          <div className="create-report-form__field">
            <label htmlFor="reportSong" className="create-report-form__label">
              Report Song
            </label>
            <select
              id="reportSong"
              className="create-report-form__select"
              value={selectedSongId || ''}
              onChange={(e) => setSelectedSongId(Number(e.target.value))}
              disabled={isLoadingSongs || isLoadingReportedIds || isPending}
            >
              <option value="">Chọn Bài Hát</option>
              {availableSongs.map((song) => (
                <option key={song.id} value={song.id}>
                  {song.title}
                </option>
              ))}
            </select>
            {availableSongs.length === 0 && !isLoadingSongs && !isLoadingReportedIds && (
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginTop: '8px' }}>
                Tất cả bài hát đã được báo cáo hoặc không có bài hát nào.
              </p>
            )}
          </div>

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
            disabled={isPending || !selectedSongId || !description.trim()}
          >
            {isPending ? 'Đang gửi...' : 'Send Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReportForm;
