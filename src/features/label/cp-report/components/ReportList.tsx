import React, { useState } from 'react';
import { CopyrightReport, useDeleteReport } from '@/core/services/copyright-report.service';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import EditReportModal from './EditReportModal';
import { toast } from 'sonner';

interface ReportListProps {
  reports: CopyrightReport[];
  isLoading: boolean;
}

const ReportList: React.FC<ReportListProps> = ({ reports, isLoading }) => {
  const [editingReport, setEditingReport] = useState<CopyrightReport | null>(null);
  const [deletingReportId, setDeletingReportId] = useState<number | null>(null);
  const deleteReport = useDeleteReport();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#FFA726';
      case 'Resolved':
        return '#66BB6A';
      case 'Rejected':
        return '#EF5350';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Đang Xử Lý';
      case 'Resolved':
        return 'Đã Giải Quyết';
      case 'Rejected':
        return 'Bị Từ Chối';
      default:
        return status;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) {
      return;
    }

    setDeletingReportId(id);
    try {
      await deleteReport.mutateAsync(id);
      toast.success("Xóa báo cáo thành công");
    } catch (error) {
      alert('Không thể xóa báo cáo');
    } finally {
      setDeletingReportId(null);
    }
  };

  const handleEditSuccess = () => {
    toast.success('Cập nhật báo cáo thành công');
    setEditingReport(null);
  };

  if (isLoading) {
    return (
      <div className="report-list">
        <div className="report-list__loading">Đang tải...</div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="report-list">
        <div className="report-list__empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p>Chưa Có Báo Cáo Nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="report-list">
      {reports.map((report) => (
        <div key={report.id} className="report-item">
          <div className="report-item__header">
            <div className="report-item__song">
              <h3>{report.song?.title || 'Unknown Song'}</h3>
              <p>{report.song?.artist || 'Unknown Artist'}</p>
            </div>
            <div className="report-item__header-right">
              <div 
                className="report-item__status"
                style={{ color: getStatusColor(report.status) }}
              >
                {getStatusText(report.status)}
              </div>
              <div className="report-item__actions">
                <button
                  onClick={() => setEditingReport(report)}
                  className="report-item__action-btn report-item__action-btn--edit"
                  title="Chỉnh sửa"
                  disabled={report.status !== 'Pending'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="report-item__action-btn report-item__action-btn--delete"
                  title="Xóa"
                  disabled={deletingReportId === report.id}
                >
                  {deletingReportId === report.id ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spinner">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="report-item__reason">{report.reportReason}</div>
          {report.adminNotes && (
            <div className="report-item__notes">
              <strong>Ghi chú admin:</strong> {report.adminNotes}
            </div>
          )}
          <div className="report-item__footer">
            <span>
              Báo cáo {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true, locale: vi })}
            </span>
            {report.resolvedAt && (
              <span>
                Giải quyết {formatDistanceToNow(new Date(report.resolvedAt), { addSuffix: true, locale: vi })}
              </span>
            )}
          </div>
        </div>
      ))}

      {editingReport && (
        <EditReportModal
          report={editingReport}
          onClose={() => setEditingReport(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default ReportList;
