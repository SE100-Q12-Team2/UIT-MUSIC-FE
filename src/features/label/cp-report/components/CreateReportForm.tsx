import React, { useState } from 'react';
import { useCreateReport } from '@/core/services/copyright-report.service';
import { useLabelSongs } from '@/core/services/label.service';
import { useProfileStore } from '@/store/profileStore';
import { toast } from 'sonner';

interface CreateReportFormProps {
  onSuccess?: () => void;
}

const CreateReportForm: React.FC<CreateReportFormProps> = ({ onSuccess }) => {
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [description, setDescription] = useState('');

  const profile = useProfileStore((state) => state.profile);
  const labelId = profile?.role?.id === 3 ? profile.id : undefined;

  const { data: songsData, isLoading: isLoadingSongs } = useLabelSongs(labelId, 1, 1000);
  const { mutate: createReport, isPending } = useCreateReport();

  const songs = songsData?.items || [];

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
          toast.error(error?.message || 'Không thể gửi báo cáo');
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
              disabled={isLoadingSongs || isPending}
            >
              <option value="">Chọn Bài Hát</option>
              {songs.map((song) => (
                <option key={song.id} value={song.id}>
                  {song.title}
                </option>
              ))}
            </select>
          </div>

          <div className="create-report-form__field">
            <label htmlFor="description" className="create-report-form__label">
              Description
            </label>
            <textarea
              id="description"
              className="create-report-form__textarea"
              placeholder="Short Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              rows={8}
            />
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
