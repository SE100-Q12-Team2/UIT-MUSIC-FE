import React, { useState } from 'react';
import { CopyrightReport, useUpdateReport } from '@/core/services/copyright-report.service';
import '@/styles/edit-report-modal.css';

interface EditReportModalProps {
  report: CopyrightReport;
  onClose: () => void;
  onSuccess: () => void;
}

const EditReportModal: React.FC<EditReportModalProps> = ({ report, onClose, onSuccess }) => {
  const [reportReason, setReportReason] = useState(report.reportReason);
  const [error, setError] = useState('');
  const updateReport = useUpdateReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (reportReason.trim().length < 10) {
      setError('Lý do báo cáo phải có ít nhất 10 ký tự');
      return;
    }

    if (reportReason.trim().length > 2000) {
      setError('Lý do báo cáo không được vượt quá 2000 ký tự');
      return;
    }

    try {
      await updateReport.mutateAsync({ 
        id: report.id, 
        data: { reportReason: reportReason.trim() } 
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể cập nhật báo cáo');
    }
  };

  return (
    <div className="edit-report-modal__overlay" onClick={onClose}>
      <div className="edit-report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-report-modal__header">
          <h2>Chỉnh Sửa Báo Cáo</h2>
          <button className="edit-report-modal__close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-report-modal__form">
          <div className="edit-report-modal__song-info">
            <h3>{report.song?.title || 'Unknown Song'}</h3>
            <p>{report.song?.artist || 'Unknown Artist'}</p>
          </div>

          <div className="edit-report-modal__field">
            <label htmlFor="reportReason">
              Lý Do Báo Cáo <span className="required">*</span>
            </label>
            <textarea
              id="reportReason"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Mô tả chi tiết lý do báo cáo vi phạm bản quyền..."
              rows={6}
              maxLength={2000}
            />
            <div className="edit-report-modal__char-count">
              {reportReason.length}/2000
            </div>
          </div>

          {error && <div className="edit-report-modal__error">{error}</div>}

          <div className="edit-report-modal__actions">
            <button type="button" onClick={onClose} className="edit-report-modal__cancel">
              Hủy
            </button>
            <button 
              type="submit" 
              className="edit-report-modal__submit"
              disabled={updateReport.isPending}
            >
              {updateReport.isPending ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReportModal;
